"use client";

// components/profile/PasswordModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { API } from "@/services/api";
import ModalShell from "./ModalShell";

const schema = yup.object({
  old_password: yup.string().required("Joriy parol majburiy"),
  new_password: yup.string().required("Yangi parol majburiy").min(8, "Kamida 8 belgi"),
  confirm_password: yup
    .string()
    .required("Tasdiqlang")
    .oneOf([yup.ref("new_password")], "Parollar mos kelmadi"),
});
type Form = yup.InferType<typeof schema>;

export default function PasswordModal({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: yupResolver(schema) });

  const { mutate: change, isPending } = useMutation({
    mutationFn: (body: Form) =>
      API.patch("me/", {
        old_password: body.old_password,
        new_password: body.new_password,
      }),
    onSuccess: () => {
      toast.success("Parol o'zgartirildi");
      onClose();
    },
    onError: () => toast.error("Parolni o'zgartirib bo'lmadi. Joriy parolni tekshiring"),
  });

  return (
    <ModalShell
      icon={<Lock className="w-7 h-7" />}
      iconBg="bg-indigo-600"
      title="Parolni o'zgartirish"
      desc="Parolni o'zgartirish uchun joriy parolni kiriting"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            form="pw-form"
            disabled={isPending}
            className="flex items-center gap-2 px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            O'zgartirish
          </button>
        </>
      }
    >
      <form id="pw-form" onSubmit={handleSubmit((d) => change(d))} className="space-y-4 py-2">
        <Field label="Joriy parol" show={show} error={errors.old_password?.message} register={register("old_password")} toggle={() => setShow((s) => !s)} />
        <Field label="Yangi parol" show={show} error={errors.new_password?.message} register={register("new_password")} />
        <Field label="Parolni tasdiqlang" show={show} error={errors.confirm_password?.message} register={register("confirm_password")} />
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  show,
  error,
  register,
  toggle,
}: {
  label: string;
  show: boolean;
  error?: string;
  register: any;
  toggle?: () => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
        <span className="text-red-500">*</span> {label}
      </label>
      <div className="relative mt-1.5">
        <input
          {...register}
          type={show ? "text" : "password"}
          placeholder="Kiriting"
          className={`w-full h-11 px-3.5 pr-11 rounded-xl text-sm outline-none transition-all
            bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400
            border ${error ? "border-red-500/60 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"}`}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}