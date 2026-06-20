import ProtectedRoute from "@/components/ProtectedRoute";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles="student">{children}</ProtectedRoute>

}