"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ArrowLeft, User, Phone, Mail, Camera, Loader2, ShieldCheck } from "lucide-react";
import { API } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { formatUzPhone } from "@/utils/formatters";
import Skeleton from "@/components/common/Skeleton";

interface ProfileData {
  id: string;
  phone: string;
  email: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  avatar: string | null;
}

const schema = yup.object({
  first_name: yup.string().required("Ism majburiy"),
  last_name: yup.string().required("Familiya majburiy"),
  phone: yup
    .string()
    .required("Telefon majburiy")
    .test("phone-complete", "Telefon to'liq emas", (val) => (val?.replace(/\D/g, "") ?? "").length === 12),
  email: yup
    .string()
    .transform((v) => (v && v.trim().length > 0 ? v : undefined))
    .email("Email noto'g'ri")
    .optional(),
});

type FormData = yup.InferType<typeof schema>;

export default function DirectorDetailsView() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, login, tokens } = useAuthStore();

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => (await API.get("me/")).data,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [phoneDisplay, setPhoneDisplay] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { first_name: "", last_name: "", phone: "998", email: "" },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone ? "998" + profile.phone.replace(/\D/g, "").replace(/^998/, "").slice(0, 9) : "998",
      email: profile.email ?? "",
    });
    setPhoneDisplay(formatUzPhone(profile.phone.replace(/\D/g, "").replace(/^998/, "")));
    setAvatarPreview(profile.avatar ?? null);
  }, [profile, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
    setPhoneDisplay(formatUzPhone(local));
    setValue("phone", "998" + local, { shouldValidate: true });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const fd = new FormData();
      fd.append("first_name", data.first_name);
      fd.append("last_name", data.last_name);
      fd.append("phone", data.phone);
      fd.append("email", data.email ?? "");
      if (avatarFile) fd.append("avatar", avatarFile);
      const res = await API.patch("me/", fd);
      return res.data as ProfileData;
    },
    onSuccess: (updated) => {
      toast.success(t("director.profile.details.toast.updated"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // authStore'dagi userni ham yangilaymiz — Header/ProfileView shu yerdan o'qiydi
      if (user && tokens) login({ ...user, ...updated }, tokens);
    },
    onError: () => toast.error(t("director.profile.details.toast.error")),
  });

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Skeleton variant="block" className="w-24 h-9" />
        <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="w-16 h-16" />
            <Skeleton variant="text" className="w-32" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="block" className="w-full h-10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-bold text-foreground-muted hover:text-foreground bg-surface border border-border/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("common.back")}
      </button>

      <div className="rounded-2xl bg-surface border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">{t("director.profile.details.title")}</h1>
        </div>

        <form onSubmit={handleSubmit((d) => saveProfile(d))} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black text-white">
                    {`${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </span>
            </div>
            <label className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border bg-surface text-sm font-semibold text-foreground hover:bg-hover cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              {t("director.profile.details.avatar_upload")}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* Ism + Familiya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
                {t("director.profile.details.first_name_label")}
              </label>
              <input
                {...register("first_name")}
                className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring ${errors.first_name ? "border-danger/50" : "border-border"}`}
              />
              {errors.first_name && <p className="text-danger text-[11px] mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
                {t("director.profile.details.last_name_label")}
              </label>
              <input
                {...register("last_name")}
                className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring ${errors.last_name ? "border-danger/50" : "border-border"}`}
              />
              {errors.last_name && <p className="text-danger text-[11px] mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-[14px] text-foreground-muted mb-1 block font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> {t("common.phone")}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-semibold text-foreground pointer-events-none">+998</span>
              <input
                type="tel"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                placeholder="90-123-45-67"
                className={`border rounded-lg w-full h-[40px] pl-[54px] pr-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring ${errors.phone ? "border-danger/50" : "border-border"}`}
              />
            </div>
            {errors.phone && <p className="text-danger text-[11px] mt-1">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[14px] text-foreground-muted mb-1 block font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" /> {t("common.email")}
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle ${errors.email ? "border-danger/50" : "border-border"}`}
            />
            {errors.email && <p className="text-danger text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-10 px-4 border border-border bg-surface text-foreground hover:bg-hover text-sm font-semibold rounded-lg cursor-pointer transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer transition-colors"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
