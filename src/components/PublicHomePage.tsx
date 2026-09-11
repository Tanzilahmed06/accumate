import React, { useState } from 'react';
import {
  ArrowRight,
  BellRing,
  Building2,
  Calendar,
  ChevronRight,
  FileCheck2,
  FileText,
  HelpCircle,
  LogIn,
  QrCode,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { OFFICIAL_NOTICES } from '../services/mockData';

interface PublicHomePageProps {
  onApplyClick: () => void;
  onTrackClick: () => void;
  onVerifyClick: () => void;
  onGATCClick: () => void;
  onHelpClick: () => void;
  onLoginClick?: () => void;
}

const publicServices = [
  { icon: FileCheck2, title: 'Instrument Verification', description: 'Apply for verification and re-verification of measuring instruments.', action: 'Apply for verification', target: 'apply' },
  { icon: Search, title: 'Application Tracking', description: 'Track the current status of an application and inspection.', action: 'Track application', target: 'track' },
  { icon: Calendar, title: 'Inspection Scheduling', description: 'View scheduled inspections and upcoming appointments.', action: 'View schedule', target: 'apply' },
  { icon: FileText, title: 'Digital Certificates', description: 'Access issued verification certificates and their details.', action: 'View certificates', target: 'verify' },
  { icon: Building2, title: 'GATC Testing', description: 'Find Government Approved Test Centres for applicable testing.', action: 'Find a test centre', target: 'gatc' },
  { icon: QrCode, title: 'Public Verification', description: 'Verify certificate authenticity without signing in.', action: 'Verify certificate', target: 'verify' },
] as const;

const workflow = [
  'Submit Application',
  'Document Verification',
  'Fee Payment',
  'Officer Assignment',
  'Instrument Inspection',
  'Digital Certificate',
];

const faqs = [
  ['What is Legal Metrology verification?', 'It is the statutory process of confirming that a weighing or measuring instrument meets applicable accuracy and compliance requirements before commercial use.'],
  ['How do I register an instrument?', 'Sign in to the trader portal, choose Register New Instrument, and provide the instrument, ownership, and installation details.'],
  ['How can I track my application?', 'Use the application reference number issued after submission in the Track Application section.'],
  ['How do I verify a certificate?', 'Enter a certificate number, application number, or instrument ID, or scan the QR code printed on the certificate.'],
  ['What is a GATC?', 'A Government Approved Test Centre supports specified technical testing and reporting for Legal Metrology services.'],
  ['How long is a verification certificate valid?', 'Validity depends on the instrument category and applicable rules. Check the expiry date printed on the issued certificate.'],
];

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onApplyClick,
  onTrackClick,
  onVerifyClick,
  onGATCClick,
  onHelpClick,
  onLoginClick,
}) => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [verificationMode, setVerificationMode] = useState<'Certificate Number' | 'Application Number' | 'Instrument ID'>('Certificate Number');
  const [verificationQuery, setVerificationQuery] = useState('');
  const [applicationQuery, setApplicationQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const serviceAction = (target: (typeof publicServices)[number]['target']) => {
    if (target === 'apply') onApplyClick();
    if (target === 'track') onTrackClick();
    if (target === 'verify') onVerifyClick();
    if (target === 'gatc') onGATCClick();
  };

  const scrollHome = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-2 text-[11px] text-slate-600 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span className="font-semibold tracking-wide text-slate-800">GOVERNMENT OF INDIA</span>
              <span className="hidden text-slate-300 sm:inline">|</span>
              <span className="hidden truncate sm:inline">Department of Legal Metrology</span>
              <span className="hidden text-slate-300 lg:inline">|</span>
              <span className="hidden lg:inline">Ministry of Consumer Affairs</span>
            </div>
            <div className="flex shrink-0 items-center gap-3 font-medium">
              <button type="button" className="hover:text-indigo-700">Accessibility</button>
              <span className="text-slate-300">|</span>
              <button type="button" className="hover:text-indigo-700">English | हिन्दी</button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <button type="button" onClick={scrollHome} className="flex items-center gap-3 text-left">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-700 text-white shadow-sm shadow-indigo-200">
                <ShieldCheck className="size-5" strokeWidth={2.3} />
              </span>
              <span>
                <span className="font-heading block text-lg font-bold tracking-tight text-slate-950">e-Metro</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Legal Metrology Services</span>
                <span className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">Digital Verification &amp; Certification Infrastructure</span>
              </span>
            </button>

            <div className="hidden items-center gap-6 md:flex">
              <button type="button" onClick={scrollHome} className="text-sm font-medium text-slate-700 hover:text-indigo-700">Home</button>
              <a href="#services" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Services</a>
              <a href="#track-application" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Track Application</a>
              <a href="#verify-certificate" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Verify Certificate</a>
              <a href="#help" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Help</a>
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-800"
              >
                <LogIn className="size-3.5" /> Login
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileNav((open) => !open)}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 md:hidden"
              aria-expanded={showMobileNav}
            >
              {showMobileNav ? <X className="size-4" /> : 'Menu'}
            </button>
          </div>
          {showMobileNav && (
            <nav className="mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-sm md:hidden">
              <button type="button" onClick={scrollHome} className="rounded-md px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50">Home</button>
              <a href="#services" className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Services</a>
              <a href="#track-application" className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Track Application</a>
              <a href="#verify-certificate" className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Verify Certificate</a>
              <a href="#help" className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Help</a>
              <button type="button" onClick={onLoginClick} className="rounded-md bg-indigo-700 px-3 py-2 text-left font-semibold text-white">Login</button>
            </nav>
          )}
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white px-5 py-12 sm:px-8 lg:py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Government digital service</p>
              <h1 className="font-heading max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                Digital Legal Metrology<br />Verification &amp; Certification
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                An integrated digital platform for traders, Legal Metrology Officers and Government Approved Test Centres to manage verification, inspection and digital certification.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button onClick={onApplyClick} className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800">
                  <FileCheck2 className="size-4" /> Apply for Verification
                </button>
                <button onClick={onTrackClick} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Search className="size-4 text-indigo-700" /> Track Application
                </button>
              </div>
              <button onClick={onVerifyClick} className="mt-5 text-sm font-medium text-slate-600 hover:text-indigo-700">
                Already have a certificate? <span className="font-semibold text-indigo-700">Verify Certificate</span>
              </button>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
              <div className="border-b border-slate-200 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Digital verification workflow</p>
                <h2 className="font-heading mt-1 text-lg font-semibold text-slate-900">A clear record at every stage</h2>
              </div>
              <ol className="mt-4 space-y-0">
                {['Instrument', 'Inspection', 'Verification', 'Digital Certificate', 'QR Verification'].map((step, index) => (
                  <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
                    {index < 4 && <span className="absolute left-[11px] top-6 h-5 w-px bg-slate-300" />}
                    <span className="z-10 grid size-[23px] shrink-0 place-items-center rounded-full border border-indigo-200 bg-white text-[10px] font-bold text-indigo-700">{String(index + 1).padStart(2, '0')}</span>
                    <span className="pt-0.5 text-sm font-medium text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Purpose</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">One platform for Legal Metrology services</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">e-Metro simplifies the complete verification lifecycle — from application submission and inspection scheduling to certificate issuance and public verification.</p>
            </div>
            <div className="mt-7 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {[
                ['01', 'Apply Online', 'Submit an application for verification of weighing and measuring instruments.'],
                ['02', 'Track Application', 'Monitor application status and inspection progress.'],
                ['03', 'Digital Certificate', 'Receive and manage digitally issued verification certificates.'],
                ['04', 'Verify Certificate', 'Verify certificate authenticity using a number or QR code.'],
              ].map(([number, title, text]) => (
                <div key={number} className="px-5 py-5 first:pl-0 last:pr-0 sm:first:pl-0">
                  <div className="text-xs font-semibold text-indigo-700">{number}</div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Public services</p>
                <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">Legal Metrology Services</h2>
              </div>
              <p className="text-sm text-slate-500">Start the service that matches your requirement.</p>
            </div>
            <div className="grid border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {publicServices.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="border-b border-r border-slate-200 p-5">
                    <div className="grid size-8 place-items-center border border-slate-200 bg-slate-50 text-indigo-700"><Icon className="size-4" /></div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-2 min-h-10 text-xs leading-5 text-slate-600">{service.description}</p>
                    <button onClick={() => serviceAction(service.target)} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">
                      View service <ArrowRight className="size-3.5" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Process</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">How e-Metro works</h2>
            </div>
            <ol className="mt-7 grid gap-0 border-y border-slate-200 md:grid-cols-3 lg:grid-cols-6">
              {workflow.map((step, index) => (
                <li key={step} className="relative border-b border-slate-200 px-4 py-5 last:border-b-0 md:border-b-0 md:border-r lg:last:border-r-0">
                  <div className="text-xs font-semibold text-indigo-700">{String(index + 1).padStart(2, '0')}</div>
                  <div className="mt-3 text-sm font-semibold leading-5 text-slate-900">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="verify-certificate" className="border-y border-slate-200 bg-indigo-50/50 px-5 py-12 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="grid size-10 place-items-center rounded-lg bg-indigo-700 text-white"><QrCode className="size-5" /></div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Public certificate verification</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">Verify a Legal Metrology Certificate</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Check the authenticity and current status of a certificate issued through e-Metro.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-3">
                {(['Certificate Number', 'Application Number', 'Instrument ID'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVerificationMode(mode)}
                    className={`border-b-2 px-2 py-1.5 text-xs font-semibold ${verificationMode === mode ? 'border-indigo-700 text-indigo-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <label className="mt-5 block text-sm font-medium text-slate-700">{verificationMode}</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={verificationQuery}
                  onChange={(event) => setVerificationQuery(event.target.value)}
                  placeholder={verificationMode === 'Certificate Number' ? 'LM-DEL-2026-004821' : `Enter ${verificationMode.toLowerCase()}`}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none placeholder:font-sans placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
                <button onClick={onVerifyClick} className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800">
                  <Search className="size-4" /> Verify Certificate
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">Verification does not require login.</p>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600">
                <QrCode className="size-4 shrink-0 text-indigo-700" /> Scan the QR code printed on your certificate to verify it instantly.
              </div>
            </div>
          </div>
        </section>

        <section id="track-application" className="px-5 py-12 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Application tracking</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">Track your application</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Enter the reference number provided when your verification application was submitted.</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  value={applicationQuery}
                  onChange={(event) => setApplicationQuery(event.target.value)}
                  placeholder="APP-2026-1403"
                  className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
                <button onClick={onTrackClick} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Search className="size-4 text-indigo-700" /> Track Application
                </button>
              </div>
            </div>
            <div className="border-l-0 border-slate-200 pt-1 lg:border-l lg:pl-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Typical application progress</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-xs font-medium text-slate-600">
                {['Submitted', 'Documents Verified', 'Inspection Scheduled', 'Inspection Completed', 'Certificate Issued'].map((step, index) => (
                  <React.Fragment key={step}>
                    <span className="border border-slate-200 bg-slate-50 px-2.5 py-1.5">{step}</span>
                    {index < 4 && <ChevronRight className="size-3.5 text-slate-400" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-500">Use your application reference to view its actual status and timeline.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Secure workspaces</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">Services for every participant</h2>
            </div>
            <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
              <PortalPanel title="For Traders" text="Manage your instruments, applications and certificates from one secure workspace." points={['Register instruments', 'Submit verification applications', 'Track inspections', 'View certificates and notifications']} action="Login to Trader Portal" onClick={onLoginClick} />
              <PortalPanel title="Legal Metrology Officers" text="Review applications, schedule inspections, conduct field verification and issue certificates." points={['Review applications', 'Plan field inspections', 'Record verification outcomes']} action="Officer Login" onClick={onLoginClick} />
              <PortalPanel title="Government Approved Test Centres" text="Manage assigned instruments, record test results and submit reports for verification." points={['Review test assignments', 'Record test results', 'Submit verification reports']} action="GATC Login" onClick={onLoginClick} />
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <BellRing className="size-4 text-indigo-700" />
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-slate-950">Important Notices</h2>
                <p className="mt-0.5 text-xs text-slate-500">Demo content for this prototype.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {OFFICIAL_NOTICES.slice(0, 4).map((notice) => (
                <article key={notice.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{notice.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{notice.category} · {notice.date}</p>
                  </div>
                  <button type="button" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">View details <ArrowRight className="size-3.5" /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="help" className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Help centre</p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-950">Frequently asked questions</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Find practical guidance for registration, verification, certificates and testing.</p>
              <button onClick={onHelpClick} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"><HelpCircle className="size-4" /> Open help centre</button>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map(([question, answer], index) => (
                <div key={question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq((open) => (open === index ? null : index))}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-slate-800"
                    aria-expanded={openFaq === index}
                  >
                    {question}
                    <ChevronRight className={`size-4 shrink-0 text-indigo-700 transition-transform ${openFaq === index ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === index && <p className="pb-4 pr-8 text-xs leading-6 text-slate-600">{answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 px-5 py-10 text-white sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Ready to manage your Legal Metrology services digitally?</h2>
              <p className="mt-2 text-sm text-slate-300">Start an application or verify an existing certificate.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={onApplyClick} className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Apply for Verification</button>
              <button onClick={onVerifyClick} className="rounded-md border border-slate-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Verify Certificate</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-5 py-8 text-slate-300 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="font-heading text-lg font-semibold text-white">e-Metro</div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">Government of India · Department of Legal Metrology · Ministry of Consumer Affairs</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#track-application" className="hover:text-white">Track Application</a>
            <a href="#verify-certificate" className="hover:text-white">Verify Certificate</a>
            <a href="#help" className="hover:text-white">Help</a>
            <button type="button" className="text-left hover:text-white">Accessibility</button>
            <button type="button" className="text-left hover:text-white">Privacy</button>
          </div>
          <div className="text-xs leading-5 text-slate-400 md:text-right">
            <p>Demo Prototype – Not an official Government of India website</p>
            <p className="mt-1">Version 1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PortalPanel: React.FC<{
  title: string;
  text: string;
  points: string[];
  action: string;
  onClick?: () => void;
}> = ({ title, text, points, action, onClick }) => (
  <article className="px-0 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
    <ul className="mt-4 space-y-2 text-xs text-slate-600">
      {points.map((point) => <li key={point} className="flex gap-2"><span className="mt-1.5 size-1 shrink-0 bg-indigo-700" />{point}</li>)}
    </ul>
    <button type="button" onClick={onClick} className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">
      {action} <ArrowRight className="size-3.5" />
    </button>
  </article>
);
