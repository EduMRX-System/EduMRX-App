import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: "circle" | "text" | "block";
  className?: string;
}

export default function Skeleton({ variant = "block", className }: SkeletonProps) {
  const shapes = {
    circle: "rounded-full",
    text: "rounded-md h-3",
    block: "rounded-xl",
  };
  return <div className={cn("animate-pulse bg-hover shrink-0", shapes[variant], className)} />;
}
