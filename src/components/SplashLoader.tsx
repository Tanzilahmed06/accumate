import React, { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SplashLoaderProps {
  onComplete: () => void;
}

/**
 * An accessible, one-time landing reveal. The dashboard is displayed when the
 * supplied video ends; users are never blocked if it is slow or unavailable.
 */
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
      className="animate-fade-in relative grid min-h-screen place-items-center overflow-hidden bg-white px-6 text-center text-[#17324D]"
      aria-labelledby="splash-title"
    >
      <div className="w-full max-w-md">
        <h1 id="splash-title" className="sr-only">Welcome to AccuMate</h1>

        {hasError ? (
          <div className="flex flex-col items-center gap-5">
            <BrandLogo className="h-32 w-52" />
            <div className="flex items-center gap-2 text-sm text-slate-600" role="status">
              <AlertCircle className="size-4 text-[#1558A6]" aria-hidden="true" />
              <span>The AccuMate welcome animation could not load.</span>
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="bg-[#1558A6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#104986] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1558A6] focus-visible:ring-offset-2"
            >
              Continue to AccuMate
            </button>
          </div>
        ) : (
          <div className="relative">
            {!isReady && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white" role="status" aria-live="polite">
                <LoaderCircle className="size-7 animate-spin text-[#1558A6]" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-600">Preparing AccuMate…</span>
              </div>
            )}
            <video
              className={`mx-auto w-full max-w-md object-contain transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
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
            {isReady && (
              <button
                type="button"
                onClick={onComplete}
                className="mt-4 text-sm font-semibold text-[#1558A6] underline-offset-4 transition hover:text-[#104986] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1558A6] focus-visible:ring-offset-2"
              >
                Skip animation
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
