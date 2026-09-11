import React from 'react';
import { X, AlertTriangle, FileCheck2 } from 'lucide-react';
import type { ExpiryAlert } from '../types';

interface ExpiryAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ExpiryAlert[];
  onApplyRenewal: (instrumentId: string) => void;
  onViewCertificate: (certNo: string) => void;
}

export const ExpiryAlertsModal: React.FC<ExpiryAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onApplyRenewal,
  onViewCertificate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
            <h3 className="font-bold text-base font-heading">Certificate Expiry Alert System</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <p className="text-xs text-slate-500">
            Instruments expiring within 60 days, 30 days, 7 days, or expired. Legal Metrology rules require re-stamping before commercial use.
          </p>

          {alerts.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border text-xs text-slate-400">
              No instruments requiring immediate re-verification. All active certificates are valid.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((al) => (
                <div
                  key={al.instrumentId}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    al.severity === 'EXPIRED'
                      ? 'bg-rose-50/80 border-rose-200'
                      : al.severity === 'CRITICAL'
                      ? 'bg-orange-50/80 border-orange-200'
                      : 'bg-amber-50/80 border-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{al.instrumentTitle}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          al.severity === 'EXPIRED'
                            ? 'bg-rose-600 text-white'
                            : al.severity === 'CRITICAL'
                            ? 'bg-orange-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {al.daysRemaining < 0 ? 'EXPIRED' : `${al.daysRemaining} DAYS REMAINING`}
                      </span>
                    </div>

                    <div className="text-slate-600 font-mono text-[11px]">
                      S/N: {al.serialNumber} | Cert #: {al.certNo} | Category: {al.category}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      Expiry Date: <strong className="text-slate-800">{al.expiryDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {al.certNo !== 'N/A' && (
                      <button
                        onClick={() => onViewCertificate(al.certNo)}
                        className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
                      >
                        View Cert
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onApplyRenewal(al.instrumentId);
                        onClose();
                      }}
                      className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Renew Verification</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
