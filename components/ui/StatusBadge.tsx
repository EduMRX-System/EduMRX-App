import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "primary" | "neutral";

interface StatusBadgeProps {
    variant?: Variant;
    children: React.ReactNode;
    className?: string;
    dot?: boolean;
}

const variantClasses: Record<Variant, string> = {
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger:  "bg-danger-bg  text-danger",
    primary: "bg-primary/10  text-primary",
    neutral: "bg-border-subtle text-foreground-muted",
};

export default function StatusBadge({
    variant = "neutral",
    children,
    className,
    dot = false,
}: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                variantClasses[variant],
                className,
            )}
        >
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            )}
            {children}
        </span>
    );
}
