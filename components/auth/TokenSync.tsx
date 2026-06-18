"use client";

import { useEffect } from "react";

export default function TokenSync() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const at = params.get("at");
        const rt = params.get("rt");

        if (at) {
            const maxAge = 7 * 24 * 60 * 60;
            document.cookie = `access_token=${at}; path=/; max-age=${maxAge}; samesite=lax`;
            if (rt) document.cookie = `refresh_token=${rt}; path=/; max-age=${maxAge}; samesite=lax`;

            // URL'ni tozalab, reload qil — endi cookie bor, middleware to'g'ri ishlaydi
            window.location.replace(window.location.pathname);
        }
    }, []);

    return null;
}