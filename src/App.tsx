import { useState, useEffect } from 'react';
import type {
  UserRole,
  User,
  BusinessProfile,
  Instrument,
  VerificationApplication,
  DigitalCertificate,
  AuditLog,
  ExpiryAlert,
  AnalyticsStats,
} from './types';
import { StorageService, subscribeStorage } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { TraderDashboard } from './components/TraderDashboard';
import { RegisterInstrumentModal } from './components/RegisterInstrumentModal';
import { ApplyVerificationWizard } from './components/ApplyVerificationWizard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { OfficerInspectionModule } from './components/OfficerInspectionModule';
import { GATCDashboard } from './components/GATCDashboard';
import { AdminAnalyticsDashboard } from './components/AdminAnalyticsDashboard';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';
import { PublicVerifyPage } from './components/PublicVerifyPage';
import { ExpiryAlertsModal } from './components/ExpiryAlertsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { TimelineModal } from './components/TimelineModal';
import { PublicPortal } from './components/PublicPortal';
import { SplashLoader } from './components/SplashLoader';
import { OnboardingFlow } from './components/OnboardingFlow';
import { BusinessProfile as BusinessProfilePage } from './components/BusinessProfile';

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  // Authentication & Role state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => StorageService.getCurrentRole());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPublicRoute, setIsPublicRoute] = useState(true);
  const [isPublicVerifyRoute, setIsPublicVerifyRoute] = useState(() => window.location.pathname === '/verify-certificate');

  // App data state synced with StorageService
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | undefined>(() => StorageService.getBusinessProfile());
  const [instruments, setInstruments] = useState<Instrument[]>(() => StorageService.getInstruments());
  const [applications, setApplications] = useState<VerificationApplication[]>(() => StorageService.getApplications());
  const [certificates, setCertificates] = useState<DigitalCertificate[]>(() => StorageService.getCertificates());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>(() => StorageService.getExpiryAlerts());
  const [stats, setStats] = useState<AnalyticsStats>(() => StorageService.getAnalyticsStats());

  // Active Modals & Selected items state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isApplyWizardOpen, setIsApplyWizardOpen] = useState(false);
  const [wizardInitialInstId, setWizardInitialInstId] = useState<string | undefined>(undefined);

  const [activeInspectionApp, setActiveInspectionApp] = useState<VerificationApplication | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<DigitalCertificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const [viewingTimelineApp, setViewingTimelineApp] = useState<VerificationApplication | null>(null);
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [publicSearchCertNo, setPublicSearchCertNo] = useState<string | undefined>(() => new URLSearchParams(window.location.search).get('id') || undefined);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sync data whenever StorageService triggers a change
  const refreshData = () => {
    setCurrentUser(StorageService.getCurrentUser());
    setBusinessProfile(StorageService.getBusinessProfile());
    setInstruments(StorageService.getInstruments());
    setApplications(StorageService.getApplications());
    setCertificates(StorageService.getCertificates());
    setAuditLogs(StorageService.getAuditLogs());
    setExpiryAlerts(StorageService.getExpiryAlerts());
    setStats(StorageService.getAnalyticsStats());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeStorage(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  // Handle Role Change
  const handleRoleChange = (newRole: UserRole) => {
    StorageService.setCurrentRole(newRole);
    setCurrentRole(newRole);

    // Set default tab per role
    if (newRole === 'trader') setActiveTab('dashboard');
    else if (newRole === 'officer') setActiveTab('officer-dashboard');
    else if (newRole === 'gatc') setActiveTab('gatc-dashboard');
    else if (newRole === 'admin') setActiveTab('admin-analytics');

    setIsPublicRoute(false);
    setIsPublicVerifyRoute(false);
    setActiveInspectionApp(null);
  };

  // Handle Login Success
  const handleLoginSuccess = (role: UserRole) => {
    handleRoleChange(role);
    setShowOnboarding(role === 'trader' && !StorageService.getBusinessProfile());
    setIsAuthenticated(true);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsPublicVerifyRoute(false);
    setIsPublicRoute(true);
  };

  // Open Certificate Helper
  const handleViewCertificate = (certNoOrAppNo: string) => {
    const cert = StorageService.getCertificateByNumber(certNoOrAppNo);
    if (cert) {
      setViewingCertificate(cert);
      setIsCertModalOpen(true);
    }
  };

  // Open Public QR Verification Page
  const handleOpenPublicVerify = (certNo?: string) => {
    const verificationPath = certNo ? `/verify-certificate?id=${encodeURIComponent(certNo)}` : '/verify-certificate';
    window.history.pushState({}, '', verificationPath);
    setPublicSearchCertNo(certNo);
    setIsPublicRoute(false);
    setIsPublicVerifyRoute(true);
    setIsCertModalOpen(false);
  };

  if (!isSplashComplete) {
    return <SplashLoader onComplete={() => setIsSplashComplete(true)} />;
  }

  if (isPublicVerifyRoute) {
    return (
      <PublicVerifyPage
        initialCertNo={publicSearchCertNo}
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setIsPublicVerifyRoute(false);
          setIsPublicRoute(true);
        }}
      />
    );
  }

  if (isPublicRoute) {
    return (
      <PublicPortal
        onLogin={() => setIsPublicRoute(false)}
        onOpenVerify={handleOpenPublicVerify}
      />
    );
  }

  // If User is not logged in
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onOpenPublicVerify={() => handleOpenPublicVerify()}
      />
    );
  }

  if (currentRole === 'trader' && showOnboarding) {
    return (
      <OnboardingFlow
        user={currentUser}
        onComplete={(profile) => {
          setBusinessProfile(profile);
          setShowOnboarding(false);
          setActiveTab('dashboard');
        }}
        onCompleteLater={() => {
          setShowOnboarding(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Government Navigation Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenVerify={() => handleOpenPublicVerify()}
        onOpenExpiryAlerts={() => setIsExpiryModalOpen(true)}
        onLogout={handleLogout}
        expiryCount={expiryAlerts.length}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeRole={currentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenApplyWizard={() => {
            setWizardInitialInstId(undefined);
            setIsApplyWizardOpen(true);
          }}
          onOpenVerify={() => handleOpenPublicVerify()}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden">
          {/* TRADER ROLE VIEWS */}
          {currentRole === 'trader' && activeTab === 'business-profile' && (
            <BusinessProfilePage
              profile={businessProfile}
              onStartSetup={() => setShowOnboarding(true)}
            />
          )}

          {currentRole === 'trader' && activeTab !== 'business-profile' && (
            <TraderDashboard
              instruments={instruments}
              applications={applications}
              certificates={certificates}
              expiryAlerts={expiryAlerts}
              businessProfile={businessProfile}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onOpenApplyWizard={(instId) => {
                setWizardInitialInstId(instId);
                setIsApplyWizardOpen(true);
              }}
              onViewCertificate={handleViewCertificate}
              onViewApplicationTimeline={(app) => setViewingTimelineApp(app)}
            />
          )}

          {/* OFFICER ROLE VIEWS */}
          {currentRole === 'officer' && (
            <>
              {activeInspectionApp ? (
                <OfficerInspectionModule
                  application={activeInspectionApp}
                  instrument={instruments.find((i) => i.id === activeInspectionApp.instrumentId)}
                  onBack={() => setActiveInspectionApp(null)}
                  onSuccess={(newCertNo) => {
                    setActiveInspectionApp(null);
                    if (newCertNo) handleViewCertificate(newCertNo);
                  }}
                />
              ) : (
                <OfficerDashboard
                  applications={applications}
                  instruments={instruments}
                  onStartInspection={(app) => setActiveInspectionApp(app)}
                  onViewCertificate={handleViewCertificate}
                />
              )}
            </>
          )}

          {/* GATC ROLE VIEWS */}
          {currentRole === 'gatc' && (
            <GATCDashboard applications={applications} onRefresh={refreshData} />
          )}

          {/* ADMIN ROLE VIEWS */}
          {currentRole === 'admin' && (
            <AdminAnalyticsDashboard
              stats={stats}
              auditLogs={auditLogs}
              onViewCertificate={handleViewCertificate}
            />
          )}
        </main>
      </div>

      {/* ALL MODALS & DRAWERS */}
      <RegisterInstrumentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={refreshData}
      />

      <ApplyVerificationWizard
        isOpen={isApplyWizardOpen}
        onClose={() => setIsApplyWizardOpen(false)}
        instruments={instruments}
        initialInstrumentId={wizardInitialInstId}
        onSuccess={() => {
          refreshData();
          setActiveTab('applications');
        }}
      />

      {viewingCertificate && (
        <DigitalCertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          certificate={viewingCertificate}
          onVerifyQR={(certNo) => handleOpenPublicVerify(certNo)}
        />
      )}

      {viewingTimelineApp && (
        <TimelineModal
          isOpen={!!viewingTimelineApp}
          onClose={() => setViewingTimelineApp(null)}
          application={viewingTimelineApp}
          onViewCertificate={handleViewCertificate}
        />
      )}

      <ExpiryAlertsModal
        isOpen={isExpiryModalOpen}
        onClose={() => setIsExpiryModalOpen(false)}
        alerts={expiryAlerts}
        onApplyRenewal={(instId) => {
          setWizardInitialInstId(instId);
          setIsApplyWizardOpen(true);
        }}
        onViewCertificate={handleViewCertificate}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        instruments={instruments}
        applications={applications}
        certificates={certificates}
        onViewCertificate={handleViewCertificate}
        onViewApplication={(app) => setViewingTimelineApp(app)}
      />
    </div>
  );
}
