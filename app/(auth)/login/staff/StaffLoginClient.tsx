"use client";

import { useRouter } from "next/navigation";
import StaffLoginView from "@/views/auth/StaffLoginView";

export default function StaffLoginClient() {
  const router = useRouter();
  return <StaffLoginView onBack={() => router.push("/login")} />;
}
