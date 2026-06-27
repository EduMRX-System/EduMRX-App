"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-layout flex items-center justify-center p-6 text-foreground transition-colors duration-300">
            <div className="max-w-md w-full text-center space-y-8">

                <div className="relative flex justify-center items-center h-44">
                    <div className="absolute inset-0 bg-primary/8 blur-3xl rounded-full max-w-xs mx-auto h-40 -z-10 transition-colors duration-300" />

                    <div className="text-9xl font-black text-primary tracking-tight select-none flex items-center justify-center gap-2">
                        <span>4</span>

                        <div className="flex items-center justify-center px-2">
                            <div className="w-24 h-24 rounded-full bg-surface border border-border shadow-md flex items-center justify-center transition-all hover:scale-105 duration-300">
                                <HelpCircle className="w-12 h-12 text-primary animate-bounce" />
                            </div>
                        </div>

                        <span>4</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                        Sahifa topilmadi
                    </h2>
                    <p className="text-sm text-foreground-muted max-w-sm mx-auto font-medium leading-relaxed">
                        Kechirasiz, siz qidirayotgan sahifa mavjud emas, o&apos;chirilgan yoki manzili o&apos;zgartirilgan bo&apos;lishi mumkin.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto px-6 py-2.5 bg-surface border border-border hover:border-border-subtle rounded-xl font-bold text-sm text-foreground-muted flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                        <ArrowLeft className="w-4 h-4 text-foreground-subtle" />
                        <span>Orqaga qaytish</span>
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover rounded-xl font-bold text-sm text-primary-fg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                        <Home className="w-4 h-4" />
                        <span>Bosh sahifa</span>
                    </Link>
                </div>

                <div className="pt-8 border-t border-border/60">
                    <p className="text-xs text-foreground-subtle font-semibold tracking-wider uppercase">
                        eduMRX boshqaruv tizimi
                    </p>
                </div>

            </div>
        </div>
    );
}
