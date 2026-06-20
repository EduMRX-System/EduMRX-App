"use client";

import { useRouter, usePathname } from "next/navigation";
import { Rocket, ArrowLeft, Sparkles, Hammer } from "lucide-react";

interface Props {
    description?: string;
}

export default function ComingSoon({ 
    description = "Ushbu bo'lim ustida qizg'in ish olib bormoqdamiz. Tez orada yangi imkoniyatlar foydalanishga topshiriladi!" 
}: Props) {
    const router = useRouter();
    const pathname = usePathname();

    // URL path'dan chiroyli sarlavha yasash (Masalan: /dashboard/reports -> Dashboard / Reports)
    const formatPath = (path: string) => {
        if (!path || path === "/") return "Asosiy";
        return path
            .split("/")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" / ");
    };

    const pageName = formatPath(pathname);

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[60vh] p-6 overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            
            {/* Orqa fondagi bezakli gradient xiraliklar (Kattalashtirilgan blur) */}
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto space-y-6">
                
                {/* Animatsiyali Ikonka qismi */}
                <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-50/80 dark:bg-slate-800/80 backdrop-blur-md border border-indigo-100 dark:border-slate-700 shadow-inner group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl animate-ping opacity-20" />
                    <Rocket className="w-10 h-10 text-indigo-600 dark:text-indigo-400 transform group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-500" />
                    <Sparkles className="absolute top-3 right-3 w-4 h-4 text-amber-400 animate-pulse" />
                </div>

                {/* Matn qismi */}
                <div className="space-y-2">
                    {/* Path manzilni ko'rsatish */}
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-[13px] font-medium text-slate-600 dark:text-slate-300">
                        <Hammer className="w-3.5 h-3.5" />
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">{pathname}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                            {pageName}
                        </span>{" "}
                        qurilmoqda...
                    </h2>
                    
                    <p className="text-[15px] md:text-base text-slate-500 dark:text-slate-400 leading-relaxed mt-4 max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Harakat tugmasi */}
                <div className="pt-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-[14px] transition-all focus:ring-4 focus:ring-slate-900/10 dark:focus:ring-white/10 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Orqaga qaytish
                    </button>
                </div>
            </div>
        </div>
    );
}