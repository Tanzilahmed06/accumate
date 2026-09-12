import React from 'react';
import { X, Calendar, Award } from 'lucide-react';
import type { VerificationApplication } from '../types';
import { AppStatusBadge } from './TraderDashboard';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: VerificationApplication;
  onViewCertificate?: (certNo: string) => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  application,
  onViewCertificate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {application.applicationNo}
              </span>
              <AppStatusBadge status={application.status} />
            </div>
            <h3 className="font-bold text-base font-heading text-white mt-1">{application.instrumentTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <div className="text-slate-500 font-medium">Prototype assignment</div>
            <div className="font-bold text-slate-900 text-sm">{application.assignedOfficerName || 'Demo Officer'}</div>
            {application.scheduledInspectionDate && (
              <div className="text-blue-700 font-semibold pt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Scheduled Field Visit: {application.scheduledInspectionDate}</span>
              </div>
            )}
          </div>

          {/* Visual Step Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Proposed workflow timeline</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {application.timeline.map((step, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.completed
                        ? 'bg-emerald-600 text-white shadow'
                        : step.current
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      {step.timestamp && <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>}
                    </div>
                    <p className="text-[11px] text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {application.status === 'CERTIFICATE_GENERATED' && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onViewCertificate) onViewCertificate(application.applicationNo);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View & Download Digital Certificate</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
