"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Users,
  DoorOpen,
  GraduationCap,
  AlertCircle,
  Building2,
} from "lucide-react";
import { API } from "@/services/api";
import { useUIStore } from "@/store/useUIStore";
import { formatUzPhone } from "@/utils/formatters";
import type { Branch } from "@/types/branch";
import { parseCoordinates } from "@/types/branch";

type BranchesResponse = {
  status?: string;
  count?: number;
  data?: Branch[];
  results?: Branch[];
};

type YandexBounds = unknown;
type YandexPlacemark = unknown;

interface YandexMap {
  destroy: () => void;
  setCenter: (
    coordinates: [number, number],
    zoom?: number,
    options?: { duration?: number },
  ) => void;
  setBounds: (
    bounds: YandexBounds,
    options?: { checkZoomRange?: boolean; zoomMargin?: number },
  ) => void;
  geoObjects: {
    add: (object: YandexPlacemark) => void;
    removeAll: () => void;
    getBounds: () => YandexBounds;
  };
  panes: {
    get: (name: string) => {
      getElement: () => HTMLElement | null;
    };
  };
}

interface YandexMapsApi {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    state: {
      center: [number, number];
      zoom: number;
      controls: string[];
    },
    options?: { suppressMapOpenBlock?: boolean },
  ) => YandexMap;
  Placemark: new (
    coordinates: [number, number],
    properties: Record<string, string>,
    options: Record<string, string>,
  ) => YandexPlacemark;
}

type WindowWithYMaps = Window & {
  ymaps?: YandexMapsApi;
};

let ymapsPromise: Promise<void> | null = null;

function loadYandexMaps(): Promise<void> {
  const win = window as WindowWithYMaps;

  if (win.ymaps && typeof win.ymaps.ready === "function") {
    return new Promise((resolve) => win.ymaps?.ready(resolve));
  }

  if (ymapsPromise) return ymapsPromise;

  ymapsPromise = new Promise((resolve, reject) => {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
    const scriptUrl = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;

    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    if (existingScript) {
      const checkYmaps = window.setInterval(() => {
        if (win.ymaps && typeof win.ymaps.ready === "function") {
          window.clearInterval(checkYmaps);
          win.ymaps.ready(resolve);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;

    script.onload = () => {
      if (!win.ymaps) {
        reject(new Error("Xaritani yuklashda xatolik"));
        return;
      }

      win.ymaps.ready(resolve);
    };

    script.onerror = () => {
      ymapsPromise = null;
      reject(new Error("Xaritani yuklashda xatolik"));
    };

    document.head.appendChild(script);
  });

  return ymapsPromise;
}

function getBranchCoords(branch: Branch): [number, number] | null {
  const parsed = parseCoordinates(branch.coordinates);
  if (!parsed) return null;

  const lat = Number(parsed.lat);
  const lng = Number(parsed.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;

  return [lat, lng];
}

function formatPhone(phone?: string | null) {
  if (!phone) return "Telefon kiritilmagan";

  const clean = phone.replace(/\D/g, "");
  const local = clean.startsWith("998") ? clean.slice(3) : clean;

  return `+998 ${formatUzPhone(local)}`;
}

async function fetchBranches(): Promise<Branch[]> {
  const response = await API.get<BranchesResponse | Branch[]>("/center/branches/");
  const payload = response.data;

  if (Array.isArray(payload)) return payload;

  return payload.data || payload.results || [];
}

export default function BranchesLocationView() {
  const router = useRouter();
  const theme = useUIStore((state) => state.theme);
  const isDark = theme === "dark";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<YandexMap | null>(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const {
    data: branches = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const branchesWithCoords = useMemo(
    () =>
      branches
        .map((branch) => ({
          branch,
          coords: getBranchCoords(branch),
        }))
        .filter(
          (item): item is { branch: Branch; coords: [number, number] } =>
            item.coords !== null,
        ),
    [branches],
  );

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) || null,
    [branches, selectedBranchId],
  );

  const focusBranch = (branch: Branch) => {
    const coords = getBranchCoords(branch);
    if (!coords) return;

    setSelectedBranchId(branch.id);
    mapInstanceRef.current?.setCenter(coords, 16, { duration: 400 });
  };

  useEffect(() => {
    if (isLoading || !mapContainerRef.current) return;

    let isMounted = true;

    setMapLoading(true);
    setMapError("");

    loadYandexMaps()
      .then(() => {
        if (!isMounted || !mapContainerRef.current) return;

        const ymaps = (window as WindowWithYMaps).ymaps;
        if (!ymaps) throw new Error("Yandex Maps topilmadi");

        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }

        const firstCoords = branchesWithCoords[0]?.coords || [41.2995, 69.2401];

        const map = new ymaps.Map(
          mapContainerRef.current,
          {
            center: firstCoords,
            zoom: branchesWithCoords.length ? 12 : 11,
            controls: ["zoomControl", "fullscreenControl"],
          },
          { suppressMapOpenBlock: true },
        );

        mapInstanceRef.current = map;

        if (isDark) {
          const groundElement = map.panes.get("ground").getElement();
          if (groundElement) {
            groundElement.style.filter =
              "invert(1) hue-rotate(180deg) brightness(0.85) contrast(1)";
          }
        }

        branchesWithCoords.forEach(({ branch, coords }) => {
          const placemark = new ymaps.Placemark(
            coords,
            {
              balloonContentHeader: `<strong>${branch.name}</strong>`,
              balloonContentBody: `
                <div>
                  <div>${branch.address || "Manzil kiritilmagan"}</div>
                  <div><b>Tel:</b> ${formatPhone(branch.phone)}</div>
                </div>
              `,
              iconCaption: branch.name,
            },
            {
              preset: "islands#violetDotIconWithCaption",
              iconColor: branch.status === "active" ? "#4F46E5" : "#94A3B8",
            },
          );

          map.geoObjects.add(placemark);
        });

        if (branchesWithCoords.length > 1) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 48,
          });
        }

        setMapLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMapError("Xaritani yuklashda xatolik yuz berdi");
        setMapLoading(false);
      });

    return () => {
      isMounted = false;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoading, branchesWithCoords, isDark]);

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Orqaga
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            {branches.length} ta filial
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Filiallarimiz
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Eng yaqin filialni xaritadan toping yoki ro'yxatdan tanlang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          disabled={isLoading}
        >
          Yangilash
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 relative min-h-[420px] lg:h-[560px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
          {(isLoading || mapLoading) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Xarita yuklanmoqda...
              </p>
            </div>
          )}

          {(isError || mapError) && !isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 px-6 text-center">
              <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {mapError || "Filiallarni yuklashda xatolik yuz berdi"}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          )}

          {!isLoading && !isError && branchesWithCoords.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center bg-slate-100 dark:bg-slate-900">
              <MapPin className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Koordinatasi bor filial topilmadi
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Filial qo'shganda xaritadan joylashuv tanlanganini tekshiring.
              </p>
            </div>
          )}

          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ outline: "none" }}
          />
        </div>

        <div className="lg:col-span-2 space-y-3 max-h-[560px] overflow-y-auto pr-1">
          {isLoading ? (
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
              />
            ))
          ) : branches.length > 0 ? (
            branches.map((branch) => {
              const coords = getBranchCoords(branch);
              const isSelected = selectedBranch?.id === branch.id;

              return (
                <div
                  key={branch.id}
                  onClick={() => focusBranch(branch)}
                  className={`rounded-xl border bg-white dark:bg-slate-900 p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-400 dark:border-indigo-500 shadow-md shadow-indigo-500/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          branch.status === "active"
                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {branch.name}
                          </p>
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              branch.status === "active"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {branch.address || "Manzil kiritilmagan"}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-2">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{formatPhone(branch.phone)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={
                          coords
                            ? `https://yandex.com/maps/?pt=${coords[1]},${coords[0]}&z=16`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          coords
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-300 pointer-events-none"
                        }`}
                        aria-label="Yandex Maps"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>

                      <a
                        href={
                          coords
                            ? `https://www.google.com/maps?q=${coords[0]},${coords[1]}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          coords
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-300 pointer-events-none"
                        }`}
                        aria-label="Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{branch.stats?.students_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{branch.stats?.teachers_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{branch.stats?.rooms_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
              <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Filiallar topilmadi
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                API dan filial kelganda shu yerda ko'rinadi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}