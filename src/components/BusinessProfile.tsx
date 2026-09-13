import { useEffect, useState } from 'react';
import { Building2, Edit3, Save } from 'lucide-react';
import type { BusinessProfile as BusinessProfileData, BusinessType } from '../types';
import { stateCodes, StorageService } from '../services/storageService';

interface BusinessProfileProps {
  profile?: BusinessProfileData;
  onStartSetup: () => void;
}

const businessTypes: BusinessType[] = ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Other'];
const indianStates = Object.keys(stateCodes).sort((first, second) => first.localeCompare(second));
const inputClass = 'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-[#17324D] outline-none transition focus:border-[#1558A6] focus:ring-4 focus:ring-[#1558A6]/10';

export const BusinessProfile: React.FC<BusinessProfileProps> = ({ profile, onStartSetup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<BusinessProfileData | undefined>(profile);

  useEffect(() => {
    setDraft(profile);
    setIsEditing(false);
  }, [profile]);

  if (!profile || !draft) {
    return (
      <section className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <Building2 className="mx-auto size-9 text-[#1558A6]" />
        <h2 className="mt-4 text-xl font-bold text-[#17324D]">Set up your business profile</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Add your business information to receive your AccuMate Merchant ID and keep your records personalized.</p>
        <button type="button" onClick={onStartSetup} className="mt-6 rounded-lg bg-[#1558A6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#104986]">Set Up My Business</button>
      </section>
    );
  }

  const update = <Key extends keyof BusinessProfileData>(key: Key, value: BusinessProfileData[Key]) => setDraft((current) => current ? { ...current, [key]: value } : current);

  const save = () => {
    StorageService.saveBusinessProfile({
      userId: draft.userId,
      businessName: draft.businessName,
      legalBusinessName: draft.legalBusinessName,
      businessType: draft.businessType,
      gstin: draft.gstin,
      pan: draft.pan,
      addressLine1: draft.addressLine1,
      addressLine2: draft.addressLine2,
      city: draft.city,
      district: draft.district,
      state: draft.state,
      pinCode: draft.pinCode,
      contactName: draft.contactName,
      designation: draft.designation,
      mobile: draft.mobile,
      email: draft.email,
    });
    setIsEditing(false);
  };

  return (
    <section className="border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#EAF3FB] text-[#1558A6]"><Building2 className="size-5" /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">Trader workspace</p><h2 className="mt-0.5 text-xl font-bold text-[#17324D]">My Business</h2></div></div>
        {isEditing ? <button type="button" onClick={save} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1558A6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#104986]"><Save className="size-4" />Save Changes</button> : <button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Edit3 className="size-4" />Edit Profile</button>}
      </header>
      <div className="grid gap-7 p-5 sm:p-6 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <h3 className="text-sm font-bold text-[#17324D]">Business details</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ProfileField label="Business Name"><input disabled={!isEditing} value={draft.businessName} onChange={(event) => update('businessName', event.target.value)} className={inputClass} /></ProfileField>
            <ProfileField label="Legal Business Name" optional><input disabled={!isEditing} value={draft.legalBusinessName || ''} onChange={(event) => update('legalBusinessName', event.target.value || undefined)} className={inputClass} /></ProfileField>
            <ProfileField label="Business Type"><select disabled={!isEditing} value={draft.businessType} onChange={(event) => update('businessType', event.target.value as BusinessType)} className={inputClass}>{businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></ProfileField>
            <ProfileField label="GSTIN"><input disabled={!isEditing} value={draft.gstin} onChange={(event) => update('gstin', event.target.value.toUpperCase())} className={`${inputClass} font-mono`} /></ProfileField>
          </div>

          <h3 className="mt-7 text-sm font-bold text-[#17324D]">Business location</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ProfileField label="Address Line 1" className="sm:col-span-2"><input disabled={!isEditing} value={draft.addressLine1} onChange={(event) => update('addressLine1', event.target.value)} className={inputClass} /></ProfileField>
            <ProfileField label="Address Line 2" optional className="sm:col-span-2"><input disabled={!isEditing} value={draft.addressLine2 || ''} onChange={(event) => update('addressLine2', event.target.value || undefined)} className={inputClass} /></ProfileField>
            <ProfileField label="City"><input disabled={!isEditing} value={draft.city} onChange={(event) => update('city', event.target.value)} className={inputClass} /></ProfileField>
            <ProfileField label="District"><input disabled={!isEditing} value={draft.district} onChange={(event) => update('district', event.target.value)} className={inputClass} /></ProfileField>
            <ProfileField label="State / UT"><select disabled={!isEditing} value={draft.state} onChange={(event) => update('state', event.target.value)} className={inputClass}>{indianStates.map((state) => <option key={state} value={state}>{state}</option>)}</select></ProfileField>
            <ProfileField label="PIN Code"><input disabled={!isEditing} value={draft.pinCode} onChange={(event) => update('pinCode', event.target.value.replace(/\D/g, '').slice(0, 6))} className={inputClass} /></ProfileField>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-[#a9d4ff] bg-[#EAF3FB] p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">AccuMate Merchant ID</p><code className="mt-2 block text-lg font-bold text-[#17324D]">{draft.merchantId}</code><p className="mt-2 text-xs leading-5 text-slate-600">This permanent platform identifier is read-only and does not change if the business address changes.</p></div>
          <div><h3 className="text-sm font-bold text-[#17324D]">Primary contact</h3><div className="mt-4 space-y-4"><ProfileField label="Contact Name"><input disabled={!isEditing} value={draft.contactName} onChange={(event) => update('contactName', event.target.value)} className={inputClass} /></ProfileField><ProfileField label="Designation"><input disabled={!isEditing} value={draft.designation} onChange={(event) => update('designation', event.target.value)} className={inputClass} /></ProfileField><ProfileField label="Mobile"><input disabled={!isEditing} value={draft.mobile} onChange={(event) => update('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} className={inputClass} /></ProfileField><ProfileField label="Email"><input disabled={!isEditing} type="email" value={draft.email} onChange={(event) => update('email', event.target.value)} className={inputClass} /></ProfileField></div></div>
        </div>
      </div>
    </section>
  );
};

const ProfileField: React.FC<{ label: string; optional?: boolean; className?: string; children: React.ReactNode }> = ({ label, optional, className, children }) => <label className={className}><span className="text-sm font-semibold text-slate-700">{label} {optional && <span className="font-normal text-slate-500">(optional)</span>}</span>{children}</label>;
