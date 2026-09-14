import React from 'react';
import { Award, Building2, ClipboardCheck, FlaskConical, QrCode, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import type { DigitalCertificate, Instrument, UserRole, VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';

interface JudgeDemoBarProps {
  role: Exclude<UserRole, 'public'>;
  instruments: Instrument[];
  applications: VerificationApplication[];
  certificates: DigitalCertificate[];
  onRoleChange: (role: Exclude<UserRole, 'public'>) => void;
  onReset: () => void;
  onOpenRegisterInstrument: () => void;
  onStartInspection: (application: VerificationApplication) => void;
  onViewCertificate: (certificateNo: string) => void;
  onOpenPublicVerification: (verificationToken: string) => void;
  onRefresh: () => void;
}

const demoRoles: Array<{ role: Exclude<UserRole, 'public'>; label: string; icon: typeof Building2 }> = [
  { role: 'trader', label: 'Business', icon: Building2 },
  { role: 'officer', label: 'LMO', icon: ShieldCheck },
  { role: 'gatc', label: 'GATC', icon: FlaskConical },
  { role: 'admin', label: 'Admin', icon: Users },
];

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  role,
  instruments,
  applications,
  certificates,
  onRoleChange,
  onReset,
  onOpenRegisterInstrument,
  onStartInspection,
  onViewCertificate,
  onOpenPublicVerification,
  onRefresh,
}) => {
  const application = applications[0];
  const certificate = certificates[0];
  const run = (action: () => void) => {
    try {
      action();
      onRefresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to update the Judge Demo record.');
    }
  };

  const startDemoInspection = () => {
    if (!application) return;
    run(() => StorageService.startFieldInspection(application.id));
    const updated = StorageService.getApplicationByNo(application.applicationNo);
    if (updated) onStartInspection(updated);
  };

  return (
    <section className="border-y border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500 text-slate-950"><ClipboardCheck className="size-5" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-extrabold text-amber-950">JUDGE DEMO</h2>
              <span className="border border-amber-400 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-900">DEMO ACCOUNT</span>
              <span className="text-[11px] font-medium text-amber-800">DEMO / PROTOTYPE DATA · isolated workspace</span>
            </div>
            <p className="mt-0.5 text-xs text-amber-900">Business → LMO inspection → digital certificate → public QR verification</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {demoRoles.map(({ role: demoRole, label, icon: Icon }) => (
            <button key={demoRole} type="button" onClick={() => onRoleChange(demoRole)} className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-xs font-bold transition ${role === demoRole ? 'border-amber-600 bg-amber-500 text-slate-950' : 'border-amber-300 bg-white text-amber-950 hover:bg-amber-100'}`}>
              <Icon className="size-3.5" />{label}
            </button>
          ))}
          <button type="button" disabled={!certificate} onClick={() => certificate && onViewCertificate(certificate.certNo)} className="inline-flex items-center gap-1.5 border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-bold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-45"><Award className="size-3.5" />Certificate</button>
          <button type="button" disabled={!certificate} onClick={() => certificate && onOpenPublicVerification(certificate.verificationToken)} className="inline-flex items-center gap-1.5 border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-bold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-45"><QrCode className="size-3.5" />QR verification</button>
          <button type="button" onClick={() => { if (window.confirm('Reset Judge Demo? This removes only DEMO / PROTOTYPE records.')) onReset(); }} className="inline-flex items-center gap-1.5 border border-rose-300 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50"><RefreshCw className="size-3.5" />Reset Demo</button>
        </div>
      </div>

      <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-2 border-t border-amber-200 pt-3">
        {role === 'trader' && <>
          {!instruments.length && <button type="button" onClick={onOpenRegisterInstrument} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">Add pre-filled instrument</button>}
          {instruments.length > 0 && !application && <button type="button" onClick={() => run(() => StorageService.submitJudgeDemoApplication())} className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800">Submit Demo Application</button>}
          {application && <DemoStatus text={`Application ${application.applicationNo}: ${application.status.replaceAll('_', ' ')}`} />}
        </>}
        {role === 'officer' && <>
          {!application && <DemoStatus text="Waiting for the Business demo to submit the application." />}
          {application?.status === 'SUBMITTED' && <button type="button" onClick={() => run(() => StorageService.startReview(application.id, 'Demo LMO review started.'))} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800">Review Application</button>}
          {application?.status === 'UNDER_REVIEW' && <button type="button" onClick={() => run(() => StorageService.scheduleInspection(application.id, new Date().toISOString().slice(0, 10), 'Demo inspection scheduled for today.'))} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800">Schedule Inspection</button>}
          {application && ['INSPECTION_SCHEDULED', 'INSPECTION_IN_PROGRESS'].includes(application.status) && <button type="button" onClick={startDemoInspection} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">Start Demo Inspection</button>}
          {application && certificate && <button type="button" onClick={() => onViewCertificate(certificate.certNo)} className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800">Show Demo Certificate</button>}
        </>}
        {role === 'gatc' && <DemoStatus text={application ? `Assigned DEMO / PROTOTYPE application: ${application.applicationNo}` : 'The GATC assignment appears when the LMO accepts the demo application.'} />}
        {role === 'admin' && <>
          {!certificate && <DemoStatus text="Certificate metrics update when the LMO passes the inspection." />}
          {certificate?.status === 'VALID' && <button type="button" onClick={() => run(() => StorageService.updateCertificateStatus(certificate.certNo, 'EXPIRED'))} className="rounded-md bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700">Set Demo Certificate Expired</button>}
          {certificate?.status === 'EXPIRED' && <button type="button" onClick={() => run(() => StorageService.updateCertificateStatus(certificate.certNo, 'VALID'))} className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800">Restore Demo Certificate Valid</button>}
          {certificate && <button type="button" onClick={() => onOpenPublicVerification(certificate.verificationToken)} className="rounded-md border border-amber-400 bg-white px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-100">Open same QR verification</button>}
        </>}
      </div>
    </section>
  );
};

const DemoStatus: React.FC<{ text: string }> = ({ text }) => <span className="border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-950">{text}</span>;
