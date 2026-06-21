"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import i18n from "@/i18n";

export default function LanguageInitializer() {
    const [hydrated, setHydrated] = useState(false);
    const language = useUIStore((state) => state.language);

    useEffect(() => {
        const unsub = useUIStore.persist.onFinishHydration(() => setHydrated(true));
        if (useUIStore.persist.hasHydrated()) setHydrated(true);
        return unsub;
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        i18n.changeLanguage(language);
        document.documentElement.lang = language;
    }, [language, hydrated]);

    return null;
}
