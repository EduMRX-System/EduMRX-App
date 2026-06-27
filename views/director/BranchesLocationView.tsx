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
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted hover:text-foreground dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Orqaga
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20  bg-primary-soft  px-3 py-1 text-xs font-bold text-primary  mb-3">
            <Building2 className="w-3.5 h-3.5" />
            {branches.length} ta filial
          </div>

          <h1 className="text-2xl font-black text-foreground">
            Filiallarimiz
          </h1>

          <p className="text-sm text-foreground-muted mt-1">
            Eng yaqin filialni xaritadan toping yoki ro'yxatdan tanlang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="h-10 px-4 rounded-lg bg-slate-900 dark:bg-surface text-white dark:text-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          disabled={isLoading}
        >
          Yangilash
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 relative min-h-[420px] lg:h-[560px] overflow-hidden rounded-xl border border-border bg-hover ">
          {(isLoading || mapLoading) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-hover ">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
              <p className="text-sm font-bold text-foreground-muted">
                Xarita yuklanmoqda...
              </p>
            </div>
          )}

          {(isError || mapError) && !isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-hover  px-6 text-center">
              <AlertCircle className="w-10 h-10 text-danger mb-3" />
              <p className="text-sm font-bold text-slate-800 ">
                {mapError || "Filiallarni yuklashda xatolik yuz berdi"}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 h-9 px-4 rounded-lg bg-primary text-primary-fg text-sm font-bold hover:bg-primary-hover transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          )}

          {!isLoading && !isError && branchesWithCoords.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center bg-hover ">
              <MapPin className="w-10 h-10 text-foreground-subtle mb-3" />
              <p className="text-sm font-bold text-foreground">
                Koordinatasi bor filial topilmadi
              </p>
              <p className="text-xs text-foreground-muted mt-1">
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
                className="h-32 rounded-xl border border-border bg-surface animate-pulse"
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
                  className={`rounded-xl border bg-surface p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-400 dark:border-indigo-500 shadow-md shadow-indigo-500/10"
                      : "border-border hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          branch.status === "active"
                            ? "bg-primary-soft  text-primary "
                            : "bg-hover  text-foreground-subtle"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-foreground truncate">
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

                        <p className="text-xs text-foreground-muted mt-1 line-clamp-2">
                          {branch.address || "Manzil kiritilmagan"}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-foreground-subtle mt-2">
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
                            ? "bg-hover  text-foreground-muted hover:text-primary hover:bg-primary-soft "
                            : "bg-hover  text-slate-300 pointer-events-none"
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
                            ? "bg-hover  text-foreground-muted hover:text-primary hover:bg-primary-soft "
                            : "bg-hover  text-slate-300 pointer-events-none"
                        }`}
                        aria-label="Google Maps"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border-subtle">
                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>{branch.stats?.students_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{branch.stats?.teachers_count ?? 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{branch.stats?.rooms_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
              <MapPin className="w-10 h-10 text-slate-300 dark:text-foreground-muted mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground">
                Filiallar topilmadi
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                API dan filial kelganda shu yerda ko'rinadi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}