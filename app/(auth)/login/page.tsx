"use client";

import { useState } from "react";
import ChooseProfileView from "@/views/auth/ChooseProfileView";
import StudentLoginView from "@/views/auth/StudentLoginView";
import StaffLoginView from "@/views/auth/StaffLoginView";

type Step = "choose" | "student" | "staff";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("choose");

  if (step === "student") return <StudentLoginView onBack={() => setStep("choose")} />;
  if (step === "staff")   return <StaffLoginView   onBack={() => setStep("choose")} />;

  return <ChooseProfileView onChoose={(type) => setStep(type)} />;
}
