import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  QrCode,
  LogOut,
  Copy,
  Building2,
} from 'lucide-react';
import type { UserRole, User } from '../types';
import { BrandLogo } from './BrandLogo';
import { Navbar } from './Navbar';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenVerify: () => void;
  onOpenExpiryAlerts: () => void;
  onLogout: () => void;
  expiryCount: number;
  merchantId?: string;
  onViewBusinessProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenSearch,
  onOpenVerify,
  onOpenExpiryAlerts,
  onLogout,
  expiryCount,
  merchantId,
  onViewBusinessProfile,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [merchantCopied, setMerchantCopied] = useState(false);

  const copyMerchantId = async () => {
    if (!merchantId) return;
    await navigator.clipboard?.writeText(merchantId);
    setMerchantCopied(true);
    window.setTimeout(() => setMerchantCopied(false), 1800);
  };

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    trader: { label: 'Trader / Instrument Owner', badge: 'TRADER', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    officer: { label: 'Legal Metrology Officer (LMO)', badge: 'LMO OFFICER', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    gatc: { label: 'Government Approved Test Centre', badge: 'GATC LAB', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    admin: { label: 'Admin / Department Authority', badge: 'ADMIN', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    public: { label: 'Public Verifier', badge: 'PUBLIC', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
  };

  return (
    <Navbar className="z-40">
      {/* Top Govt Bar */}
      <div className="bg-slate-100 px-4 py-1 text-xs text-slate-500 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACCUMATE PROTOTYPE WORKSPACE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Digital Legal Metrology Verification &amp; Certification Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenVerify}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Public Certificate Verification</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <BrandLogo />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#17324D] font-heading">
                AccuMate
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 tracking-wider">
                DEMO PLATFORM
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Digital Legal Metrology Verification &amp; Certification Platform
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={onOpenSearch}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-lg border border-slate-200 text-sm flex items-center justify-between transition-all group cursor-pointer"
          >
            <span className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search Application ID, Instrument ID, Cert No...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white text-slate-500 rounded border border-slate-200">
              /
            </kbd>
          </button>
        </div>

        {/* Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick QR Verify Button */}
          <button
            onClick={onOpenVerify}
            className="hidden sm:flex items-center gap-2 bg-[#1558A6] hover:bg-[#104986] text-white text-xs font-semibold px-3 py-2 shadow-sm transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify QR</span>
          </button>

          {merchantId && (
            <button onClick={copyMerchantId} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 xl:inline-flex" title="Copy Merchant ID">
              <span className="font-mono">{merchantId}</span>
              <Copy className="size-3.5" />
              <span className="sr-only">{merchantCopied ? 'Copied' : 'Copy Merchant ID'}</span>
            </button>
          )}

          {/* Expiry Alerts Notification Bell */}
          <button
            onClick={onOpenExpiryAlerts}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#17324D] transition-colors cursor-pointer"
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
              className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100">
                  Switch Active Portal Role
                </div>
                {(['trader', 'officer', 'gatc', 'admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentUser.role === role ? 'bg-[#EAF3FB] text-[#1558A6] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{roleLabels[role].label}</div>
                      <div className="text-[10px] text-slate-500">
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
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-[#17324D] leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{currentUser.designation || currentUser.role}</div>
              </div>
            </button>

            {showProfileDropdown && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowProfileDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-[#17324D]">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                </div>
                {merchantId && onViewBusinessProfile && (
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onViewBusinessProfile();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#1558A6] hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>View Business Profile</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};
