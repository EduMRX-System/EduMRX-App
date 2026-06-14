import React from "react";

export default function AboutView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-left space-y-4">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">
        Biz haqimizda
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        EduMRX — ta'lim tizimini to'liq raqamlashtirishni maqsad qilgan
        professional SaaS ekotizimidir. Biz zamonaviy ta'lim markazlariga barcha
        filiallarini, guruhlarini va xodimlarini bitta markazlashgan boshqaruv
        paneli orqali nazorat qilish imkonini beramiz.
      </p>
    </div>
  );
}
