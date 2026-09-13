import type {
  AnalyticsStats,
  AuditLog,
  BusinessProfile,
  DigitalCertificate,
  ExpiryAlert,
  InspectionRecord,
  Instrument,
  Merchant,
  User,
  UserRole,
  VerificationApplication,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CERTIFICATES,
  INITIAL_INSPECTIONS,
  INITIAL_INSTRUMENTS,
} from './mockData';

const KEY_PREFIX = 'accumate';
const STORAGE_VERSION_KEY = `${KEY_PREFIX}_storage_version`;
const CURRENT_USER_ROLE_KEY = `${KEY_PREFIX}_user_role_v3`;
const CURRENT_USER_KEY = `${KEY_PREFIX}_current_user_v1`;
const DEMO_MODE_KEY = `${KEY_PREFIX}_demo_mode_v1`;
const MERCHANTS_KEY = `${KEY_PREFIX}_merchants_v3`;

type StorageListener = () => void;
type ScopedRecord = Instrument | VerificationApplication | DigitalCertificate | AuditLog;

const listeners: StorageListener[] = [];

const stateCodes: Record<string, string> = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  Assam: 'AS',
  Bihar: 'BR',
  Chhattisgarh: 'CG',
  Goa: 'GA',
  Gujarat: 'GJ',
  Haryana: 'HR',
  'Himachal Pradesh': 'HP',
  Jharkhand: 'JH',
  Karnataka: 'KA',
  Kerala: 'KL',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Manipur: 'MN',
  Meghalaya: 'ML',
  Mizoram: 'MZ',
  Nagaland: 'NL',
  Odisha: 'OD',
  Punjab: 'PB',
  Rajasthan: 'RJ',
  Sikkim: 'SK',
  'Tamil Nadu': 'TN',
  Telangana: 'TS',
  Tripura: 'TR',
  'Uttar Pradesh': 'UP',
  Uttarakhand: 'UK',
  'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN',
  Chandigarh: 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD',
  Delhi: 'DL',
  'Jammu and Kashmir': 'JK',
  Ladakh: 'LA',
  Lakshadweep: 'LD',
  Puducherry: 'PY',
};

const scopedKey = (collection: string, userId: string) => `${KEY_PREFIX}_${collection}_v3_${userId}`;
const profileKey = (userId: string) => `${KEY_PREFIX}_business_${userId}`;
const demoUserId = DEMO_USERS.trader.id;
const anonymousUser: User = {
  id: 'USR-ANONYMOUS',
  name: 'New Trader',
  email: '',
  role: 'trader',
  designation: '',
  organization: '',
  phone: '',
};

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeValue<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function displayDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getStoredProfile(userId: string): BusinessProfile | undefined {
  return readValue<BusinessProfile | undefined>(profileKey(userId), undefined);
}

function getRecordsForUser<T>(collection: string, userId: string): T[] {
  return readValue<T[]>(scopedKey(collection, userId), []);
}

function setRecordsForUser<T>(collection: string, userId: string, records: T[]) {
  writeValue(scopedKey(collection, userId), records);
}

function getAllScopedRecords<T extends ScopedRecord>(collection: string): T[] {
  if (isDemoMode()) return getRecordsForUser<T>(collection, demoUserId);

  const keyStart = `${KEY_PREFIX}_${collection}_v3_`;
  const records: T[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(keyStart) && !key.endsWith(`_${demoUserId}`)) records.push(...readValue<T[]>(key, []));
  }

  return records;
}

function getCurrentRole(): UserRole {
  return readValue<User | undefined>(CURRENT_USER_KEY, undefined)?.role
    || (localStorage.getItem(CURRENT_USER_ROLE_KEY) as UserRole)
    || 'trader';
}

function isDemoMode() {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

function getCurrentUser(): User {
  const baseUser = readValue<User | undefined>(CURRENT_USER_KEY, undefined) || anonymousUser;
  if (baseUser.role !== 'trader') return baseUser;

  const profile = getStoredProfile(baseUser.id);
  if (!profile) return baseUser;

  return {
    ...baseUser,
    name: profile.contactName,
    email: profile.email,
    designation: profile.designation,
    organization: profile.businessName,
    phone: profile.mobile,
  };
}

function userIdFromIdentity(role: UserRole, identity: string) {
  let hash = 0;
  for (const character of `${role}:${identity}`) {
    hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  }
  return `USR-${role.toUpperCase()}-${(hash >>> 0).toString(36).toUpperCase()}`;
}

function createAuthenticatedUser(role: UserRole, email: string, mobile: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile.replace(/\D/g, '');
  const identity = normalizedEmail || normalizedMobile;

  return {
    id: userIdFromIdentity(role, identity),
    name: normalizedEmail ? normalizedEmail.split('@')[0] : 'New Trader',
    email: normalizedEmail,
    role,
    designation: '',
    organization: '',
    phone: normalizedMobile,
  };
}

function createDemoProfile(): BusinessProfile {
  return {
    id: 'BUS-DEMO-001',
    userId: demoUserId,
    businessName: 'Sample Trader (Demo)',
    legalBusinessName: 'Sample Trader (Demo)',
    businessType: 'Proprietorship',
    gstin: '29DEMOX0000D1ZP',
    pan: 'DEMOX0000D',
    addressLine1: 'Demo Industrial Estate',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    stateCode: 'KA',
    pinCode: '560001',
    contactName: 'Demo Trader',
    designation: 'Business Owner',
    mobile: '9000000000',
    email: 'trader@demo.com',
    merchantId: 'ACCU-T-KA-DEMO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    onboardingCompleted: true,
  };
}

function getMerchants(): Record<string, Merchant> {
  return readValue<Record<string, Merchant>>(MERCHANTS_KEY, {});
}

function generateMerchantId(state: string) {
  const stateCode = stateCodes[state] || 'IN';
  const merchants = getMerchants();

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const merchantId = `ACCU-T-${stateCode}-${suffix}`;
    if (!merchants[merchantId]) return merchantId;
  }

  throw new Error('Unable to generate a unique merchant ID. Please try again.');
}

function getInstruments(): Instrument[] {
  const user = getCurrentUser();
  return user.role === 'trader'
    ? getRecordsForUser<Instrument>('instruments', user.id)
    : getAllScopedRecords<Instrument>('instruments');
}

function getApplications(): VerificationApplication[] {
  const user = getCurrentUser();
  return user.role === 'trader'
    ? getRecordsForUser<VerificationApplication>('applications', user.id)
    : getAllScopedRecords<VerificationApplication>('applications');
}

function getCertificates(): DigitalCertificate[] {
  const user = getCurrentUser();
  return user.role === 'trader'
    ? getRecordsForUser<DigitalCertificate>('certificates', user.id)
    : getAllScopedRecords<DigitalCertificate>('certificates');
}

function getAuditLogs(): AuditLog[] {
  const user = getCurrentUser();
  return user.role === 'trader'
    ? getRecordsForUser<AuditLog>('audit_logs', user.id)
    : getAllScopedRecords<AuditLog>('audit_logs');
}

function addAuditLog(action: string, details: string, targetId: string) {
  const user = getCurrentUser();
  const logs = getRecordsForUser<AuditLog>('audit_logs', user.id);
  const log: AuditLog = {
    id: `LOG-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action,
    targetId,
    details,
    ipAddress: 'Local prototype',
  };
  setRecordsForUser('audit_logs', user.id, [log, ...logs].slice(0, 100));
}

function getExpiryAlerts(): ExpiryAlert[] {
  const today = new Date();
  const alerts: ExpiryAlert[] = [];

  getInstruments().forEach((instrument) => {
    if (!instrument.certExpiryDate) return;
    const daysRemaining = Math.ceil((new Date(instrument.certExpiryDate).getTime() - today.getTime()) / 86_400_000);
    const severity: ExpiryAlert['severity'] | undefined = daysRemaining < 0
      ? 'EXPIRED'
      : daysRemaining <= 7
        ? 'CRITICAL'
        : daysRemaining <= 30
          ? 'HIGH'
          : daysRemaining <= 60
            ? 'MEDIUM'
            : undefined;

    if (severity) {
      alerts.push({
        instrumentId: instrument.id,
        instrumentTitle: instrument.title,
        category: instrument.category,
        serialNumber: instrument.serialNumber,
        certNo: instrument.currentCertNo || 'N/A',
        expiryDate: instrument.certExpiryDate,
        daysRemaining,
        severity,
      });
    }
  });

  return alerts.sort((first, second) => first.daysRemaining - second.daysRemaining);
}

function getAnalyticsStats(): AnalyticsStats {
  const applications = getApplications();
  const alerts = getExpiryAlerts();
  const pendingApplications = applications.filter((application) => !['CERTIFICATE_GENERATED', 'REJECTED'].includes(application.status)).length;

  return {
    totalInstruments: getInstruments().length,
    totalApplications: applications.length,
    pendingApplications,
    completedVerifications: applications.filter((application) => application.status === 'CERTIFICATE_GENERATED').length,
    rejectedApplications: applications.filter((application) => application.status === 'REJECTED').length,
    expiringCertificates: alerts.filter((alert) => alert.severity !== 'EXPIRED').length,
    expiredCertificates: alerts.filter((alert) => alert.severity === 'EXPIRED').length,
    totalRevenue: 0,
  };
}

function parseVerificationReference(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    return url.searchParams.get('id') || url.searchParams.get('cert') || trimmed;
  } catch {
    return trimmed;
  }
}

export function subscribeStorage(listener: StorageListener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };
}

export const StorageService = {
  initStorage() {
    if (!localStorage.getItem(STORAGE_VERSION_KEY)) localStorage.setItem(STORAGE_VERSION_KEY, '3');
    if (!localStorage.getItem(CURRENT_USER_ROLE_KEY)) localStorage.setItem(CURRENT_USER_ROLE_KEY, 'trader');
  },

  getCurrentRole,

  setCurrentRole(role: UserRole) {
    localStorage.setItem(CURRENT_USER_ROLE_KEY, role);
    const currentUser = readValue<User | undefined>(CURRENT_USER_KEY, undefined);
    if (currentUser) writeValue(CURRENT_USER_KEY, { ...currentUser, role });
    notifyListeners();
  },

  getCurrentUser,

  authenticateUser({ role, email, mobile }: { role: UserRole; email: string; mobile: string }) {
    const user = createAuthenticatedUser(role, email, mobile);
    writeValue(CURRENT_USER_KEY, user);
    localStorage.setItem(CURRENT_USER_ROLE_KEY, role);
    localStorage.removeItem(DEMO_MODE_KEY);
    notifyListeners();
    return user;
  },

  isDemoMode,

  loadDemoWorkspace() {
    const demoProfile = createDemoProfile();

    if (!localStorage.getItem(profileKey(demoUserId))) writeValue(profileKey(demoUserId), demoProfile);
    if (!localStorage.getItem(scopedKey('instruments', demoUserId))) writeValue(scopedKey('instruments', demoUserId), INITIAL_INSTRUMENTS);
    if (!localStorage.getItem(scopedKey('applications', demoUserId))) writeValue(scopedKey('applications', demoUserId), INITIAL_APPLICATIONS);
    if (!localStorage.getItem(scopedKey('certificates', demoUserId))) writeValue(scopedKey('certificates', demoUserId), INITIAL_CERTIFICATES);
    if (!localStorage.getItem(scopedKey('inspections', demoUserId))) writeValue(scopedKey('inspections', demoUserId), INITIAL_INSPECTIONS);
    if (!localStorage.getItem(scopedKey('audit_logs', demoUserId))) writeValue(scopedKey('audit_logs', demoUserId), INITIAL_AUDIT_LOGS);

    const merchants = getMerchants();
    if (!merchants[demoProfile.merchantId]) {
      merchants[demoProfile.merchantId] = {
        merchantId: demoProfile.merchantId,
        userId: demoUserId,
        businessProfileId: demoProfile.id,
        stateCode: demoProfile.stateCode,
        status: 'ACTIVE',
        createdAt: demoProfile.createdAt,
      };
      writeValue(MERCHANTS_KEY, merchants);
    }

    writeValue(CURRENT_USER_KEY, DEMO_USERS.trader);
    localStorage.setItem(CURRENT_USER_ROLE_KEY, 'trader');
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    notifyListeners();
    return getCurrentUser();
  },

  getBusinessProfile(userId = getCurrentUser().id) {
    return getStoredProfile(userId);
  },

  isOnboardingCompleted(userId = getCurrentUser().id) {
    return Boolean(getStoredProfile(userId)?.onboardingCompleted);
  },

  saveBusinessProfile(profile: Omit<BusinessProfile, 'id' | 'merchantId' | 'createdAt' | 'updatedAt' | 'stateCode' | 'onboardingCompleted'>) {
    const existing = getStoredProfile(profile.userId);
    const now = new Date().toISOString();
    const merchantId = existing?.merchantId || generateMerchantId(profile.state);
    const savedProfile: BusinessProfile = {
      ...profile,
      id: existing?.id || `BUS-${crypto.randomUUID()}`,
      merchantId,
      stateCode: stateCodes[profile.state] || 'IN',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      onboardingCompleted: true,
    };
    writeValue(profileKey(profile.userId), savedProfile);

    if (!existing) {
      const merchants = getMerchants();
      merchants[merchantId] = {
        merchantId,
        userId: profile.userId,
        businessProfileId: savedProfile.id,
        stateCode: savedProfile.stateCode,
        status: 'ACTIVE',
        createdAt: now,
      };
      writeValue(MERCHANTS_KEY, merchants);
    }

    addAuditLog(existing ? 'BUSINESS_PROFILE_UPDATED' : 'BUSINESS_PROFILE_CREATED', `Business profile saved for ${savedProfile.businessName}`, savedProfile.id);
    notifyListeners();
    return savedProfile;
  },

  getInstruments,

  saveInstrument(instrument: Omit<Instrument, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'ownerPhone' | 'merchantId'>) {
    const user = getCurrentUser();
    const profile = getStoredProfile(user.id);
    const newInstrument: Instrument = {
      ...instrument,
      id: `INST-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: todayISO(),
      ownerId: user.id,
      ownerName: profile?.businessName || user.name,
      ownerEmail: profile?.email || user.email,
      ownerPhone: profile?.mobile || user.phone || '',
      merchantId: profile?.merchantId,
    };
    setRecordsForUser('instruments', user.id, [newInstrument, ...getRecordsForUser<Instrument>('instruments', user.id)]);
    addAuditLog('INSTRUMENT_REGISTERED', `Registered ${newInstrument.title}`, newInstrument.id);
    notifyListeners();
    return newInstrument;
  },

  getApplications,

  getApplicationByNo(query: string) {
    const normalizedQuery = parseVerificationReference(query).toUpperCase();
    return getAllScopedRecords<VerificationApplication>('applications').find((application) =>
      [application.applicationNo, application.id].some((value) => value.toUpperCase() === normalizedQuery),
    );
  },

  createApplication(instrumentId: string, applicationType: 'VERIFICATION' | 'RE_VERIFICATION', feeAmount: number, preferredDate?: string) {
    const user = getCurrentUser();
    const instruments = getRecordsForUser<Instrument>('instruments', user.id);
    const instrument = instruments.find((item) => item.id === instrumentId);
    if (!instrument) throw new Error('Instrument not found for this account.');

    const profile = getStoredProfile(user.id);
    const applicationNo = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionDate = displayDate();
    const application: VerificationApplication = {
      id: `APP-${crypto.randomUUID()}`,
      applicationNo,
      instrumentId: instrument.id,
      instrumentTitle: instrument.title,
      category: instrument.category,
      serialNumber: instrument.serialNumber,
      ownerId: user.id,
      ownerName: profile?.businessName || user.name,
      ownerEmail: profile?.email || user.email,
      merchantId: profile?.merchantId,
      applicationType,
      submissionDate,
      scheduledInspectionDate: preferredDate || undefined,
      feeAmount,
      paymentStatus: 'PENDING',
      status: 'SUBMITTED',
      documents: {},
      timeline: [
        { title: 'Application submitted', description: 'Your application has been recorded in AccuMate.', timestamp: submissionDate, completed: true },
        { title: 'Review', description: 'Awaiting workflow review.', completed: false, current: true },
        { title: 'Inspection', description: 'An inspection update will appear here when scheduled.', completed: false },
        { title: 'Certificate', description: 'A certificate record is created after a successful recorded outcome.', completed: false },
      ],
    };
    setRecordsForUser('applications', user.id, [application, ...getRecordsForUser<VerificationApplication>('applications', user.id)]);
    instrument.status = 'VERIFICATION_PENDING';
    setRecordsForUser('instruments', user.id, instruments);
    addAuditLog('APPLICATION_SUBMITTED', `Application ${applicationNo} submitted for ${instrument.title}`, application.id);
    notifyListeners();
    return application;
  },

  updateApplicationStatus(appId: string, status: VerificationApplication['status'], rejectionReason?: string, officerName?: string, scheduledDate?: string) {
    const application = getAllScopedRecords<VerificationApplication>('applications').find((item) => item.id === appId);
    if (!application) return;

    const applications = getRecordsForUser<VerificationApplication>('applications', application.ownerId);
    const index = applications.findIndex((item) => item.id === appId);
    if (index < 0) return;
    applications[index] = {
      ...applications[index],
      status,
      rejectionReason: rejectionReason || applications[index].rejectionReason,
      assignedOfficerName: officerName || applications[index].assignedOfficerName,
      scheduledInspectionDate: scheduledDate || applications[index].scheduledInspectionDate,
    };
    setRecordsForUser('applications', application.ownerId, applications);
    notifyListeners();
  },

  getCertificates,

  getCertificateByNumber(query: string) {
    const normalizedQuery = parseVerificationReference(query).toUpperCase();
    return getAllScopedRecords<DigitalCertificate>('certificates').find((certificate) =>
      [certificate.certNo, certificate.verificationToken, certificate.applicationId, certificate.instrumentId]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toUpperCase() === normalizedQuery),
    );
  },

  submitInspectionAndGenerateCertificate(appId: string, inspectionData: Omit<InspectionRecord, 'id' | 'submittedAt'>): { inspection: InspectionRecord; certificate?: DigitalCertificate } {
    const application = getAllScopedRecords<VerificationApplication>('applications').find((item) => item.id === appId);
    if (!application) throw new Error('Application not found.');

    const inspection: InspectionRecord = {
      ...inspectionData,
      id: `INSP-${crypto.randomUUID()}`,
      submittedAt: new Date().toISOString(),
    };
    setRecordsForUser('inspections', application.ownerId, [inspection, ...getRecordsForUser<InspectionRecord>('inspections', application.ownerId)]);

    if (inspectionData.finalResult !== 'PASS') {
      this.updateApplicationStatus(appId, 'REJECTED', inspectionData.observations);
      return { inspection };
    }

    const profile = getStoredProfile(application.ownerId);
    const instruments = getRecordsForUser<Instrument>('instruments', application.ownerId);
    const instrumentIndex = instruments.findIndex((item) => item.id === application.instrumentId);
    const instrument = instruments[instrumentIndex];
    const verificationToken = crypto.randomUUID();
    const certificate: DigitalCertificate = {
      certNo: `ACCU-CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      applicationId: application.id,
      instrumentId: application.instrumentId,
      ownerName: profile?.businessName || application.ownerName,
      ownerEmail: application.ownerEmail,
      ownerPhone: profile?.mobile || '',
      ownerAddress: profile ? `${profile.addressLine1}, ${profile.city}, ${profile.state} ${profile.pinCode}` : instrument?.locationAddress || '',
      businessName: profile?.businessName || application.ownerName,
      merchantId: profile?.merchantId || application.merchantId,
      instrumentCategory: application.category,
      manufacturer: instrument?.manufacturer || '',
      modelNumber: instrument?.modelNumber || '',
      serialNumber: application.serialNumber,
      capacity: instrument?.capacity || '',
      verificationDate: todayISO(),
      validUntilDate: new Date(Date.now() + 365 * 86_400_000).toISOString().split('T')[0],
      issuingOfficerName: inspectionData.officerName,
      issuingOfficerDesignation: 'AccuMate reviewing role',
      verificationAuthority: 'AccuMate prototype record',
      securityHash: crypto.randomUUID().replaceAll('-', ''),
      qrCodeUrl: `/verify-certificate?id=${encodeURIComponent(verificationToken)}`,
      verificationToken,
      status: 'VALID',
    };
    setRecordsForUser('certificates', application.ownerId, [certificate, ...getRecordsForUser<DigitalCertificate>('certificates', application.ownerId)]);

    if (instrument) {
      instruments[instrumentIndex] = { ...instrument, status: 'VERIFIED', currentCertNo: certificate.certNo, certExpiryDate: certificate.validUntilDate };
      setRecordsForUser('instruments', application.ownerId, instruments);
    }
    this.updateApplicationStatus(appId, 'CERTIFICATE_GENERATED');
    notifyListeners();
    return { inspection, certificate };
  },

  getAuditLogs,
  addAuditLog,
  getExpiryAlerts,
  getAnalyticsStats,

  resetAllData() {
    const user = getCurrentUser();
    localStorage.removeItem(profileKey(user.id));
    ['instruments', 'applications', 'certificates', 'inspections', 'audit_logs'].forEach((collection) => localStorage.removeItem(scopedKey(collection, user.id)));
    notifyListeners();
  },
};

export { stateCodes };
