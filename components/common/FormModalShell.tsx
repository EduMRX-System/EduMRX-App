"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

interface FormModalShellProps {
  onClose: () => void;
  children: ReactNode;
  /** "center" — modal opens centered with a fade+scale animation.
   *  "right" — modal opens as a full-height drawer sliding in from the right edge.
   *  Defaults to the user's global "Modal ko'rinishi" profile setting when omitted. */
  variant?: "center" | "right";
  /** Tailwind max-w-* class for the panel (center) / drawer (right). */
  maxWidth?: string;
  /** Backdrop click closes the modal. Defaults by variant: "right" → true, "center" → false. */
  closeOnBackdropClick?: boolean;
}

// Bitta joyda markazlashtirilgan modal animatsiyasi — har bir forma modal
// o'zicha animatsiya yozmaydi, hammasi shu shell orqali ishlaydi. To'liq
// enter+exit (fade-out/scale-out) uchun chaqiruvchi tomonda
// `{open && <XxxModal/>}` shartini <AnimatePresence> bilan o'rab qo'yish kifoya
// — animatsiyaning o'zi (timing, easing, variant) shu yerda yagona joyda.
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const centerPanelVariants = {
  hidden: { opacity: 0, y: -24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const rightPanelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export default function FormModalShell({
  onClose,
  children,
  variant: variantProp,
  maxWidth = "max-w-xl",
  closeOnBackdropClick,
}: FormModalShellProps) {
  const globalVariant = useUIStore((s) => s.modalVariant);
  const variant = variantProp ?? globalVariant;
  const shouldCloseOnBackdrop = closeOnBackdropClick ?? variant === "right";

  if (variant === "right") {
    return (
      <div className="fixed inset-0 z-50">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 bg-overlay backdrop-blur-sm"
          onClick={shouldCloseOnBackdrop ? onClose : undefined}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={rightPanelVariants}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className={`fixed inset-y-0 right-0 z-10 w-full ${maxWidth} bg-surface p-6 overflow-y-auto shadow-2xl border-l border-border-subtle`}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={shouldCloseOnBackdrop ? onClose : undefined}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={centerPanelVariants}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`bg-surface p-6 rounded-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-border-subtle`}
      >
        {children}
      </motion.div>
    </div>
  );
}
