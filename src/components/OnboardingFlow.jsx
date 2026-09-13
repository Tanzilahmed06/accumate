import { useEffect, useRef, useState } from 'react';
import { Building2, CheckCircle2, Database, ShieldCheck } from 'lucide-react';

export const stateCodes = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  Assam: 'AS',
  Bihar: 'BR',
  Chhattisgarh: 'CG',
  Goa: 'GA',
  Gujarat: 'GJ',
  Haryana: 'HR',
  'Himachal Pradesh': 'HP',
  Jharkhand: 'JH',
  Karnataka: 'KA',
  Kerala: 'KL',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Manipur: 'MN',
  Meghalaya: 'ML',
  Mizoram: 'MZ',
  Nagaland: 'NL',
  Odisha: 'OD',
  Punjab: 'PB',
  Rajasthan: 'RJ',
  Sikkim: 'SK',
  'Tamil Nadu': 'TN',
  Telangana: 'TS',
  Tripura: 'TR',
  'Uttar Pradesh': 'UP',
  Uttarakhand: 'UK',
  'West Bengal': 'WB',
  'Andaman and Nicobar Islands': 'AN',
  Chandigarh: 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD',
  Delhi: 'DL',
  'Jammu and Kashmir': 'JK',
  Ladakh: 'LA',
  Lakshadweep: 'LD',
  Puducherry: 'PY',
};

export function generateMerchantID(stateName) {
  const stateCode = stateCodes[stateName] || 'IN';
  const currentYear = new Date().getFullYear();
  const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);

  return `ACCT-${stateCode}-${currentYear}-${randomFourDigitNumber}`;
}

const verifiedBusiness = {
  name: 'Sri Balaji Traders',
  city: 'Bengaluru',
  state: 'Karnataka',
};

/**
 * A four-step business registration experience for new AccuMate merchants.
 */
export default function OnboardingFlow({ onComplete = () => {} }) {
  const [view, setView] = useState('login');
  const [gstin, setGstin] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const fetchTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (fetchTimer.current) window.clearTimeout(fetchTimer.current);
    };
  }, []);

  const handleFetchDetails = (event) => {
    event.preventDefault();
    if (!gstin.trim() || isFetching) return;

    setIsFetching(true);
    setIsVerified(false);
    fetchTimer.current = window.setTimeout(() => {
      setIsFetching(false);
      setIsVerified(true);
      fetchTimer.current = null;
    }, 1500);
  };

  const handleConfirmProfile = (event) => {
    event.preventDefault();
    if (!contactNumber.trim()) return;

    setMerchantId(generateMerchantID(verifiedBusiness.state));
    setView('success');
  };

  const primaryButtonClass =
    'w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-wait disabled:opacity-70';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900 sm:p-6">
      <section className="max-w-md w-full rounded-xl bg-white p-8 shadow-lg" aria-live="polite">
        {view === 'login' && (
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Building2 className="size-7" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold text-indigo-700">Legal Metrology made simple</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Welcome to AccuMate</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Register your establishment and manage your legal-metrology obligations in one place.
            </p>

            <div className="mt-8 space-y-3">
              <button type="button" onClick={() => setView('empty')} className={primaryButtonClass}>
                Sign Up (New User)
              </button>
              <button
                type="button"
                onClick={() => onComplete('demo')}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/50"
              >
                Login as Demo Merchant
              </button>
            </div>
          </div>
        )}

        {view === 'empty' && (
          <div className="py-4 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-indigo-50 text-indigo-700">
              <Building2 className="size-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">Ready when you are</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Let&apos;s get your business compliant. You currently have no registered establishments.
            </p>
            <button type="button" onClick={() => setView('setup')} className={`mt-8 ${primaryButtonClass}`}>
              Set Up Business Profile
            </button>
          </div>
        )}

        {view === 'setup' && (
          <div>
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                <Database className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-700">Business profile setup</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Verify your business</h1>
              </div>
            </div>

            <form onSubmit={handleFetchDetails} className="mt-7">
              <label htmlFor="gstin" className="mb-2 block text-sm font-medium text-slate-700">
                GSTIN or UDYAM Number
              </label>
              <input
                id="gstin"
                type="text"
                value={gstin}
                onChange={(event) => setGstin(event.target.value.toUpperCase())}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter your registration number"
                autoComplete="off"
                required
              />
              <button type="submit" disabled={isFetching} className={`mt-3 ${primaryButtonClass}`}>
                {isFetching ? 'Fetching from Gov Database...' : 'Fetch Details'}
              </button>
            </form>

            {isVerified && (
              <>
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                    Verified via GSTIN
                  </div>
                  <div className="mt-3 border-t border-emerald-200 pt-3 text-sm text-emerald-950">
                    <p className="font-semibold">{verifiedBusiness.name}</p>
                    <p className="mt-1 text-emerald-800">{verifiedBusiness.city}, {verifiedBusiness.state}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmProfile} className="mt-6 border-t border-slate-200 pt-6">
                  <label htmlFor="primary-contact" className="mb-2 block text-sm font-medium text-slate-700">
                    Primary Contact Number
                  </label>
                  <input
                    id="primary-contact"
                    type="tel"
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit contact number"
                    required
                  />
                  <button type="submit" className={`mt-4 ${primaryButtonClass}`}>
                    Confirm &amp; Generate Credentials
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {view === 'success' && (
          <div className="py-4 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-9" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">Store Setup Complete.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your business profile has been verified and your merchant credentials are ready.
            </p>
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Merchant ID</p>
              <code className="mt-2 block break-all font-mono text-base font-bold text-indigo-800">{merchantId}</code>
            </div>
            <button type="button" onClick={() => onComplete('dashboard')} className={`mt-8 ${primaryButtonClass}`}>
              Add New Weighing Instrument →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
