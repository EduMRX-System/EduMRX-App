"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import BranchMapPicker from "./BranchMapPicker";
import { BranchFormValues, branchSchema } from "@/types/branch";

interface Props {
    defaultValues: BranchFormValues;
    submitting: boolean;
    submitLabel: string;
    serverError?: string | null;
    onSubmit: (values: BranchFormValues) => void;
    onCancel: () => void;
}

const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500";

const labelCls =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function BranchForm({
    defaultValues,
    submitting,
    submitLabel,
    serverError,
    onSubmit,
    onCancel,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<BranchFormValues>({
        resolver: yupResolver(branchSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <label className={labelCls}>{t("director.branches.form.name_label")}</label>
                <input
                    {...register("name")}
                    className={inputCls}
                    placeholder={t("director.branches.form.name_placeholder")}
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
                )}
            </div>

            {/* Phone + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className={labelCls}>{t("director.branches.form.phone_label")}</label>
                    <input
                        {...register("phone")}
                        className={inputCls}
                        placeholder="+998901234567"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>
                    )}
                </div>
                <div>
                    <label className={labelCls}>{t("director.branches.form.status_label")}</label>
                    <select {...register("status")} className={inputCls}>
                        <option value="active">{t("common.active")}</option>
                        <option value="inactive">{t("common.inactive")}</option>
                    </select>
                </div>
            </div>

            {/* Address */}
            <div>
                <label className={labelCls}>{t("director.branches.form.address_label")}</label>
                <input
                    {...register("address")}
                    className={inputCls}
                    placeholder={t("director.branches.form.address_placeholder")}
                />
                {errors.address && (
                    <p className="mt-1 text-xs text-rose-500">{errors.address.message}</p>
                )}
            </div>

            {/* Map picker */}
            <div>
                <label className={labelCls}>{t("director.branches.form.location_label")}</label>
                <Controller
                    name="lat"
                    control={control}
                    render={({ field: latField }) => (
                        <Controller
                            name="lng"
                            control={control}
                            render={({ field: lngField }) => (
                                <BranchMapPicker
                                    lat={latField.value}
                                    lng={lngField.value}
                                    error={errors.lat?.message || errors.lng?.message}
                                    onChange={(lat, lng) => {
                                        latField.onChange(lat);
                                        lngField.onChange(lng);
                                    }}
                                    onAddressResolved={(addr) =>
                                        setValue("address", addr, { shouldValidate: true })
                                    }
                                />
                            )}
                        />
                    )}
                />
            </div>

            {serverError && (
                <div className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                    {serverError}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {t("common.cancel")}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}