"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, Loader2, DoorOpen } from "lucide-react";
import { toast } from "react-toastify";
import { Room, RoomPayload } from "@/types/room";
import { useTranslation } from "react-i18next";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import AsyncBranchSelect from "@/components/common/AsyncBranchSelect";

interface Props {
    room?: Room | null;
    onClose: () => void;
}

export default function RoomFormModal({ room, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!room;
    const [isMounted, setIsMounted] = useState(false);

    const { activeCenter, isCentersLoaded } = useActiveCenterStore();

    const [formData, setFormData] = useState({
        name: room?.name ?? "",
        capacity: room?.capacity ? String(room.capacity) : "",
        branch: room?.branch ?? "",
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { mutate: saveRoom, isPending } = useMutation({
        mutationFn: async () => {
            if (!activeCenter) throw new Error(t("center.no_active_center"));
            const payload: RoomPayload = {
                name: formData.name.trim(),
                capacity: Number(formData.capacity),
                center: activeCenter,
                branch: formData.branch,
            };
            return isEdit
                ? (await API.patch(`director/rooms/${room!.id}/`, payload)).data
                : (await API.post("director/rooms/", payload)).data;
        },
        onSuccess: () => {
            toast.success(t(isEdit ? "director.rooms.toast.updated" : "director.rooms.toast.created"));
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            onClose();
        },
        onError: (err: any) => {
            const e = err?.response?.data;
            if (e && typeof e === "object") {
                const k = Object.keys(e)[0];
                if (k) {
                    const text = Array.isArray(e[k]) ? e[k][0] : e[k];
                    return toast.error(`${k}: ${typeof text === "string" ? text.replace(/["']/g, "") : text}`);
                }
            }
            toast.error(err?.message || t("director.rooms.toast.error_generic"));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error(t("director.rooms.toast.error_name"));
        if (!formData.capacity || Number(formData.capacity) <= 0)
            return toast.error(t("director.rooms.toast.error_capacity"));
        if (!formData.branch) return toast.error(t("director.rooms.toast.error_branch"));
        if (!activeCenter) return toast.error(t("center.no_active_center"));
        saveRoom();
    };

    const inputCls =
        "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 placeholder:text-slate-400 dark:placeholder:text-slate-500";
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
                    isMounted ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />

            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${
                    isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-[10px] border border-slate-200 dark:border-slate-700 shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20">
                    <DoorOpen className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.rooms.form.title_edit") : t("director.rooms.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelCls}>{t("director.rooms.form.name_label")}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            placeholder={t("director.rooms.form.name_placeholder")}
                            className={inputCls}
                            required
                        />
                    </div>

                    <div>
                        <label className={labelCls}>{t("director.rooms.form.capacity_label")}</label>
                        <input
                            type="number"
                            min={1}
                            value={formData.capacity}
                            onChange={(e) => setFormData((p) => ({ ...p, capacity: e.target.value }))}
                            placeholder="15"
                            className={inputCls}
                            required
                        />
                    </div>

                    <AsyncBranchSelect
                        centerId={activeCenter}
                        value={formData.branch}
                        onChange={(id) => setFormData((p) => ({ ...p, branch: id }))}
                        required
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !activeCenter}
                            className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
