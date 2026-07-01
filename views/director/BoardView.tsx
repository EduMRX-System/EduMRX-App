"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Presentation, Maximize, Minimize } from "lucide-react";
import ExcalidrawBoard from "@/components/sections/directorPanelSections/board/ExcalidrawBoard";

export default function BoardView() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-170px)] min-h-[560px]">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <Presentation className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">{t("director.nav.board")}</h1>
      </div>

      <div ref={containerRef} className="relative flex-1 min-h-0 bg-surface">
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? t("director.board.fullscreen_exit") : t("director.board.fullscreen_enter")}
          aria-label={isFullscreen ? t("director.board.fullscreen_exit") : t("director.board.fullscreen_enter")}
          className="absolute top-16 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-foreground-muted hover:text-primary hover:bg-hover shadow-sm cursor-pointer transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <ExcalidrawBoard rounded={!isFullscreen} />
      </div>
    </div>
  );
}
