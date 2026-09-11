import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileCheck2,
  Award,
  AlertTriangle,
  ClipboardList,
  FlaskConical,
  BarChart3,
  Users,
  History,
  QrCode,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  activeRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenApplyWizard: () => void;
  onOpenVerify: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  activeTab,
  onTabChange,
  onOpenRegisterModal,
  onOpenApplyWizard,
  onOpenVerify,
}) => {
  return (
    <aside className="sticky top-[68px] hidden min-h-[calc(100vh-68px)] w-60 flex-col justify-between border-r border-slate-800 bg-slate-900 md:flex">
      <div className="space-y-4 p-3">
        {/* Quick Action Button based on role */}
        {activeRole === 'trader' && (
          <div className="space-y-2">
            <button
              onClick={onOpenRegisterModal}
              className="flex w-full items-center justify-center gap-2 bg-blue-700 px-3 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-800 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Instrument</span>
            </button>
            <button
              onClick={onOpenApplyWizard}
              className="flex w-full items-center justify-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Apply Verification</span>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div>
          <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {activeRole === 'trader' && 'Trader Portal'}
            {activeRole === 'officer' && 'LMO Field Portal'}
            {activeRole === 'gatc' && 'GATC Test Lab'}
            {activeRole === 'admin' && 'Central Administration'}
          </div>

          <nav className="space-y-1">
            {activeRole === 'trader' && (
              <>
                <NavItem
                  id="dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard Overview"
                  active={activeTab === 'dashboard'}
                  onClick={() => onTabChange('dashboard')}
                />
                <NavItem
                  id="instruments"
                  icon={ClipboardList}
                  label="My Instruments"
                  active={activeTab === 'instruments'}
                  onClick={() => onTabChange('instruments')}
                />
                <NavItem
                  id="applications"
                  icon={FileCheck2}
                  label="Applications & Status"
                  active={activeTab === 'applications'}
                  onClick={() => onTabChange('applications')}
                />
                <NavItem
                  id="certificates"
                  icon={Award}
                  label="Digital Certificates"
                  active={activeTab === 'certificates'}
                  onClick={() => onTabChange('certificates')}
                />
                <NavItem
                  id="expiring"
                  icon={AlertTriangle}
                  label="Expiring Instruments"
                  active={activeTab === 'expiring'}
                  onClick={() => onTabChange('expiring')}
                />
              </>
            )}

            {activeRole === 'officer' && (
              <>
                <NavItem
                  id="officer-dashboard"
                  icon={LayoutDashboard}
                  label="Officer Dashboard"
                  active={activeTab === 'officer-dashboard'}
                  onClick={() => onTabChange('officer-dashboard')}
                />
                <NavItem
                  id="inspection-queue"
                  icon={CheckSquare}
                  label="Assigned Inspection Queue"
                  active={activeTab === 'inspection-queue'}
                  onClick={() => onTabChange('inspection-queue')}
                />
                <NavItem
                  id="field-inspection"
                  icon={ShieldCheck}
                  label="Field Inspection Module"
                  active={activeTab === 'field-inspection'}
                  onClick={() => onTabChange('field-inspection')}
                  badge="Mobile UI"
                />
                <NavItem
                  id="issued-certs"
                  icon={Award}
                  label="Issued Certificates"
                  active={activeTab === 'issued-certs'}
                  onClick={() => onTabChange('issued-certs')}
                />
              </>
            )}

            {activeRole === 'gatc' && (
              <>
                <NavItem
                  id="gatc-dashboard"
                  icon={LayoutDashboard}
                  label="GATC Dashboard"
                  active={activeTab === 'gatc-dashboard'}
                  onClick={() => onTabChange('gatc-dashboard')}
                />
                <NavItem
                  id="lab-requests"
                  icon={FlaskConical}
                  label="Assigned Test Requests"
                  active={activeTab === 'lab-requests'}
                  onClick={() => onTabChange('lab-requests')}
                />
                <NavItem
                  id="submitted-results"
                  icon={FileCheck2}
                  label="Submitted Verification Results"
                  active={activeTab === 'submitted-results'}
                  onClick={() => onTabChange('submitted-results')}
                />
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <NavItem
                  id="admin-analytics"
                  icon={BarChart3}
                  label="Central Analytics"
                  active={activeTab === 'admin-analytics'}
                  onClick={() => onTabChange('admin-analytics')}
                />
                <NavItem
                  id="officer-monitor"
                  icon={Users}
                  label="Officer & GATC Monitor"
                  active={activeTab === 'officer-monitor'}
                  onClick={() => onTabChange('officer-monitor')}
                />
                <NavItem
                  id="all-certificates"
                  icon={Award}
                  label="Certificate Registry"
                  active={activeTab === 'all-certificates'}
                  onClick={() => onTabChange('all-certificates')}
                />
                <NavItem
                  id="audit-logs"
                  icon={History}
                  label="Audit Logs & Compliance"
                  active={activeTab === 'audit-logs'}
                  onClick={() => onTabChange('audit-logs')}
                />
              </>
            )}
          </nav>
        </div>

        {/* Public Verification Shortcut */}
        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={onOpenVerify}
            className="group flex w-full items-center gap-2.5 border border-slate-700 bg-slate-800/60 p-2.5 text-left transition-colors hover:bg-slate-800 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center bg-amber-500/10 text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Public Verification</div>
              <div className="text-[10px] text-slate-400">Scan or search certificate</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="space-y-1 border-t border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>System Status: Online</span>
        </div>
        <div>Legal Metrology Act, 2009 Compliant</div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between px-2 py-2 text-xs font-medium transition-colors cursor-pointer ${
      active
        ? 'border-l-2 border-blue-500 bg-blue-600/15 text-blue-300 font-semibold'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
      <span>{label}</span>
    </div>
    {badge && (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        {badge}
      </span>
    )}
  </button>
);
