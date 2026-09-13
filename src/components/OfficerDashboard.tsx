import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Eye, Search, ShieldCheck, XCircle } from 'lucide-react';
import type { PlatformUser, VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';
import { AppStatusBadge } from './TraderDashboard';

interface OfficerDashboardProps {
  applications: VerificationApplication[];
  testCenters: PlatformUser[];
  onStartInspection: (application: VerificationApplication) => void;
  onViewCertificate: (reference: string) => void;
  onRefresh: () => void;
}

const statusOptions = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'INSPECTION_SCHEDULED', 'INSPECTION_IN_PROGRESS', 'VERIFIED', 'COMPLETED', 'REJECTED'];

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  applications,
  testCenters,
  onStartInspection,
  onViewCertificate,
  onRefresh,
}) => {
  const officer = StorageService.getCurrentUser();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState<VerificationApplication | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [testCenterId, setTestCenterId] = useState('');
  const [error, setError] = useState('');

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      application.applicationNo,
      application.ownerName,
      application.merchantId || '',
      application.instrumentTitle,
      application.serialNumber,
    ].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (status === 'ALL' || application.status === status);
  }), [applications, search, status]);

  const counts = {
    new: applications.filter((application) => application.status === 'SUBMITTED').length,
    underReview: applications.filter((application) => application.status === 'UNDER_REVIEW').length,
    assigned: applications.filter((application) => application.status === 'ASSIGNED').length,
    scheduled: applications.filter((application) => application.status === 'INSPECTION_SCHEDULED').length,
    completed: applications.filter((application) => ['VERIFIED', 'COMPLETED'].includes(application.status)).length,
    rejected: applications.filter((application) => application.status === 'REJECTED').length,
  };

  const selectApplication = (application: VerificationApplication) => {
    setSelectedApplication(application);
    setScheduleDate(application.scheduledInspectionDate || '');
    setRemarks(application.reviewNotes || application.testCenterNotes || application.rejectionReason || '');
    setTestCenterId(application.assignedGATCId || '');
    setError('');
  };

  const runAction = (action: () => void) => {
    try {
      action();
      onRefresh();
      setError('');
    } catch (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : 'Unable to update this application.');
    }
  };

  const handleSchedule = () => {
    if (!selectedApplication) return;
    runAction(() => StorageService.scheduleInspection(selectedApplication.id, scheduleDate, remarks));
  };

  const handleAssignTestCenter = () => {
    if (!selectedApplication) return;
    runAction(() => StorageService.assignTestCenter(selectedApplication.id, testCenterId, remarks));
  };

  const handleReject = () => {
    if (!selectedApplication) return;
    if (!remarks.trim()) {
      setError('Add a reason before rejecting the application.');
      return;
    }
    runAction(() => StorageService.updateApplicationStatus(selectedApplication.id, 'REJECTED', remarks));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">Field Officer Workspace</p>
        <h2 className="mt-1 text-2xl font-bold">{officer.name || 'Field officer'}’s application queue</h2>
        <p className="mt-2 text-sm text-slate-300">Review submitted applications, schedule inspections, and route appropriate work to a test center.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <WorkflowCount label="New applications" value={counts.new} />
        <WorkflowCount label="Under review" value={counts.underReview} />
        <WorkflowCount label="Assigned" value={counts.assigned} />
        <WorkflowCount label="Inspection scheduled" value={counts.scheduled} />
        <WorkflowCount label="Verified / completed" value={counts.completed} />
        <WorkflowCount label="Rejected" value={counts.rejected} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Application management</h3>
            <p className="mt-1 text-xs text-slate-500">This queue reads the same submitted records visible to traders.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search application or business" className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-xs outline-none focus:border-blue-500 sm:w-56" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500">
              {statusOptions.map((option) => <option key={option} value={option}>{option === 'ALL' ? 'All statuses' : option.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th className="px-4 py-3">Application</th><th className="px-4 py-3">Business / Merchant</th><th className="px-4 py-3">Instrument</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned officer</th><th className="px-4 py-3">Inspection date</th><th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{application.applicationNo}</td>
                  <td className="px-4 py-3"><div className="font-semibold text-slate-900">{application.ownerName}</div><div className="font-mono text-[10px] text-slate-500">{application.merchantId || 'Merchant ID pending'}</div></td>
                  <td className="px-4 py-3"><div className="font-semibold text-slate-900">{application.instrumentTitle}</div><div className="text-[10px] text-slate-500">{application.serialNumber}</div></td>
                  <td className="px-4 py-3">{application.submissionDate}</td><td className="px-4 py-3"><AppStatusBadge status={application.status} /></td><td className="px-4 py-3">{application.assignedOfficerName || 'Unassigned'}</td><td className="px-4 py-3">{application.scheduledInspectionDate || 'Not scheduled'}</td>
                  <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2">
                    <button type="button" onClick={() => selectApplication(application)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50"><Eye className="size-3.5" />View</button>
                    {application.status === 'SUBMITTED' && <button type="button" onClick={() => runAction(() => StorageService.startReview(application.id))} className="rounded-lg bg-blue-700 px-2.5 py-1.5 font-semibold text-white hover:bg-blue-800">Start review</button>}
                    {['INSPECTION_SCHEDULED', 'INSPECTION_IN_PROGRESS', 'VERIFIED'].includes(application.status) && <button type="button" onClick={() => onStartInspection(application)} className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 font-semibold text-white hover:bg-slate-800"><ShieldCheck className="size-3.5" />Record inspection</button>}
                    {application.status === 'VERIFIED' && <button type="button" onClick={() => runAction(() => StorageService.completeApplication(application.id))} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 font-semibold text-white hover:bg-emerald-700"><CheckCircle2 className="size-3.5" />Complete</button>}
                    {application.status === 'COMPLETED' && <button type="button" onClick={() => onViewCertificate(application.applicationNo)} className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100">Certificate</button>}
                  </div></td>
                </tr>
              ))}
              {filteredApplications.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500">No applications match this queue.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="font-mono text-xs font-bold text-blue-700">{selectedApplication.applicationNo}</p><h3 className="mt-1 text-lg font-bold text-slate-900">{selectedApplication.instrumentTitle}</h3><p className="mt-1 text-xs text-slate-500">{selectedApplication.ownerName} · {selectedApplication.merchantId || 'Merchant ID pending'}</p></div><button type="button" onClick={() => setSelectedApplication(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">×</button></header>
            <div className="space-y-5 p-6">
              {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
              <div className="grid gap-3 sm:grid-cols-2"><Info label="Status"><AppStatusBadge status={selectedApplication.status} /></Info><Info label="Assigned test center">{selectedApplication.assignedGATCName || 'Not assigned'}</Info><Info label="Submitted">{selectedApplication.submissionDate}</Info><Info label="Inspection date">{selectedApplication.scheduledInspectionDate || 'Not scheduled'}</Info></div>
              <label className="block text-xs font-semibold text-slate-700">Review remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm font-normal outline-none focus:border-blue-500" placeholder="Add review, scheduling, or rejection remarks" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-700">Inspection date<input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500" /></label><label className="block text-xs font-semibold text-slate-700">Test center<select value={testCenterId} onChange={(event) => setTestCenterId(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500"><option value="">Select an active test center</option>{testCenters.map((center) => <option key={center.id} value={center.id}>{center.centerName || center.name}{center.centerCode ? ` (${center.centerCode})` : ''}</option>)}</select></label></div>
              {!testCenters.length && <p className="text-xs text-amber-700">No active test centers are available. A department administrator can create or activate a test-center profile.</p>}
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                {selectedApplication.status === 'SUBMITTED' && <button type="button" onClick={() => runAction(() => StorageService.startReview(selectedApplication.id, remarks))} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800">Accept / start review</button>}
                <button type="button" onClick={handleSchedule} className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"><Calendar className="size-3.5" />Schedule inspection</button><button type="button" disabled={!testCenterId} onClick={handleAssignTestCenter} className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50">Assign test center</button><button type="button" onClick={handleReject} className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"><XCircle className="size-3.5" />Reject</button>
              </div>
              <div><h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Status history</h4><ol className="mt-3 space-y-2">{(selectedApplication.statusHistory || []).map((item) => <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><strong className="text-slate-900">{item.newStatus.replaceAll('_', ' ')}</strong> · {item.changedByName} · {new Date(item.timestamp).toLocaleString()} {item.remarks && <span>— {item.remarks}</span>}</li>)}</ol></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const WorkflowCount: React.FC<{ label: string; value: number }> = ({ label, value }) => <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>;
const Info: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => <div className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><div className="mt-1 text-sm font-medium text-slate-900">{children}</div></div>;
