# AccuMate prototype

AccuMate is a prototype workflow for instrument verification records. It is not a Government certificate system.

## Judge Demo

At sign-in choose **Enter Judge Demo**. This opens a separate, resettable DEMO / PROTOTYPE workspace with no password entry and four role identities:

- Business: Amaan Measurement Solutions / Arman Khan (`ACCU-T-KA-4821`)
- LMO: Demo Legal Metrology Officer (`DEMO-LMO-001`)
- GATC: Demo Government Approved Test Centre (`DEMO-GATC-001`)
- Admin: AccuMate Demo Administrator (`DEMO-ADMIN-001`)

The business starts with a pre-filled Electronic Weighing Scale form. The role strip performs the shared workflow using the demo data store: submit application, review, schedule, start inspection, pass inspection, generate the certificate, and update certificate status. **Reset Demo** affects only the isolated demo storage keys.

The generated certificate QR encodes:

`{VITE_PUBLIC_APP_URL}/verify/{verificationToken}`

Set `VITE_PUBLIC_APP_URL` to the deployed origin, for example `https://accumate.vercel.app`; never use a localhost value for issued QR codes.

## Public verification deployment

`/verify/:verificationToken` is public and read-only. For cross-device/deployed lookups, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, apply the Supabase migration, and use a backend mutation to persist issued certificates to the existing `certificates` table. The included public RPC deliberately returns only verification-safe fields.

The current frontend prototype stores workflow writes in browser local storage; it does not include a configured Supabase write client or server credentials. The demo remains fully stateful within that browser, but a second device will not have its local demo records until that backend write integration is supplied. See `.env.example`.

## Commands

```bash
npm.cmd run build
npm.cmd run lint
```
