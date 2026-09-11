import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
} from 'lucide-react';
import type { PublicPageTab, VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';
import { GATC_DIRECTORY } from '../services/mockData';

interface PublicInfoPagesProps {
  activeTab: PublicPageTab;
}

export const PublicInfoPages: React.FC<PublicInfoPagesProps> = ({
  activeTab,
}) => {
  // Track Application State
  const [trackQuery, setTrackQuery] = useState('APP-2026-1403');
  const [trackedApp, setTrackedApp] = useState<VerificationApplication | undefined>(() =>
    StorageService.getApplicationByNo('APP-2026-1403')
  );

  // GATC Search State
  const [gatcSearch, setGatcSearch] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = StorageService.getApplicationByNo(trackQuery);
    setTrackedApp(app);
  };

  const filteredGATCs = GATC_DIRECTORY.filter((g) =>
    g.name.toLowerCase().includes(gatcSearch.toLowerCase()) ||
    g.state.toLowerCase().includes(gatcSearch.toLowerCase()) ||
    g.location.toLowerCase().includes(gatcSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-xs text-slate-700">
      {/* 1. ABOUT E-METRO */}
      {activeTab === 'about' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-heading text-slate-900">About e-Metro Infrastructure</h2>
            <p className="text-xs text-slate-500">Legal Metrology Digital Governance Framework</p>
          </div>

          <div className="space-y-3 leading-relaxed">
            <p>
              <strong>e-Metro</strong> is the official central digital platform built under the Directorate of Legal Metrology, Ministry of Consumer Affairs, Food & Public Distribution, Government of India. It standardizes the verification, testing, stamping, and digital certification of all commercial weighing and measuring instruments across India.
            </p>

            <h3 className="text-sm font-bold text-slate-900 font-heading pt-2">Key Objectives</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Eliminate paper-based verification certificates with tamper-proof cryptographic QR codes.</li>
              <li>Provide seamless online registration and verification application workflows for traders.</li>
              <li>Enable field legal metrology officers (LMO) to record Maximum Permissible Error (MPE) test readings on mobile/tablet devices on-site.</li>
              <li>Integrate Government Approved Test Centres (GATC) under Section 24A for precision meter calibration.</li>
              <li>Ensure complete public transparency through zero-authentication online certificate verification.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 2. LEGAL METROLOGY SERVICES */}
      {activeTab === 'services' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-heading text-slate-900">Legal Metrology Services Catalog</h2>
            <p className="text-xs text-slate-500">Statutory services under Legal Metrology Act, 2009</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceDetailBox
              title="1. Initial Verification & Stamping"
              description="Mandatory verification and stamping for newly manufactured or imported weighing and measuring instruments prior to commercial usage."
              fee="₹1,250 - ₹3,500 (As per Schedule-IX)"
            />
            <ServiceDetailBox
              title="2. Periodic Re-Verification"
              description="Mandatory annual or biannual re-stamping for active commercial instruments to ensure accuracy compliance."
              fee="₹1,250 - ₹3,500 (Annual)"
            />
            <ServiceDetailBox
              title="3. Instrument Registration"
              description="Digital registration of commercial equipment specifications, serial numbers, accuracy classes, and installation coordinates."
              fee="Free Registration"
            />
            <ServiceDetailBox
              title="4. GATC Precision Testing"
              description="Laboratory testing for industrial flow meters, water meters, and energy meters via NABL accredited test centers."
              fee="₹2,000 (Lab Fee)"
            />
          </div>
        </div>
      )}

      {/* 3. TRACK APPLICATION */}
      {activeTab === 'track' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-heading text-slate-900">Track Application Progress</h2>
            <p className="text-xs text-slate-500">Enter your Application Reference Number to view live verification status</p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="e.g. APP-2026-1403"
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 uppercase"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </button>
          </form>

          {trackedApp ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono font-bold text-blue-700 text-sm bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {trackedApp.applicationNo}
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-1">{trackedApp.instrumentTitle}</div>
                  <div className="text-[11px] text-slate-500">Trader: {trackedApp.ownerName} | S/N: {trackedApp.serialNumber}</div>
                </div>
                <span className="px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
                  {trackedApp.status}
                </span>
              </div>

              {/* Stepper Timeline */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs font-heading">Application Milestone Progress</div>
                <div className="space-y-2">
                  {trackedApp.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.completed ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.timestamp || 'Pending'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-lg border text-xs text-slate-500">
              No application record found for query "<strong>{trackQuery}</strong>". Please verify the reference ID.
            </div>
          )}
        </div>
      )}

      {/* 4. GATC DIRECTORY SEARCH */}
      {activeTab === 'gatc' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900">Approved Test Centres (GATC) Directory</h2>
              <p className="text-xs text-slate-500">Accredited laboratories under Section 24A of Legal Metrology Act</p>
            </div>

            <input
              type="text"
              placeholder="Filter by facility name, state..."
              value={gatcSearch}
              onChange={(e) => setGatcSearch(e.target.value)}
              className="px-3.5 py-1.5 text-xs border border-slate-300 rounded-md w-64"
            />
          </div>

          <div className="space-y-3">
            {filteredGATCs.map((gatc) => (
              <div key={gatc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm font-heading">{gatc.name}</div>
                  <div className="text-[11px] text-slate-600">
                    Accreditation No: <span className="font-mono font-semibold text-blue-700">{gatc.accreditationNo}</span> | State: <strong>{gatc.state}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">Location: {gatc.location} | Contact: {gatc.contactPerson} ({gatc.phone})</div>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] shrink-0">
                  NABL ACTIVE ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HELP & FAQS */}
      {activeTab === 'help' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-heading text-slate-900">Frequently Asked Questions (FAQs)</h2>
            <p className="text-xs text-slate-500">Guidelines for Traders, Inspectors & Test Laboratories</p>
          </div>

          <div className="space-y-3">
            <FaqBox
              question="What is the validity period of a Legal Metrology Verification Certificate?"
              answer="Standard commercial weighing scales and weighbridges have a certificate validity of 12 months (1 year) from the date of verification & stamping."
            />
            <FaqBox
              question="Is online QR verification legally valid?"
              answer="Yes. The digital verification certificate generated on e-Metro contains a cryptographic SHA-256 hash and QR code, which is legally valid under the Information Technology Act, 2000."
            />
            <FaqBox
              question="What happens if an instrument fails field inspection MPE tolerance tests?"
              answer="If an instrument exceeds Maximum Permissible Error (MPE) limits, the LMO Inspector marks it as REJECTED. Commercial usage must cease until recalibration and re-verification is completed."
            />
          </div>
        </div>
      )}

      {/* 6. CONTACT & CIRCLE OFFICES */}
      {activeTab === 'contact' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold font-heading text-slate-900">Contact Department Directory</h2>
            <p className="text-xs text-slate-500">Legal Metrology National Directorate & Regional Circle Offices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-slate-900 text-sm font-heading">Directorate Headquarters</div>
              <p className="text-slate-600">Department of Legal Metrology, Krishi Bhawan, New Delhi - 110001</p>
              <p className="font-mono text-slate-800">Phone: 011-23381234 / Toll Free: 1915</p>
              <p className="font-mono text-slate-800">Email: dir-legalmetrology@nic.in</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-slate-900 text-sm font-heading">Delhi Circle-IV Office</div>
              <p className="text-slate-600">Okhla Industrial Area Phase-3, District South, New Delhi</p>
              <p className="font-mono text-slate-800">Senior LMO: Inspector Vikramaditya Roy</p>
              <p className="font-mono text-slate-800">Contact: +91 98112 34567</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceDetailBox: React.FC<{ title: string; description: string; fee: string }> = ({
  title,
  description,
  fee,
}) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
    <div className="font-bold text-slate-900 text-xs font-heading">{title}</div>
    <p className="text-slate-600 leading-relaxed text-[11px]">{description}</p>
    <div className="text-[11px] font-semibold text-blue-700 pt-1">Statutory Fee: {fee}</div>
  </div>
);

const FaqBox: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
      <span>{question}</span>
    </div>
    <p className="text-slate-600 text-[11px] pl-5 leading-relaxed">{answer}</p>
  </div>
);
