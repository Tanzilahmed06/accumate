import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  QrCode,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import type { UserRole, User } from '../types';
import { StorageService } from '../services/storageService';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenVerify: () => void;
  onOpenExpiryAlerts: () => void;
  onLogout: () => void;
  expiryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenSearch,
  onOpenVerify,
  onOpenExpiryAlerts,
  onLogout,
  expiryCount,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    trader: { label: 'Trader / Instrument Owner', badge: 'TRADER', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    officer: { label: 'Legal Metrology Officer (LMO)', badge: 'LMO OFFICER', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    gatc: { label: 'Government Approved Test Centre', badge: 'GATC LAB', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    admin: { label: 'Admin / Department Authority', badge: 'ADMIN', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    public: { label: 'Public Verifier', badge: 'PUBLIC', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      {/* Top Govt Bar */}
      <div className="bg-slate-950 px-4 py-1 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GOVERNMENT OF INDIA
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Department of Legal Metrology, Ministry of Consumer Affairs</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenVerify}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Public Certificate Verification</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => StorageService.resetAllData()}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Mock Data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                e-Metro
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                LEGAL METROLOGY
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Digital Verification & Certification Infrastructure
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={onOpenSearch}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-lg border border-slate-700 text-sm flex items-center justify-between transition-all group cursor-pointer"
          >
            <span className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search Application ID, Instrument ID, Cert No...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-700 text-slate-300 rounded border border-slate-600">
              /
            </kbd>
          </button>
        </div>

        {/* Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 lg:hidden cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick QR Verify Button */}
          <button
            onClick={onOpenVerify}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify QR</span>
          </button>

          {/* Expiry Alerts Notification Bell */}
          <button
            onClick={onOpenExpiryAlerts}
            className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Certificate Expiry Reminders"
          >
            <Bell className="w-5 h-5" />
            {expiryCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {expiryCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                roleLabels[currentUser.role].color
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span className="font-semibold">{roleLabels[currentUser.role].badge}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800">
                  Switch Active Portal Role
                </div>
                {(['trader', 'officer', 'gatc', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                      currentUser.role === role ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{roleLabels[role].label}</div>
                      <div className="text-[10px] text-slate-400">
                        {role === 'trader' && 'trader@demo.com'}
                        {role === 'officer' && 'officer@demo.com'}
                        {role === 'gatc' && 'gatc@demo.com'}
                        {role === 'admin' && 'admin@demo.com'}
                      </div>
                    </div>
                    {currentUser.role === role && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Menu & Logout */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{currentUser.designation || currentUser.role}</div>
              </div>
            </button>

            {showProfileDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
