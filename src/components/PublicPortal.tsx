import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HelpCircle,
  Landmark,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  Stamp,
  X,
} from 'lucide-react';
import type { PublicPageTab, VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';

interface PublicPortalProps {
  onLogin: () => void;
  onOpenVerify: (certificateNumber?: string) => void;
}

const officialActUrl = 'https://consumeraffairs.gov.in/pages/legal-metrology-act';
const officialOverviewUrl = 'https://consumeraffairs.gov.in/pages/legal-metrology-overview';
const officialMeasuresUrl = 'https://consumeraffairs.gov.in/pages/weight-and-measures';
const controllerDirectoryUrl = 'https://consumeraffairs.gov.in/pages/address-email-of-controllers';

const navigation: Array<{ id: PublicPageTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About AccuMate' },
  { id: 'legal-metrology', label: 'Legal Metrology' },
  { id: 'services', label: 'Services' },
  { id: 'track', label: 'Track Application' },
  { id: 'rules', label: 'Rules & Regulations' },
  { id: 'notices', label: 'Notices' },
  { id: 'help', label: 'FAQs' },
  { id: 'contact', label: 'Contact' },
];

const serviceCards = [
  { icon: ClipboardCheck, title: 'Application management', text: 'Organize prototype applications, documents and progress updates in one workspace.' },
  { icon: Stamp, title: 'Verification workflow', text: 'Support a proposed inspection, review and result-recording workflow.' },
  { icon: FileCheck2, title: 'Inspection management', text: 'Capture demo checklists, observations and supporting evidence.' },
  { icon: BadgeCheck, title: 'Certificate management', text: 'View clearly labelled prototype certificate records and their status.' },
  { icon: Building2, title: 'GATC workflow', text: 'Coordinate sample test-centre work items without representing an approval register.' },
  { icon: QrCode, title: 'Public verification', text: 'Check a prototype certificate record by its reference number or QR value.' },
  { icon: Search, title: 'Application tracking', text: 'Make proposed workflow milestones visible to applicants.' },
];

const workflow = [
  ['01', 'Application submitted'],
  ['02', 'Document review'],
  ['03', 'Officer assignment'],
  ['04', 'Inspection'],
  ['05', 'Verification result'],
  ['06', 'Certificate processing'],
  ['07', 'Completion'],
];

const officialDocuments = [
  ['Legal Metrology Act, 2009', '2009', 'Primary Act listed by the Department of Consumer Affairs.'],
  ['Legal Metrology (General) Rules, 2011', '2011', 'Rules listed on the Department’s Legal Metrology Act and Rules page.'],
  ['Legal Metrology (Government Approved Test Centre) Rules, 2013', '2013', 'Official rules listed by the Department for Government Approved Test Centres.'],
  ['Legal Metrology (National Standards) Rules, 2011', '2011', 'Official rules listed by the Department.'],
];

export const PublicPortal: React.FC<PublicPortalProps> = ({ onLogin, onOpenVerify }) => {
  const [activeTab, setActiveTab] = useState<PublicPageTab>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectTab = (tab: PublicPageTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#17324D]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-white focus:px-3 focus:py-2 focus:text-[#17324D] focus:shadow">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[#17324D] px-4 py-1.5 text-[11px] text-slate-100 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <span>AccuMate prototype digital platform</span>
            <span className="hidden sm:block">Legal information source: Department of Consumer Affairs, Government of India</span>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => selectTab('home')} className="flex items-center gap-3 text-left" aria-label="AccuMate home">
            <span className="grid size-10 place-items-center border border-[#1558A6] bg-[#1558A6] text-white shadow-sm"><ShieldCheck className="size-5" /></span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-[#17324D]">AccuMate</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Legal Metrology workflows</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => onOpenVerify()} className="hidden items-center gap-1.5 border border-[#1558A6] px-3 py-2 text-xs font-semibold text-[#1558A6] transition hover:bg-[#EAF3FB] sm:inline-flex">
              <QrCode className="size-3.5" /> Verify certificate
            </button>
            <button onClick={onLogin} className="bg-[#1558A6] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#104986]">
              Login
            </button>
            <button onClick={() => setMobileOpen((open) => !open)} className="grid size-9 place-items-center border border-slate-300 text-[#17324D] sm:hidden" aria-expanded={mobileOpen} aria-label="Toggle navigation">
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        <nav className="hidden border-t border-slate-200 bg-white sm:block" aria-label="Public navigation">
          <div className="mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-4 sm:px-6">
            {navigation.map((item) => <NavButton key={item.id} {...item} active={activeTab === item.id} onClick={() => selectTab(item.id)} />)}
          </div>
        </nav>
        {mobileOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-2 sm:hidden" aria-label="Public navigation">
            {navigation.map((item) => <NavButton key={item.id} {...item} active={activeTab === item.id} onClick={() => selectTab(item.id)} />)}
          </nav>
        )}
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        {activeTab === 'home' && <HomeContent onApply={onLogin} onVerify={onOpenVerify} onNavigate={selectTab} />}
        {activeTab === 'about' && <AboutContent />}
        {activeTab === 'legal-metrology' && <LegalMetrologyContent />}
        {activeTab === 'services' && <ServicesContent onApply={onLogin} />}
        {activeTab === 'track' && <TrackingContent />}
        {activeTab === 'rules' && <RulesContent />}
        {activeTab === 'notices' && <NoticesContent />}
        {activeTab === 'help' && <FaqContent />}
        {activeTab === 'contact' && <ContactContent />}
      </main>

      <footer className="border-t border-slate-700 bg-[#17324D] text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1.2fr_.8fr_.9fr]">
          <div>
            <div className="text-lg font-bold text-white">AccuMate</div>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">Digital Legal Metrology Verification & Certification Platform</p>
            <p className="mt-4 max-w-md text-xs leading-5 text-slate-400">AccuMate is a prototype/demonstration platform. It is not itself an official Government of India website or system unless explicitly authorized.</p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-white">Quick links</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <button onClick={() => selectTab('legal-metrology')} className="w-fit hover:text-white">Legal Metrology</button>
              <button onClick={() => selectTab('rules')} className="w-fit hover:text-white">Rules & Regulations</button>
              <button onClick={() => onOpenVerify()} className="w-fit hover:text-white">Verify certificate</button>
              <button onClick={() => selectTab('track')} className="w-fit hover:text-white">Track application</button>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-white">Official source</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Department of Consumer Affairs<br />Government of India</p>
            <a href={officialActUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#a9d4ff] hover:text-white">View Act & Rules <ArrowUpRight className="size-3.5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold transition ${active ? 'border-[#1558A6] bg-[#EAF3FB] text-[#1558A6]' : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-[#17324D]'}`}>
    {label}
  </button>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">{children}</div>;

const PageHeading: React.FC<{ eyebrow: string; title: string; text: string }> = ({ eyebrow, title, text }) => (
  <div className="max-w-3xl border-l-4 border-[#1558A6] pl-4">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17324D] sm:text-4xl">{title}</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{text}</p>
  </div>
);

const HomeContent: React.FC<{ onApply: () => void; onVerify: (certificateNumber?: string) => void; onNavigate: (tab: PublicPageTab) => void }> = ({ onApply, onVerify, onNavigate }) => (
  <div className="space-y-12 pb-4">
    <section className="border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.25fr_.75fr] lg:p-12">
        <div>
          <Eyebrow>AccuMate · Prototype platform</Eyebrow>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#17324D] sm:text-5xl">Digital Legal Metrology Verification & Certification</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">AccuMate is a demonstration platform for organizing Legal Metrology-related application, inspection, verification and certification workflows. It does not replace official Government systems or statutory procedures.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onApply} className="inline-flex items-center gap-2 bg-[#1558A6] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104986]">Apply for verification <ArrowRight className="size-4" /></button>
            <button onClick={() => onVerify()} className="inline-flex items-center gap-2 border border-[#1558A6] bg-white px-4 py-3 text-sm font-semibold text-[#1558A6] transition hover:bg-[#EAF3FB]"><QrCode className="size-4" /> Verify certificate</button>
          </div>
        </div>
        <aside className="border border-[#cfe2f3] bg-[#EAF3FB] p-5 sm:p-6">
          <div className="flex size-11 items-center justify-center bg-[#17324D] text-white"><Landmark className="size-5" /></div>
          <h2 className="mt-4 text-lg font-bold text-[#17324D]">Information-first by design</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Legal and regulatory references link to the Department of Consumer Affairs. Application and certificate records in this prototype are clearly marked as demo data.</p>
          <button onClick={() => onNavigate('legal-metrology')} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1558A6] hover:text-[#17324D]">Read Legal Metrology information <ArrowRight className="size-3.5" /></button>
        </aside>
      </div>
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4"><div><Eyebrow>Quick services</Eyebrow><h2 className="mt-1 text-2xl font-bold text-[#17324D]">Start the task you need</h2></div><button onClick={() => onNavigate('services')} className="hidden text-sm font-semibold text-[#1558A6] sm:block">All services</button></div>
      <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        <QuickService icon={FileCheck2} title="Apply for Verification" onClick={onApply} />
        <QuickService icon={Search} title="Track Application" onClick={() => onNavigate('track')} />
        <QuickService icon={QrCode} title="Verify Certificate" onClick={() => onVerify()} />
        <QuickService icon={BadgeCheck} title="View Certificates" onClick={() => onVerify()} />
        <QuickService icon={BookOpen} title="Legal Metrology Information" onClick={() => onNavigate('legal-metrology')} />
      </div>
    </section>

    <section className="grid gap-8 border-t border-slate-200 pt-10 lg:grid-cols-[.9fr_1.1fr]">
      <div><Eyebrow>Proposed AccuMate workflow</Eyebrow><h2 className="mt-2 text-2xl font-bold text-[#17324D]">A clear route from application to completion</h2><p className="mt-3 text-sm leading-6 text-slate-600">This sequence demonstrates how a digital workflow can be organized. It is not a statement of legally mandated procedure.</p></div>
      <ol className="grid gap-3 sm:grid-cols-2">
        {workflow.map(([number, label]) => <li key={number} className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3"><span className="font-mono text-sm font-bold text-[#1558A6]">{number}</span><span className="text-sm font-semibold text-[#17324D]">{label}</span></li>)}
      </ol>
    </section>
  </div>
);

const QuickService: React.FC<{ icon: React.ElementType; title: string; onClick: () => void }> = ({ icon: Icon, title, onClick }) => <button onClick={onClick} className="group bg-white p-4 text-left transition hover:bg-[#EAF3FB]"><Icon className="size-5 text-[#1558A6]" /><span className="mt-5 block text-sm font-semibold text-[#17324D] group-hover:text-[#1558A6]">{title}</span><ArrowRight className="mt-3 size-3.5 text-slate-400 group-hover:text-[#1558A6]" /></button>;

const AboutContent = () => <div className="space-y-8"><PageHeading eyebrow="About AccuMate" title="A prototype for clearer Legal Metrology workflows" text="AccuMate demonstrates how application tracking, inspection management, certificate records, public verification and role-based workspaces can be organized digitally." /><section className="grid gap-4 md:grid-cols-2"><InfoCard title="Purpose" text="The platform illustrates a structured, transparent way to coordinate Legal Metrology-related workflow information." /><InfoCard title="Prototype boundary" text="AccuMate does not replace official Government systems, authorities, approvals, records or statutory procedures." /><InfoCard title="Workflow visibility" text="Demo records make each proposed milestone visible to applicants and authorized portal roles." /><InfoCard title="Role-based access" text="Separate Trader, Officer, GATC and Admin workspaces demonstrate relevant task views." /></section><SourcePanel /></div>;

const LegalMetrologyContent = () => <div className="space-y-8"><PageHeading eyebrow="Official Legal Metrology information" title="Legal Metrology" text="The following overview uses only Department of Consumer Affairs references. For the authoritative text, use the official links provided." /><section className="grid gap-4 md:grid-cols-2"><InfoCard title="Legal Metrology Act, 2009" text="The Department lists the Legal Metrology Act, 2009 on its official Act and Rules page. The Department’s Weight and Measures page states that the Act was implemented with effect from 1 April 2011." link={{ label: 'View official Act & Rules', href: officialActUrl }} /><InfoCard title="Legal Metrology (General) Rules, 2011" text="The Department lists the Legal Metrology (General) Rules, 2011 and related amendments on its official Act and Rules page." link={{ label: 'View official rules', href: officialActUrl }} /><InfoCard title="Weights and measures" text="The Department’s Weight and Measures page describes the metric system based on the International System of Units and lists rules framed for implementation of the Act." link={{ label: 'Read Weight and Measures information', href: officialMeasuresUrl }} /><InfoCard title="Government Approved Test Centres" text="The Department lists the Legal Metrology (Government Approved Test Centre) Rules, 2013 and related amendments on its official Act and Rules page." link={{ label: 'View official GATC rules', href: officialActUrl }} /></section><SourcePanel /></div>;

const ServicesContent: React.FC<{ onApply: () => void }> = ({ onApply }) => <div className="space-y-8"><PageHeading eyebrow="AccuMate platform capabilities" title="Services" text="These are proposed AccuMate platform workflows. They are not presented as statutory requirements or official Government services." /><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{serviceCards.map(({ icon: Icon, title, text }) => <article key={title} className="border border-slate-200 bg-white p-5 shadow-sm"><Icon className="size-5 text-[#1558A6]" /><h2 className="mt-4 text-base font-bold text-[#17324D]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</section><section className="flex flex-col justify-between gap-4 border border-[#cfe2f3] bg-[#EAF3FB] p-5 sm:flex-row sm:items-center"><div><div className="text-sm font-bold text-[#17324D]">Ready to use the prototype workspace?</div><div className="mt-1 text-sm text-slate-600">Sign in to access role-specific demo workflows.</div></div><button onClick={onApply} className="shrink-0 bg-[#1558A6] px-4 py-2.5 text-sm font-semibold text-white">Apply / Register</button></section></div>;

const TrackingContent = () => {
  const [query, setQuery] = useState('DEMO-APP-2026-001');
  const [result, setResult] = useState<VerificationApplication | undefined>(() => StorageService.getApplicationByNo('DEMO-APP-2026-001'));
  const submit = (event: React.FormEvent) => { event.preventDefault(); setResult(StorageService.getApplicationByNo(query)); };
  return <div className="space-y-8"><PageHeading eyebrow="Prototype tracking" title="Track application" text="Use a prototype application reference to view its proposed AccuMate workflow progress. This is not a live Government application service." /><section className="border border-slate-200 bg-white p-5 shadow-sm"><form onSubmit={submit} className="flex flex-col gap-2 sm:max-w-xl sm:flex-row"><label className="sr-only" htmlFor="application-id">Application ID</label><input id="application-id" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="DEMO-APP-2026-001" className="min-w-0 flex-1 border border-slate-300 px-3 py-2.5 font-mono text-sm text-[#17324D] outline-none focus:border-[#1558A6] focus:ring-2 focus:ring-[#1558A6]/20" required /><button className="inline-flex items-center justify-center gap-2 bg-[#1558A6] px-4 py-2.5 text-sm font-semibold text-white"><Search className="size-4" /> Track</button></form><div className="mt-3 text-xs text-slate-500">Demo application ID: DEMO-APP-2026-001</div></section>{result ? <ApplicationProgress application={result} /> : <EmptyState icon={Search} title="No application record found" text="Check the prototype application reference and try again." />}</div>;
};

const ApplicationProgress: React.FC<{ application: VerificationApplication }> = ({ application }) => <section className="border border-slate-200 bg-white shadow-sm"><div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-[#EAF3FB] px-5 py-4 sm:flex-row sm:items-center"><div><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">Prototype record</div><div className="mt-1 font-mono text-sm font-bold text-[#17324D]">{application.applicationNo}</div><div className="mt-1 text-sm text-slate-600">{application.instrumentTitle}</div></div><span className="w-fit border border-[#d7b35f] bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wide text-[#835c00]">{application.status.replaceAll('_', ' ')}</span></div><ol className="divide-y divide-slate-200 px-5">{application.timeline.map((step, index) => <li key={`${step.title}-${index}`} className="flex gap-4 py-4"><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${step.completed ? 'bg-[#278A4B] text-white' : 'bg-slate-100 text-slate-500'}`}>{step.completed ? <CheckCircle2 className="size-3.5" /> : index + 1}</span><div><div className="text-sm font-semibold text-[#17324D]">{step.title}</div><div className="mt-0.5 text-sm text-slate-600">{step.description}</div>{step.timestamp && <div className="mt-1 text-xs text-slate-500">{step.timestamp}</div>}</div></li>)}</ol></section>;

const RulesContent = () => <div className="space-y-8"><PageHeading eyebrow="Department of Consumer Affairs" title="Rules & Regulations" text="Document titles below are listed on the Department of Consumer Affairs Legal Metrology Act and Rules page. AccuMate does not reproduce or interpret the documents." /><section className="overflow-hidden border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 bg-[#EAF3FB] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#17324D]"><span>Official document</span><span>Source</span></div>{officialDocuments.map(([title, year, description]) => <article key={title} className="grid gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_auto]"><div><h2 className="text-sm font-bold text-[#17324D]">{title}</h2><p className="mt-1 text-xs font-semibold text-slate-500">Year: {year}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p></div><a href={officialActUrl} target="_blank" rel="noreferrer" className="inline-flex h-fit items-center gap-1 self-center border border-[#1558A6] px-3 py-2 text-xs font-semibold text-[#1558A6] hover:bg-[#EAF3FB]">View / download <ArrowUpRight className="size-3.5" /></a></article>)}</section><SourcePanel /></div>;

const NoticesContent = () => <div className="space-y-8"><PageHeading eyebrow="Platform notices" title="Notices" text="AccuMate does not publish Government notices. The entries below are clearly labelled prototype notices for interface demonstration." /><section className="divide-y divide-slate-200 border border-slate-200 bg-white shadow-sm">{[['DEMO NOTICE', 'Prototype service availability', 'This demonstration workspace is available for reviewing AccuMate sample workflows.'], ['DEMO NOTICE', 'Prototype certificate records', 'Certificate searches return local demonstration records only and do not query a Government database.']].map(([tag, title, text]) => <article key={title} className="px-5 py-5"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#D89000]">{tag}</div><h2 className="mt-1 text-base font-bold text-[#17324D]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</section><a href="https://consumeraffairs.gov.in/pages/latest-news" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#1558A6]">View Department of Consumer Affairs latest news <ArrowUpRight className="size-3.5" /></a></div>;

const FaqContent = () => <div className="space-y-8"><PageHeading eyebrow="Help" title="Frequently asked questions" text="Platform questions are answered below. For legal and regulatory information, refer to the Department of Consumer Affairs source links." /><section className="grid gap-4 lg:grid-cols-2"><Faq question="What is AccuMate?" answer="AccuMate is a prototype digital platform for demonstrating Legal Metrology-related workflow organization." /><Faq question="How does application tracking work?" answer="The tracker shows milestones from prototype data stored in this application. It does not access an official application system." /><Faq question="How does certificate verification work?" answer="A certificate number is checked against prototype records held locally by this demonstration application." /><Faq question="Where can I find the official Act and Rules?" answer="Use the Department of Consumer Affairs Legal Metrology Act and Rules page linked below." link={officialActUrl} /></section></div>;

const ContactContent = () => <div className="space-y-8"><PageHeading eyebrow="Contact" title="Contact information" text="AccuMate does not display invented Government contacts. Use the official Department of Consumer Affairs directory for authority contact details." /><section className="grid gap-4 md:grid-cols-2"><InfoCard title="Official controller directory" text="The Department of Consumer Affairs publishes an Address, Email of Controllers page for official directory information." link={{ label: 'Open official directory', href: controllerDirectoryUrl }} /><InfoCard title="Demo contact information" text="For this prototype, use the in-app Help & Support option after signing in. No Government support channel is represented by AccuMate." /></section></div>;

const InfoCard: React.FC<{ title: string; text: string; link?: { label: string; href: string } }> = ({ title, text, link }) => <article className="border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-bold text-[#17324D]">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>{link && <a href={link.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1558A6] hover:text-[#17324D]">{link.label} <ArrowUpRight className="size-3.5" /></a>}</article>;

const SourcePanel = () => <aside className="border-l-4 border-[#168A8A] bg-[#EAF3FB] p-5"><div className="text-sm font-bold text-[#17324D]">Official source</div><p className="mt-1 text-sm text-slate-600">Department of Consumer Affairs, Government of India</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2"><a href={officialActUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1558A6] hover:text-[#17324D]">Act & Rules</a><a href={officialOverviewUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1558A6] hover:text-[#17324D]">Overview</a><a href={officialMeasuresUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1558A6] hover:text-[#17324D]">Weight & Measures</a></div></aside>;

const Faq: React.FC<{ question: string; answer: string; link?: string }> = ({ question, answer, link }) => <article className="border border-slate-200 bg-white p-5"><div className="flex gap-3"><HelpCircle className="mt-0.5 size-4 shrink-0 text-[#1558A6]" /><div><h2 className="text-sm font-bold text-[#17324D]">{question}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>{link && <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1558A6]">Open official source <ArrowUpRight className="size-3.5" /></a>}</div></div></article>;

const EmptyState: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({ icon: Icon, title, text }) => <div className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><Icon className="mx-auto size-6 text-slate-400" /><h2 className="mt-3 text-base font-bold text-[#17324D]">{title}</h2><p className="mt-1 text-sm text-slate-600">{text}</p></div>;
