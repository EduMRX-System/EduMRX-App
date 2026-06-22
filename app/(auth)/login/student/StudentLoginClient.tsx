"use client";

import { useRouter } from "next/navigation";
import StudentLoginView from "@/views/auth/StudentLoginView";

export default function StudentLoginClient() {
  const router = useRouter();
  return <StudentLoginView onBack={() => router.push("/login")} />;
}
