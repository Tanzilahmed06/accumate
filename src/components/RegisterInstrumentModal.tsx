import React, { useState } from 'react';
import { X, Upload, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import type { InstrumentCategory } from '../types';
import { StorageService } from '../services/storageService';
import { JUDGE_DEMO_INSTRUMENT } from '../services/mockData';

interface RegisterInstrumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterInstrumentModal: React.FC<RegisterInstrumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isJudgeDemo = StorageService.isDemoMode();
  const [title, setTitle] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.title : '');
  const [category, setCategory] = useState<InstrumentCategory>(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.category : 'Weighing Scale');
  const [manufacturer, setManufacturer] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.manufacturer : '');
  const [modelNumber, setModelNumber] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.modelNumber : '');
  const [serialNumber, setSerialNumber] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.serialNumber : '');
  const [capacity, setCapacity] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.capacity : '');
  const [accuracyClass, setAccuracyClass] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.accuracyClass || 'Class III' : 'Class III');
  const [locationAddress, setLocationAddress] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.locationAddress : '');
  const [city, setCity] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.city : '');
  const [state, setState] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.state : '');
  const [purchaseDate, setPurchaseDate] = useState(isJudgeDemo ? JUDGE_DEMO_INSTRUMENT.purchaseDate : '');
  const [invoiceUploaded, setInvoiceUploaded] = useState(isJudgeDemo);
  const [photoUploaded, setPhotoUploaded] = useState(isJudgeDemo);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !serialNumber || !manufacturer || !capacity || !locationAddress) {
      setError('Please fill in all mandatory instrument fields.');
      return;
    }

    StorageService.saveInstrument({
      title,
      category,
      manufacturer,
      modelNumber: modelNumber || 'Not specified',
      serialNumber,
      capacity,
      accuracyClass,
      locationAddress,
      city,
      state,
      purchaseDate,
      status: 'REGISTERED',
      photoUrl: photoUploaded ? 'instrument_photo_attached' : undefined,
      invoiceUrl: invoiceUploaded ? 'purchase_invoice_attached' : undefined,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-heading">{isJudgeDemo ? 'Add Pre-filled Demo Instrument' : 'Register Weighing / Measuring Instrument'}</h3>
              <p className="text-xs text-slate-400">{isJudgeDemo ? 'DEMO / PROTOTYPE DATA is pre-filled for the judge presentation.' : 'Add the equipment details you want to manage in AccuMate.'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Instrument Basic Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Technical Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Instrument Title / Name *</label>
                <input
                  type="text"
                  placeholder="Enter an instrument name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Instrument Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InstrumentCategory)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Weighing Scale">Weighing Scale</option>
                  <option value="Weighbridge">Weighbridge</option>
                  <option value="Fuel Dispenser">Fuel Dispenser</option>
                  <option value="Electricity Meter">Electricity Meter</option>
                  <option value="Water Meter">Water Meter</option>
                  <option value="Measuring Equipment">Measuring Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Serial Number *</label>
                <input
                  type="text"
                  placeholder="Enter serial number"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Manufacturer *</label>
                <input
                  type="text"
                  placeholder="Enter manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Model Number</label>
                <input
                  type="text"
                  placeholder="Enter model number"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Maximum Capacity *</label>
                <input
                  type="text"
                  placeholder="Enter capacity or range"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Accuracy Class / Grade</label>
                <select
                  value={accuracyClass}
                  onChange={(e) => setAccuracyClass(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Class I (Special Accuracy)">Class I (Special Accuracy - Lab)</option>
                  <option value="Class II (High Accuracy)">Class II (High Accuracy - Jewelry/Gold)</option>
                  <option value="Class III (Medium Accuracy)">Class III (Medium Accuracy - Commercial)</option>
                  <option value="Class IV (Ordinary Accuracy)">Class IV (Ordinary Accuracy - Bulk)</option>
                  <option value="Class 0.5 (Liquid Dispenser)">Class 0.5 (Liquid Fuel Dispenser)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Purchase info */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Installation Site & Purchase Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Physical Installation Address *</label>
                <input
                  type="text"
                  placeholder="Enter installation address"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">State / UT</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Simulation */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Verification Evidence & Photos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Upload */}
              <div
                onClick={() => setPhotoUploaded(!photoUploaded)}
                className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                  photoUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Upload className={`w-6 h-6 mx-auto mb-1 ${photoUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="text-xs font-semibold text-slate-800">
                  {photoUploaded ? 'Instrument Photo Attached ✓' : 'Upload Instrument Photo'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 10MB</div>
              </div>

              {/* Invoice Upload */}
              <div
                onClick={() => setInvoiceUploaded(!invoiceUploaded)}
                className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                  invoiceUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Upload className={`w-6 h-6 mx-auto mb-1 ${invoiceUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="text-xs font-semibold text-slate-800">
                  {invoiceUploaded ? 'Purchase Invoice Attached ✓' : 'Upload Purchase Invoice / Bill'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">PDF or Scanned Document</div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              <span>{isJudgeDemo ? 'Add Demo Instrument' : 'Register Instrument'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
