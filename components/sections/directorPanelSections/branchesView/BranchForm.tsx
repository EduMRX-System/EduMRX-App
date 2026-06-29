"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import BranchMapPicker from "./BranchMapPicker";
import { BranchFormValues, branchSchema } from "@/types/branch";
import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
    defaultValues: BranchFormValues;
    submitting: boolean;
    submitLabel: string;
    serverError?: string | null;
    onSubmit: (values: BranchFormValues) => void;
    onCancel: () => void;
}

const inputCls =
    "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground-subtle focus:border-primary focus:ring-2 focus:ring-primary-ring";

const labelCls =
    "mb-1.5 block text-sm font-medium text-foreground-muted";

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
                    <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
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
                        <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
                    )}
                </div>
                <div>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <CustomSelect
                                label={t("director.branches.form.status_label")}
                                value={field.value ?? "active"}
                                onChange={field.onChange}
                                options={[
                                    { value: "active", label: t("common.active") },
                                    { value: "inactive", label: t("common.inactive") },
                                ]}
                            />
                        )}
                    />
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
                    <p className="mt-1 text-xs text-danger">{errors.address.message}</p>
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
                <div className="rounded-xl bg-danger-bg px-3.5 py-2.5 text-sm text-danger dark:bg-danger-bg0/10 dark:text-danger">
                    {serverError}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-muted transition hover:bg-hover disabled:opacity-50"
                >
                    {t("common.cancel")}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}