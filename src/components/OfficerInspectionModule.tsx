import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  Smartphone,
} from 'lucide-react';
import type { VerificationApplication, Instrument, TestReading } from '../types';
import { StorageService } from '../services/storageService';
import { CATEGORY_TOLERANCE_RULES, evaluateTestReading } from '../services/verificationEngine';

interface OfficerInspectionModuleProps {
  application: VerificationApplication;
  instrument?: Instrument;
  onBack: () => void;
  onSuccess: (certNo?: string) => void;
}

export const OfficerInspectionModule: React.FC<OfficerInspectionModuleProps> = ({
  application,
  instrument,
  onBack,
  onSuccess,
}) => {
  const rules = CATEGORY_TOLERANCE_RULES[application.category] || CATEGORY_TOLERANCE_RULES['Weighing Scale'];

  const [testReadings, setTestReadings] = useState<TestReading[]>(() =>
    rules.standardTests.map((t) => evaluateTestReading(t.parameter, t.standardValue, t.standardValue, t.unit, t.allowedTolerancePercent))
  );

  const [observations, setObservations] = useState(
    'Prototype inspection observation. Confirm applicable official requirements outside this demonstration.'
  );
  const [geoTagged, setGeoTagged] = useState('28.6139° N, 77.2090° E (Accuracy: ±2.5m)');
  const [photoCaptured, setPhotoCaptured] = useState(true);
  const [finalDecision, setFinalDecision] = useState<'PASS' | 'FAIL'>('PASS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleObservedValueChange = (index: number, val: number) => {
    const rule = rules.standardTests[index];
    const updated = evaluateTestReading(
      rule.parameter,
      rule.standardValue,
      val,
      rule.unit,
      rule.allowedTolerancePercent
    );

    const newReadings = [...testReadings];
    newReadings[index] = updated;
    setTestReadings(newReadings);

    const hasFail = newReadings.some((r) => r.result === 'FAIL');
    setFinalDecision(hasFail ? 'FAIL' : 'PASS');
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const officer = StorageService.getCurrentUser();

    setTimeout(() => {
      const res = StorageService.submitInspectionAndGenerateCertificate(application.id, {
        applicationId: application.id,
        instrumentId: application.instrumentId,
        officerId: officer.id,
        officerName: officer.name,
        inspectionDate: new Date().toISOString().split('T')[0],
        locationGeo: geoTagged,
        locationAddress: instrument?.locationAddress || 'Okhla Industrial Area, Delhi',
        checklist: [
          { id: 'instrument-identification', label: 'Demo identification review completed', checked: true },
          { id: 'document-reference', label: 'Demo application reference reviewed', checked: true },
          { id: 'serial-number', label: 'Demo serial-number match recorded', checked: true },
          { id: 'physical-condition', label: 'Demo condition observation recorded', checked: true },
          { id: 'test-reading', label: 'Demo test readings recorded', checked: true },
          { id: 'result', label: 'Prototype result selected', checked: finalDecision === 'PASS' },
          { id: 'completion', label: 'Demo completion note recorded', checked: finalDecision === 'PASS' },
        ],
        testReadings,
        observations,
        photos: [
          instrument?.photoUrl ||
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
        ],
        finalResult: finalDecision,
      });

      setIsSubmitting(false);

      onSuccess(res.certificate?.certNo);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Mobile/Tablet Friendly Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            FIELD INSPECTION MODE
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">{application.applicationNo}</span>
        </div>
      </div>

      {/* Main Inspection Mobile Card Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-900 px-6 py-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              PROTOTYPE INSPECTION WORKSPACE · DEMO DATA
            </div>
            <h2 className="text-xl font-bold font-heading text-white">{application.instrumentTitle}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trader: <strong>{application.ownerName}</strong> | Serial No: <span className="font-mono">{application.serialNumber}</span>
            </p>
          </div>
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-xs">
            <div className="text-slate-400">Instrument category</div>
            <div className="font-bold text-amber-300 font-heading">{application.category}</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitInspection} className="p-6 space-y-6">
          {/* Section 1: Geo-location & Site Verification */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Geo-Tag & Verification Site Location
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">{instrument?.locationAddress || 'Okhla Industrial Area, New Delhi'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">GPS: {geoTagged}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeoTagged('28.6139° N, 77.2090° E (Refreshed Accuracy: ±1.2m)')}
                className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs cursor-pointer shrink-0"
              >
                Refresh GPS Tag
              </button>
            </div>
          </div>

          {/* Section 2: Tolerance Test Readings Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Demo Test Readings
              </h3>
              <span className="text-[10px] font-semibold text-slate-500">
                Prototype decision support · not a statutory checklist
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Standard Test Parameter</th>
                    <th className="p-3">Standard Value</th>
                    <th className="p-3">Observed Reading</th>
                    <th className="p-3">Allowed Tolerance</th>
                    <th className="p-3">Error %</th>
                    <th className="p-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {testReadings.map((reading, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">{reading.parameter}</td>
                      <td className="p-3 font-mono text-slate-600">
                        {reading.standardValue} {reading.unit}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.001"
                          value={reading.observedValue}
                          onChange={(e) => handleObservedValueChange(idx, parseFloat(e.target.value) || 0)}
                          className="w-28 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-900 bg-white"
                        />
                        <span className="ml-1 text-slate-500">{reading.unit}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">±{reading.toleranceMargin}%</td>
                      <td className="p-3 font-mono font-bold text-slate-700">{reading.errorPercentage}%</td>
                      <td className="p-3 text-right">
                        {reading.result === 'PASS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>PASS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>FAIL</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Photo Evidence & Observations */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                3. Prototype observations &amp; evidence
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Inspection Notes & Observations</label>
                <textarea
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Photo Evidence Drop/Preview */}
              <div className="p-4 border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-slate-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {photoCaptured ? 'Demo evidence attached' : 'Attach demo evidence'}
                    </div>
                    <div className="text-[10px] text-slate-400">Geo-tagged image file</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoCaptured(!photoCaptured)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-semibold rounded-xl text-slate-700 cursor-pointer"
                >
                  {photoCaptured ? 'Retake Photo' : 'Capture'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: PASS / FAIL Final Decision */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Prototype result</div>
                <div className="text-sm font-semibold text-slate-300">
                  Select a demo result based on the prototype record above.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFinalDecision('PASS')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  finalDecision === 'PASS'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">MARK AS PASS</span>
              </button>

              <button
                type="button"
                onClick={() => setFinalDecision('FAIL')}
                className={`p-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  finalDecision === 'FAIL'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-lg ring-2 ring-rose-400/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5" />
                <span className="text-sm">MARK AS FAIL</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 font-bold text-xs text-white rounded-xl shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
                finalDecision === 'PASS'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500'
              }`}
            >
              {isSubmitting ? (
                <span>Submitting Inspection...</span>
              ) : (
                <>
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>
                    {finalDecision === 'PASS'
                      ? 'Submit Prototype Inspection'
                      : 'Submit Prototype Result'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
