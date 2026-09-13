import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, QrCode, Search, Upload, XCircle } from 'lucide-react';
import type { DigitalCertificate } from '../types';
import { StorageService } from '../services/storageService';
import { BrandLogo } from './BrandLogo';

interface PublicVerifyPageProps {
  initialCertNo?: string;
  onBackToApp: () => void;
}

interface QrDetector {
  detect(image: ImageBitmap): Promise<Array<{ rawValue: string }>>;
}

interface QrDetectorConstructor {
  new (options: { formats: string[] }): QrDetector;
}

type ScannerWindow = Window & typeof globalThis & { BarcodeDetector?: QrDetectorConstructor };

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ initialCertNo, onBackToApp }) => {
  const [query, setQuery] = useState(initialCertNo || '');
  const [certificate, setCertificate] = useState<DigitalCertificate | undefined>(() => (
    initialCertNo ? StorageService.getCertificateByNumber(initialCertNo) : undefined
  ));
  const [searched, setSearched] = useState(Boolean(initialCertNo));
  const [scanMessage, setScanMessage] = useState('');
  const imageInput = useRef<HTMLInputElement>(null);

  const verifyReference = (reference: string) => {
    setCertificate(StorageService.getCertificateByNumber(reference));
    setSearched(true);
  };

  useEffect(() => {
    if (!initialCertNo) return;
    setQuery(initialCertNo);
    verifyReference(initialCertNo);
  }, [initialCertNo]);

  const verify = (event: React.FormEvent) => {
    event.preventDefault();
    setScanMessage('');
    verifyReference(query);
  };

  const scanQrImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    const Detector = (window as ScannerWindow).BarcodeDetector;
    if (!Detector || !('createImageBitmap' in window)) {
      setScanMessage('QR image scanning is not supported by this browser. Open the QR link with your camera or enter the certificate number.');
      return;
    }

    try {
      const image = await createImageBitmap(imageFile);
      const results = await new Detector({ formats: ['qr_code'] }).detect(image);
      image.close();
      const scannedValue = results[0]?.rawValue;
      if (!scannedValue) {
        setScanMessage('No QR code was found in that image. Try another clear QR image.');
        return;
      }
      setQuery(scannedValue);
      setScanMessage('QR code scanned. Checking the AccuMate record…');
      verifyReference(scannedValue);
    } catch {
      setScanMessage('Unable to read that QR image. You can still enter the certificate number manually.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-[#17324D]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <BrandLogo />
            <div>
              <h1 className="text-lg font-bold text-[#17324D]">AccuMate Certificate Verification</h1>
              <p className="text-xs text-slate-500">Prototype verification service</p>
            </div>
          </div>
          <button onClick={onBackToApp} className="inline-flex items-center gap-1.5 border border-[#1558A6] px-3 py-2 text-xs font-semibold text-[#1558A6] transition hover:bg-[#EAF3FB]">
            <ArrowLeft className="size-3.5" />Back to AccuMate
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8 sm:py-10">
        <div className="border-l-4 border-[#D89000] bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
          <strong>PROTOTYPE VERIFICATION RECORD.</strong> This checks an AccuMate prototype record and is not connected to a Government certificate database.
        </div>

        <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1558A6]"><QrCode className="size-4" />Certificate verification</div>
            <h2 className="mt-2 text-2xl font-bold text-[#17324D]">Verify an AccuMate Certificate</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Scan a certificate QR code or enter its number. The QR contains only a verification reference and is checked against the AccuMate certificate record.</p>
          </div>
          <form onSubmit={verify} className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="certificate-query">Certificate number or verification URL</label>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <input id="certificate-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Certificate number or QR verification URL" className="w-full border border-slate-300 py-2.5 pl-9 pr-3 font-mono text-sm text-[#17324D] outline-none focus:border-[#1558A6] focus:ring-2 focus:ring-[#1558A6]/20" />
            </div>
            <button className="bg-[#1558A6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#104986]">Verify Certificate</button>
          </form>
          <div className="mt-3 flex justify-center">
            <input ref={imageInput} type="file" accept="image/*" capture="environment" className="sr-only" onChange={scanQrImage} />
            <button type="button" onClick={() => imageInput.current?.click()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1558A6] transition hover:text-[#104986]">
              <Upload className="size-3.5" />Scan QR image
            </button>
          </div>
          {scanMessage && <p className="mt-3 text-center text-xs text-slate-600">{scanMessage}</p>}
        </section>

        {searched && (certificate ? <CertificateResult certificate={certificate} /> : <CertificateNotFound />)}
      </main>
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">AccuMate · Prototype Digital Legal Metrology Verification &amp; Certification Platform</footer>
    </div>
  );
};

const CertificateNotFound: React.FC = () => (
  <section className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
    <XCircle className="mx-auto size-8 text-[#C93636]" />
    <h2 className="mt-3 text-lg font-bold text-[#17324D]">CERTIFICATE NOT FOUND</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">No matching AccuMate certificate record was found. Check the certificate number or scan the QR code again.</p>
  </section>
);

const CertificateResult: React.FC<{ certificate: DigitalCertificate }> = ({ certificate }) => {
  const dateExpired = new Date(`${certificate.validUntilDate}T23:59:59`).getTime() < Date.now();
  const status = certificate.status === 'VALID' && !dateExpired ? 'VERIFIED' : certificate.status === 'REVOKED' ? 'FAILED' : 'EXPIRED';
  const isValid = status === 'VERIFIED';
  const isExpired = status === 'EXPIRED';
  const statusClass = isValid ? 'border-green-200 bg-green-50 text-[#1f6d3b]' : isExpired ? 'border-amber-200 bg-amber-50 text-[#8a5a00]' : 'border-red-200 bg-red-50 text-[#9e2d2d]';
  const statusMessage = isValid ? 'INSTRUMENT VERIFIED' : isExpired ? 'VERIFICATION EXPIRED' : 'VERIFICATION FAILED';

  return (
    <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[#EAF3FB] px-5 py-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">AccuMate certificate verification</div>
        <h2 className="mt-1 font-mono text-base font-bold text-[#17324D]">{certificate.certNo}</h2>
      </div>
      <div className="p-5 sm:p-7">
        <div className={`flex gap-3 border p-4 ${statusClass}`}>
          {isValid ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <AlertTriangle className="mt-0.5 size-5 shrink-0" />}
          <div>
            <div className="text-sm font-bold">{statusMessage}</div>
            <p className="mt-1 text-xs leading-5">Verified against the AccuMate certificate record. This is not a Government verification result.</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Detail label="Certificate Number" value={certificate.certNo} mono />
          <Detail label="Instrument Name" value={certificate.instrumentName || certificate.instrumentCategory} />
          <Detail label="Instrument Category" value={certificate.instrumentCategory} />
          <Detail label="Manufacturer" value={certificate.manufacturer} />
          <Detail label="Model" value={certificate.modelNumber} />
          <Detail label="Serial Number" value={certificate.serialNumber} mono />
          <Detail label="Capacity" value={certificate.capacity} />
          <Detail label="Business Name" value={certificate.businessName || certificate.ownerName} />
          <Detail label="Verification Status" value={status} />
          <Detail label="Certificate Issue Date" value={certificate.verificationDate} />
          <Detail label="Valid Until" value={certificate.validUntilDate} />
          <Detail label="Verification Date" value={certificate.verificationDate} />
        </dl>
        <div className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">Only public verification information is shown. Business contact details, merchant identifiers, payment information, email, and private documents are not displayed.</div>
      </div>
    </section>
  );
};

const Detail: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</dt>
    <dd className={`mt-1 text-sm font-medium text-[#17324D] ${mono ? 'font-mono' : ''}`}>{value}</dd>
  </div>
);
