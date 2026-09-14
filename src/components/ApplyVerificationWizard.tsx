import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  CreditCard,
  Building,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import type { Instrument } from '../types';
import { StorageService } from '../services/storageService';

interface ApplyVerificationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  initialInstrumentId?: string;
  onSuccess: (appId: string) => void;
}

export const ApplyVerificationWizard: React.FC<ApplyVerificationWizardProps> = ({
  isOpen,
  onClose,
  instruments,
  initialInstrumentId,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedInstId, setSelectedInstId] = useState<string>(
    initialInstrumentId || (instruments.length > 0 ? instruments[0].id : '')
  );
  const [verificationType, setVerificationType] = useState<'VERIFICATION' | 'RE_VERIFICATION'>('VERIFICATION');
  const [preferredDate, setPreferredDate] = useState('2026-09-18');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('trader@upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedAppNo, setCompletedAppNo] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedInst = instruments.find((i) => i.id === selectedInstId);

  const calculateFee = (cat?: string) => {
    switch (cat) {
      case 'Weighbridge':
        return 3500;
      case 'Fuel Dispenser':
        return 2500;
      case 'Water Meter':
        return 2000;
      case 'Electricity Meter':
        return 1800;
      default:
        return 1250;
    }
  };

  const currentFee = calculateFee(selectedInst?.category);

  const handleNextStep = () => {
    if (step === 1 && !selectedInstId) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePaymentAndSubmit = () => {
    if (!selectedInstId) return;
    setIsProcessing(true);

    setTimeout(() => {
      const createdApp = StorageService.createApplication(
        selectedInstId,
        verificationType,
        currentFee,
        preferredDate
      );
      setIsProcessing(false);
      setCompletedAppNo(createdApp.applicationNo);
      setStep(5);
      onSuccess(createdApp.applicationNo);
    }, 1200);
  };

  const handleCopyAppId = () => {
    navigator.clipboard.writeText(completedAppNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header with Progress Steps */}
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-lg font-heading">Apply for Digital Verification</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <StepIndicator number={1} label="Instrument" active={step === 1} completed={step > 1} />
            <StepIndicator number={2} label="Inspection Date" active={step === 2} completed={step > 2} />
            <StepIndicator number={3} label="Documents" active={step === 3} completed={step > 3} />
            <StepIndicator number={4} label="Mock Payment" active={step === 4 || step === 5} completed={step === 5} />
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6">
          {/* STEP 1: SELECT INSTRUMENT */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading">Step 1: Select Registered Instrument</h4>
              <p className="text-xs text-slate-500">
                Choose the instrument from your registered portfolio that requires verification or stamping.
              </p>

              {instruments.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border text-xs text-slate-500">
                  No registered instruments found. Please register an instrument first.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {instruments.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => setSelectedInstId(inst.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedInstId === inst.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center">
                          {selectedInstId === inst.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{inst.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            S/N: {inst.serialNumber} | {inst.category} | ID: {inst.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">₹{calculateFee(inst.category)}</div>
                        <div className="text-[10px] text-slate-400">Demo transaction amount</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInst && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Selected <strong>{selectedInst.title}</strong> at {selectedInst.locationAddress}, {selectedInst.city}.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: INSPECTION DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading">Step 2: Verification Type & Preferred Schedule</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setVerificationType('VERIFICATION')}
                  className={`p-4 rounded-2xl border cursor-pointer text-xs transition-all ${
                    verificationType === 'VERIFICATION'
                      ? 'border-blue-600 bg-blue-50/60 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 mb-1">Initial Verification & Stamping</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    A proposed AccuMate workflow option for this prototype record.
                  </div>
                </div>

                <div
                  onClick={() => setVerificationType('RE_VERIFICATION')}
                  className={`p-4 rounded-2xl border cursor-pointer text-xs transition-all ${
                    verificationType === 'RE_VERIFICATION'
                      ? 'border-blue-600 bg-blue-50/60 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 mb-1">Re-verification</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    A proposed AccuMate workflow option for an existing prototype record.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred On-Site Inspection Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  The selected date is a demo preference only; it does not confirm an official inspection appointment.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT REVIEW */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading">Step 3: Document Verification</h4>
              <p className="text-xs text-slate-500">
                Confirm uploaded evidence documents attached to instrument <strong>{selectedInst?.serialNumber}</strong>.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Purchase Invoice / Bill of Sale</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    VERIFIED ✓
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Instrument High-Resolution Geo-Photo</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ATTACHED ✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MOCK FEE PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-heading">Step 4: Demo Transaction</h4>

              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Demo transaction amount</div>
                  <div className="text-2xl font-extrabold text-amber-400 font-heading">₹{currentFee}.00</div>
                  <div className="text-[10px] text-slate-400">Prototype amount only — not an official fee</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold">{selectedInst?.category}</div>
                  <div className="text-slate-400 font-mono">{selectedInst?.serialNumber}</div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Select Mock Payment Method</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>BHIM UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === 'NETBANKING' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Enter UPI VPA / ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: APPLICATION SUCCESS CONFIRMATION */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-heading">Application Submitted Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  A prototype application record has been created and assigned to Demo Officer.
                </p>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Application Reference No</div>
                  <div className="text-base font-extrabold text-blue-700 font-mono">{completedAppNo}</div>
                </div>
                <button
                  onClick={handleCopyAppId}
                  className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Close & View Applications
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons for steps 1 to 4 */}
          {step < 5 && (
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!selectedInstId}
                  className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePaymentAndSubmit}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete demo transaction &amp; submit</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ number: number; label: string; active: boolean; completed: boolean }> = ({
  number,
  label,
  active,
  completed,
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
        completed
          ? 'bg-emerald-500 text-slate-950 font-extrabold'
          : active
          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20'
          : 'bg-slate-800 text-slate-400'
      }`}
    >
      {completed ? '✓' : number}
    </div>
    <span className={`text-[10px] font-medium ${active ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);
