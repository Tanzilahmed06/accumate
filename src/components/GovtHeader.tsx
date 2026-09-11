import React, { useState } from 'react';
import {
  Shield,
  Search,
  Globe,
  QrCode,
  LogIn,
  LogOut,
  Bell,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import type { UserRole, User, PublicPageTab } from '../types';
import { StorageService } from '../services/storageService';

interface GovtHeaderProps {
  isAuthenticated: boolean;
  currentUser: User;
  currentRole: UserRole;
  activePublicTab: PublicPageTab;
  fontSize: 'sm' | 'md' | 'lg';
  language: 'EN' | 'HI';
  highContrast: boolean;
  expiryCount: number;
  onSelectPublicTab: (tab: PublicPageTab) => void;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenVerify: () => void;
  onOpenExpiryAlerts: () => void;
  onToggleFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onToggleLanguage: (lang: 'EN' | 'HI') => void;
  onToggleHighContrast: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const GovtHeader: React.FC<GovtHeaderProps> = ({
  isAuthenticated,
  currentUser,
  currentRole,
  activePublicTab,
  fontSize,
  language,
  highContrast,
  expiryCount,
  onSelectPublicTab,
  onRoleChange,
  onOpenSearch,
  onOpenVerify,
  onOpenExpiryAlerts,
  onToggleFontSize,
  onToggleLanguage,
  onToggleHighContrast,
  onLoginClick,
  onLogoutClick,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const roleBadges: Record<UserRole, { badge: string; color: string }> = {
    trader: { badge: 'TRADER PORTAL', color: 'bg-emerald-800 text-emerald-100 border-emerald-700' },
    officer: { badge: 'LMO FIELD PORTAL', color: 'bg-blue-800 text-blue-100 border-blue-700' },
    gatc: { badge: 'GATC LAB PORTAL', color: 'bg-purple-800 text-purple-100 border-purple-700' },
    admin: { badge: 'ADMINISTRATOR', color: 'bg-amber-800 text-amber-100 border-amber-700' },
    public: { badge: 'PUBLIC VERIFIER', color: 'bg-slate-700 text-slate-200 border-slate-600' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* 1. TOP GOVERNMENT UTILITY STRIP */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] text-slate-300 flex flex-wrap items-center justify-between border-b border-slate-800/80">
        {/* Left: Govt Emblem & Department Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:p-1 focus:bg-amber-500 focus:text-slate-950">
            Skip to main content
          </a>

          <div className="flex items-center gap-1.5 font-bold tracking-wide text-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>GOVERNMENT OF INDIA</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-300">
            Ministry of Consumer Affairs, Food & Public Distribution • Department of Legal Metrology
          </span>
        </div>

        {/* Right: Accessibility Controls, Language, Demo Indicator */}
        <div className="flex items-center gap-3">
          {/* DEMO ENVIRONMENT TAG */}
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
            DEMO ENVIRONMENT
          </span>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Accessibility Font Size Switcher */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <span className="text-slate-500">Text:</span>
            <button
              onClick={() => onToggleFontSize('sm')}
              className={`px-1 py-0.5 rounded cursor-pointer ${fontSize === 'sm' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-white'}`}
              title="Small Font"
            >
              A-
            </button>
            <button
              onClick={() => onToggleFontSize('md')}
              className={`px-1 py-0.5 rounded cursor-pointer ${fontSize === 'md' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-white'}`}
              title="Standard Font"
            >
              A
            </button>
            <button
              onClick={() => onToggleFontSize('lg')}
              className={`px-1 py-0.5 rounded cursor-pointer ${fontSize === 'lg' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-white'}`}
              title="Large Font"
            >
              A+
            </button>
          </div>

          <button
            onClick={onToggleHighContrast}
            className={`hidden sm:flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              highContrast ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle high contrast"
            aria-pressed={highContrast}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Contrast</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Language Switcher */}
          <button
            onClick={() => onToggleLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{language === 'EN' ? 'English' : 'हिंदी (Hindi)'}</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Reset Demo Data */}
          <button
            onClick={() => StorageService.resetAllData()}
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            title="Reset Mock Data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRANDING BAR */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 border-b border-slate-800/60 bg-slate-900">
        {/* Brand Logo & Government Emblem representation */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-white tracking-tight">
                e-Metro
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 tracking-wider uppercase">
                Legal Metrology
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Digital Verification & Certification Infrastructure
            </p>
          </div>
        </div>

        {/* Global Search Button */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <button
            onClick={onOpenSearch}
            className="w-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-md border border-slate-700/80 text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search App ID, Cert No, Serial Number...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
              /
            </kbd>
          </button>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Public Certificate Verification Button */}
          <button
            onClick={onOpenVerify}
            className="hidden sm:flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer border border-amber-500"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verify Certificate</span>
          </button>

          {/* Expiry Bell */}
          <button
            onClick={onOpenExpiryAlerts}
            className="relative p-1.5 rounded-md text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Certificate Expiry Reminders"
          >
            <Bell className="w-4 h-4" />
            {expiryCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {expiryCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold cursor-pointer ${roleBadges[currentRole].color}`}
              >
                <span>{roleBadges[currentRole].badge}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-md shadow-xl py-1 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800">
                    Switch Authorized Role
                  </div>
                  {(['trader', 'officer', 'gatc', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                        currentRole === role ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{role.toUpperCase()} PORTAL</div>
                        <div className="text-[10px] text-slate-400">
                          {role === 'trader' && 'trader@demo.com'}
                          {role === 'officer' && 'officer@demo.com'}
                          {role === 'gatc' && 'gatc@demo.com'}
                          {role === 'admin' && 'admin@demo.com'}
                        </div>
                      </div>
                      {currentRole === role && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-md object-cover border border-slate-700"
                />
                <div className="text-left hidden xl:block">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{currentUser.designation || currentUser.role}</div>
                </div>
              </button>

              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-md shadow-xl py-1.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onLogoutClick();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer border border-blue-600"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. PUBLIC WEBSITE MAIN NAVIGATION MENU */}
      <nav className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar text-xs">
        <PublicNavButton id="home" label="Home" active={activePublicTab === 'home'} onClick={() => onSelectPublicTab('home')} />
        <PublicNavButton id="about" label="About e-Metro" active={activePublicTab === 'about'} onClick={() => onSelectPublicTab('about')} />
        <PublicNavButton id="services" label="Legal Metrology Services" active={activePublicTab === 'services'} onClick={() => onSelectPublicTab('services')} />
        <PublicNavButton id="verification" label="Public Certificate Verification" active={activePublicTab === 'verification'} onClick={() => onSelectPublicTab('verification')} />
        <PublicNavButton id="track" label="Track Application" active={activePublicTab === 'track'} onClick={() => onSelectPublicTab('track')} />
        <PublicNavButton id="gatc" label="Approved Test Centres (GATC)" active={activePublicTab === 'gatc'} onClick={() => onSelectPublicTab('gatc')} />
        <PublicNavButton id="help" label="Help / FAQs" active={activePublicTab === 'help'} onClick={() => onSelectPublicTab('help')} />
        <PublicNavButton id="contact" label="Contact & Offices" active={activePublicTab === 'contact'} onClick={() => onSelectPublicTab('contact')} />
      </nav>
    </header>
  );
};

const PublicNavButton: React.FC<{ id: string; label: string; active: boolean; onClick: () => void }> = ({
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
      active
        ? 'bg-amber-600 text-white font-bold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
    }`}
  >
    {label}
  </button>
);
