import React from 'react';
import type { PublicPageTab } from '../types';

interface PublicInfoPagesProps {
  activeTab: PublicPageTab;
}

/** Compatibility component for integrations that previously rendered isolated public tabs. */
export const PublicInfoPages: React.FC<PublicInfoPagesProps> = ({ activeTab }) => (
  <section className="border border-slate-200 bg-white p-6 text-[#17324D] shadow-sm">
    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1558A6]">AccuMate prototype</div>
    <h2 className="mt-2 text-xl font-bold">Public information</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">The connected AccuMate public portal provides the {activeTab.replaceAll('-', ' ')} content, official-source links, and prototype disclaimers.</p>
  </section>
);
