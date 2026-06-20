"use client";

import Header from "@/components/common/Header";
import LeftComponent from "@/components/common/LeftComponent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUIStore } from "@/store/useUIStore";
import { directorMenu } from "@/constants/navigation";
import DirectorNav from "@/components/sections/directorPanelSections/navbar/DirectorNav";

export default function DirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed, setSidebarCollapsed, theme } = useUIStore();

  const handleNavigate = () => {
    setSidebarOpen(false);   // mobil drawer yopiladi
  };

  return (
    <ProtectedRoute>
      <div className="bg-[#F8F9FA] dark:bg-slate-950 h-screen w-screen flex overflow-hidden transition-colors duration-300">

        {/* MOBILE OVERLAY BACKDROP */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR — floating (LeftComponent o'zi p-3 wrapper va kenglikni boshqaradi) */}
        <div
          className={`
    z-50 h-screen shrink-0
    fixed lg:relative lg:translate-x-0
    transition-transform duration-300 lg:transition-none
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
        >

          <DirectorNav onNavigate={handleNavigate} />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden transition-all duration-300">
          {/* HEADER — floating sidebar bilan moslab, ozgina padding bilan */}
          <Header menuItems={directorMenu} />


          <main className="px-3 pb-3 pt-4 md:px-5 md:pb-5 flex-1 overflow-y-auto transition-all duration-300">
            <div className="w-full h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}