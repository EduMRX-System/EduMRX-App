"use client";

import React from "react";
import { formatUzPhone } from "@/utils/formatters";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = raw.slice(0, 9);
        const full = "998" + local;
        onChange(full);
    };

    return (
        <div>
            <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-3 pointer-events-none">
                    <span className="text-base">🇺🇿</span>
                    <span className="text-sm font-semibold text-foreground-muted">+998</span>
                </div>
                <input
                    type="tel"
                    value={formatUzPhone(value.slice(3))}
                    onChange={handlePhoneChange}
                    placeholder="90-123-45-67"
                    className={`w-full h-[44px] pl-[90px] pr-3 rounded-xl text-sm outline-none transition-all
            bg-surface
            text-foreground
            placeholder:text-foreground-subtle
            border ${error
                            ? "border-danger/50 focus:border-danger"
                            : "border-border focus:border-primary"
                        }`}
                />
            </div>
            {error && <p className="text-danger text-[11px] mt-1.5">{error}</p>}
        </div>
    );
};
