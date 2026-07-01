"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { UserCog, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatUzPhone, splitFullName, type IManager } from "@/types/manager";
import { useTranslation } from "react-i18next";
import ScopeFormFields from "@/components/common/ScopeFormFields";
import FormModalShell from "@/components/common/FormModalShell";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { getFormDraft, useFormDraftSave, clearFormDraft } from "@/hooks/useFormDraft";
import { queryKeys } from "@/lib/queryKeys";

const schema = yup.object({
    first_name: yup.string().required("Ism majburiy"),
    last_name: yup.string().required("Familiya majburiy"),
    phone: yup
        .string()
        .required("Telefon majburiy")
        .test("phone-complete", "Telefon to'liq emas", (val) => (val?.replace(/\D/g, "") ?? "").length === 12),
    email: yup.string().email("Email noto'g'ri").required("Email majburiy"),
    password: yup.string().when("$isEdit", {
        is: false,
        then: (s) => s.min(6, "Kamida 6 belgi").required("Parol majburiy"),
        otherwise: (s) => s.optional(),
    }),
    branch: yup.string().uuid("Filial UUID noto'g'ri").required("Filialni tanlang"),
    notes: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

interface Props {
    manager?: IManager | null;
    onClose: () => void;
}

export default function ManagerFormModal({ manager, onClose }: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEdit = !!manager;
    const [phoneDisplay, setPhoneDisplay] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { activeCenter, isCentersLoaded } = useActiveCenterStore();

    const u = manager?.user;
    const nameFromFull = splitFullName(u?.full_name);

    const draftKey = isEdit ? `edit-manager-${manager!.id}-draft` : "manager-form-draft";
    const draft = getFormDraft<Partial<Omit<FormData, "password">>>(draftKey);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        context: { isEdit },
        defaultValues: {
            first_name: draft?.first_name ?? (u?.first_name || nameFromFull.first),
            last_name: draft?.last_name ?? (u?.last_name || nameFromFull.last),
            phone: draft?.phone ?? (u?.phone || "998"),
            email: draft?.email ?? (u?.email || ""),
            password: "",
            branch: draft?.branch ?? ((manager as any)?.branch || ""),
            notes: draft?.notes ?? (manager?.notes || ""),
        },
    });

    const watchedValues = watch();
    useFormDraftSave(draftKey, { ...watchedValues, password: undefined });

    useEffect(() => {
        const currentPhone = draft?.phone ?? u?.phone;
        if (currentPhone) setPhoneDisplay(formatUzPhone(currentPhone));
    }, [u]);


    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        setValue("phone", "998" + local, { shouldValidate: true });
    };

    const { mutate: saveManager, isPending } = useMutation({
        mutationFn: async (body: FormData) => {
            if (!activeCenter) throw new Error(t("center.no_active_center"));
            const payload: any = { ...body, center: activeCenter };
            if (isEdit && !payload.password) delete payload.password;
            return isEdit
                ? (await API.patch(`director/admins/${manager!.id}/`, payload)).data
                : (await API.post("director/admins/", payload)).data;
        },
        onSuccess: (data: any) => {
            toast.success(data?.message || t(isEdit ? "director.managers.toast.updated" : "director.managers.toast.created"));
            queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
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
            toast.error(t("director.managers.toast.error_generic"));
        },
    });

    const fieldCls = (hasError?: boolean) =>
        `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:ring-2 focus:ring-primary-ring ${hasError ? "border-danger/50" : "border-border focus:border-primary"}`;
    const labelCls = "text-[14px] text-foreground-muted mb-1 block font-semibold";
    const errCls = "text-red-400 dark:text-danger text-[11px] mt-1";

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
                    <UserCog className="w-6 h-6" />
                </div>

                <h3 className="text-foreground text-[18px] font-semibold mb-4">
                    {isEdit ? t("director.managers.form.title_edit") : t("director.managers.form.title_add")}
                </h3>

                <form onSubmit={handleSubmit((d) => saveManager(d))} className="space-y-4">
                    {/* Ism + Familiya */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("common.first_name")} *</label>
                            <input {...register("first_name")} placeholder="Jasur" className={fieldCls(!!errors.first_name)} />
                            {errors.first_name && <p className={errCls}>{errors.first_name.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>{t("common.last_name")} *</label>
                            <input {...register("last_name")} placeholder="Karimov" className={fieldCls(!!errors.last_name)} />
                            {errors.last_name && <p className={errCls}>{errors.last_name.message}</p>}
                        </div>
                    </div>

                    {/* Filial */}
                    <ScopeFormFields
                        branchValue={watch("branch")}
                        onBranchChange={(id) => setValue("branch", id, { shouldValidate: true })}
                        branchError={(errors as any).branch?.message}
                    />

                    {/* Telefon + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>{t("common.phone")} *</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm font-semibold text-foreground pointer-events-none select-none">+998</span>
                                <input type="tel" value={phoneDisplay} onChange={handlePhoneChange} placeholder="90-123-45-67" className={`${fieldCls(!!errors.phone)} pl-[55px]`} />
                            </div>
                            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>{t("common.email")} *</label>
                            <input {...register("email")} type="email" placeholder="manager@example.com" className={fieldCls(!!errors.email)} />
                            {errors.email && <p className={errCls}>{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Parol */}
                    <div>
                        <label className={labelCls}>
                            {isEdit ? t("director.managers.form.password_label_edit") : `${t("common.password")} *`}
                        </label>
                        <div className="relative flex items-center">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder={isEdit ? t("director.managers.form.password_placeholder_edit") : "••••••"}
                                className={`${fieldCls(!!errors.password)} pr-10`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-foreground-subtle hover:text-foreground cursor-pointer">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className={errCls}>{errors.password.message}</p>}
                    </div>

                    {/* Izoh */}
                    <div>
                        <label className={labelCls}>{t("director.managers.form.note_label")}</label>
                        <textarea
                            {...register("notes")}
                            rows={2}
                            placeholder={t("director.managers.form.note_placeholder")}
                            className="border rounded-lg w-full px-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-surface text-foreground border-border focus:border-primary placeholder:text-foreground-subtle"
                        />
                    </div>

                    {/* Markaz biriktirilmagan ogohlantirish */}
                    {isCentersLoaded && !activeCenter && (
                        <p className="text-warning text-[13px] bg-warning-bg dark:bg-amber-900/20 border border-warning/20 dark:border-amber-800/50 rounded-lg px-3 py-2">
                            {t("center.no_active_center")}
                        </p>
                    )}

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isPending || !activeCenter} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t("common.save") : t("common.create")}
                        </button>
                    </div>
                </form>
        </FormModalShell>
    );
}