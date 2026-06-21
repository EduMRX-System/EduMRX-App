"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export default function ThemeInitializer() {
    const theme = useUIStore((state) => state.theme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return null;
}
