import { StorageService } from './storageService';
import { extractVerificationToken } from './verificationUrl';

export interface PublicCertificate {
  certNo: string;
  instrumentType: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  businessName: string;
  verificationDate: string;
  validUntilDate: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function toPublicCertificate(record: {
  certNo: string;
  instrumentName?: string;
  instrumentCategory: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  businessName?: string;
  ownerName: string;
  verificationDate: string;
  validUntilDate: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}): PublicCertificate {
  return {
    certNo: record.certNo,
    instrumentType: record.instrumentName || record.instrumentCategory,
    manufacturer: record.manufacturer,
    modelNumber: record.modelNumber,
    serialNumber: record.serialNumber,
    businessName: record.businessName || record.ownerName,
    verificationDate: record.verificationDate,
    validUntilDate: record.validUntilDate,
    status: record.status,
  };
}

function toSupabasePublicCertificate(record: Record<string, unknown>): PublicCertificate | undefined {
  const status = record.current_status;
  if (typeof status !== 'string' || !['VALID', 'EXPIRED', 'REVOKED'].includes(status)) return undefined;

  const fields = [
    record.certificate_number,
    record.instrument_type,
    record.manufacturer,
    record.model_number,
    record.serial_number,
    record.business_name,
    record.verification_date,
    record.valid_until,
  ];
  if (fields.some((field) => typeof field !== 'string')) return undefined;

  return {
    certNo: record.certificate_number as string,
    instrumentType: record.instrument_type as string,
    manufacturer: record.manufacturer as string,
    modelNumber: record.model_number as string,
    serialNumber: record.serial_number as string,
    businessName: record.business_name as string,
    verificationDate: record.verification_date as string,
    validUntilDate: record.valid_until as string,
    status: status as PublicCertificate['status'],
  };
}

/**
 * Uses the Supabase RPC when configured. The RPC returns a deliberately small
 * public projection; local storage is only retained for the prototype/demo.
 */
export async function findPublicCertificate(reference: string, tokenOnly = false) {
  const verificationReference = extractVerificationToken(reference);
  if (!verificationReference) return undefined;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/verify_certificate`, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification_reference: verificationReference, token_only: tokenOnly }),
      });
      if (!response.ok) return undefined;
      const records = await response.json() as Record<string, unknown>[];
      return records[0] ? toSupabasePublicCertificate(records[0]) : undefined;
    } catch {
      return undefined;
    }
  }

  const tokenMatch = StorageService.getPublicCertificateByVerificationToken(verificationReference);
  if (tokenMatch) return toPublicCertificate(tokenMatch);
  if (tokenOnly) return undefined;

  const certificateMatch = StorageService.getCertificateByNumber(reference);
  return certificateMatch ? toPublicCertificate(certificateMatch) : undefined;
}
