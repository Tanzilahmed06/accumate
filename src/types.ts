export type UserRole = 'trader' | 'officer' | 'gatc' | 'admin' | 'public';

export type PublicPageTab =
  | 'home'
  | 'about'
  | 'services'
  | 'verification'
  | 'track'
  | 'gatc'
  | 'help'
  | 'contact';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  organization?: string;
  phone?: string;
  avatar?: string;
}

export type InstrumentCategory =
  | 'Weighing Scale'
  | 'Weighbridge'
  | 'Fuel Dispenser'
  | 'Electricity Meter'
  | 'Water Meter'
  | 'Measuring Equipment';

export type InstrumentStatus =
  | 'REGISTERED'
  | 'VERIFICATION_PENDING'
  | 'INSPECTION_SCHEDULED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRING_SOON'
  | 'EXPIRED';

export interface Instrument {
  id: string;
  title: string;
  category: InstrumentCategory;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  capacity: string;
  accuracyClass?: string;
  locationAddress: string;
  city: string;
  state: string;
  purchaseDate: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: InstrumentStatus;
  currentCertNo?: string;
  certExpiryDate?: string;
  photoUrl?: string;
  invoiceUrl?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENTS_VERIFIED'
  | 'OFFICER_ASSIGNED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'CERTIFICATE_GENERATED'
  | 'REJECTED';

export interface TimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
  officerName?: string;
}

export interface VerificationApplication {
  id: string;
  applicationNo: string; // e.g. APP-2026-1403
  instrumentId: string;
  instrumentTitle: string;
  category: InstrumentCategory;
  serialNumber: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  applicationType: 'VERIFICATION' | 'RE_VERIFICATION';
  submissionDate: string;
  scheduledInspectionDate?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedGATCId?: string;
  assignedGATCName?: string;
  feeAmount: number;
  paymentStatus: 'PAID' | 'PENDING';
  paymentTransactionId?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  documents: {
    purchaseInvoice?: string;
    instrumentPhoto?: string;
    previousCertificate?: string;
    calibrationReport?: string;
  };
  timeline: TimelineStep[];
}

export interface InspectionChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface TestReading {
  parameter: string;
  standardValue: number;
  observedValue: number;
  unit: string;
  toleranceMargin: number; // e.g. 0.05 (%) or fixed offset
  errorPercentage: number;
  result: 'PASS' | 'FAIL';
}

export interface InspectionRecord {
  id: string;
  applicationId: string;
  instrumentId: string;
  officerId: string;
  officerName: string;
  inspectionDate: string;
  locationGeo: string; // GPS Coordinates e.g. "28.6139° N, 77.2090° E"
  locationAddress: string;
  checklist: InspectionChecklistItem[];
  testReadings: TestReading[];
  observations: string;
  photos: string[];
  finalResult: 'PASS' | 'FAIL' | 'REQUIRES_REINSPECTION';
  submittedAt: string;
}

export interface DigitalCertificate {
  certNo: string; // e.g. LM-DEL-2026-004821
  applicationId: string;
  instrumentId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  instrumentCategory: InstrumentCategory;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  capacity: string;
  verificationDate: string;
  validUntilDate: string;
  issuingOfficerName: string;
  issuingOfficerDesignation: string;
  verificationAuthority: string;
  securityHash: string; // SHA-256 Mock hash
  qrCodeUrl: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetId: string;
  details: string;
  ipAddress: string;
}

export interface ExpiryAlert {
  instrumentId: string;
  instrumentTitle: string;
  category: InstrumentCategory;
  serialNumber: string;
  certNo: string;
  expiryDate: string;
  daysRemaining: number;
  severity: 'EXPIRED' | 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface AnalyticsStats {
  totalInstruments: number;
  totalApplications: number;
  pendingApplications: number;
  completedVerifications: number;
  rejectedApplications: number;
  expiringCertificates: number;
  expiredCertificates: number;
  totalRevenue: number;
}

export interface NoticeBoardItem {
  id: string;
  title: string;
  date: string;
  category: 'Circular' | 'Fee Structure' | 'Guidelines' | 'GATC List';
  fileUrl?: string;
  isNew?: boolean;
}

export interface GATCInfo {
  id: string;
  code: string;
  name: string;
  location: string;
  state: string;
  accreditationNo: string;
  contactPerson: string;
  phone: string;
  email: string;
  categories: InstrumentCategory[];
  status: 'ACTIVE' | 'SUSPENDED';
}
