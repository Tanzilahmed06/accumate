import React, { useState } from 'react';
import {
  Award,
  Plus,
  FileCheck2,
  Search,
  Eye,
  Calendar,
} from 'lucide-react';
import type { Instrument, VerificationApplication, DigitalCertificate, ExpiryAlert } from '../types';

interface TraderDashboardProps {
  instruments: Instrument[];
  applications: VerificationApplication[];
  certificates: DigitalCertificate[];
  expiryAlerts: ExpiryAlert[];
  onOpenRegisterModal: () => void;
  onOpenApplyWizard: (instrumentId?: string) => void;
  onViewCertificate: (certNo: string) => void;
  onViewApplicationTimeline: (app: VerificationApplication) => void;
}

export const TraderDashboard: React.FC<TraderDashboardProps> = ({
  instruments,
  applications,
  certificates,
  expiryAlerts,
  onOpenRegisterModal,
  onOpenApplyWizard,
  onViewCertificate,
  onViewApplicationTimeline,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'instruments' | 'applications'>('instruments');

  // Stats calculation
  const totalInstruments = instruments.length;
  const activeCertificatesCount = certificates.filter((c) => c.status === 'VALID').length;
  const pendingAppsCount = applications.filter((a) => a.status !== 'CERTIFICATE_GENERATED' && a.status !== 'REJECTED').length;
  const expiringSoonCount = expiryAlerts.length;
  const completedCount = applications.filter((a) => a.status === 'CERTIFICATE_GENERATED').length;

  const filteredInstruments = instruments.filter((inst) => {
    const matchesSearch =
      inst.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || inst.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || inst.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Trader summary and primary actions */}
      <div className="border border-slate-200 border-l-4 border-l-slate-900 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
              <span className="h-1.5 w-1.5 bg-blue-700"></span>
              TRADER WORKSPACE · DEMO DATA
            </div>
            <h2 className="font-heading text-[26px] font-semibold tracking-tight text-slate-900">
              Sample Trader
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
              Manage prototype instrument records, proposed verification applications and clearly labelled demo certificate records.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onOpenRegisterModal}
              className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-blue-700" />
              <span>Register Instrument</span>
            </button>
            <button
              onClick={() => onOpenApplyWizard()}
              className="flex items-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Apply Verification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact portfolio summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Total Instruments"
          value={totalInstruments}
          subtext="Registered equipment"
          tone="bg-blue-600"
        />
        <KpiCard
          label="Active Certificates"
          value={activeCertificatesCount}
          subtext="Currently valid"
          tone="bg-emerald-600"
        />
        <KpiCard
          label="Pending Applications"
          value={pendingAppsCount}
          subtext="Awaiting action"
          tone="bg-amber-500"
        />
        <KpiCard
          label="Expiring Soon"
          value={expiringSoonCount}
          subtext="Requires attention"
          tone="bg-rose-600"
        />
      </div>

      <div className="flex items-center justify-end text-xs text-slate-500">
        <span className="font-medium text-slate-700">{completedCount}</span><span className="ml-1">completed verifications</span>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('instruments')}
              className={`border-b-2 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'instruments'
                  ? 'border-blue-700 text-blue-800'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              My Registered Instruments ({instruments.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`border-b-2 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'applications'
                  ? 'border-blue-700 text-blue-800'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              Verification Applications ({applications.length})
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search serial no, model, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:w-60"
              />
            </div>
            {activeTab === 'instruments' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Weighing Scale">Weighing Scale</option>
                <option value="Weighbridge">Weighbridge</option>
                <option value="Fuel Dispenser">Fuel Dispenser</option>
                <option value="Electricity Meter">Electricity Meter</option>
                <option value="Water Meter">Water Meter</option>
              </select>
            )}
          </div>
        </div>

        {/* Instruments Tab Table */}
        {activeTab === 'instruments' && (
          <div className="overflow-x-auto">
            <table className="min-w-[1080px] w-full text-left text-[13px] text-slate-600">
              <thead className="border-b border-slate-300 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Instrument</th>
                  <th className="px-4 py-3 font-medium">Instrument ID</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Verification Status</th>
                  <th className="px-4 py-3 font-medium">Certificate Expiry</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInstruments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No instruments found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInstruments.map((inst) => (
                    <tr key={inst.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <div className="min-w-[210px] font-medium leading-5 text-slate-900">{inst.title}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-xs font-medium text-slate-800">{inst.id}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-slate-500">S/N {inst.serialNumber}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
                          {inst.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        <div className="max-w-[190px] leading-5" title={inst.locationAddress}>
                          {inst.city}, {inst.state}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        {inst.certExpiryDate ? (
                          <div className="font-medium text-slate-800">{inst.certExpiryDate}</div>
                        ) : (
                          <span className="text-xs text-slate-400">Not verified</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        {inst.currentCertNo && (
                          <button
                            onClick={() => onViewCertificate(inst.currentCertNo!)}
                            className="mr-1 inline-flex items-center gap-1 border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-50 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Cert</span>
                          </button>
                        )}
                        <button
                          onClick={() => onOpenApplyWizard(inst.id)}
                          className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-900 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Applications Tab Table */}
        {activeTab === 'applications' && (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-[13px] text-slate-600">
              <thead className="border-b border-slate-300 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Application & Instrument</th>
                  <th className="px-4 py-3 font-medium">Submission Date</th>
                  <th className="px-4 py-3 font-medium">Assigned Officer</th>
                  <th className="px-4 py-3 font-medium">Fee & Payment</th>
                  <th className="px-4 py-3 font-medium">Current Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app) => (
                  <tr key={app.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-800">
                          {app.applicationNo}
                        </span>
                        <div className="mt-1 font-medium text-slate-900">{app.instrumentTitle}</div>
                        <div className="text-[11px] text-slate-500">S/N {app.serialNumber} · {app.category}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.submissionDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{app.assignedOfficerName || 'Pending Assignment'}</div>
                      {app.scheduledInspectionDate && (
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          Scheduled: <span className="font-semibold">{app.scheduledInspectionDate}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">₹{app.feeAmount}</div>
                      <span className="mt-1 inline-block border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <AppStatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onViewApplicationTimeline(app)}
                        className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Track Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

interface KpiCardProps {
  label: string;
  value: number;
  subtext: string;
  tone: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, subtext, tone }) => (
  <div className="border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 shrink-0 ${tone}`}></span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-600">{label}</span>
    </div>
    <div className="mt-2 text-2xl font-semibold leading-none text-slate-900">{value}</div>
    <div className="mt-1 text-[11px] text-slate-500">{subtext}</div>
  </div>
);

export const StatusBadge: React.FC<{ status: Instrument['status'] }> = ({ status }) => {
  const styles: Record<Instrument['status'], { label: string; style: string }> = {
    VERIFIED: { label: 'VERIFIED', style: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
    VERIFICATION_PENDING: { label: 'PENDING VERIFICATION', style: 'border-amber-300 bg-amber-50 text-amber-800' },
    INSPECTION_SCHEDULED: { label: 'INSPECTION SCHEDULED', style: 'border-blue-300 bg-blue-50 text-blue-800' },
    REGISTERED: { label: 'REGISTERED', style: 'border-slate-300 bg-slate-50 text-slate-700' },
    EXPIRING_SOON: { label: 'EXPIRING SOON', style: 'border-amber-300 bg-amber-50 text-amber-900' },
    EXPIRED: { label: 'EXPIRED', style: 'border-rose-300 bg-rose-50 text-rose-800' },
    REJECTED: { label: 'REJECTED', style: 'border-red-300 bg-red-50 text-red-800' },
  };

  const current = styles[status] || { label: status, style: 'bg-slate-100 text-slate-700 border-slate-300' };

  return (
    <span className={`inline-block border px-2 py-1 text-[10px] font-semibold tracking-[0.03em] ${current.style}`}>
      {current.label}
    </span>
  );
};

export const AppStatusBadge: React.FC<{ status: VerificationApplication['status'] }> = ({ status }) => {
  const map: Record<VerificationApplication['status'], { label: string; style: string }> = {
    DRAFT: { label: 'DRAFT', style: 'border-slate-300 bg-slate-50 text-slate-700' },
    SUBMITTED: { label: 'SUBMITTED', style: 'border-slate-300 bg-slate-50 text-slate-800' },
    DOCUMENTS_VERIFIED: { label: 'DOCUMENTS VERIFIED', style: 'border-blue-300 bg-blue-50 text-blue-800' },
    OFFICER_ASSIGNED: { label: 'OFFICER ASSIGNED', style: 'border-blue-300 bg-blue-50 text-blue-800' },
    INSPECTION_SCHEDULED: { label: 'INSPECTION SCHEDULED', style: 'border-amber-300 bg-amber-50 text-amber-800' },
    INSPECTION_COMPLETED: { label: 'INSPECTION COMPLETED', style: 'border-blue-300 bg-blue-50 text-blue-800' },
    CERTIFICATE_GENERATED: { label: 'CERTIFICATE ISSUED', style: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
    REJECTED: { label: 'REJECTED', style: 'border-rose-300 bg-rose-50 text-rose-800' },
  };
  const current = map[status] || { label: status, style: 'bg-slate-100 text-slate-700 border-slate-300' };
  return (
    <span className={`inline-block border px-2 py-1 text-[10px] font-semibold tracking-[0.03em] ${current.style}`}>
      {current.label}
    </span>
  );
};
