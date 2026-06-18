"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Settings as SettingsIcon,
  Camera,
  Check,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { API } from "@/services/api";

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

const ROLE_LABEL: Record<string, string> = {
  director: "Direktor",
  manager: "Menejer",
  teacher: "O'qituvchi",
  student: "O'quvchi",
  parent: "Ota-ona",
};

type Tab = "profile" | "security" | "settings";

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profil", icon: User },
  { key: "security", label: "Xavfsizlik", icon: Lock },
  { key: "settings", label: "Sozlamalar", icon: SettingsIcon },
];

export default function ProfileView() {
  const [tab, setTab] = useState<Tab>("profile");

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => (await API.get("me/")).data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="">
      {/* HEADER */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Cover — indigo/slate */}
        <div className="h-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(79,70,229,0.4),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.25),transparent_50%)]" />
        </div>

        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <ProfileAvatar profile={profile} initials={initials} />

            <div className="sm:pb-1.5 flex-1">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {profile.full_name}
              </h1>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  +{profile.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="px-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-1 -mb-px">
            {TABS.map((tItem) => {
              const Icon = tItem.icon;
              const active = tab === tItem.key;
              return (
                <button
                  key={tItem.key}
                  onClick={() => setTab(tItem.key)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors ${active
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-5">
        {tab === "profile" && <ProfileTab profile={profile} />}
        {tab === "security" && <SecurityTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ════════════════ AVATAR ════════════════ */
function ProfileAvatar({
  profile,
  initials,
}: {
  profile: ProfileData;
  initials: string;
}) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("avatar", file);
      return API.patch("me/", fd);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["profile"], res.data);
      toast.success("Rasm yangilandi");
    },
    onError: () => toast.error("Rasm yuklashda xatolik"),
  });

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
  };

  return (
    <div className="relative w-20 h-20 shrink-0">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shadow-md">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-black text-white">{initials || "?"}</span>
        )}
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={isPending}
        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
        aria-label="Rasm yuklash"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Camera className="w-3.5 h-3.5" />
        )}
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
    </div>
  );
}

/* ════════════════ PROFIL TAB ════════════════ */
const profileSchema = yup.object({
  first_name: yup.string().required("Ism majburiy"),
  last_name: yup.string().required("Familiya majburiy"),
  email: yup.string().email("Email noto'g'ri").nullable(),
});
type ProfileForm = yup.InferType<typeof profileSchema>;

function ProfileTab({ profile }: { profile: ProfileData }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    values: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
    },
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: (body: ProfileForm) => API.patch("me/", body),
    onSuccess: (res) => {
      queryClient.setQueryData(["profile"], res.data);
      toast.success("Profil saqlandi");
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => save(d))}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
    >
      <h2 className="text-base font-black text-slate-900 dark:text-white">Shaxsiy ma'lumotlar</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
        Ism, familiya va aloqa ma'lumotlaringizni yangilang
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <Input label="Ism" icon={<User className="w-4 h-4" />} error={errors.first_name?.message} register={register("first_name")} />
        <Input label="Familiya" icon={<User className="w-4 h-4" />} error={errors.last_name?.message} register={register("last_name")} />
      </div>

      <div className="mt-5">
        <Input label="Email" type="email" icon={<Mail className="w-4 h-4" />} error={errors.email?.message} register={register("email")} />
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Phone className="w-4 h-4" /> Telefon
        </label>
        <div className="mt-1.5 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center text-sm text-slate-500 dark:text-slate-400">
          +{profile.phone}
          <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wide">O'zgarmas</span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>O'zgarishlarni saqlash</span>
        </button>
      </div>
    </form>
  );
}

/* ════════════════ XAVFSIZLIK TAB ════════════════ */
const pwSchema = yup.object({
  old_password: yup.string().required("Joriy parol majburiy"),
  new_password: yup.string().required("Yangi parol majburiy").min(8, "Kamida 8 belgi"),
  confirm_password: yup
    .string()
    .required("Parolni tasdiqlang")
    .oneOf([yup.ref("new_password")], "Parollar mos kelmadi"),
});
type PwForm = yup.InferType<typeof pwSchema>;

function SecurityTab() {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PwForm>({ resolver: yupResolver(pwSchema) });

  const { mutate: changePw, isPending } = useMutation({
    mutationFn: (body: PwForm) =>
      API.patch("me/", {
        old_password: body.old_password,
        new_password: body.new_password,
      }),
    onSuccess: () => {
      toast.success("Parol o'zgartirildi");
      reset();
    },
    onError: () => toast.error("Parolni o'zgartirib bo'lmadi. Joriy parolni tekshiring"),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => changePw(d))}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 max-w-xl"
    >
      <h2 className="text-base font-black text-slate-900 dark:text-white">Parolni o'zgartirish</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
        Xavfsizlik uchun kuchli parol tanlang
      </p>

      <div className="mt-6 space-y-5">
        <PwInput label="Joriy parol" show={show} error={errors.old_password?.message} register={register("old_password")} />
        <PwInput label="Yangi parol" show={show} error={errors.new_password?.message} register={register("new_password")} />
        <PwInput label="Yangi parolni tasdiqlang" show={show} error={errors.confirm_password?.message} register={register("confirm_password")} />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {show ? "Parollarni yashirish" : "Parollarni ko'rsatish"}
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>Parolni yangilash</span>
        </button>
      </div>
    </form>
  );
}

/* ════════════════ SOZLAMALAR TAB ════════════════ */
function SettingsTab() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 max-w-xl">
      <h2 className="text-base font-black text-slate-900 dark:text-white">Sozlamalar</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
        Bildirishnoma va interfeys sozlamalari
      </p>

      <div className="mt-6 space-y-1">
        <ToggleRow title="Email bildirishnomalar" desc="Yangiliklar va hisobotlarni emailga olish" defaultOn />
        <ToggleRow title="SMS bildirishnomalar" desc="Muhim hodisalar haqida SMS" />
        <ToggleRow title="Haftalik hisobot" desc="Har dushanba kuni umumiy hisobot" defaultOn />
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultOn = false }: { title: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
          }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""
            }`}
        />
      </button>
    </div>
  );
}

/* ════════════════ REUSABLE INPUTS ════════════════ */
function Input({
  label,
  icon,
  error,
  register,
  type = "text",
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  register: any;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <input
        {...register}
        type={type}
        className={`mt-1.5 w-full h-11 px-3.5 rounded-xl text-sm outline-none transition-all
          bg-white dark:bg-slate-800 text-slate-900 dark:text-white
          border ${error
            ? "border-red-500/60 focus:border-red-500"
            : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
          }`}
      />
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

function PwInput({
  label,
  show,
  error,
  register,
}: {
  label: string;
  show: boolean;
  error?: string;
  register: any;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...register}
        type={show ? "text" : "password"}
        placeholder="••••••••"
        className={`mt-1.5 w-full h-11 px-3.5 rounded-xl text-sm outline-none transition-all
          bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
          border ${error
            ? "border-red-500/60 focus:border-red-500"
            : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
          }`}
      />
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}