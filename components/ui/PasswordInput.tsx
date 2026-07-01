// PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
    register: any;
    error?: string;
}

export const PasswordInput = ({ register, error }: PasswordInputProps) => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-foreground-subtle pointer-events-none" />
                <input
                    {...register}
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full h-[44px] pl-10 pr-10 rounded-xl text-sm outline-none transition-all
            bg-surface
            text-foreground
            placeholder:text-foreground-subtle
            border ${error
                            ? "border-danger/50 focus:border-danger"
                            : "border-border focus:border-primary"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 text-foreground-subtle hover:text-primary transition-colors cursor-pointer"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && <p className="text-danger text-[11px] mt-1.5">{error}</p>}
        </div>
    );
};
