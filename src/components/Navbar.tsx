import type React from 'react';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/** Shared sticky shell used by the application's top navigation bars. */
export const Navbar: React.FC<NavbarProps> = ({ children, className = '', ...props }) => (
  <header
    className={`sticky top-0 z-50 border-b border-slate-200 bg-white text-[#17324D] shadow-sm ${className}`}
    {...props}
  >
    {children}
  </header>
);
