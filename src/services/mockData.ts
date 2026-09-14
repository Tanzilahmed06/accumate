import type { Instrument, User } from '../types';

/**
 * These identities exist only inside the isolated Judge Demo storage scope.
 * They are intentionally not credentials and are never used by normal sign-in.
 */
export const DEMO_USERS: Record<'trader' | 'officer' | 'gatc' | 'admin', User> = {
  trader: {
    id: 'DEMO-TRADER-001',
    name: 'Arman Khan',
    email: 'judge-demo-trader@accumate.prototype',
    role: 'trader',
    designation: 'Proprietor',
    organization: 'Amaan Measurement Solutions',
    phone: '9000004821',
  },
  officer: {
    id: 'DEMO-LMO-001',
    name: 'Demo Legal Metrology Officer',
    email: 'judge-demo-lmo@accumate.prototype',
    role: 'officer',
    designation: 'LMO / Field Officer · Bengaluru',
    organization: 'AccuMate Judge Demo',
    phone: '9000001001',
  },
  gatc: {
    id: 'DEMO-GATC-001',
    name: 'Demo Government Approved Test Centre',
    email: 'judge-demo-gatc@accumate.prototype',
    role: 'gatc',
    designation: 'GATC · Bengaluru',
    organization: 'Demo Government Approved Test Centre',
    phone: '9000001002',
  },
  admin: {
    id: 'DEMO-ADMIN-001',
    name: 'AccuMate Demo Administrator',
    email: 'judge-demo-admin@accumate.prototype',
    role: 'admin',
    designation: 'Demo Administrator',
    organization: 'AccuMate Judge Demo',
    phone: '9000001003',
  },
};

/** The reset state keeps the business profile but lets the presenter add this pre-filled instrument. */
export const INITIAL_INSTRUMENTS: Instrument[] = [];
export const INITIAL_APPLICATIONS = [];
export const INITIAL_CERTIFICATES = [];
export const INITIAL_INSPECTIONS = [];
export const INITIAL_AUDIT_LOGS = [];

export const JUDGE_DEMO_INSTRUMENT: Omit<Instrument, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'ownerPhone' | 'merchantId'> = {
  title: 'Electronic Weighing Scale',
  category: 'Weighing Scale',
  manufacturer: 'Demo Instruments Pvt. Ltd.',
  modelNumber: 'DWS-30',
  serialNumber: 'ACC-DEMO-WS-001',
  capacity: '30 kg',
  accuracyClass: 'Class III',
  locationAddress: 'Amaan Measurement Solutions, Peenya, Bengaluru, Karnataka',
  city: 'Bengaluru',
  state: 'Karnataka',
  purchaseDate: '2026-09-01',
  status: 'REGISTERED',
  photoUrl: 'demo-prototype-instrument-evidence',
  invoiceUrl: 'demo-prototype-purchase-reference',
};
