export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-hidden bg-white dark:bg-slate-950">
      {/* Fon nurlari */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/4 w-[36rem] h-[36rem] bg-indigo-500/[0.08] rounded-full blur-[130px]"></div>
        <div className="absolute top-8 right-0 w-[30rem] h-[30rem] bg-violet-500/[0.06] rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_55%_45%_at_50%_45%,#000_60%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 pt-12 items-center">
          {/* Chap tomon kontenti */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span>Yangi avlod CRM tizimi</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                Ta'lim markazingizni
                <br />
                <span className="relative inline-block bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent py-1">
                  raqamlashtiring
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                O'quv markazingiz boshqaruvini yangi bosqichga olib chiqing.
                Hisobotlar, davomat va to'lovlar endi bitta xavfsiz tizimda.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                href="https://director.educationcrm.uz/register"
              >
                <span>Bepul boshlash</span>
              </a>
              <a
                href="/educrm.apk"
                download
                className="inline-flex items-center justify-center gap-2 text-sm h-12 px-6 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Android APK</span>
              </a>
            </div>

            {/* Kichik Statistikalar */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <div>
                <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  500+
                </div>
                <div className="text-xs text-slate-500">O'quv markazi</div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  50K+
                </div>
                <div className="text-xs text-slate-500">O'quvchi</div>
              </div>
            </div>
          </div>

          {/* O'ng tomon: Interfeys Maketi */}
          <div className="relative lg:[transform:rotateX(6deg)_rotateY(-12deg)] transition-transform duration-500">
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-[2rem] blur-2xl opacity-70"></div>
            <div className="relative bg-slate-900 p-1.5 rounded-[2.2rem] shadow-2xl overflow-hidden">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 min-h-[340px]">
                {/* Imkoniyatlar sarlavhasi */}
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Haftalik Dars Jadvali
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
                {/* Namunaviy Jadval Qatorlari */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-500 rounded-r-xl">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Mental Arifmetika (Guruh #12)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Xona: 3-Auditoriya • 09:00 - 10:30
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-500 rounded-r-xl">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Web Dasturlash Foundation
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Xona: Lab-1 • 11:00 - 13:00
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50/70 dark:bg-purple-950/40 border-l-4 border-purple-500 rounded-r-xl">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      IELTS Masterclass (Guruh #4)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Xona: 1-Auditoriya • 14:30 - 16:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
