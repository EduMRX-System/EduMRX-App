"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { X, Loader2, CalendarDays } from "lucide-react";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import { toast } from "react-toastify";
import { useGroupOptions } from "@/hooks/useLessons";
import { toHHMM, type Lesson, type LessonPayload } from "@/types/lesson";
import SearchSelect from "@/components/ui/SearchSelect";
import { useTranslation } from "react-i18next";
import FormModalShell from "@/components/common/FormModalShell";
import { getFormDraft, useFormDraftSave, clearFormDraft } from "@/hooks/useFormDraft";
import { queryKeys } from "@/lib/queryKeys";

interface Props {
    lesson?: Lesson | null;
    onClose: () => void;
    role?: "director" | "manager";
}

export default function LessonFormModal({ lesson, onClose, role = "director" }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!lesson;

    const draftKey = isEdit ? `edit-lesson-${lesson!.id}-draft` : "lesson-form-draft";
    const draft = getFormDraft<{
        group: string; date: string; start_time: string; end_time: string; topic: string; notes: string;
    }>(draftKey);

    const [formData, setFormData] = useState({
        group: draft?.group ?? (lesson?.group ?? ""),
        date: draft?.date ?? (lesson?.date ?? new Date().toISOString().split("T")[0]),
        start_time: draft?.start_time ?? toHHMM(lesson?.start_time),
        end_time: draft?.end_time ?? toHHMM(lesson?.end_time),
        topic: draft?.topic ?? (lesson?.topic ?? ""),
        notes: draft?.notes ?? (lesson?.notes ?? ""),
    });

    useFormDraftSave(draftKey, formData);

    const { data: groups = [], isLoading: groupsLoading } = useGroupOptions(role);

    const { mutate: saveLesson, isPending } = useMutation({
        mutationFn: async () => {
            const payload: LessonPayload = {
                group: formData.group,
                date: formData.date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                topic: formData.topic.trim(),
                notes: formData.notes.trim(),
            };
            return isEdit
                ? (await API.patch(`${role}/lessons/${lesson!.id}/`, payload)).data
                : (await API.post(`${role}/lessons/`, payload)).data;
        },
        onSuccess: () => {
            toast.success(t(isEdit ? "director.lessons.toast.updated" : "director.lessons.toast.created"));
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
            clearFormDraft(draftKey);
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
            toast.error(t("director.lessons.toast.error_generic"));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.group) return toast.error(t("director.lessons.toast.error_group"));
        if (!formData.date) return toast.error(t("director.lessons.toast.error_date"));
        if (!formData.start_time || !formData.end_time) return toast.error(t("director.lessons.toast.error_time"));
        if (!formData.topic.trim()) return toast.error(t("director.lessons.toast.error_topic"));
        saveLesson();
    };

    const inputCls = "border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground border-border focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle";
    const labelCls = "text-[14px] text-foreground-muted mb-1 block font-semibold";

    return (
        <FormModalShell onClose={onClose} maxWidth="max-w-xl">
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-foreground-subtle hover:text-foreground p-1.5 rounded-lg bg-surface/90 backdrop-blur-sm border border-border shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-[10px] border border-border shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-primary bg-primary-soft/10">
                    <CalendarDays className="w-6 h-6" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.lessons.form.title_edit") : t("director.lessons.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Guruh */}
                    <SearchSelect
                        label={t("director.lessons.form.group_label")}
                        required
                        value={formData.group}
                        options={groups}
                        loading={groupsLoading}
                        placeholder={t("director.lessons.form.group_placeholder")}
                        onChange={(id) => setFormData((p) => ({ ...p, group: id }))}
                    />

                    {/* Sana + Mavzu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <DatePicker
                                label={t("director.lessons.form.date_label")}
                                value={formData.date}
                                onChange={(v) => setFormData((p) => ({ ...p, date: v }))}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>{t("director.lessons.form.topic_label")}</label>
                            <input
                                type="text"
                                value={formData.topic}
                                onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))}
                                placeholder={t("director.lessons.form.topic_placeholder")}
                                className={inputCls}
                                required
                            />
                        </div>
                    </div>

                    {/* Vaqt */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TimePicker
                            label={t("director.lessons.form.start_time_label")}
                            value={formData.start_time}
                            onChange={(v) => setFormData((p) => ({ ...p, start_time: v }))}
                            required
                        />
                        <TimePicker
                            label={t("director.lessons.form.end_time_label")}
                            value={formData.end_time}
                            onChange={(v) => setFormData((p) => ({ ...p, end_time: v }))}
                            required
                        />
                    </div>

                    {/* Izoh */}
                    <div>
                        <label className={labelCls}>{t("director.lessons.form.note_label")}</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                            rows={2}
                            placeholder={t("director.lessons.form.note_placeholder")}
                            className="border rounded-lg w-full px-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-surface text-foreground border-border focus:border-primary placeholder:text-foreground-subtle"
                        />
                    </div>

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
        </FormModalShell>
    );
}
