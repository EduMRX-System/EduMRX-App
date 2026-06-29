"use client";

import { useLayoutEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export default function PanelThemeInitializer() {
  const accentTheme = useUIStore((s) => s.accentTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", accentTheme);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [accentTheme]);

  return null;
}
