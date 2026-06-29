"use client";

import { useRef, useState, useEffect } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import type { AccentTheme } from "@/lib/cookies";

const SWATCHES: { id: AccentTheme; color: string; label: string }[] = [
  { id: "indigo", color: "#6260ff", label: "Indigo" },
  { id: "lime",   color: "#9fe870", label: "Lime"   },
  { id: "teal",   color: "#bdd9d7", label: "Teal"   },
  { id: "royal",  color: "#3447aa", label: "Royal"  },
  { id: "sun",    color: "#fcdb32", label: "Sun"     },
  { id: "mint",   color: "#34e0a1", label: "Mint"   },
];

export default function ThemePickerButton() {
  const { accentTheme, setAccentTheme } = useUIStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const currentColor = SWATCHES.find((s) => s.id === accentTheme)?.color ?? "#6260ff";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
          open ? "bg-hover text-foreground" : "text-foreground-muted hover:bg-hover hover:text-foreground"
        }`}
        title="Rang tanlash"
        aria-label="Rang tanlash"
      >
        {/* Colored circle representing current theme */}
        <span
          className="w-4 h-4 rounded-full border-2 border-white/60 shadow-sm ring-1 ring-black/10"
          style={{ backgroundColor: currentColor }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-2xl shadow-xl z-50 p-3"
          >
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider mb-2.5 px-0.5">
              Rang
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SWATCHES.map((s) => {
                const active = accentTheme === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setAccentTheme(s.id); setOpen(false); }}
                    className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer ${
                      active ? "bg-hover" : "hover:bg-hover"
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border-2 border-white/60 shadow-sm ring-1 ring-black/10"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[10px] font-semibold text-foreground-muted leading-none">
                      {s.label}
                    </span>
                    {active && (
                      <span
                        className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: s.color }}
                      >
                        <Check className="w-2 h-2 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
