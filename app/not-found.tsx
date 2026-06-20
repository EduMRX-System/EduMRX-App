"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center p-6 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <div className="max-w-md w-full text-center space-y-8">

                <div className="relative flex justify-center items-center h-44">
                    {/* Orqa fondagi xiralik (Blur) */}
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full max-w-xs mx-auto h-40 -z-10 transition-colors duration-300" />

                    <div className="text-9xl font-black text-indigo-600 dark:text-indigo-500 tracking-tight select-none flex items-center justify-center gap-2">
                        <span>4</span>

                        {/* O'rtadagi 0 o'rniga turuvchi ikonkali aylana */}
                        <div className="flex items-center justify-center px-2">
                            <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105 duration-300">
                                <HelpCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                            </div>
                        </div>

                        <span>4</span>
                    </div>
                </div>

                {/* Matn qismi */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Sahifa topilmadi
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                        Kechirasiz, siz qidirayotgan sahifa mavjud emas, o'chirilgan yoki manzili o'zgartirilgan bo'lishi mumkin.
                    </p>
                </div>

                {/* Tugmalar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>Orqaga qaytish</span>
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#4F46E5] dark:bg-indigo-600 hover:bg-[#4338CA] dark:hover:bg-indigo-700 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                        <Home className="w-4 h-4" />
                        <span>Bosh sahifa</span>
                    </Link>
                </div>

                {/* Footer qismi */}
                <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                        eduMRX boshqaruv tizimi
                    </p>
                </div>

            </div>
        </div>
    );
}