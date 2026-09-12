import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  Search,
  XCircle,
} from 'lucide-react';
import type { DigitalCertificate } from '../types';
import { StorageService } from '../services/storageService';
import { BrandLogo } from './BrandLogo';

interface PublicVerifyPageProps {
  initialCertNo?: string;
  onBackToApp: () => void;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ initialCertNo, onBackToApp }) => {
  const [query, setQuery] = useState(initialCertNo || 'DEMO-CERT-2026-001');
  const [certificate, setCertificate] = useState<DigitalCertificate | undefined>(() => StorageService.getCertificateByNumber(query));
  const [searched, setSearched] = useState(true);

  useEffect(() => {
    if (initialCertNo) {
      setQuery(initialCertNo);
      setCertificate(StorageService.getCertificateByNumber(initialCertNo));
    }
  }, [initialCertNo]);

  const verify = (event: React.FormEvent) => {
    event.preventDefault();
    setCertificate(StorageService.getCertificateByNumber(query));
    setSearched(true);
  };

  const useDemo = (number: string) => {
    setQuery(number);
    setCertificate(StorageService.getCertificateByNumber(number));
    setSearched(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-[#17324D]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3"><BrandLogo /><div><h1 className="text-lg font-bold text-[#17324D]">AccuMate certificate verification</h1><p className="text-xs text-slate-500">Prototype verification service · local demo records</p></div></div>
          <button onClick={onBackToApp} className="inline-flex items-center gap-1.5 border border-[#1558A6] px-3 py-2 text-xs font-semibold text-[#1558A6] hover:bg-[#EAF3FB]"><ArrowLeft className="size-3.5" /> Back to AccuMate</button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8 sm:py-10">
        <div className="border-l-4 border-[#D89000] bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950"><strong>PROTOTYPE VERIFICATION RECORD.</strong> This search checks AccuMate demo data only. It is not connected to an official Government certificate database.</div>
        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="text-center"><div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1558A6]"><QrCode className="size-4" /> Public verification</div><h2 className="mt-2 text-2xl font-bold text-[#17324D]">Verify a certificate record</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Enter a prototype certificate number, application reference, instrument ID, serial number, or a QR value.</p></div>
          <form onSubmit={verify} className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="certificate-query">Certificate number or QR value</label><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input id="certificate-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="DEMO-CERT-2026-001" className="w-full border border-slate-300 py-2.5 pl-9 pr-3 font-mono text-sm text-[#17324D] outline-none focus:border-[#1558A6] focus:ring-2 focus:ring-[#1558A6]/20" /></div><button className="bg-[#1558A6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#104986]">Verify certificate</button></form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs"><span className="text-slate-500">Try prototype records:</span><button type="button" onClick={() => useDemo('DEMO-CERT-2026-001')} className="border border-[#1558A6] bg-[#EAF3FB] px-2 py-1 font-mono font-semibold text-[#1558A6]">DEMO-CERT-2026-001</button><button type="button" onClick={() => useDemo('DEMO-CERT-2025-002')} className="border border-slate-300 bg-white px-2 py-1 font-mono font-semibold text-slate-700">DEMO-CERT-2025-002</button></div>
        </section>

        {searched && (certificate ? <CertificateResult certificate={certificate} /> : <section className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><XCircle className="mx-auto size-8 text-[#C93636]" /><h2 className="mt-3 text-lg font-bold text-[#17324D]">Certificate record not found</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">No prototype certificate record matches “{query}”. Check the demo reference and try again.</p></section>)}
      </main>
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">AccuMate · Prototype Digital Legal Metrology Verification & Certification Platform</footer>
    </div>
  );
};

const CertificateResult: React.FC<{ certificate: DigitalCertificate }> = ({ certificate }) => {
  const valid = certificate.status === 'VALID';
  const expired = certificate.status === 'EXPIRED';
  return <section className="overflow-hidden border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 bg-[#EAF3FB] px-5 py-4"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">DEMO / PROTOTYPE</div><h2 className="mt-1 font-mono text-base font-bold text-[#17324D]">{certificate.certNo}</h2></div><div className="p-5 sm:p-7"><div className={`flex gap-3 border p-4 ${valid ? 'border-green-200 bg-green-50 text-[#1f6d3b]' : expired ? 'border-red-200 bg-red-50 text-[#9e2d2d]' : 'border-red-200 bg-red-50 text-[#9e2d2d]'}`}>{valid ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <AlertTriangle className="mt-0.5 size-5 shrink-0" />}<div><div className="text-sm font-bold">{valid ? 'Certificate record found' : expired ? 'Certificate record found — expired' : 'Certificate record found — invalid'}</div><p className="mt-1 text-xs leading-5">This status reflects a prototype record only; it does not establish an official verification outcome.</p></div></div><dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2"><Detail label="Certificate number" value={certificate.certNo} mono /><Detail label="Verification status" value={certificate.status} /><Detail label="Instrument" value={`${certificate.instrumentCategory} · ${certificate.manufacturer} ${certificate.modelNumber}`} /><Detail label="Serial number" value={certificate.serialNumber} mono /><Detail label="Applicant / trader" value={certificate.ownerName} /><Detail label="Verification date" value={certificate.verificationDate} /><Detail label="Validity shown in demo" value={certificate.validUntilDate} /><Detail label="Prototype issuing role" value={certificate.issuingOfficerDesignation} /></dl><div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">Fields displayed above are prototype fields. AccuMate does not present this document as an official Government-issued certificate.</div></div></section>;
};

const Detail: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => <div><dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</dt><dd className={`mt-1 text-sm font-medium text-[#17324D] ${mono ? 'font-mono' : ''}`}>{value}</dd></div>;
