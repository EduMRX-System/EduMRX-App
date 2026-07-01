"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/useUIStore";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

// Excalidraw canvas/DOM API'larga tayansin — faqat brauzerda, SSR'siz yuklanadi.
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    ),
  },
);

// Backend'da doska sahnasini saqlash endpointi hali yo'q — hozircha
// localStorage'da vaqtinchalik saqlanadi (faqat shu brauzerda ko'rinadi).
// TODO: backend endpoint tayyor bo'lgach (masalan PATCH director/board/)
// shu ikkita funksiyani (loadScene/saveScene) o'sha so'rovga almashtirish kifoya —
// Excalidraw props (initialData/onChange) o'zgarishsiz qoladi.
const STORAGE_KEY = "edumrx-director-board-scene";
const SAVE_DEBOUNCE_MS = 800;
// Excalidraw shu vaqt ichida ochilmasa (masalan eski/qolib ketgan Service
// Worker cache'i chalg'itgan chunk qaytarsa) — "qotib qolish" o'rniga
// foydalanuvchiga qayta urinish imkonini beramiz.
const READY_TIMEOUT_MS = 10000;

function loadScene(): ExcalidrawInitialDataState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Faqat elements/files saqlanadi — appState'ni ataylab saqlamaymiz: u
    // ichida `collaborators` kabi runtime-only Map maydonlar bor, JSON
    // round-trip'dan keyin oddiy obyektga aylanib, Excalidraw'ni buzadi.
    // Scroll/zoom kabi appState qiymatlari qayta ochilganda standart
    // holatga qaytadi — bu qabul qilinadi.
    //
    // Saqlangan format eskirgan/buzilgan bo'lishi mumkin (masalan
    // `elements` massiv emas) — bunday holatda `null` qaytarib, Excalidraw
    // bo'sh sahna bilan ochiladi, "qotib qolish" o'rniga.
    if (!parsed || !Array.isArray(parsed.elements)) return null;
    // Saqlangan massiv ichida null/undefined yoki id'siz element bo'lishi
    // mumkin (buzilgan yozuv) — Excalidraw'ning ichki addMissingFiles
    // funksiyasi har bir elementdan `.id` o'qiydi va null bo'lsa xato beradi.
    const elements = parsed.elements.filter(
      (el: unknown): el is OrderedExcalidrawElement =>
        !!el && typeof el === "object" && "id" in el,
    );
    if (elements.length === 0) return null;
    return {
      elements,
      files: parsed.files && typeof parsed.files === "object" ? parsed.files : {},
    };
  } catch {
    return null;
  }
}

function saveScene(elements: readonly OrderedExcalidrawElement[], files: BinaryFiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements, files }));
  } catch {
    // localStorage to'lgan yoki mavjud emas — jim o'tkazamiz, doska ishlashda davom etadi
  }
}

interface Props {
  /** Fullscreen holatida burchak/border ko'rinishi olib tashlanadi. */
  rounded?: boolean;
}

export default function ExcalidrawBoard({ rounded = true }: Props) {
  const { t } = useTranslation();
  const theme = useUIStore((s) => s.theme);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // "qotib qolish" holatidan chiqish uchun: Excalidraw haqiqatan tayyor
  // bo'lganda excalidrawAPI callback chaqiriladi va readyRef true bo'ladi.
  // Agar belgilangan vaqt ichida chaqirilmasa — foydalanuvchiga qayta
  // urinish tugmasi ko'rsatamiz.
  const readyRef = useRef(false);
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    readyRef.current = false;
    setTimedOut(false);
    const id = setTimeout(() => {
      if (!readyRef.current) setTimedOut(true);
    }, READY_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [retryKey]);

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], _appState: AppState, files: BinaryFiles) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveScene(elements, files), SAVE_DEBOUNCE_MS);
    },
    [],
  );

  if (timedOut) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center gap-3 border border-border bg-surface ${rounded ? "rounded-2xl" : ""}`}>
        <p className="text-sm text-foreground-muted">{t("director.board.load_error")}</p>
        <button
          type="button"
          onClick={() => setRetryKey((k) => k + 1)}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold cursor-pointer transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          {t("director.board.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-hidden border border-border ${rounded ? "rounded-2xl" : ""}`}>
      <Excalidraw
        key={retryKey}
        initialData={loadScene}
        onChange={handleChange}
        excalidrawAPI={() => { readyRef.current = true; }}
        theme={theme}
        langCode="ru-RU"
      />
    </div>
  );
}
