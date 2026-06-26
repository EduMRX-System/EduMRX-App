"use client";

import { LogoIcons } from "@/constants/icons";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Role → subdomen yorlig'i (host'dagi 1-bo'lak shunga almashtiriladi)
const ROLE_SUBDOMAIN: Record<string, string> = {
    director: "director",
    admin: "manager",
    manager: "manager",
    teacher: "teacher",
    student: "student",
    parent: "parent",
};

function panelUrlForRole(role: string): string | null {
    const sub = ROLE_SUBDOMAIN[role];
    if (!sub || typeof window === "undefined") return null;
    const { protocol, host } = window.location; 
    const parts = host.split(".");
    if (parts.length < 2) return null; // subdomen yo'q — aniqlab bo'lmaydi
    parts[0] = sub; // 1-bo'lak (subdomen) ni role subdomeniga almashtiramiz
    return `${protocol}//${parts.join(".")}`;
}

// Joriy subdomen role'ga mos keladimi (allaqachon to'g'ri paneldamizmi)
function isOnRolePanel(role: string): boolean {
    const sub = ROLE_SUBDOMAIN[role];
    if (!sub || typeof window === "undefined") return false;
    return window.location.host.split(".")[0] === sub;
}

interface Props {
    children: React.ReactNode;
    // Shu panelga ruxsat etilgan role(lar). Director paneli uchun: "director"
    allowedRoles?: string | string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const initAuth = useAuthStore((state) => state.initAuth);
    const user = useAuthStore((state) => state.user);
    const role = user?.role;

    const [redirecting, setRedirecting] = useState(false);

    const allowed = useMemo(
        () => (allowedRoles ? (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]) : null),
        [allowedRoles]
    );

    // bu panelga mos kelmaydigan role
    const isWrongPanel = !!(allowed && role && !allowed.includes(role));

    useEffect(() => {
        initAuth();
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        // 1) Umuman kirmagan
        if (!isAuthenticated) {
            toast.warn("Siz tizimga kirmagansiz yoki seans muddati tugagan!");
            router.push("/login");
            return;
        }

        // 2) Kirgan, lekin boshqa panelга tegishli → o'z paneliga yuboramiz
        if (isWrongPanel && role) {
            const home = panelUrlForRole(role);
            if (home && !isOnRolePanel(role)) {
                setRedirecting(true);
                toast.info("Siz o'z panelingizga yo'naltirilmoqdasiz...");
                window.location.href = home; // cross-subdomain → to'liq redirect
            } else {
                // panel topilmasa, xavfsizlik uchun login'ga
                router.push("/login");
            }
        }
    }, [isInitialized, isAuthenticated, isWrongPanel, role, router]);

    const messages = [
        "Xavfsiz ulanish o'rnatilmoqda",
        "Shaxsingiz tasdiqlanmoqda",
        "Ish maydoni tayyorlanmoqda",
    ];
    const [msgIndex, setMsgIndex] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setMsgIndex((i) => (i + 1) % messages.length);
        }, 1500);
        return () => clearInterval(id);
    }, []);

    // Yuklash / tekshirish / redirect davomida — loader ko'rsatamiz (kontent "miltillamasligi" uchun)
    if (!isInitialized || redirecting || isWrongPanel) {
        return (
            <div className="relative flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] blur-3xl rounded-full" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.5] dark:opacity-[0.18]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgb(99 102 241 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(99 102 241 / 0.07) 1px, transparent 1px)",
                        backgroundSize: "46px 46px",
                        maskImage: "radial-gradient(ellipse 46% 46% at 50% 50%, black, transparent)",
                    }}
                />

                <div className="relative z-10 flex flex-col items-center">
                    {/* ───────── ANIMATED SECURITY CORE ───────── */}
                    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                        <svg viewBox="0 0 180 180" className="absolute inset-0 w-full h-full">
                            <defs>
                                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                                <linearGradient id="scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#6366f1" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                </linearGradient>
                                <radialGradient id="core-glow">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Core glow */}
                            <circle cx="90" cy="90" r="60" fill="url(#core-glow)">
                                <animate attributeName="r" values="50;64;50" dur="2.4s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
                            </circle>

                            {/* Outer dashed ring — clockwise */}
                            <circle
                                cx="90" cy="90" r="78"
                                fill="none" stroke="url(#ring-grad)" strokeWidth="1.5"
                                strokeDasharray="3 9" strokeLinecap="round" opacity="0.55"
                                style={{ transformOrigin: "90px 90px", animation: "spin-cw 9s linear infinite" }}
                            />

                            {/* Middle ring — counter-clockwise, segmented arcs */}
                            <g style={{ transformOrigin: "90px 90px", animation: "spin-ccw 6s linear infinite" }}>
                                <circle
                                    cx="90" cy="90" r="64"
                                    fill="none" stroke="url(#ring-grad)" strokeWidth="2.5"
                                    strokeDasharray="50 250" strokeLinecap="round"
                                />
                                <circle
                                    cx="90" cy="90" r="64"
                                    fill="none" stroke="url(#ring-grad)" strokeWidth="2.5"
                                    strokeDasharray="28 250" strokeDashoffset="-150" strokeLinecap="round" opacity="0.6"
                                />
                            </g>

                            {/* Inner ring — clockwise faster */}
                            <circle
                                cx="90" cy="90" r="50"
                                fill="none" stroke="#6366f1" strokeWidth="1.5"
                                strokeDasharray="2 6" opacity="0.4"
                                style={{ transformOrigin: "90px 90px", animation: "spin-cw 4s linear infinite" }}
                            />

                            {/* Orbiting nodes */}
                            <g style={{ transformOrigin: "90px 90px", animation: "spin-cw 5s linear infinite" }}>
                                <circle cx="90" cy="12" r="3" fill="#8b5cf6">
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            </g>
                            <g style={{ transformOrigin: "90px 90px", animation: "spin-ccw 7s linear infinite" }}>
                                <circle cx="90" cy="26" r="2.5" fill="#6366f1">
                                    <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        </svg>

                        {/* Center shield badge */}
                        <div className="relative w-[68px] h-[68px]">
                            {/* Pulse rings behind badge */}
                            <span className="absolute inset-0 rounded-[20px] bg-indigo-500/25 animate-ping" style={{ animationDuration: "2s" }} />

                            {/* Badge with scan effect */}
                            <div className="relative w-[68px] h-[68px] rounded-[20px] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-xl shadow-indigo-500/40 overflow-hidden">
                                <Image src={LogoIcons.icon192} alt="EduMRX - mini logo" />

                                {/* Scan line sweeping across badge */}
                                <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" style={{ animation: "scan 2s ease-in-out infinite" }} />
                            </div>

                            {/* Check seal — appears with pop */}
                            <div
                                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center shadow-lg"
                                style={{ animation: "seal-pop 2.6s ease-in-out infinite" }}
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5">
                                        <animate attributeName="stroke-dasharray" values="0 24;24 24" dur="0.6s" begin="0.4s" fill="freeze" />
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Brand name */}
                    <p className="mt-8 text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        EduMRX
                    </p>

                    {/* Rotating message with fade */}
                    <div className="mt-2 h-5 overflow-hidden relative">
                        <p
                            key={msgIndex}
                            className="text-[13px] font-medium text-slate-500 dark:text-slate-400 text-center"
                            style={{ animation: "msg-in 0.4s ease-out" }}
                        >
                            {redirecting ? "Panelingizga yo'naltirilmoqda" : messages[msgIndex]}
                        </p>
                    </div>

                    {/* Segmented progress dots */}
                    <div className="mt-5 flex items-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === msgIndex
                                    ? "w-7 bg-gradient-to-r from-indigo-500 to-violet-500"
                                    : "w-1.5 bg-slate-200 dark:bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}