import React from 'react';

export function OwlHeroSvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-bob shrink-0 drop-shadow-[0_10px_18px_rgba(167,139,250,0.35)]`}
      viewBox="0 0 140 140"
      role="img"
      aria-label="Maskot burung hantu Owi"
    >
      <ellipse cx="70" cy="76" rx="48" ry="49" fill="#BCA8F4" />
      <path d="M28 43 19 12 51 29M112 43l9-31-32 18" fill="#9C83E8" />
      <ellipse cx="52" cy="65" rx="21" ry="23" fill="#FFFFFF" />
      <ellipse cx="88" cy="65" rx="21" ry="23" fill="#FFFFFF" />
      <circle cx="55" cy="67" r="9" fill="#4B3F6B" />
      <circle cx="85" cy="67" r="9" fill="#4B3F6B" />
      <circle cx="58" cy="63" r="3" fill="#FFFFFF" />
      <circle cx="88" cy="63" r="3" fill="#FFFFFF" />
      <path d="m64 83 6 8 7-8" fill="#FFB86B" />
      <ellipse cx="70" cy="112" rx="24" ry="12" fill="#F5D9A8" />
      <path d="M44 118 34 130M96 118l10 12" stroke="#E9A75C" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function TitleLockupSvg() {
  return (
    <svg
      viewBox="0 0 540 86"
      className="w-full max-w-[460px] mx-auto h-auto"
      role="heading"
      aria-level={1}
      aria-label="Susun Gagasanku!"
    >
      <defs>
        <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="52%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <text
        x="270"
        y="58"
        textAnchor="middle"
        fill="url(#titleGrad)"
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 800,
          fontSize: '54px',
          letterSpacing: '-0.02em',
        }}
      >
        Susun Gagasanku!
      </text>
    </svg>
  );
}

export function OwlSpeechRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#EDE6FF] to-[#DFF3FF] grid place-items-center shrink-0 shadow-sm border border-[#E6DEF8]"
        aria-hidden="true"
      >
        <OwlHeroSvg className="w-10 h-10" />
      </div>
      <div className="flex-1 bg-[#F9F6FF] border border-[#E6DEF8] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed text-[#4B3F6B]">
        {children}
      </div>
    </div>
  );
}
