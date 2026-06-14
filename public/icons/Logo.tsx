"use client";

import React from "react";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

// Brand colors: #4F46E5 → #6366F1 → #06B6D4
export default function Logo({ variant = "full", className = "" }: LogoProps) {
  const Icon = (
    <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-grad)" />
      <path d="M32 22 L32 46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 22 Q22 18 15 21 L15 43 Q22 40 32 44 Z" fill="white" fillOpacity="0.9" />
      <path d="M32 22 Q42 18 49 21 L49 43 Q42 40 32 44 Z" fill="white" />
      <line x1="40" y1="34" x2="45" y2="29" stroke="#4F46E5" strokeWidth="1.4" />
      <line x1="40" y1="34" x2="44" y2="38" stroke="#06B6D4" strokeWidth="1.4" />
      <circle cx="40" cy="34" r="2.4" fill="#4F46E5" />
      <circle cx="45" cy="29" r="2.4" fill="#4F46E5" />
      <circle cx="44" cy="38" r="2.4" fill="#06B6D4" />
    </svg>
  );

  if (variant === "icon") {
    return <div className={className}>{Icon}</div>;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 shrink-0">{Icon}</div>
      <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
        Edu<span className="text-indigo-500 dark:text-indigo-400">MRM</span>
      </span>
    </div>
  );
}
