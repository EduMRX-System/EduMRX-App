"use client";

import Header from "@/components/common/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUIStore } from "@/store/useUIStore";
import { managerMenu } from "@/constants/navigation";
import ManagerNav from "@/components/sections/managerPanelSections/navbar/ManagerNav";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PanelThemeInitializer from "@/components/PanelThemeInitializer";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const handleNavigate = () => {
    setSidebarOpen(false);
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "admin"]}>
      <PanelThemeInitializer />
      <div className="bg-layout h-screen w-screen flex overflow-hidden transition-colors duration-300">

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`
            z-50 h-screen shrink-0
            fixed lg:relative lg:translate-x-0
            transition-transform duration-300 lg:transition-none
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <ManagerNav onNavigate={handleNavigate} />
        </div>

        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden transition-all duration-300">
          <Header menuItems={managerMenu} showQuickTools />

          <main className="px-3 pb-3 pt-4 md:px-5 md:pb-5 flex-1 overflow-y-auto transition-all duration-300">
            <Breadcrumb />
            <div className="w-full h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}
