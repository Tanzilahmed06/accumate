import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';
import type { BusinessProfile, BusinessType, User } from '../types';
import { stateCodes, StorageService } from '../services/storageService';

interface OnboardingFlowProps {
  user: User;
  onComplete: (profile: BusinessProfile) => void;
  onCompleteLater: () => void;
}

type OnboardingStep = 'welcome' | 'business' | 'location' | 'contact' | 'success';

interface FormValues {
  businessName: string;
  legalBusinessName: string;
  businessType: BusinessType | '';
  gstin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  contactName: string;
  designation: string;
  mobile: string;
  email: string;
}

const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;
const indianStates = Object.keys(stateCodes).sort((first, second) => first.localeCompare(second));
const normalizeGstin = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '');

const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#1558A6] focus:ring-4 focus:ring-[#1558A6]/10';
const labelClass = 'block text-sm font-semibold text-slate-700';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete, onCompleteLater }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [form, setForm] = useState<FormValues>({
    businessName: '',
    legalBusinessName: '',
    businessType: '',
    gstin: '',
    pan: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    contactName: user.name === 'New Trader' ? '' : user.name,
    designation: user.designation || '',
    mobile: user.phone?.replace(/\D/g, '').slice(-10) || '',
    email: user.email || '',
  });
  const [error, setError] = useState('');
  const [savedProfile, setSavedProfile] = useState<BusinessProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const normalizedGstin = normalizeGstin(form.gstin);
  const isGstinFormatValid = !normalizedGstin || gstinPattern.test(normalizedGstin);

  const updateField = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const nextFromBusiness = () => {
    if (!form.businessName || !form.businessType) {
      setError('Enter your business name and business type.');
      return;
    }
    if (!isGstinFormatValid) {
      setError('Enter a valid 15-character GSTIN format.');
      return;
    }
    setStep('location');
  };

  const nextFromLocation = () => {
    if (!form.addressLine1 || !form.city || !form.district || !form.state || !/^\d{6}$/.test(form.pinCode)) {
      setError('Complete the address, city, district, state, and a valid 6-digit PIN code.');
      return;
    }
    setStep('contact');
  };

  const saveProfile = () => {
    if (!form.contactName || !form.designation || !/^\d{10}$/.test(form.mobile) || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Enter your contact name, designation, 10-digit mobile number, and email address.');
      return;
    }

    const profile = StorageService.saveBusinessProfile({
      userId: user.id,
      businessName: form.businessName.trim(),
      legalBusinessName: form.legalBusinessName.trim() || undefined,
      businessType: form.businessType as BusinessType,
      gstin: normalizedGstin,
      pan: form.pan.trim() || undefined,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      district: form.district.trim(),
      state: form.state,
      pinCode: form.pinCode,
      contactName: form.contactName.trim(),
      designation: form.designation.trim(),
      mobile: form.mobile,
      email: form.email.trim(),
    });
    setSavedProfile(profile);
    setStep('success');
  };

  const copyMerchantId = async () => {
    if (!savedProfile) return;
    await navigator.clipboard?.writeText(savedProfile.merchantId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const progressStep = step === 'business' ? 1 : step === 'location' ? 2 : step === 'contact' ? 3 : 0;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#17324D] sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[#17324D] px-6 py-5 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#a9d4ff]"><Building2 className="size-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a9d4ff]">AccuMate trader workspace</p>
              <h1 className="mt-0.5 text-xl font-bold">Set up your business</h1>
            </div>
          </div>
        </div>

        {step !== 'welcome' && step !== 'success' && (
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-6 py-3 sm:px-8">
            {['Business details', 'Business location', 'Contact details'].map((label, index) => {
              const number = index + 1;
              const complete = progressStep > number;
              const active = progressStep === number;
              return (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full font-bold ${complete ? 'bg-[#278A4B] text-white' : active ? 'bg-[#1558A6] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {complete ? <CheckCircle2 className="size-3.5" /> : number}
                  </span>
                  <span className={`hidden font-semibold sm:inline ${active ? 'text-[#17324D]' : 'text-slate-500'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-6 sm:p-8">
          {step === 'welcome' && (
            <div className="mx-auto max-w-xl py-4 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#EAF3FB] text-[#1558A6]"><ShieldCheck className="size-8" /></div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#17324D]">Welcome to AccuMate</h2>
              <p className="mt-3 text-base font-medium text-slate-700">Let&apos;s set up your business profile before you get started.</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">Add your business details and registered instruments to create your AccuMate merchant profile.</p>
              <div className="mx-auto mt-8 max-w-sm space-y-3">
                <button type="button" onClick={() => setStep('business')} className="w-full rounded-lg bg-[#1558A6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#104986] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1558A6]/30">Set Up My Business</button>
                <button type="button" onClick={onCompleteLater} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300">Complete Later</button>
              </div>
            </div>
          )}

          {step === 'business' && (
            <FormSection title="Business details" description="Enter information for your business. GSTIN is optional and, when provided, is checked for format only; this prototype does not perform Government verification.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business / Shop Name"><input value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={inputClass} required /></Field>
                <Field label="Legal Business Name" optional><input value={form.legalBusinessName} onChange={(event) => updateField('legalBusinessName', event.target.value)} className={inputClass} /></Field>
                <Field label="Business Type"><select value={form.businessType} onChange={(event) => updateField('businessType', event.target.value as BusinessType)} className={inputClass} required><option value="">Select business type</option>{(['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Other'] as BusinessType[]).map((type) => <option key={type} value={type}>{type}</option>)}</select></Field>
                <Field label="GSTIN" optional><input value={form.gstin} onChange={(event) => updateField('gstin', normalizeGstin(event.target.value).slice(0, 15))} className={inputClass} placeholder="15-character GSTIN" />{normalizedGstin && <p className={`mt-1.5 text-xs font-medium ${isGstinFormatValid ? 'text-[#278A4B]' : 'text-[#C93636]'}`}>{isGstinFormatValid ? 'GSTIN format valid' : 'Enter a valid 15-character GSTIN format.'}</p>}</Field>
                <Field label="PAN" optional><input value={form.pan} onChange={(event) => updateField('pan', event.target.value.toUpperCase().slice(0, 10))} className={inputClass} /></Field>
                <Field label="Mobile Number"><input inputMode="numeric" value={form.mobile} onChange={(event) => updateField('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} className={inputClass} placeholder="10-digit mobile number" required /></Field>
                <Field label="Email Address" className="sm:col-span-2"><input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className={inputClass} required /></Field>
              </div>
              <FormActions onBack={() => setStep('welcome')} onNext={nextFromBusiness} />
            </FormSection>
          )}

          {step === 'location' && (
            <FormSection title="Business location" description="Use the actual location where your business operates. No location is pre-filled.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Address Line 1" className="sm:col-span-2"><input value={form.addressLine1} onChange={(event) => updateField('addressLine1', event.target.value)} className={inputClass} required /></Field>
                <Field label="Address Line 2" optional className="sm:col-span-2"><input value={form.addressLine2} onChange={(event) => updateField('addressLine2', event.target.value)} className={inputClass} /></Field>
                <Field label="City"><input value={form.city} onChange={(event) => updateField('city', event.target.value)} className={inputClass} required /></Field>
                <Field label="District"><input value={form.district} onChange={(event) => updateField('district', event.target.value)} className={inputClass} required /></Field>
                <Field label="State / UT"><select value={form.state} onChange={(event) => updateField('state', event.target.value)} className={inputClass} required><option value="">Select state or UT</option>{indianStates.map((state) => <option key={state} value={state}>{state}</option>)}</select></Field>
                <Field label="PIN Code"><input inputMode="numeric" value={form.pinCode} onChange={(event) => updateField('pinCode', event.target.value.replace(/\D/g, '').slice(0, 6))} className={inputClass} placeholder="6-digit PIN code" required /></Field>
              </div>
              <FormActions onBack={() => setStep('business')} onNext={nextFromLocation} />
            </FormSection>
          )}

          {step === 'contact' && (
            <FormSection title="Primary contact" description="Review the contact who will manage this business profile. You can edit these details later.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary Contact Name"><input value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} className={inputClass} required /></Field>
                <Field label="Designation"><input value={form.designation} onChange={(event) => updateField('designation', event.target.value)} className={inputClass} required /></Field>
                <Field label="Mobile Number"><input inputMode="numeric" value={form.mobile} onChange={(event) => updateField('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} className={inputClass} required /></Field>
                <Field label="Email"><input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className={inputClass} required /></Field>
              </div>
              <FormActions onBack={() => setStep('location')} onNext={saveProfile} nextLabel="Generate Merchant ID" />
            </FormSection>
          )}

          {step === 'success' && savedProfile && (
            <div className="mx-auto max-w-xl py-4 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-[#278A4B]"><CheckCircle2 className="size-9" /></div>
              <h2 className="mt-6 text-2xl font-bold text-[#17324D]">Your AccuMate business profile is ready.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">This unique Merchant ID identifies your business within the AccuMate platform. It is not a Government-issued identification number.</p>
              <div className="mt-6 rounded-lg border border-[#a9d4ff] bg-[#EAF3FB] p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1558A6]">Your AccuMate Merchant ID</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><code className="text-xl font-bold tracking-wide text-[#17324D]">{savedProfile.merchantId}</code><button type="button" onClick={copyMerchantId} className="inline-flex items-center gap-1.5 rounded-md border border-[#1558A6] bg-white px-3 py-1.5 text-xs font-semibold text-[#1558A6] transition hover:bg-[#EAF3FB]"><Copy className="size-3.5" />{copied ? 'Copied' : 'Copy Merchant ID'}</button></div>
                <dl className="mt-4 grid gap-3 border-t border-[#a9d4ff] pt-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Business name</dt><dd className="mt-0.5 font-semibold">{savedProfile.businessName}</dd></div><div><dt className="text-xs text-slate-500">State</dt><dd className="mt-0.5 font-semibold">{savedProfile.state}</dd></div></dl>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => onComplete(savedProfile)} className="rounded-lg bg-[#1558A6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#104986]">Start Managing Your Instruments</button><button type="button" onClick={() => onComplete(savedProfile)} className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View Business Profile</button></div>
            </div>
          )}

          {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-[#C93636]">{error}</p>}
        </div>
      </section>
    </main>
  );
};

const Field: React.FC<{ label: string; optional?: boolean; className?: string; children: React.ReactNode }> = ({ label, optional, className, children }) => (
  <label className={className}>
    <span className={labelClass}>{label} {optional && <span className="font-normal text-slate-500">(optional)</span>}</span>
    {children}
  </label>
);

const FormSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div>
    <h2 className="text-2xl font-bold tracking-tight text-[#17324D]">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    <div className="mt-7">{children}</div>
  </div>
);

const FormActions: React.FC<{ onBack: () => void; onNext: () => void; nextLabel?: string }> = ({ onBack, onNext, nextLabel = 'Continue' }) => (
  <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
    <button type="button" onClick={onBack} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"><ArrowLeft className="size-4" />Back</button>
    <button type="button" onClick={onNext} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1558A6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#104986]">{nextLabel}<ArrowRight className="size-4" /></button>
  </div>
);
