"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Building2, Phone, Mail, MapPin, Image as ImageIcon,
  Loader2, Hash, ShieldCheck, CreditCard, UserRound, Users,
  GraduationCap, UserCog, DoorOpen, Users2, CalendarClock,
} from "lucide-react";
import { useActiveCenterStore } from "@/store/activeCenterStore";
import { useCenterDetail, useUpdateCenter } from "@/hooks/useCenter";
import { useTeachers } from "@/hooks/useTeachers";
import { useManagers } from "@/hooks/useManagers";
import { useBranches } from "@/hooks/useBranches";
import { useGroups } from "@/hooks/useGroups";
import { formatUzPhone } from "@/utils/formatters";
import { formatDate } from "@/types/payment";
import type { CenterPayload } from "@/types/center";
import Skeleton from "@/components/common/Skeleton";
import BranchMapPicker from "@/components/sections/directorPanelSections/branchesView/BranchMapPicker";

const schema = yup.object({
  name: yup.string().required("Nomi majburiy"),
  phone: yup
    .string()
    .required("Telefon majburiy")
    .test("phone-complete", "Telefon to'liq emas", (val) => (val?.replace(/\D/g, "") ?? "").length === 12),
  email: yup
    .string()
    .transform((v) => (v && v.trim().length > 0 ? v : undefined))
    .email("Email noto'g'ri")
    .optional(),
  address: yup.string().required("Manzil majburiy"),
  latitude: yup.string().required("Xaritadan joylashuvni belgilang"),
  longitude: yup.string().required("Xaritadan joylashuvni belgilang"),
});

type FormData = yup.InferType<typeof schema>;

export default function DirectorCenterView() {
  const { t } = useTranslation();
  const router = useRouter();
  const activeCenter = useActiveCenterStore((s) => s.activeCenter);

  const { data: center, isLoading } = useCenterDetail(activeCenter);
  const { mutate: updateCenter, isPending } = useUpdateCenter(activeCenter);

  // KPI qatori uchun hisoblar — director/analytics/summary/ bu maydonlarni
  // (teachers/managers count) hozircha qaytarmaydi, shuning uchun mavjud
  // ro'yxat endpointlaridan pageSize=1 bilan faqat `count` olinadi (real
  // ma'lumot, ortiqcha yuk yo'q). Backend alohida
  // "director/analytics/center-summary/" kabi bitta endpoint chiqarsa,
  // shu to'rtta so'rovni o'shanga almashtirish kifoya.
  const { data: teachersData, isLoading: teachersLoading } = useTeachers({ page: 1, pageSize: 1 });
  const { data: managersData, isLoading: managersLoading } = useManagers({ page: 1, pageSize: 1 });
  const { data: branchesData, isLoading: branchesLoading } = useBranches({ page: 1, pageSize: 1 });
  const { data: groupsData, isLoading: groupsLoading } = useGroups({ page: 1, pageSize: 1 });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [phoneDisplay, setPhoneDisplay] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", phone: "998", email: "", address: "", latitude: "", longitude: "" },
  });

  // Center yuklangach formani to'ldirish
  useEffect(() => {
    if (!center) return;
    reset({
      name: center.name,
      phone: center.phone ? "998" + center.phone.replace(/\D/g, "").replace(/^998/, "").slice(0, 9) : "998",
      email: center.email ?? "",
      address: center.address,
      latitude: center.latitude,
      longitude: center.longitude,
    });
    setPhoneDisplay(formatUzPhone(center.phone.replace(/\D/g, "").replace(/^998/, "")));
    setLogoPreview(center.logo ?? null);
  }, [center, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const local = (raw.startsWith("998") ? raw.slice(3) : raw).slice(0, 9);
    setPhoneDisplay(formatUzPhone(local));
    setValue("phone", "998" + local, { shouldValidate: true });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: FormData) => {
    const payload: CenterPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email ?? "",
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      logo: logoFile,
    };
    updateCenter(payload, {
      onSuccess: () => toast.success(t("director.profile.center.toast.updated")),
      onError: () => toast.error(t("director.profile.center.toast.error")),
    });
  };

  const lat = watch("latitude");
  const lng = watch("longitude");

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-5">
        <Skeleton variant="block" className="w-24 h-9" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border-subtle rounded-2xl p-5">
              <Skeleton variant="block" className="w-10 h-10 mb-3" />
              <Skeleton variant="text" className="w-16 mb-2" />
              <Skeleton variant="text" className="w-10 h-6" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-5 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" className="w-16 h-16" />
              <div className="space-y-2">
                <Skeleton variant="text" className="w-40" />
                <Skeleton variant="text" className="w-24" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="block" className="w-full h-10" />
            ))}
          </div>
          <div className="rounded-2xl bg-surface border border-border p-5">
            <Skeleton variant="block" className="w-full h-56" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-bold text-foreground-muted hover:text-foreground bg-surface border border-border/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("common.back")}
      </button>

      {/* ── KPI qatori — markaz haqida umumiy tasavvur ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <CenterKpiCard
          icon={<Users className="w-5 h-5 text-primary" />}
          iconBg="bg-primary-soft"
          label={t("director.profile.center.kpi.students")}
          value={center?.students_count ?? 0}
          loading={isLoading}
        />
        <CenterKpiCard
          icon={<GraduationCap className="w-5 h-5 text-success" />}
          iconBg="bg-success-bg dark:bg-success/10"
          label={t("director.profile.center.kpi.teachers")}
          value={teachersData?.count ?? 0}
          loading={teachersLoading}
        />
        <CenterKpiCard
          icon={<UserCog className="w-5 h-5 text-warning" />}
          iconBg="bg-warning-bg dark:bg-warning-bg0/10"
          label={t("director.profile.center.kpi.managers")}
          value={managersData?.count ?? 0}
          loading={managersLoading}
        />
        <CenterKpiCard
          icon={<DoorOpen className="w-5 h-5 text-danger" />}
          iconBg="bg-danger-bg dark:bg-danger/10"
          label={t("director.profile.center.kpi.branches")}
          value={branchesData?.count ?? 0}
          loading={branchesLoading}
        />
        <CenterKpiCard
          icon={<Users2 className="w-5 h-5 text-foreground-muted" />}
          iconBg="bg-hover"
          label={t("director.profile.center.kpi.groups")}
          value={groupsData?.count ?? 0}
          loading={groupsLoading}
        />
      </div>

      {/* ── Tahrirlash formasi + xarita/ma'lumot — kengroq 2 ustunli layout ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">{t("director.profile.center.title")}</h1>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-hover border border-border flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-foreground-subtle" />
              )}
            </div>
            <label className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border bg-surface text-sm font-semibold text-foreground hover:bg-hover cursor-pointer transition-colors">
              <ImageIcon className="w-4 h-4" />
              {t("director.profile.center.logo_upload")}
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
          </div>

          {/* Nomi */}
          <div>
            <label className="text-[14px] text-foreground-muted mb-1 block font-semibold">
              {t("director.profile.center.name_label")}
            </label>
            <input
              {...register("name")}
              className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle ${errors.name ? "border-danger/50" : "border-border"}`}
            />
            {errors.name && <p className="text-danger text-[11px] mt-1">{errors.name.message}</p>}
          </div>

          {/* Telefon + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="text-[14px] text-foreground-muted mb-1 block font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" /> {t("common.email")}
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="info@markaz.uz"
                className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle ${errors.email ? "border-danger/50" : "border-border"}`}
              />
              {errors.email && <p className="text-danger text-[11px] mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Manzil */}
          <div>
            <label className="text-[14px] text-foreground-muted mb-1 block font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {t("director.profile.center.address_label")}
            </label>
            <input
              {...register("address")}
              className={`border rounded-lg w-full h-[40px] px-3 text-[14px] outline-none transition-all bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary-ring placeholder:text-foreground-subtle ${errors.address ? "border-danger/50" : "border-border"}`}
            />
            {errors.address && <p className="text-danger text-[11px] mt-1">{errors.address.message}</p>}
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
        </div>

        {/* ── O'ng ustun: xarita + faqat o'qish uchun ma'lumot ── */}
        <div className="lg:col-span-1 space-y-5">
          <div className="rounded-2xl bg-surface border border-border p-5">
            <p className="text-[14px] text-foreground-muted mb-2 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {t("director.profile.center.map_title")}
            </p>
            <Controller
              name="latitude"
              control={control}
              render={() => (
                <BranchMapPicker
                  lat={lat ? Number(lat) : null}
                  lng={lng ? Number(lng) : null}
                  onChange={(newLat, newLng) => {
                    setValue("latitude", String(newLat), { shouldValidate: true });
                    setValue("longitude", String(newLng), { shouldValidate: true });
                  }}
                  onAddressResolved={(addr) => setValue("address", addr, { shouldValidate: true })}
                  error={errors.latitude?.message || errors.longitude?.message}
                />
              )}
            />
          </div>

          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wide">
              {t("director.profile.center.readonly_title")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ReadonlyField icon={<Hash className="w-3.5 h-3.5" />} label={t("director.profile.center.slug_label")} value={center?.slug || "—"} />
              <ReadonlyField icon={<ShieldCheck className="w-3.5 h-3.5" />} label={t("director.profile.center.status_label")} value={center?.status || "—"} />
              <ReadonlyField icon={<CreditCard className="w-3.5 h-3.5" />} label={t("director.profile.center.plan_label")} value={center?.plan || "—"} />
              <ReadonlyField icon={<UserRound className="w-3.5 h-3.5" />} label={t("director.profile.center.director_label")} value={center?.director_name || "—"} />
              <ReadonlyField icon={<CalendarClock className="w-3.5 h-3.5" />} label={t("director.profile.center.subscription_label")} value={formatDate(center?.subscription_expires)} className="col-span-2" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function CenterKpiCard({ icon, iconBg, label, value, loading }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-3 ${iconBg}`}>
        {icon}
      </div>
      <p className="text-[11px] font-semibold text-foreground-subtle dark:text-foreground-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      {loading ? (
        <div className="h-7 w-16 bg-hover rounded animate-pulse" />
      ) : (
        <span className="text-2xl font-black text-foreground">{value}</span>
      )}
    </div>
  );
}

function ReadonlyField({ icon, label, value, className = "" }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-xl bg-hover/60 border border-border-subtle px-3 py-2.5 ${className}`}>
      <p className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-subtle uppercase tracking-wide">
        {icon} {label}
      </p>
      <p className="text-[13px] font-semibold text-foreground mt-1 truncate">{value}</p>
    </div>
  );
}
