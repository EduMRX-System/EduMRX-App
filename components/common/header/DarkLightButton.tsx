"use client";

import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function DarkLightButton() {
  const { theme, setTheme } = useUIStore();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-foreground-muted hover:bg-hover hover:text-foreground transition-colors cursor-pointer"
      title={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
      aria-label={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
    >
      {theme === "dark" ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
