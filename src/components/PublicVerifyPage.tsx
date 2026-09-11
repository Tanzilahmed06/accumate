import React, { useState, useEffect } from 'react';
import {
  QrCode,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import type { DigitalCertificate } from '../types';
import { StorageService } from '../services/storageService';

interface PublicVerifyPageProps {
  initialCertNo?: string;
  onBackToApp: () => void;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ initialCertNo, onBackToApp }) => {
  const [query, setQuery] = useState(initialCertNo || 'LM-CERT-2025-9011');
  const [certificate, setCertificate] = useState<DigitalCertificate | undefined>(() =>
    StorageService.getCertificateByNumber(query)
  );
  const [isSearched, setIsSearched] = useState(true);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = StorageService.getCertificateByNumber(query);
    setCertificate(result);
    setIsSearched(true);
  };

  useEffect(() => {
    if (initialCertNo) {
      setQuery(initialCertNo);
      setCertificate(StorageService.getCertificateByNumber(initialCertNo));
    }
  }, [initialCertNo]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Public Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-heading text-white">e-Metro Verification Portal</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PUBLIC ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400">Government of India • Ministry of Consumer Affairs</p>
            </div>
          </div>

          <button
            onClick={onBackToApp}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Portal Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full space-y-8">
        {/* Search Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-1">
              <QrCode className="w-4 h-4" />
              PUBLIC CERTIFICATE & STAMPING AUDIT
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Verify Legal Metrology Certificate</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Enter the Certificate Number, Application Reference No, or Instrument Serial Number to verify authenticity.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. LM-CERT-2025-9011 or APP-2026-8801"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-all cursor-pointer shrink-0"
            >
              Verify Certificate
            </button>
          </form>

          {/* Quick Demo Certificate Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
            <span>Try sample certificates:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('LM-CERT-2025-9011');
                setCertificate(StorageService.getCertificateByNumber('LM-CERT-2025-9011'));
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-mono border border-slate-700 cursor-pointer"
            >
              LM-CERT-2025-9011 (VALID)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('LM-CERT-2024-1102');
                setCertificate(StorageService.getCertificateByNumber('LM-CERT-2024-1102'));
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg font-mono border border-slate-700 cursor-pointer"
            >
              LM-CERT-2024-1102 (EXPIRED)
            </button>
          </div>
        </div>

        {/* VERIFICATION RESULT CARD */}
        {isSearched && (
          <div>
            {certificate ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Status Indicator Banner */}
                {certificate.status === 'VALID' ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold font-heading text-white">CERTIFICATE STATUS: VALID ✓</div>
                      <div className="text-xs text-emerald-300">
                        Authenticated digital certificate issued by Legal Metrology Department. Valid until{' '}
                        <strong>{certificate.validUntilDate}</strong>.
                      </div>
                    </div>
                  </div>
                ) : certificate.status === 'EXPIRED' ? (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-4 text-rose-400">
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-7 h-7 text-rose-400" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold font-heading text-white">CERTIFICATE STATUS: EXPIRED</div>
                      <div className="text-xs text-rose-300">
                        This certificate expired on <strong>{certificate.validUntilDate}</strong>. Commercial use without re-verification is prohibited under Section 24 of Legal Metrology Act.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-900/30 border border-rose-600 rounded-2xl flex items-center gap-4 text-rose-300">
                    <XCircle className="w-8 h-8 text-rose-500 shrink-0" />
                    <div>
                      <div className="text-lg font-extrabold text-white">INVALID OR REVOKED CERTIFICATE</div>
                      <div className="text-xs">Do not rely on this certificate. Report suspect instruments to Legal Metrology Hotline.</div>
                    </div>
                  </div>
                )}

                {/* Instrument Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-y border-slate-800 py-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Certificate Number</div>
                      <div className="text-base font-extrabold text-amber-400 font-mono">{certificate.certNo}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Instrument Owner</div>
                      <div className="text-sm font-bold text-white">{certificate.ownerName}</div>
                      <div className="text-slate-400">{certificate.ownerAddress}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Issuing Authority</div>
                      <div className="text-slate-300">{certificate.verificationAuthority}</div>
                    </div>
                  </div>

                  <div className="space-y-3 md:border-l border-slate-800 md:pl-6">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Instrument Details</div>
                      <div className="text-sm font-bold text-white">{certificate.instrumentCategory}</div>
                      <div className="text-slate-400">
                        {certificate.manufacturer} ({certificate.modelNumber})
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Serial Number</div>
                        <div className="font-mono text-white font-bold">{certificate.serialNumber}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Capacity</div>
                        <div className="text-slate-300">{certificate.capacity}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Verification Officer</div>
                      <div className="text-slate-300">{certificate.issuingOfficerName} ({certificate.issuingOfficerDesignation})</div>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Security Hash */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>CRYPTOGRAPHIC DIGITAL SIGNATURE HASH</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all">{certificate.securityHash}</div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Certificate Not Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No Legal Metrology certificate matches query "<strong>{query}</strong>". Please verify the number or scan a valid e-Metro QR code.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Department of Legal Metrology • Government of India Digital Portal
      </footer>
    </div>
  );
};
