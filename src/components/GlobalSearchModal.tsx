import React, { useState } from 'react';
import { X, Search, FileCheck2, Award } from 'lucide-react';
import type { Instrument, VerificationApplication, DigitalCertificate } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  applications: VerificationApplication[];
  certificates: DigitalCertificate[];
  onViewCertificate: (certNo: string) => void;
  onViewApplication: (app: VerificationApplication) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  instruments,
  applications,
  certificates,
  onViewCertificate,
  onViewApplication,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const matchingApps = query.trim()
    ? applications.filter(
        (a) =>
          a.applicationNo.toLowerCase().includes(query.toLowerCase()) ||
          a.instrumentTitle.toLowerCase().includes(query.toLowerCase()) ||
          a.serialNumber.toLowerCase().includes(query.toLowerCase()) ||
          a.ownerName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingCerts = query.trim()
    ? certificates.filter(
        (c) =>
          c.certNo.toLowerCase().includes(query.toLowerCase()) ||
          c.ownerName.toLowerCase().includes(query.toLowerCase()) ||
          c.serialNumber.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingInsts = query.trim()
    ? instruments.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.serialNumber.toLowerCase().includes(query.toLowerCase()) ||
          i.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type Application ID, Cert No, Serial Number, or Owner Name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-slate-900 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Type any query above to perform instant central system search across applications, certificates, and registered instruments.
            </div>
          ) : matchingApps.length === 0 && matchingCerts.length === 0 && matchingInsts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No system records found matching query "<strong>{query}</strong>".
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Applications */}
              {matchingApps.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Applications ({matchingApps.length})
                  </div>
                  <div className="space-y-2">
                    {matchingApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          onViewApplication(app);
                          onClose();
                        }}
                        className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileTextIcon className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-bold text-slate-900 font-mono">{app.applicationNo}</div>
                            <div className="text-[11px] text-slate-600">{app.instrumentTitle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700">{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {matchingCerts.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Digital Certificates ({matchingCerts.length})
                  </div>
                  <div className="space-y-2">
                    {matchingCerts.map((cert) => (
                      <div
                        key={cert.certNo}
                        onClick={() => {
                          onViewCertificate(cert.certNo);
                          onClose();
                        }}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-bold text-slate-900 font-mono">{cert.certNo}</div>
                            <div className="text-[11px] text-slate-600">{cert.ownerName} | {cert.instrumentCategory}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">VALID ✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <FileCheck2 className={className} />
);
