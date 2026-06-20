"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { UserCog, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useBranchOptions } from "@/hooks/useBranches";
import { formatUzPhone, splitFullName, type IManager } from "@/types/manager";
import SearchSelect from "@/components/ui/SearchSelect";

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
    center: yup.string().uuid("Filial UUID noto'g'ri").required("Filialni tanlang"),
    notes: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

interface Props {
    manager?: IManager | null;
    onClose: () => void;
}

export default function ManagerFormModal({ manager, onClose }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!manager;
    const [isMounted, setIsMounted] = useState(false);
    const [phoneDisplay, setPhoneDisplay] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { data: branches = [], isLoading: branchesLoading } = useBranchOptions();

    const u = manager?.user;
    const nameFromFull = splitFullName(u?.full_name);

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
            first_name: u?.first_name || nameFromFull.first,
            last_name: u?.last_name || nameFromFull.last,
            phone: u?.phone || "998",
            email: u?.email || "",
            password: "",
            center: manager?.center || "",
            notes: manager?.notes || "",
        },
    });

    useEffect(() => {
        setIsMounted(true);
        if (u?.phone) setPhoneDisplay(formatUzPhone(u.phone));
    }, [u]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        setValue("phone", "998" + local, { shouldValidate: true });
    };

    const { mutate: saveManager, isPending } = useMutation({
        mutationFn: async (body: FormData) => {
            // edit'da parol bo'sh bo'lsa yubormaymiz
            const payload: any = { ...body };
            if (isEdit && !payload.password) delete payload.password;
            return isEdit
                ? (await API.patch(`director/admins/${manager!.id}/`, payload)).data
                : (await API.post("director/admins/", payload)).data;
        },
        onSuccess: (data: any) => {
            toast.success(data?.message || (isEdit ? "Menejer yangilandi" : "Menejer qo'shildi"));
            queryClient.invalidateQueries({ queryKey: ["managers"] });
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
            toast.error("Xatolik yuz berdi");
        },
    });

    const fieldCls = (hasError?: boolean) =>
        `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 ${hasError ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`;
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";
    const errCls = "text-red-400 dark:text-red-500 text-[11px] mt-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
            >
                <div className="sticky top-0 z-50 h-0 w-full flex justify-end items-start pointer-events-none">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pointer-events-auto -mt-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-[10px] border border-slate-200 dark:border-slate-700 shadow-sm w-[44px] h-[44px] rounded-lg flex justify-center items-center text-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20">
                    <UserCog className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? "Menejerni tahrirlash" : "Yangi menejer qo'shish"}
                </h3>

                <form onSubmit={handleSubmit((d) => saveManager(d))} className="space-y-4">
                    {/* Ism + Familiya */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Ism *</label>
                            <input {...register("first_name")} placeholder="Jasur" className={fieldCls(!!errors.first_name)} />
                            {errors.first_name && <p className={errCls}>{errors.first_name.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Familiya *</label>
                            <input {...register("last_name")} placeholder="Karimov" className={fieldCls(!!errors.last_name)} />
                            {errors.last_name && <p className={errCls}>{errors.last_name.message}</p>}
                        </div>
                    </div>

                    {/* Filial */}
                    <SearchSelect
                        label="Filial"
                        required
                        value={watch("center") || ""}
                        options={branches}
                        loading={branchesLoading}
                        placeholder="Filialni tanlang..."
                        error={errors.center?.message}
                        onChange={(id) => setValue("center", id, { shouldValidate: true })}
                    />

                    {/* Telefon + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Telefon *</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm font-semibold text-slate-700 dark:text-slate-300 pointer-events-none select-none">+998</span>
                                <input type="tel" value={phoneDisplay} onChange={handlePhoneChange} placeholder="90-123-45-67" className={`${fieldCls(!!errors.phone)} pl-[55px]`} />
                            </div>
                            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Email *</label>
                            <input {...register("email")} type="email" placeholder="manager@example.com" className={fieldCls(!!errors.email)} />
                            {errors.email && <p className={errCls}>{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Parol */}
                    <div>
                        <label className={labelCls}>
                            Parol {isEdit ? "(o'zgartirish uchun)" : "*"}
                        </label>
                        <div className="relative flex items-center">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder={isEdit ? "Bo'sh qoldirsangiz o'zgarmaydi" : "••••••"}
                                className={`${fieldCls(!!errors.password)} pr-10`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className={errCls}>{errors.password.message}</p>}
                    </div>

                    {/* Izoh */}
                    <div>
                        <label className={labelCls}>Izoh (ixtiyoriy)</label>
                        <textarea
                            {...register("notes")}
                            rows={2}
                            placeholder="Menejer haqida qo'shimcha..."
                            className="border rounded-lg w-full px-3 py-2.5 text-[14px] outline-none transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:border-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    {/* Tugmalar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <button type="button" onClick={onClose} className="h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                            Bekor qilish
                        </button>
                        <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors">
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? "Saqlash" : "Yaratish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}