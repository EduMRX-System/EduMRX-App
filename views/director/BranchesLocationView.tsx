"use client";

// app/director/profile/locations — Filiallar manzili (hozircha fake data)
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Navigation, ExternalLink } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
}

// ─── FAKE DATA (keyin API'dan keladi) ───
const BRANCHES: Branch[] = [
  { id: "1", name: "Chilonzor filiali", address: "Bunyodkor shoh ko'chasi, 12", landmark: "Chilonzor metro bekati yonida", lat: 41.2856, lng: 69.2034 },
  { id: "2", name: "Yunusobod filiali", address: "Amir Temur shoh ko'chasi, 108", landmark: "Yunusobod tumani, Shahriston", lat: 41.3375, lng: 69.2890 },
  { id: "3", name: "Sergeli filiali", address: "Yangi Sergeli, 4-mavze", landmark: "Sergeli metro bekati", lat: 41.2230, lng: 69.2210 },
  { id: "4", name: "Mirzo Ulug'bek filiali", address: "Mustaqillik shoh ko'chasi, 56", landmark: "Buyuk Ipak Yo'li metro", lat: 41.3250, lng: 69.3340 },
];

export default function BranchesLocationView() {
  const router = useRouter();

  return (
    <div className="">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        Orqaga
      </button>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Filiallarimiz</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Filiallarimiz Dushanbadan-Shanbagacha, 9:00 dan 20:00 gacha ishlaydi
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* MAP PLACEHOLDER (keyin Yandex Maps) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden relative min-h-[400px] flex items-center justify-center">
          {/* Placeholder grid pattern */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(148 163 184 / 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.2) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Xarita</p>
            <p className="text-xs text-slate-400 mt-1">Yandex Maps tez orada ulanadi</p>
          </div>
        </div>

        {/* BRANCHES LIST */}
        <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {BRANCHES.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{b.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{b.address}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{b.landmark}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <a
                    href={`https://yandex.com/maps/?pt=${b.lng},${b.lat}&z=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    aria-label="Yandex Maps"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    aria-label="Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}