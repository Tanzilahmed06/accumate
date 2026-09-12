import React, { useState } from 'react';
import {
  Clock,
  Award,
  XCircle,
  Calendar,
  ShieldCheck,
  Search,
  MapPin,
} from 'lucide-react';
import type { VerificationApplication, Instrument } from '../types';
import { StorageService } from '../services/storageService';
import { AppStatusBadge } from './TraderDashboard';

interface OfficerDashboardProps {
  applications: VerificationApplication[];
  instruments: Instrument[];
  onStartInspection: (app: VerificationApplication) => void;
  onViewCertificate: (certNo: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  applications,
  instruments,
  onStartInspection,
  onViewCertificate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<VerificationApplication | null>(null);
  const [scheduleDate, setScheduleDate] = useState('2026-09-15');

  const officerUser = StorageService.getCurrentUser();

  const assignedApps = applications.filter((app) => app.assignedOfficerId === officerUser.id || !app.assignedOfficerId);

  const filteredApps = assignedApps.filter((app) => {
    const matchesSearch =
      app.applicationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.instrumentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = assignedApps.filter((a) => a.status === 'SUBMITTED' || a.status === 'DOCUMENTS_VERIFIED' || a.status === 'OFFICER_ASSIGNED').length;
  const scheduledCount = assignedApps.filter((a) => a.status === 'INSPECTION_SCHEDULED').length;
  const issuedCount = assignedApps.filter((a) => a.status === 'CERTIFICATE_GENERATED').length;
  const rejectedCount = assignedApps.filter((a) => a.status === 'REJECTED').length;

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForSchedule) return;
    StorageService.updateApplicationStatus(
      selectedAppForSchedule.id,
      'INSPECTION_SCHEDULED',
      undefined,
      officerUser.name,
      scheduleDate
    );
    setSelectedAppForSchedule(null);
  };

  return (
    <div className="space-y-6">
      {/* Officer Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              OFFICER WORKSPACE · DEMO DATA
            </div>
            <h2 className="text-2xl font-bold font-heading">{officerUser.name}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {officerUser.designation} | {officerUser.organization}
            </p>
          </div>
          <div className="bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 text-xs">
            <div className="text-slate-400">Demo work area</div>
            <div className="font-bold text-amber-300 font-heading">Prototype inspection queue</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OfficerKpiCard
          label="Pending Applications"
          value={pendingCount}
          subtext="Requires a demo action"
          color="bg-amber-500/10 border-amber-500/30 text-amber-600"
          icon={Clock}
        />
        <OfficerKpiCard
          label="Inspections Scheduled"
          value={scheduledCount}
          subtext="Field visits ready"
          color="bg-blue-500/10 border-blue-500/30 text-blue-600"
          icon={Calendar}
        />
        <OfficerKpiCard
          label="Certificate Records"
          value={issuedCount}
          subtext="Prototype records completed"
          color="bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
          icon={Award}
        />
        <OfficerKpiCard
          label="Failed Results"
          value={rejectedCount}
          subtext="Prototype result: fail"
          color="bg-rose-500/10 border-rose-500/30 text-rose-600"
          icon={XCircle}
        />
      </div>

      {/* Main Task Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading">Assigned Verification Queue</h3>
            <p className="text-xs text-slate-500">Review prototype records, schedule a demo inspection, or record a result.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search trader, app no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 w-48 sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="INSPECTION_SCHEDULED">Scheduled</option>
              <option value="CERTIFICATE_GENERATED">Issued</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Application No & Instrument</th>
                <th className="px-6 py-3.5">Trader Details</th>
                <th className="px-6 py-3.5">Demo transaction</th>
                <th className="px-6 py-3.5">Schedule & Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No verification applications assigned to this queue.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const inst = instruments.find((i) => i.id === app.instrumentId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {app.applicationNo}
                          </span>
                          <div className="font-semibold text-slate-900 mt-1">{app.instrumentTitle}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            S/N: {app.serialNumber} | Category: {app.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{app.ownerName}</div>
                        <div className="text-[10px] text-slate-500">{app.ownerEmail}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{inst?.locationAddress || 'Delhi Site'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ₹{app.feeAmount}
                        <div className="text-[10px] font-bold text-emerald-600">DEMO PAID</div>
                      </td>
                      <td className="px-6 py-4">
                        <AppStatusBadge status={app.status} />
                        {app.scheduledInspectionDate && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            Scheduled: <span className="font-semibold">{app.scheduledInspectionDate}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {app.status === 'SUBMITTED' || app.status === 'DOCUMENTS_VERIFIED' ? (
                          <button
                            onClick={() => setSelectedAppForSchedule(app)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg text-xs transition-colors border border-blue-200 cursor-pointer inline-flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule</span>
                          </button>
                        ) : null}

                        {app.status !== 'CERTIFICATE_GENERATED' && app.status !== 'REJECTED' ? (
                          <button
                            onClick={() => onStartInspection(app)}
                            className="px-3.5 py-1.5 bg-[#1558A6] text-white hover:bg-[#104986] font-semibold rounded-lg text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                            <span>Start Inspection</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onViewCertificate(app.applicationNo)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium rounded-lg text-xs transition-colors border border-emerald-200 cursor-pointer inline-flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Issued Cert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Scheduler Modal */}
      {selectedAppForSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border max-w-md w-full animate-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900 font-heading mb-1">Schedule Field Inspection</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set inspection date for application <strong>{selectedAppForSchedule.applicationNo}</strong>.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Inspection Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForSchedule(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OfficerKpiCard: React.FC<{ label: string; value: number; subtext: string; color: string; icon: React.ComponentType<{ className?: string }> }> = ({
  label,
  value,
  subtext,
  color,
  icon: Icon,
}) => (
  <div className={`p-4 rounded-2xl border shadow-sm ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <Icon className="w-5 h-5 opacity-80" />
    </div>
    <div className="text-2xl font-extrabold font-heading text-slate-900">{value}</div>
    <div className="text-[11px] text-slate-600">{subtext}</div>
  </div>
);
