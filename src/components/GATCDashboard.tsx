import { useState } from 'react';
import { CheckCircle2, Eye, FlaskConical, Send, XCircle } from 'lucide-react';
import type { VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';
import { AppStatusBadge } from './TraderDashboard';

interface GATCDashboardProps {
  applications: VerificationApplication[];
  onRefresh: () => void;
}

export const GATCDashboard: React.FC<GATCDashboardProps> = ({ applications, onRefresh }) => {
  const testCenter = StorageService.getCurrentUser();
  const [selectedApplication, setSelectedApplication] = useState<VerificationApplication | null>(null);
  const [remarks, setRemarks] = useState('');
  const [result, setResult] = useState<'PASS' | 'FAIL'>('PASS');
  const [error, setError] = useState('');

  const selectApplication = (application: VerificationApplication) => {
    setSelectedApplication(application);
    setRemarks(application.testCenterNotes || '');
    setResult(application.status === 'REJECTED' ? 'FAIL' : 'PASS');
    setError('');
  };

  const runAction = (action: () => void) => {
    try {
      action();
      onRefresh();
      setError('');
    } catch (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : 'Unable to update the test-center result.');
    }
  };

  const submitResult = () => {
    if (!selectedApplication) return;
    runAction(() => StorageService.recordTestCenterResult(selectedApplication.id, result, remarks));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">Test Center Workspace</p>
        <h2 className="mt-1 text-2xl font-bold">{testCenter.organization || testCenter.name}</h2>
        <p className="mt-2 text-sm text-slate-300">Only applications specifically assigned to this test center are displayed here.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h3 className="font-bold text-slate-900">Assigned testing requests</h3><p className="mt-1 text-xs text-slate-500">Record testing notes and send the result back to the responsible field officer.</p></header>
        <div className="overflow-x-auto"><table className="min-w-[850px] w-full text-left text-xs text-slate-600"><thead className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-semibold uppercase tracking-wider text-slate-700"><tr><th className="px-4 py-3">Application</th><th className="px-4 py-3">Trader / business</th><th className="px-4 py-3">Instrument</th><th className="px-4 py-3">Assignment date</th><th className="px-4 py-3">Testing date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">
          {applications.map((application) => <tr key={application.id} className="hover:bg-slate-50"><td className="px-4 py-3"><div className="font-mono font-bold text-purple-700">{application.applicationNo}</div><div className="text-[10px] text-slate-500">{application.assignedOfficerName || 'Officer pending'}</div></td><td className="px-4 py-3"><div className="font-semibold text-slate-900">{application.ownerName}</div><div className="text-[10px] text-slate-500">{application.merchantId || 'Merchant ID pending'}</div></td><td className="px-4 py-3"><div className="font-semibold text-slate-900">{application.instrumentTitle}</div><div className="text-[10px] text-slate-500">{application.serialNumber}</div></td><td className="px-4 py-3">{application.assignedTestCenterAt ? new Date(application.assignedTestCenterAt).toLocaleDateString() : 'Assigned'}</td><td className="px-4 py-3">{application.scheduledInspectionDate || 'Not scheduled'}</td><td className="px-4 py-3"><AppStatusBadge status={application.status} /></td><td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><button type="button" onClick={() => selectApplication(application)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50"><Eye className="size-3.5" />View</button>{application.status === 'ASSIGNED' && <button type="button" onClick={() => runAction(() => StorageService.beginTestCenterWork(application.id))} className="inline-flex items-center gap-1 rounded-lg bg-purple-700 px-2.5 py-1.5 font-semibold text-white hover:bg-purple-800"><FlaskConical className="size-3.5" />Start testing</button>}{application.status === 'INSPECTION_IN_PROGRESS' && <button type="button" onClick={() => selectApplication(application)} className="rounded-lg bg-purple-700 px-2.5 py-1.5 font-semibold text-white hover:bg-purple-800">Submit result</button>}</div></td></tr>)}
          {!applications.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No applications are assigned to this test center.</td></tr>}
        </tbody></table></div>
      </section>

      {selectedApplication && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><section className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="font-mono text-xs font-bold text-purple-700">{selectedApplication.applicationNo}</p><h3 className="mt-1 font-bold text-slate-900">{selectedApplication.instrumentTitle}</h3><p className="mt-1 text-xs text-slate-500">{selectedApplication.ownerName} · {selectedApplication.serialNumber}</p></div><button type="button" onClick={() => setSelectedApplication(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">×</button></header><div className="space-y-5 p-6">{error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}<div className="rounded-lg bg-slate-50 p-3 text-xs"><span className="font-semibold text-slate-700">Responsible field officer: </span>{selectedApplication.assignedOfficerName || 'Not yet assigned'}</div><label className="block text-xs font-semibold text-slate-700">Testing outcome<div className="mt-2 flex gap-2"><button type="button" onClick={() => setResult('PASS')} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 ${result === 'PASS' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-600'}`}><CheckCircle2 className="size-3.5" />Pass</button><button type="button" onClick={() => setResult('FAIL')} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 ${result === 'FAIL' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-300 text-slate-600'}`}><XCircle className="size-3.5" />Fail</button></div></label><label className="block text-xs font-semibold text-slate-700">Testing notes and remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={4} className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm font-normal outline-none focus:border-purple-500" placeholder="Record test observations and verification information" /></label><p className="text-xs text-slate-500">The current local data layer has no evidence-upload endpoint, so no file is claimed as uploaded.</p><div className="flex justify-end gap-2 border-t border-slate-200 pt-4">{selectedApplication.status === 'ASSIGNED' && <button type="button" onClick={() => runAction(() => StorageService.beginTestCenterWork(selectedApplication.id))} className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">Start testing</button>}{selectedApplication.status === 'INSPECTION_IN_PROGRESS' && <button type="button" onClick={submitResult} className="inline-flex items-center gap-1 rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-800"><Send className="size-3.5" />Send result to officer</button>}</div></div></section></div>}
    </div>
  );
};
