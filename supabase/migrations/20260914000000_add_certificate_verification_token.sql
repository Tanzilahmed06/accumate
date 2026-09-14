-- Adds the durable public token to an existing AccuMate certificates table.
-- This migration deliberately does not create a second certificate table.
create extension if not exists pgcrypto;

do $$
begin
  if to_regclass('public.certificates') is null then
    raise notice 'public.certificates does not exist; verification-token migration was skipped.';
    return;
  end if;

  alter table public.certificates
    add column if not exists verification_token text;

  update public.certificates
  set verification_token = 'ACCU-VER-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
  where verification_token is null or btrim(verification_token) = '';

  with duplicate_tokens as (
    select ctid, row_number() over (partition by verification_token order by ctid) as row_number
    from public.certificates
  )
  update public.certificates as certificate
  set verification_token = 'ACCU-VER-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
  from duplicate_tokens
  where certificate.ctid = duplicate_tokens.ctid
    and duplicate_tokens.row_number > 1;

  alter table public.certificates
    alter column verification_token set not null;

  execute 'create unique index if not exists certificates_verification_token_key on public.certificates (verification_token)';
end;
$$;

create or replace function public.assign_certificate_verification_token()
returns trigger
language plpgsql
as $$
begin
  if new.verification_token is null or btrim(new.verification_token) = '' then
    loop
      new.verification_token := 'ACCU-VER-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));
      exit when not exists (
        select 1 from public.certificates where verification_token = new.verification_token
      );
    end loop;
  end if;
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.certificates') is not null then
    execute 'drop trigger if exists certificates_assign_verification_token on public.certificates';
    execute 'create trigger certificates_assign_verification_token before insert on public.certificates for each row execute function public.assign_certificate_verification_token()';
  end if;
end;
$$;

-- This security-definer RPC is the only unauthenticated read surface. It
-- projects verification-safe fields from either snake_case or camelCase
-- certificate columns and never returns owner contacts, IDs, or audit data.
create or replace function public.verify_certificate(
  verification_reference text,
  token_only boolean default true
)
returns table (
  certificate_number text,
  instrument_type text,
  manufacturer text,
  model_number text,
  serial_number text,
  business_name text,
  verification_date text,
  valid_until text,
  current_status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regclass('public.certificates') is null then
    return;
  end if;

  return query execute $query$
    select
      coalesce(record_data ->> 'cert_no', record_data ->> 'certNo') as certificate_number,
      coalesce(record_data ->> 'instrument_name', record_data ->> 'instrumentName', record_data ->> 'instrument_category', record_data ->> 'instrumentCategory') as instrument_type,
      record_data ->> 'manufacturer' as manufacturer,
      coalesce(record_data ->> 'model_number', record_data ->> 'modelNumber') as model_number,
      coalesce(record_data ->> 'serial_number', record_data ->> 'serialNumber') as serial_number,
      coalesce(record_data ->> 'business_name', record_data ->> 'businessName', record_data ->> 'owner_name', record_data ->> 'ownerName') as business_name,
      coalesce(record_data ->> 'verification_date', record_data ->> 'verificationDate') as verification_date,
      coalesce(record_data ->> 'valid_until_date', record_data ->> 'validUntilDate') as valid_until,
      case
        when upper(coalesce(record_data ->> 'status', 'VALID')) = 'REVOKED' then 'REVOKED'
        when upper(coalesce(record_data ->> 'status', 'VALID')) = 'EXPIRED' then 'EXPIRED'
        when coalesce(record_data ->> 'valid_until_date', record_data ->> 'validUntilDate') ~ '^\d{4}-\d{2}-\d{2}$'
          and (coalesce(record_data ->> 'valid_until_date', record_data ->> 'validUntilDate'))::date < current_date then 'EXPIRED'
        else 'VALID'
      end as current_status
    from public.certificates certificate
    cross join lateral (select to_jsonb(certificate) as record_data) as public_record
    where certificate.verification_token = $1
       or (
         not $2
         and lower(coalesce(record_data ->> 'cert_no', record_data ->> 'certNo', '')) = lower($1)
       )
    limit 1
  $query$
  using verification_reference, token_only;
end;
$$;

revoke all on function public.verify_certificate(text, boolean) from public;
grant execute on function public.verify_certificate(text, boolean) to anon, authenticated;
