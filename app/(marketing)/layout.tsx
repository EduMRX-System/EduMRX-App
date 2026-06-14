import Footer from "@/components/common/marketing/Footer";
import Header from "@/components/common/marketing/Header";
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}