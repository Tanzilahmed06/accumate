import React, { useRef, useState } from 'react';
import { X, Printer, QrCode, ShieldCheck, CheckCircle2, Award, Lock, Download, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import type { DigitalCertificate } from '../types';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: DigitalCertificate;
  onVerifyQR: (verificationToken: string) => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  onVerifyQR,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const verificationReference = certificate.verificationToken;
  const verificationUrl = certificate.qrCodeUrl;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = `AccuMate-Certificate-${certificate.certNo}-QR.png`;
    downloadLink.click();
  };

  const handleCopyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy the permanent verification link:', verificationUrl);
    }
  };

  const statusIsValid = certificate.status === 'VALID';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 relative">
        {/* Action Header bar (no-print) */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm font-heading">DIGITAL CERTIFICATE</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
              DEMO / PROTOTYPE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onVerifyQR(verificationReference)}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold rounded-lg border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify QR</span>
            </button>
            <button
              onClick={handleCopyVerificationLink}
              className="hidden px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              <Copy className="size-3.5" />{copied ? 'Link copied' : 'Copy verification link'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CARD BODY */}
        <div
          id="printable-certificate"
          className="p-8 bg-white border-8 border-[#17324D] relative"
        >
          {/* Certificate Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <ShieldCheck className="w-96 h-96 text-slate-900" />
          </div>

          {/* Top Government Heading */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6 relative z-10">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-lg border-2 border-amber-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <div className="text-xs font-extrabold tracking-widest text-slate-800 uppercase">
              ACCUMATE · PROTOTYPE DIGITAL PLATFORM
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight uppercase">
              DEMO CERTIFICATE RECORD
            </h1>
            <p className="text-xs text-slate-600 italic">
              This layout demonstrates certificate information fields; it is not an official certificate.
            </p>
          </div>

          {/* Certificate Details */}
          <div className="py-6 space-y-6 relative z-10">
            {/* Cert No & Status Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-100/80 rounded-2xl border border-slate-300">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Certificate Number</div>
                <div className="text-lg font-extrabold text-slate-900 font-mono tracking-wide">{certificate.certNo}</div>
                {certificate.merchantId && <div className="mt-1 text-[10px] font-semibold text-slate-600">Merchant ID: <span className="font-mono">{certificate.merchantId}</span></div>}
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold text-white shadow-xs ${statusIsValid ? 'bg-emerald-600' : certificate.status === 'EXPIRED' ? 'bg-amber-600' : 'bg-rose-600'}`}>
                  {statusIsValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>STATUS: {certificate.status}</span>
                </span>
              </div>
            </div>

            {/* Main Instrument & Owner Specs Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs border-y border-slate-200 py-6">
              {/* Left Column: Owner & Site */}
              <div className="space-y-3">
                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">Prototype applicant / trader</div>
                  <div className="font-extrabold text-slate-900 text-sm">{certificate.ownerName}</div>
                  <div className="text-slate-600">{certificate.ownerAddress}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">Prototype record source</div>
                  <div className="font-semibold text-slate-800">{certificate.verificationAuthority}</div>
                </div>
              </div>

              {/* Right Column: Instrument Specifications */}
              <div className="space-y-3 border-l border-slate-200 pl-6">
                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">Instrument Description</div>
                  <div className="font-extrabold text-slate-900 text-sm">{certificate.instrumentCategory}</div>
                  <div className="text-slate-700">
                    Manufacturer: <strong>{certificate.manufacturer}</strong> ({certificate.modelNumber})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="font-bold text-slate-500 uppercase text-[10px]">Serial Number</div>
                    <div className="font-mono font-bold text-slate-900">{certificate.serialNumber}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-500 uppercase text-[10px]">Capacity</div>
                    <div className="font-semibold text-slate-900">{certificate.capacity}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates & QR Code Section */}
            <div className="grid grid-cols-1 gap-5 border border-slate-300 bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <div>
                <div className="font-bold text-slate-500 uppercase text-[10px]">Verification Date</div>
                <div className="text-sm font-extrabold text-slate-900">{certificate.verificationDate}</div>
              </div>

              <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">Validity shown in demo</div>
                <div className="text-sm font-extrabold text-emerald-700">{certificate.validUntilDate}</div>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center border-t border-slate-200 pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <div className="border-2 border-slate-900 bg-white p-3">
                  <QRCodeCanvas
                    ref={qrCanvasRef}
                    value={verificationUrl}
                    size={512}
                    className="h-36 w-36"
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    marginSize={4}
                    title={`Verification QR code for certificate ${certificate.certNo}`}
                  />
                </div>
                <div className="mt-3 text-center text-[10px] font-semibold text-slate-700">Scan to verify this certificate</div>
                <div className="mt-1 text-center text-[9px] font-mono text-slate-500">Ref: {verificationReference}</div>
                <button onClick={handleDownloadQr} className="no-print mt-3 inline-flex items-center gap-1.5 border border-[#1558A6] px-2.5 py-1.5 text-[10px] font-bold text-[#1558A6] hover:bg-[#EAF3FB]">
                  <Download className="size-3" />Download QR
                </button>
              </div>
            </div>

            <div className="no-print border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
              <div className="font-bold uppercase tracking-[0.08em] text-slate-500">Verification URL</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <a href={verificationUrl} target="_blank" rel="noreferrer" className="break-all font-mono text-[#1558A6] hover:underline">{verificationUrl}</a>
                <button type="button" onClick={() => onVerifyQR(verificationReference)} className="inline-flex items-center gap-1 font-bold text-[#1558A6] hover:underline"><ExternalLink className="size-3" />Open public verification</button>
                <button type="button" onClick={handleCopyVerificationLink} className="inline-flex items-center gap-1 font-bold text-[#1558A6] hover:underline"><Copy className="size-3" />{copied ? 'Copied' : 'Copy link'}</button>
              </div>
            </div>

            {/* Signatures & Security Hash */}
            <div className="pt-4 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>DEMO RECORD REFERENCE:</span>
                </div>
                <div className="text-[9px] font-mono text-slate-600 max-w-xs break-all bg-slate-100 p-1.5 rounded border border-slate-200">
                  {certificate.securityHash}
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-serif italic text-slate-800 text-sm font-bold border-b border-slate-900 pb-1">
                  {certificate.issuingOfficerName}
                </div>
                <div className="font-bold text-slate-900 text-[11px]">{certificate.issuingOfficerDesignation}</div>
                <div className="text-[10px] text-slate-500">Prototype issuing role</div>
              </div>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
            DEMO / PROTOTYPE: This record is not an official Government-issued certificate and must not be relied on as one.
          </div>
        </div>
      </div>
    </div>
  );
};
