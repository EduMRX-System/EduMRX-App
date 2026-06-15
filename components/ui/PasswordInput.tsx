// PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    register: any;
    error?: string;
}

export const PasswordInput = ({ register, error }: PasswordInputProps) => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <div className="relative flex items-center">
                <input
                    {...register}
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full h-[44px] px-3 pr-10 rounded-xl text-sm outline-none transition-all
            bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            border ${error
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-[11px] mt-1.5">{error}</p>}
        </div>
    );
};