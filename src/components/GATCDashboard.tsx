import React, { useState } from 'react';
import {
  FlaskConical,
  Upload,
  Send,
} from 'lucide-react';
import type { VerificationApplication } from '../types';
import { StorageService } from '../services/storageService';

interface GATCDashboardProps {
  applications: VerificationApplication[];
  onRefresh: () => void;
}

export const GATCDashboard: React.FC<GATCDashboardProps> = ({ applications, onRefresh }) => {
  const gatcUser = StorageService.getCurrentUser();
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);
  const [labNotes, setLabNotes] = useState('Prototype test-centre observation recorded for demonstration purposes.');

  const gatcApps = applications.filter((a) => a.category === 'Water Meter' || a.category === 'Electricity Meter' || a.assignedGATCId);

  const handleLabSubmit = (appId: string) => {
    StorageService.updateApplicationStatus(appId, 'INSPECTION_COMPLETED', undefined, 'GATC Lab Team');
    setSelectedApp(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              TEST CENTRE WORKSPACE · DEMO DATA
            </div>
            <h2 className="text-2xl font-bold font-heading">{gatcUser.organization}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Prototype workflow for Government Approved Test Centre-related work items
            </p>
          </div>
          <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/60 text-xs">
            <div className="text-purple-300">Demo centre reference</div>
            <div className="font-bold text-white font-mono">DEMO-GATC-001</div>
          </div>
        </div>
      </div>

      {/* Main GATC Requests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm font-heading">Assigned Laboratory Test Requests</h3>
          <p className="text-xs text-slate-500">Record proposed test-centre results in this demo workspace.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">App No & Instrument</th>
                <th className="px-6 py-3.5">Owner / Trader</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Demo transaction</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gatcApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No active lab test requests assigned to this GATC facility.
                  </td>
                </tr>
              ) : (
                gatcApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {app.applicationNo}
                      </span>
                      <div className="font-semibold text-slate-900 mt-1">{app.instrumentTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono">S/N: {app.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{app.ownerName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{app.category}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{app.feeAmount} (DEMO)</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Enter Lab Test Result</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Result Entry Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border max-w-lg w-full animate-in zoom-in-95 space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-heading">GATC Laboratory Test Entry</h3>
            <p className="text-xs text-slate-500">
              Submit lab test report for instrument <strong>{selectedApp.instrumentTitle}</strong> ({selectedApp.serialNumber}).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Laboratory Test Observations & Readings</label>
                <textarea
                  rows={4}
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl text-center text-xs text-slate-600">
                <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <span className="font-semibold">Attach demo test record</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLabSubmit(selectedApp.id)}
                className="px-5 py-2 bg-purple-600 text-white font-semibold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit prototype result</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
