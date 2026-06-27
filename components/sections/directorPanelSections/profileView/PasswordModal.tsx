"use client";

// components/profile/PasswordModal.tsx
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API } from "@/services/api";
import ModalShell from "./ModalShell";

type Form = { old_password: string; new_password: string; confirm_password: string };

export default function PasswordModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const schema = useMemo(
    () =>
      yup.object({
        old_password: yup.string().required(t("director.profile.password.validation.old_required")),
        new_password: yup
          .string()
          .required(t("director.profile.password.validation.new_required"))
          .min(8, t("director.profile.password.validation.new_min")),
        confirm_password: yup
          .string()
          .required(t("director.profile.password.validation.confirm_required"))
          .oneOf([yup.ref("new_password")], t("director.profile.password.validation.confirm_match")),
      }),
    [t]
  );

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
      toast.success(t("director.profile.toast.password_changed"));
      onClose();
    },
    onError: () => toast.error(t("director.profile.toast.password_error")),
  });

  return (
    <ModalShell
      icon={<Lock className="w-7 h-7" />}
      iconBg="bg-primary"
      title={t("director.profile.password.modal_title")}
      desc={t("director.profile.password.modal_desc")}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-hover text-foreground text-sm font-bold hover:bg-border transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="pw-form"
            disabled={isPending}
            className="flex items-center gap-2 px-5 h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("director.profile.password.update_btn")}
          </button>
        </>
      }
    >
      <form id="pw-form" onSubmit={handleSubmit((d) => change(d))} className="space-y-4 py-2">
        <Field
          label={t("director.profile.password.current_label")}
          placeholder={t("director.profile.password.placeholder")}
          show={show}
          error={errors.old_password?.message}
          register={register("old_password")}
          toggle={() => setShow((s) => !s)}
        />
        <Field
          label={t("director.profile.password.new_label")}
          placeholder={t("director.profile.password.placeholder")}
          show={show}
          error={errors.new_password?.message}
          register={register("new_password")}
        />
        <Field
          label={t("director.profile.password.confirm_label")}
          placeholder={t("director.profile.password.placeholder")}
          show={show}
          error={errors.confirm_password?.message}
          register={register("confirm_password")}
        />
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  placeholder,
  show,
  error,
  register,
  toggle,
}: {
  label: string;
  placeholder: string;
  show: boolean;
  error?: string;
  register: any;
  toggle?: () => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-foreground flex items-center gap-1">
        <span className="text-danger">*</span> {label}
      </label>
      <div className="relative mt-1.5">
        <input
          {...register}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full h-11 px-3.5 pr-11 rounded-xl text-sm outline-none transition-all
            bg-layout text-foreground placeholder:text-foreground-subtle
            border ${error ? "border-danger/60 focus:border-danger" : "border-border focus:border-primary"}`}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted"
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-[11px] mt-1">{error}</p>}
    </div>
  );
}
