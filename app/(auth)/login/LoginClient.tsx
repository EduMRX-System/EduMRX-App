"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  if (step === "student")
    return <StudentLoginView onBack={() => setStep("choose")} />;
  if (step === "staff")
    return <StaffLoginView onBack={() => setStep("choose")} />;

  return <ChooseProfileView onChoose={(type) => setStep(type)} />;
}
