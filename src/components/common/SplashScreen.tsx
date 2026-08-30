import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1200
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, durationMs - 300);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Luxury Ambient Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-rose-600/15 blur-[120px] -top-10 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-pink-600/10 blur-[100px] -bottom-10" />

      {/* Main Center Logo & Identity */}
      <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm">
        {/* Shimmering Rose Gold Icon Crest */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 blur-xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-[1.5px] shadow-2xl border border-rose-500/40 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#13131a] to-[#0a0a0f] flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-rose-300 via-pink-200 to-rose-400 bg-clip-text text-transparent font-display">
                KA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-rose-400/80 font-bold mt-0.5">
                CRM
              </span>
            </div>
          </div>
        </div>

        {/* Brand Names */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-rose-400" />
            Aplicativo Oficial
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            CRM KELY ALVES
          </h1>

          <p className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
            SurgiLar
          </p>

          <p className="text-xs text-zinc-400 font-normal pt-1">
            Gestão Inteligente & Relacionamento Premium
          </p>
        </div>

        {/* Loading Spinner / Progress */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="w-28 h-1 rounded-full bg-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
            Iniciando sistema...
          </span>
        </div>
      </div>
    </div>
  );
};
