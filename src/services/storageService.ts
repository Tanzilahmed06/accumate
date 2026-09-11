import type {
  Instrument,
  VerificationApplication,
  DigitalCertificate,
  InspectionRecord,
  AuditLog,
  ExpiryAlert,
  AnalyticsStats,
  UserRole,
} from '../types';
import {
  INITIAL_INSTRUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_INSPECTIONS,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS,
} from './mockData';

const KEYS = {
  INSTRUMENTS: 'e_metro_instruments_v1',
  APPLICATIONS: 'e_metro_applications_v1',
  CERTIFICATES: 'e_metro_certificates_v1',
  INSPECTIONS: 'e_metro_inspections_v1',
  AUDIT_LOGS: 'e_metro_audit_logs_v1',
  CURRENT_USER_ROLE: 'e_metro_user_role_v1',
};

type StorageListener = () => void;
const listeners: StorageListener[] = [];

export function subscribeStorage(listener: StorageListener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export const StorageService = {
  initStorage() {
    if (!localStorage.getItem(KEYS.INSTRUMENTS)) {
      localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(INITIAL_INSTRUMENTS));
    }
    if (!localStorage.getItem(KEYS.APPLICATIONS)) {
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(KEYS.CERTIFICATES)) {
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    }
    if (!localStorage.getItem(KEYS.INSPECTIONS)) {
      localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(INITIAL_INSPECTIONS));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(KEYS.CURRENT_USER_ROLE)) {
      localStorage.setItem(KEYS.CURRENT_USER_ROLE, 'trader');
    }
  },

  getCurrentRole(): UserRole {
    return (localStorage.getItem(KEYS.CURRENT_USER_ROLE) as UserRole) || 'trader';
  },

  setCurrentRole(role: UserRole) {
    localStorage.setItem(KEYS.CURRENT_USER_ROLE, role);
    notifyListeners();
  },

  getCurrentUser() {
    const role = this.getCurrentRole();
    return DEMO_USERS[role] || DEMO_USERS.trader;
  },

  // Instruments
  getInstruments(): Instrument[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(KEYS.INSTRUMENTS) || '[]');
    } catch {
      return INITIAL_INSTRUMENTS;
    }
  },

  saveInstrument(inst: Omit<Instrument, 'id' | 'createdAt'>): Instrument {
    const instruments = this.getInstruments();
    const newInst: Instrument = {
      ...inst,
      id: `INST-${inst.category.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    instruments.unshift(newInst);
    localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(instruments));

    this.addAuditLog('INSTRUMENT_REGISTERED', `Registered new ${inst.category}: ${inst.title} (${inst.serialNumber})`, newInst.id);
    notifyListeners();
    return newInst;
  },

  // Applications
  getApplications(): VerificationApplication[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  getApplicationByNo(queryNo: string): VerificationApplication | undefined {
    const apps = this.getApplications();
    const q = queryNo.trim().toUpperCase();
    return apps.find((a) => a.applicationNo.toUpperCase() === q || a.id.toUpperCase() === q);
  },

  createApplication(
    instrumentId: string,
    applicationType: 'VERIFICATION' | 'RE_VERIFICATION',
    feeAmount: number,
    preferredDate?: string
  ): VerificationApplication {
    const instruments = this.getInstruments();
    const inst = instruments.find((i) => i.id === instrumentId);
    if (!inst) throw new Error('Instrument not found');

    const applications = this.getApplications();
    const appNo = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newApp: VerificationApplication = {
      id: appNo,
      applicationNo: appNo,
      instrumentId: inst.id,
      instrumentTitle: inst.title,
      category: inst.category,
      serialNumber: inst.serialNumber,
      ownerId: inst.ownerId,
      ownerName: inst.ownerName,
      ownerEmail: inst.ownerEmail,
      applicationType,
      submissionDate: dateStr,
      scheduledInspectionDate: preferredDate || '18 Sep 2026',
      assignedOfficerId: 'USR-OFFICER-102',
      assignedOfficerName: 'Inspector Vikramaditya Roy',
      feeAmount,
      paymentStatus: 'PAID',
      paymentTransactionId: `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'SUBMITTED',
      documents: {
        purchaseInvoice: inst.invoiceUrl || 'purchase_invoice.pdf',
        instrumentPhoto: inst.photoUrl || 'instrument_photo.jpg',
      },
      timeline: [
        { title: 'Application Submitted', description: 'Application filed online by trader', timestamp: `${dateStr} 10:30 AM`, completed: true },
        { title: 'Documents Verified', description: 'Under document verification review', completed: false },
        { title: 'Fee Paid', description: `Statutory fee ₹${feeAmount} paid`, timestamp: `${dateStr} 10:35 AM`, completed: true },
        { title: 'Officer Assigned', description: 'Assigned to Inspector Vikramaditya Roy', completed: false },
        { title: 'Inspection Scheduled', description: 'Scheduled field inspection', completed: false },
        { title: 'Inspection Completed', description: 'LMO on-site tolerance testing', completed: false },
        { title: 'Certificate Issued', description: 'Digital certificate issuance with QR Code', completed: false },
      ],
    };

    applications.unshift(newApp);
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));

    inst.status = 'VERIFICATION_PENDING';
    localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(instruments));

    this.addAuditLog('APPLICATION_SUBMITTED', `Application ${appNo} submitted for ${inst.title}`, newApp.id);
    notifyListeners();
    return newApp;
  },

  updateApplicationStatus(
    appId: string,
    status: VerificationApplication['status'],
    rejectionReason?: string,
    officerName?: string,
    scheduledDate?: string
  ) {
    const applications = this.getApplications();
    const appIndex = applications.findIndex((a) => a.id === appId);
    if (appIndex === -1) return;

    const app = applications[appIndex];
    app.status = status;
    if (rejectionReason) app.rejectionReason = rejectionReason;
    if (officerName) app.assignedOfficerName = officerName;
    if (scheduledDate) app.scheduledInspectionDate = scheduledDate;

    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' 02:00 PM';
    if (status === 'DOCUMENTS_VERIFIED') {
      app.timeline[1].completed = true;
      app.timeline[1].timestamp = nowStr;
    } else if (status === 'INSPECTION_SCHEDULED') {
      app.timeline[1].completed = true;
      app.timeline[3].completed = true;
      app.timeline[4].completed = true;
      app.timeline[4].timestamp = nowStr;
      app.timeline[4].current = true;
    }

    applications[appIndex] = app;
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));

    this.addAuditLog('APPLICATION_UPDATED', `Application ${app.applicationNo} updated to status ${status}`, app.id);
    notifyListeners();
  },

  // Certificates
  getCertificates(): DigitalCertificate[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(KEYS.CERTIFICATES) || '[]');
    } catch {
      return INITIAL_CERTIFICATES;
    }
  },

  getCertificateByNumber(certNo: string): DigitalCertificate | undefined {
    const certs = this.getCertificates();
    const queryClean = certNo.trim().toUpperCase();
    return certs.find(
      (c) =>
        c.certNo.toUpperCase() === queryClean ||
        c.applicationId.toUpperCase() === queryClean ||
        c.instrumentId.toUpperCase() === queryClean ||
        c.serialNumber.toUpperCase() === queryClean
    );
  },

  // Field Inspection & Pass/Fail Decision Workflow
  submitInspectionAndGenerateCertificate(
    appId: string,
    inspectionData: Omit<InspectionRecord, 'id' | 'submittedAt'>
  ): { inspection: InspectionRecord; certificate?: DigitalCertificate } {
    const applications = this.getApplications();
    const appIndex = applications.findIndex((a) => a.id === appId);
    if (appIndex === -1) throw new Error('Application not found');

    const app = applications[appIndex];
    const instruments = this.getInstruments();
    const instIndex = instruments.findIndex((i) => i.id === app.instrumentId);
    const inst = instruments[instIndex];

    const inspections = JSON.parse(localStorage.getItem(KEYS.INSPECTIONS) || '[]');
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' 03:00 PM';
    const todayISO = new Date().toISOString().split('T')[0];

    const inspectionRecord: InspectionRecord = {
      ...inspectionData,
      id: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: nowStr,
    };
    inspections.unshift(inspectionRecord);
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(inspections));

    let createdCert: DigitalCertificate | undefined;

    if (inspectionData.finalResult === 'PASS') {
      const validUntil = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
      const certNo = `LM-DEL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const certsList = this.getCertificates();

      const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      createdCert = {
        certNo,
        applicationId: app.id,
        instrumentId: app.instrumentId,
        ownerName: app.ownerName,
        ownerEmail: app.ownerEmail,
        ownerPhone: inst?.ownerPhone || '+91 98765 43210',
        ownerAddress: inst?.locationAddress || 'Okhla Industrial Area, New Delhi',
        instrumentCategory: app.category,
        manufacturer: inst?.manufacturer || 'Standard Metrology Equipment',
        modelNumber: inst?.modelNumber || 'STD-2026',
        serialNumber: app.serialNumber,
        capacity: inst?.capacity || 'Standard Capacity',
        verificationDate: todayISO,
        validUntilDate: validUntil,
        issuingOfficerName: inspectionData.officerName,
        issuingOfficerDesignation: 'Senior Legal Metrology Officer (LMO)',
        verificationAuthority: 'Department of Legal Metrology, Govt. of NCT of Delhi',
        securityHash: hash,
        qrCodeUrl: `https://e-metro.gov.in/verify?cert=${certNo}`,
        status: 'VALID',
      };

      certsList.unshift(createdCert);
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certsList));

      app.status = 'CERTIFICATE_GENERATED';
      app.timeline.forEach((step) => {
        step.completed = true;
        if (!step.timestamp) step.timestamp = nowStr;
      });
      applications[appIndex] = app;
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));

      if (inst) {
        inst.status = 'VERIFIED';
        inst.currentCertNo = certNo;
        inst.certExpiryDate = validUntil;
        instruments[instIndex] = inst;
        localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(instruments));
      }

      this.addAuditLog(
        'CERTIFICATE_GENERATED',
        `Digital certificate ${certNo} generated for ${app.instrumentTitle} (PASS)`,
        certNo
      );
    } else {
      app.status = 'REJECTED';
      app.rejectionReason = `Failed field inspection tolerances. Observations: ${inspectionData.observations}`;
      applications[appIndex] = app;
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));

      if (inst) {
        inst.status = 'REJECTED';
        instruments[instIndex] = inst;
        localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(instruments));
      }

      this.addAuditLog(
        'FIELD_INSPECTION_FAILED',
        `Field inspection FAILED for ${app.instrumentTitle}. Reason: ${inspectionData.observations}`,
        app.id
      );
    }

    notifyListeners();
    return { inspection: inspectionRecord, certificate: createdCert };
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    this.initStorage();
    try {
      return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(action: string, details: string, targetId: string) {
    const user = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      targetId,
      details,
      ipAddress: '14.139.60.10',
    };
    logs.unshift(newLog);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  // Expiry Alerts
  getExpiryAlerts(): ExpiryAlert[] {
    const instruments = this.getInstruments();
    const today = new Date();
    const alerts: ExpiryAlert[] = [];

    instruments.forEach((inst) => {
      if (inst.certExpiryDate) {
        const expiry = new Date(inst.certExpiryDate);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

        let severity: ExpiryAlert['severity'] | null = null;
        if (diffDays < 0) severity = 'EXPIRED';
        else if (diffDays <= 7) severity = 'CRITICAL';
        else if (diffDays <= 30) severity = 'HIGH';
        else if (diffDays <= 60) severity = 'MEDIUM';

        if (severity) {
          alerts.push({
            instrumentId: inst.id,
            instrumentTitle: inst.title,
            category: inst.category,
            serialNumber: inst.serialNumber,
            certNo: inst.currentCertNo || 'N/A',
            expiryDate: inst.certExpiryDate,
            daysRemaining: diffDays,
            severity,
          });
        }
      }
    });

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  },

  // Analytics Stats
  getAnalyticsStats(): AnalyticsStats {
    const instruments = this.getInstruments();
    const applications = this.getApplications();
    const alerts = this.getExpiryAlerts();

    const pending = applications.filter((a) => a.status !== 'CERTIFICATE_GENERATED' && a.status !== 'REJECTED').length;
    const completed = applications.filter((a) => a.status === 'CERTIFICATE_GENERATED').length;
    const rejected = applications.filter((a) => a.status === 'REJECTED').length;
    const totalRev = applications.reduce((acc, a) => acc + (a.paymentStatus === 'PAID' ? a.feeAmount : 0), 0);

    const expired = alerts.filter((a) => a.severity === 'EXPIRED').length;
    const expiring = alerts.filter((a) => a.severity !== 'EXPIRED').length;

    return {
      totalInstruments: instruments.length,
      totalApplications: applications.length,
      pendingApplications: pending,
      completedVerifications: completed,
      rejectedApplications: rejected,
      expiringCertificates: expiring,
      expiredCertificates: expired,
      totalRevenue: totalRev,
    };
  },

  resetAllData() {
    localStorage.setItem(KEYS.INSTRUMENTS, JSON.stringify(INITIAL_INSTRUMENTS));
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(INITIAL_INSPECTIONS));
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(KEYS.CURRENT_USER_ROLE, 'trader');
    notifyListeners();
  },
};
