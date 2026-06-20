"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import { GraduationCap, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatUzPhone, splitFullName, type ITeacher } from "@/types/teacher";
import SearchSelect from "@/components/ui/SearchSelect";
import { useBranchOptions } from "@/hooks/useBranchOptions";

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
    centers: yup.string().uuid("Markaz UUID noto'g'ri").required("Markazni tanlang"),
    specialization: yup.string().required("Mutaxassislik majburiy"),
    experience: yup.number().typeError("Raqam kiriting").min(0, "Manfiy bo'lmasin").max(50, "Juda katta").required("Tajriba majburiy"),
    salary: yup.string().required("Maosh majburiy").matches(/^\d+$/, "Faqat raqam"),
    bio: yup.string().min(10, "Kamida 10 belgi").required("Bio majburiy"),
    date_of_birth: yup.string().required("Tug'ilgan sana majburiy"),
});

type FormData = yup.InferType<typeof schema>;

interface Props {
    teacher?: ITeacher | null; // berilsa — tahrirlash
    onClose: () => void;
}

export default function TeacherFormModal({ teacher, onClose }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!teacher;
    const [isMounted, setIsMounted] = useState(false);
    const [phoneDisplay, setPhoneDisplay] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { data: branches = [], isLoading: branchesLoading } = useBranchOptions();

    const u = teacher?.user;
    const currentCenterId = teacher?.centers || teacher?.center || teacher?.center_id || teacher?.branch || "";
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
            centers: currentCenterId,
            specialization: teacher?.specialization || "",
            experience: teacher?.experience ?? 0,
            salary: teacher?.salary ? String(Math.abs(parseInt(teacher.salary))).replace(/\D/g, "") : "",
            bio: teacher?.bio || "",
            date_of_birth: teacher?.date_of_birth ? teacher.date_of_birth.slice(0, 10) : "",
        },
    });

    useEffect(() => {
        setIsMounted(true);
        if (u?.phone) setPhoneDisplay(formatUzPhone(u.phone));
    }, [u]);

    // Filial options'da yo'q bo'lsa, joriy filialni qo'shamiz (label ko'rinishi uchun)
    const branchOptions = useMemo(() => {
        if (currentCenterId && teacher?.center_name && !branches.some((b) => b.id === currentCenterId)) {
            return [{ id: currentCenterId, label: teacher.center_name }, ...branches];
        }
        return branches;
    }, [branches, currentCenterId, teacher?.center_name]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
        setPhoneDisplay(formatUzPhone(local));
        setValue("phone", "998" + local, { shouldValidate: true });
    };

    const { mutate: saveTeacher, isPending } = useMutation({
        mutationFn: async (body: FormData) => {
            // edit'da parol yuborilmaydi
            const { password, ...rest } = body;
            const payload = isEdit ? rest : body;
            const res = isEdit
                ? await API.put(`director/teachers/${teacher!.id}/`, payload)
                : await API.post("director/teachers/", payload);
            return res.data;
        },
        onSuccess: (data: any) => {
            toast.success(data?.message || (isEdit ? "O'qituvchi yangilandi" : "O'qituvchi qo'shildi"));
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
    });

    const fieldCls = (hasError?: boolean) =>
        `border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 ${hasError ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`;
    const labelCls = "text-[14px] text-slate-600 dark:text-slate-300 mb-1 block font-semibold";
    const errCls = "text-red-400 dark:text-red-500 text-[11px] mt-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMounted ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`bg-white dark:bg-slate-900 p-6 rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-12 scale-95"}`}
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
                    <GraduationCap className="w-6 h-6" />
                </div>

                <h3 className="text-slate-900 dark:text-slate-100 text-[18px] font-semibold mb-4">
                    {isEdit ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
                </h3>

                <form onSubmit={handleSubmit((d) => saveTeacher(d))} className="space-y-4">
                    {/* Ism + Familiya */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Ism *</label>
                            <input {...register("first_name")} placeholder="Botir" className={fieldCls(!!errors.first_name)} />
                            {errors.first_name && <p className={errCls}>{errors.first_name.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Familiya *</label>
                            <input {...register("last_name")} placeholder="Abbosov" className={fieldCls(!!errors.last_name)} />
                            {errors.last_name && <p className={errCls}>{errors.last_name.message}</p>}
                        </div>
                    </div>

                    {/* Filial */}
                    <SearchSelect
                        label="Filial"
                        required
                        value={watch("centers") || ""}
                        options={branchOptions}
                        loading={branchesLoading}
                        placeholder="Filialni tanlang..."
                        error={errors.centers?.message}
                        onChange={(id) => setValue("centers", id, { shouldValidate: true })}
                    />

                    {/* Telefon + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Telefon *</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-sm font-semibold text-slate-700 dark:text-slate-300 pointer-events-none select-none">+998</span>
                                <input
                                    type="tel"
                                    value={phoneDisplay}
                                    onChange={handlePhoneChange}
                                    placeholder="90-123-45-67"
                                    className={`${fieldCls(!!errors.phone)} pl-[55px]`}
                                />
                            </div>
                            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Email *</label>
                            <input {...register("email")} type="email" placeholder="teacher@example.com" className={fieldCls(!!errors.email)} />
                            {errors.email && <p className={errCls}>{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Parol (faqat add) + Tug'ilgan sana */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {!isEdit && (
                            <div>
                                <label className={labelCls}>Parol *</label>
                                <div className="relative flex items-center">
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••"
                                        className={`${fieldCls(!!errors.password)} pr-10`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className={errCls}>{errors.password.message}</p>}
                            </div>
                        )}
                        <div className={isEdit ? "sm:col-span-2" : ""}>
                            <label className={labelCls}>Tug'ilgan sana *</label>
                            <input {...register("date_of_birth")} type="date" className={fieldCls(!!errors.date_of_birth)} />
                            {errors.date_of_birth && <p className={errCls}>{errors.date_of_birth.message}</p>}
                        </div>
                    </div>

                    {/* Mutaxassislik + Tajriba */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Mutaxassislik *</label>
                            <input {...register("specialization")} placeholder="Senior Python Developer" className={fieldCls(!!errors.specialization)} />
                            {errors.specialization && <p className={errCls}>{errors.specialization.message}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>Tajriba (yil) *</label>
                            <input {...register("experience")} type="number" className={fieldCls(!!errors.experience)} />
                            {errors.experience && <p className={errCls}>{errors.experience.message}</p>}
                        </div>
                    </div>

                    {/* Maosh */}
                    <div>
                        <label className={labelCls}>Maosh *</label>
                        <div className="relative flex items-center">
                            <input {...register("salary")} type="number" placeholder="12000000" className={`${fieldCls(!!errors.salary)} pr-16`} />
                            <span className="absolute right-3 text-sm font-semibold text-slate-400 pointer-events-none select-none">so'm</span>
                        </div>
                        {errors.salary && <p className={errCls}>{errors.salary.message}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className={labelCls}>Biografiya *</label>
                        <textarea
                            {...register("bio")}
                            rows={3}
                            placeholder="O'qituvchi haqida qisqacha..."
                            className={`border rounded-lg w-full p-3 text-[14px] outline-none transition-all resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${errors.bio ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400"}`}
                        />
                        {errors.bio && <p className={errCls}>{errors.bio.message}</p>}
                    </div>

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