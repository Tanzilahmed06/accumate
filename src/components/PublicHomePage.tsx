import React from 'react';
import { PublicPortal } from './PublicPortal';

interface PublicHomePageProps {
  onApplyClick: () => void;
  onTrackClick: () => void;
  onVerifyClick: () => void;
  onGATCClick: () => void;
  onHelpClick: () => void;
  onLoginClick?: () => void;
}

/**
 * Kept as a compatibility surface for existing integrations. PublicPortal now
 * supplies the connected public AccuMate experience and its legal-source policy.
 */
export const PublicHomePage: React.FC<PublicHomePageProps> = ({ onApplyClick, onVerifyClick, onLoginClick }) => (
  <PublicPortal onLogin={onLoginClick || onApplyClick} onOpenVerify={onVerifyClick} />
);
