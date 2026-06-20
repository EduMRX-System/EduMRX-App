"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

declare global {
    interface Window {
        ymaps?: any;
        __ymapsLoading?: Promise<any>;
    }
}

const API_KEY = process.env.NEXT_PUBLIC_YANDEX_API_KEY ?? "";
const DEFAULT_CENTER: [number, number] = [41.311081, 69.279716]; // Toshkent

// singleton loader — hot-reload / double-init'dan himoya
function loadYmaps(): Promise<any> {
    if (typeof window === "undefined") return Promise.reject("no window");
    if (window.ymaps?.ready) return new Promise((r) => window.ymaps.ready(r));
    if (window.__ymapsLoading) return window.__ymapsLoading;

    window.__ymapsLoading = new Promise((resolve, reject) => {
        const src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=uz_UZ`;
        let script = document.querySelector<HTMLScriptElement>(
            `script[src^="https://api-maps.yandex.ru/2.1/"]`
        );
        if (!script) {
            script = document.createElement("script");
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        }
        script.addEventListener("load", () => window.ymaps.ready(resolve));
        script.addEventListener("error", reject);
    });
    return window.__ymapsLoading;
}

interface Props {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
    onAddressResolved?: (address: string) => void;
    error?: string;
}

export default function BranchMapPicker({
    lat,
    lng,
    onChange,
    onAddressResolved,
    error,
}: Props) {
    const mapEl = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const placemarkRef = useRef<any>(null);
    const initialized = useRef(false); // StrictMode double-init guard
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        let destroyed = false;

        loadYmaps()
            .then((ymaps) => {
                if (destroyed || !mapEl.current) return;
                const center: [number, number] =
                    lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER;

                const map = new ymaps.Map(mapEl.current, {
                    center,
                    zoom: 12,
                    controls: ["zoomControl", "geolocationControl"],
                });
                mapRef.current = map;
                setLoading(false);

                const setMarker = (coords: [number, number]) => {
                    if (placemarkRef.current) {
                        placemarkRef.current.geometry.setCoordinates(coords);
                    } else {
                        placemarkRef.current = new ymaps.Placemark(
                            coords,
                            {},
                            { preset: "islands#violetDotIcon", draggable: true }
                        );
                        map.geoObjects.add(placemarkRef.current);
                        placemarkRef.current.events.add("dragend", () => {
                            const c = placemarkRef.current.geometry.getCoordinates();
                            emit(c);
                        });
                    }
                };

                const emit = (coords: [number, number]) => {
                    onChange(coords[0], coords[1]);
                    if (onAddressResolved) {
                        ymaps.geocode(coords).then((res: any) => {
                            const obj = res.geoObjects.get(0);
                            if (obj) onAddressResolved(obj.getAddressLine());
                        });
                    }
                };

                if (lat != null && lng != null) setMarker([lat, lng]);

                map.events.add("click", (e: any) => {
                    const coords = e.get("coords") as [number, number];
                    setMarker(coords);
                    emit(coords);
                });
            })
            .catch(() => setLoading(false));

        return () => {
            destroyed = true;
            mapRef.current?.destroy?.();
            mapRef.current = null;
            placemarkRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                    </div>
                )}
                <div ref={mapEl} className="h-full w-full" />
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
                {lat != null && lng != null
                    ? `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                    : "Xaritadan filial joylashuvini bosing"}
            </p>
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
    );
}