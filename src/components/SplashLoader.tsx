import React, { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SplashLoaderProps {
  onComplete: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reducedMotion.matches) return;

    const timer = window.setTimeout(onComplete, 0);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <main
      className="splash-screen animate-fade-in"
      aria-labelledby="splash-title"
    >
      <div className="splash-backdrop" aria-hidden="true" />
      <div className="splash-grid" aria-hidden="true" />

      <div className="splash-content">
        <h1 id="splash-title" className="sr-only">Welcome to AccuMate</h1>

        {hasError ? (
          <div className="splash-fallback" role="status">
            <div className="brand-mark brand-mark-large">
              <BrandLogo className="h-24 w-36 sm:h-28 sm:w-40" />
            </div>
            <div className="splash-status">
              <AlertCircle className="size-4 text-[#8ec5ff]" aria-hidden="true" />
              <span>The AccuMate welcome animation could not load.</span>
            </div>
            <button type="button" onClick={onComplete} className="splash-cta">
              Continue to AccuMate
            </button>
          </div>
        ) : (
          <div className="splash-visual-wrap">
            {!isReady && (
              <div className="splash-loading" role="status" aria-live="polite">
                <LoaderCircle className="size-7 animate-spin text-[#bfe7ff]" aria-hidden="true" />
                <span>Preparing AccuMate…</span>
              </div>
            )}

            <div className={`splash-visual ${isReady ? 'is-ready' : ''}`}>
              <div className="brand-orbit" aria-hidden="true" />
              <div className="brand-mark">
                <BrandLogo className="h-20 w-28 sm:h-24 sm:w-32" />
              </div>
              <video
                className="splash-video"
                autoPlay
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setIsReady(true)}
                onEnded={onComplete}
                onError={() => setHasError(true)}
                aria-label="AccuMate animated logo reveal"
              >
                <source src="/assets/accumate-reveal.mp4" type="video/mp4" />
                Your browser does not support the AccuMate welcome animation.
              </video>
            </div>

            <div className="splash-copy">
              <div className="splash-kicker">AccuMate</div>
              <h2>Every Measure, Verified.</h2>
              <p>Digital legal metrology workflows designed for trust, clarity, and speed.</p>
            </div>

            <div className="splash-progress" aria-hidden="true">
              <span className="progress-line" />
            </div>

            {isReady && (
              <button type="button" onClick={onComplete} className="splash-skip">
                Skip animation
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
