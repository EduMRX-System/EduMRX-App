"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import {
    X, Loader2, Building2, MapPin, Search, ChevronDown, Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatUzPhone } from "@/utils/formatters";
import { useUIStore } from "@/store/useUIStore";
import type { Branch, BranchStatus, BranchPayload } from "@/types/branch";
import { parseCoordinates } from "@/types/branch";

// ═════════════════════════════════════════════════════════════════
// PHONE INPUT
// ═════════════════════════════════════════════════════════════════
interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/\D/g, "");
        if (raw.startsWith("998") && raw.length > 3) raw = raw.slice(3);
        const local = raw.slice(0, 9);
        onChange("998" + local);
    };

    return (
        <div>
            <label className="text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold">
                Telefon *
            </label>
            <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-3 pointer-events-none select-none">
                    <span className="text-base">🇺🇿</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">+998</span>
                </div>
                <input
                    type="tel"
                    value={formatUzPhone(value.startsWith("998") ? value.slice(3) : value)}
                    onChange={handlePhoneChange}
                    placeholder="90-123-45-67"
                    className={`border rounded-lg w-full h-[40px] pl-[90px] pr-[10px] text-[14px] outline-none focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors ${error
                        ? "border-red-300 dark:border-red-800 bg-red-50/10"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                    required
                />
            </div>
            {error && <p className="text-red-400 dark:text-red-500 text-[11px] mt-1">{error}</p>}
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════
// GLOBAL YANDEX MAPS LOADER (singleton)
// ═════════════════════════════════════════════════════════════════
let ymapsPromise: Promise<void> | null = null;

function loadYandexMaps(): Promise<void> {
    const win = window as any;

    if (win.ymaps && typeof win.ymaps.ready === "function") {
        return new Promise((resolve) => win.ymaps.ready(() => resolve()));
    }
    if (ymapsPromise) return ymapsPromise;

    ymapsPromise = new Promise((resolve, reject) => {
        const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
        const scriptUrl = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;

        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (existingScript) {
            const checkYmaps = setInterval(() => {
                if (win.ymaps && typeof win.ymaps.ready === "function") {
                    clearInterval(checkYmaps);
                    win.ymaps.ready(() => resolve());
                }
            }, 100);
            return;
        }

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => win.ymaps.ready(() => resolve());
        script.onerror = () => {
            ymapsPromise = null;
            reject(new Error("Xaritani yuklashda xatolik"));
        };
        document.head.appendChild(script);
    });

    return ymapsPromise;
}

// ═════════════════════════════════════════════════════════════════
// STATUS OPTIONS
// ═════════════════════════════════════════════════════════════════
const STATUS_OPTIONS: { value: BranchStatus; label: string; color: string }[] = [
    { value: "active", label: "Faol", color: "bg-emerald-500" },
    { value: "inactive", label: "Nofaol", color: "bg-rose-500" },
];

interface BranchFormModalProps {
    branch?: Branch | null; // berilsa — tahrirlash rejimi
    onClose: () => void;
}

export default function BranchFormModal({ branch, onClose }: BranchFormModalProps) {
    const queryClient = useQueryClient();
    const isEdit = !!branch;
    const [isMounted, setIsMounted] = useState(false);

    const initialCoords = parseCoordinates(branch?.coordinates);

    // Form state (oddiy useState — sizning pattern)
    const [formData, setFormData] = useState({
        name: branch?.name ?? "",
        phone: branch?.phone ? "998" + branch.phone.replace(/\D/g, "").replace(/^998/, "").slice(0, 9) : "998",
        address: branch?.address ?? "",
        status: (branch?.status ?? "active") as BranchStatus,
        latitude: initialCoords?.lat ?? "",
        longitude: initialCoords?.lng ?? "",
    });

    // Status dropdown
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Yandex Map state
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const placemarkRef = useRef<any>(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [mapError, setMapError] = useState(false);
    const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(initialCoords);

    // Address search
    const [addressSearchQuery, setAddressSearchQuery] = useState(branch?.address ?? "");
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const theme = useUIStore((state) => state.theme);
    const isDark = theme === "dark";

    // Tashqi klik — dropdownlarni yopish
    useEffect(() => {
        setIsMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) setIsStatusOpen(false);
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) setAddressSuggestions([]);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Marker yangilash
    const updateMarker = useCallback((coordinate: number[], ymaps: any, map: any, shouldGeocode = true) => {
        const [lat, lng] = coordinate;
        const latStr = lat.toFixed(6);
        const lngStr = lng.toFixed(6);

        setCoords({ lat: latStr, lng: lngStr });
        setFormData(prev => ({ ...prev, latitude: latStr, longitude: lngStr }));

        if (placemarkRef.current) map.geoObjects.remove(placemarkRef.current);

        const placemark = new ymaps.Placemark(
            coordinate, {},
            { preset: "islands#violetDotIconWithCaption", iconColor: "#4F46E5" }
        );
        map.geoObjects.add(placemark);
        placemarkRef.current = placemark;

        if (shouldGeocode) {
            ymaps.geocode(coordinate, { results: 1 }).then((res: any) => {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject) {
                    const addressText = firstGeoObject.getAddressLine();
                    setFormData(prev => ({ ...prev, address: addressText }));
                    setAddressSearchQuery(addressText);
                }
            });
        }
    }, []);

    // Map init
    useEffect(() => {
        if (!isMounted) return;

        loadYandexMaps()
            .then(() => {
                if (!mapContainerRef.current) return;
                const ymaps = (window as any).ymaps;

                const hasCoords = !!(formData.latitude && formData.longitude);
                const initialCenter = hasCoords
                    ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
                    : [41.2995, 69.2401]; // Toshkent

                const map = new ymaps.Map(mapContainerRef.current, {
                    center: initialCenter,
                    zoom: hasCoords ? 15 : 12,
                    controls: ["zoomControl"],
                }, { suppressMapOpenBlock: true });

                mapInstanceRef.current = map;
                setMapLoading(false);

                // Faqat xarita fonini dark mode qilish
                if (isDark) {
                    const groundElement = map.panes.get("ground").getElement();
                    if (groundElement) {
                        groundElement.style.filter = "invert(1) hue-rotate(180deg) brightness(0.85) contrast(1)";
                    }
                }

                if (hasCoords) {
                    ymaps.ready(() => {
                        updateMarker([parseFloat(formData.latitude), parseFloat(formData.longitude)], ymaps, map, false);
                    });
                }

                map.events.add("click", (e: any) => {
                    updateMarker(e.get("coords"), ymaps, map, true);
                });
            })
            .catch(() => {
                setMapError(true);
                setMapLoading(false);
            });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, updateMarker, theme]);

    // Manzil qidirish (debounce + geocode suggestions)
    const handleAddressSearch = (query: string) => {
        setAddressSearchQuery(query);
        setFormData(prev => ({ ...prev, address: query }));

        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (!query.trim() || query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        searchDebounceRef.current = setTimeout(async () => {
            const ymaps = (window as any).ymaps;
            if (!ymaps || !mapInstanceRef.current) return;

            setIsSearchingAddress(true);
            try {
                const res = await ymaps.geocode(query, {
                    results: 5,
                    boundedBy: mapInstanceRef.current.getBounds(),
                    strictBounds: false,
                });
                const suggestions: any[] = [];
                res.geoObjects.each((obj: any) => {
                    suggestions.push({ name: obj.getAddressLine(), coords: obj.geometry.getCoordinates() });
                });
                setAddressSuggestions(suggestions);
            } catch {
                setAddressSuggestions([]);
            }
            setIsSearchingAddress(false);
        }, 400);
    };

    const selectSuggestion = (suggestion: { name: string; coords: number[] }) => {
        const ymaps = (window as any).ymaps;
        const map = mapInstanceRef.current;
        if (!ymaps || !map) return;

        map.setCenter(suggestion.coords, 15, { duration: 400 });
        updateMarker(suggestion.coords, ymaps, map, false);
        setAddressSearchQuery(suggestion.name);
        setFormData(prev => ({
            ...prev,
            address: suggestion.name,
            latitude: suggestion.coords[0].toFixed(6),
            longitude: suggestion.coords[1].toFixed(6),
        }));
        setAddressSuggestions([]);
    };

    // Create / Update mutation
    const { mutate: saveBranch, isPending } = useMutation({
        mutationFn: async () => {
            const payload: BranchPayload = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                coordinates: [parseFloat(formData.latitude), parseFloat(formData.longitude)],
                status: formData.status,
            };
            const res = isEdit
                ? await API.patch(`center/branches/${branch!.id}/`, payload)
                : await API.post("center/branches/", payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success(isEdit ? "Filial yangilandi" : "Filial qo'shildi");
            queryClient.invalidateQueries({ queryKey: ["branches"] });
            onClose();
        },
        onError: (err: any) => {
            const errData = err?.response?.data;
            if (errData && typeof errData === "object") {
                const firstKey = Object.keys(errData)[0];
                if (firstKey) {
                    const text = Array.isArray(errData[firstKey]) ? errData[firstKey][0] : errData[firstKey];
                    return toast.error(`${firstKey}: ${typeof text === "string" ? text.replace(/["']/g, "") : text}`);
                }
            }
            toast.error("Xatolik yuz berdi");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error("Filial nomini kiriting");
        if (!formData.latitude || !formData.longitude) {
            return toast.error("Iltimos, xaritadan joylashuvni tanlang");
        }
        saveBranch();
    };

    const currentStatus = STATUS_OPTIONS.find(o => o.value === formData.status) || STATUS_OPTIONS[0];
    const inputCls = "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 placeholder:text-slate-400 dark:placeholder:text-slate-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Orqa fon */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                {/* Sticky close */}
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-[10px] border border-slate-200 dark:border-slate-700 shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20">
                    <Building2 className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? "Filialni tahrirlash" : "Yangi filial qo'shish"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold">Filial nomi *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Masalan: Chilonzor filiali"
                            className={inputCls}
                            required
                        />
                    </div>

                    {/* Telefon + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PhoneInput
                            value={formData.phone}
                            onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                        />

                        <div ref={statusDropdownRef} className="relative">
                            <label className="text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold">Holati *</label>
                            <div
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="border border-slate-200 dark:border-slate-700 rounded-lg w-full h-[40px] px-3 text-[14px] flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                                    <span>{currentStatus.label}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                            </div>

                            {isStatusOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
                                    {STATUS_OPTIONS.map((option) => {
                                        const isSelected = option.value === formData.status;
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => { setFormData(prev => ({ ...prev, status: option.value })); setIsStatusOpen(false); }}
                                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${isSelected
                                                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                                    <span>{option.label}</span>
                                                </div>
                                                {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Yandex Map + manzil */}
                    <div>
                        <label className="text-[14px] text-slate-600 dark:text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            Manzil va xaritadagi joylashuv *
                        </label>

                        <div className="relative mb-2" ref={suggestionsRef}>
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={addressSearchQuery}
                                    onChange={(e) => handleAddressSearch(e.target.value)}
                                    placeholder="Manzilni kiriting yoki xaritadan tanlang..."
                                    className={`${inputCls} pl-9`}
                                />
                                {isSearchingAddress && <Loader2 className="absolute right-3 w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                                {!isSearchingAddress && addressSearchQuery && (
                                    <X
                                        onClick={() => { setAddressSearchQuery(""); setFormData(prev => ({ ...prev, address: "" })); setAddressSuggestions([]); }}
                                        className="absolute right-3 w-3.5 h-3.5 text-slate-400 cursor-pointer"
                                    />
                                )}
                            </div>

                            {addressSuggestions.length > 0 && (
                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                    {addressSuggestions.map((s, i) => (
                                        <div
                                            key={i}
                                            onClick={() => selectSuggestion(s)}
                                            className="flex items-start gap-2 px-3 py-2.5 text-[13px] text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                                        >
                                            <MapPin className="w-3.5 h-3.5 mt-0.5 text-indigo-400 shrink-0" />
                                            <span>{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            {(mapLoading || mapError) && (
                                <div className="absolute inset-0 z-10 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-2">
                                    {mapError
                                        ? <span className="text-xs text-red-500 font-semibold">Xaritani yuklashda xatolik</span>
                                        : <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />}
                                </div>
                            )}
                            <div ref={mapContainerRef} className="w-full h-[200px]" style={{ overflow: "visible" }} />
                        </div>
                    </div>

                    {/* Koordinata nishoni */}
                    {coords && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-lg px-3 py-2">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Lat: {coords.lat} | Lng: {coords.lng}</span>
                        </div>
                    )}

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? "Saqlash" : "Yaratish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}