import type React from 'react';

interface BrandLogoProps {
  className?: string;
}

/** The supplied AccuMate mark, kept in one place for consistent navigation branding. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => (
  <img
    src="/assets/accumate-logo.jpeg"
    alt="AccuMate — Every Measure, Verified."
    className={`h-12 w-20 shrink-0 object-contain ${className}`}
  />
);
