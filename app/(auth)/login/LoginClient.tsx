"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getUrlForRole } from "@/utils/redirect";
import ChooseProfileView from "@/views/auth/ChooseProfileView";
import StudentLoginView from "@/views/auth/StudentLoginView";
import StaffLoginView from "@/views/auth/StaffLoginView";

type Step = "choose" | "student" | "staff";

function getInitialStep(): Step {
  if (typeof window === "undefined") return "choose";
  const profile = new URLSearchParams(window.location.search).get("profile");
  if (profile === "staff") return "staff";
  if (profile === "student") return "student";
  return "choose";
}

export default function LoginClient() {
  const [step, setStep] = useState<Step>(getInitialStep);

  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const initAuth = useAuthStore((s) => s.initAuth);

  const [redirecting, setRedirecting] = useState(false);

  // ?logout=1 bo'lsa — foydalanuvchi ataylab chiqdi, avtomatik redirect qilmaymiz
  const isLogout =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("logout") === "1";

  useEffect(() => {
    if (!isLogout) initAuth();
  }, []);

  useEffect(() => {
    if (isLogout || !isInitialized || !isAuthenticated || !user) return;
    const url = getUrlForRole(user.role);
    if (url) {
      setRedirecting(true);
      window.location.replace(url);
    }
  }, [isInitialized, isAuthenticated, user, isLogout]);

  // Tekshiruv yoki redirect davomida — forma ko'rinmasin
  const showLoader =
    !isLogout && (!isInitialized || redirecting || (isInitialized && isAuthenticated && !!user));

  if (showLoader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950 transition-colors">
        <div className="w-10 h-10 rounded-full border-[3px] border-indigo-100 border-t-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          {redirecting ? "Panelingizga yo'naltirilmoqda…" : "Tekshirilmoqda…"}
        </p>
      </div>
    );
  }

  if (step === "student")
    return <StudentLoginView onBack={() => setStep("choose")} />;
  if (step === "staff")
    return <StaffLoginView onBack={() => setStep("choose")} />;

  return <ChooseProfileView onChoose={(type) => setStep(type)} />;
}
