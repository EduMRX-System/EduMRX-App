const coreFeatures = [
  {
    title: "Aqlli Dars Jadvallari",
    badge: "Kalendar",
    description:
      "Xonalar bandligi, guruhlar almashinuvi va o'qituvchilar dars vaqtlarini avtomatlashtirilgan aqlli tizim orqali to'qnashuvlarsiz boshqaring.",
    gradient:
      "from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Moliyaviy Analitika",
    badge: "Moliya",
    description:
      "O'quvchilar balansi, oylik to'lovlar, qarzdorliklar avomatik hisob-kitob qilinadi hamda sizga oylik va yillik sof foyda hisobotlarini shakllantiradi.",
    gradient:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Lidlar oqimi (CRM)",
    badge: "Lid Boshqaruvi",
    description:
      "Ijtimoiy tarmoqlardan yoki saytingizdan kelib tushayotgan yangi arizalarni (lidlarni) bosqichma-bosqich mijozga aylanishgacha kuzatib boring.",
    gradient:
      "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Avtomatlashgan SMS xabarlar",
    badge: "Xabarnoma",
    description:
      "To'lov muddati kelganda, o'quvchi darsga kelmaganda yoki markaz dars qoldirganda tizim avtomatik shaxsiy SMS ogohlantirishlar yuboradi.",
    gradient:
      "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative w-full py-24 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/60"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Sarlavhalar */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Imkoniyatlar va Modullar
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Markazni boshqarish uchun <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              barcha vositalar bir joyda
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Qog'ozbozlik va chalkash Excel jadvallarini unuting. Tizim
            markazingizni to'liq raqamli boshqaruvga o'tkazadi.
          </p>
        </div>

        {/* Grid Kartalar */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {coreFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex flex-col h-full justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-md">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Batafsil ko'rish &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
