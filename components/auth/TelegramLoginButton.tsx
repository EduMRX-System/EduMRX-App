"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";

import { API } from "@/services/api";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { getUrlForRole, getCookieOptions } from "@/utils/redirect";
import { useAuthStore } from "@/store/authStore";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  phone_number?: string;
}

type PhoneForm = { phone: string };

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export function TelegramLoginButton() {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [pendingTgUser, setPendingTgUser] = useState<TelegramUser | null>(null);
  const clientId = process.env.NEXT_PUBLIC_TELEGRAM_CLIENT_ID;

  const phoneSchema = useMemo(
    () =>
      yup.object({
        phone: yup
          .string()
          .required(t("auth.telegram.phone_required"))
          .test("len", t("auth.telegram.phone_invalid"), (val) =>
            val?.replace(/\D/g, "").length === 12
          ),
      }),
    [t]
  );

  const {
    control,
    handleSubmit,
    reset: resetPhone,
    formState: { errors },
  } = useForm<PhoneForm>({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const redirectAfterLogin = (res: { data: { user: TelegramUser & { role?: string }; access_token: string; refresh_token: string; message?: string } }) => {
    const { user, access_token, refresh_token, message } = res.data;
    const cookieOptions = getCookieOptions();
    document.cookie = `access_token=${access_token}; ${cookieOptions}`;
    document.cookie = `refresh_token=${refresh_token}; ${cookieOptions}`;
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; ${cookieOptions}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login(user as any, { access_token, refresh_token });
    toast.success(message || t("auth.telegram.success"));

    const base = getUrlForRole(user?.role);
    if (!base) {
      toast.error(t("auth.telegram.role_error"));
      return;
    }
    const isLocal = window.location.hostname.includes("localhost");
    const url = isLocal
      ? `${base}/?at=${encodeURIComponent(access_token)}&rt=${encodeURIComponent(refresh_token)}`
      : base;
    window.location.replace(url);
  };

  const { mutate: authTg, isPending } = useMutation({
    mutationFn: (payload: object) => API.post("auth/telegram/", payload),
    onSuccess: redirectAfterLogin,
    onError: () => toast.error(t("auth.telegram.error")),
  });

  useEffect(() => {
    if (typeof window === "undefined" || !clientId) return;

    window.onTelegramAuth = (user: TelegramUser) => {
      if (user.phone_number) {
        authTg(user);
      } else {
        setPendingTgUser(user);
      }
    };

    const script = document.createElement("script");
    script.src = "https://oauth.telegram.org/js/telegram-login.js?5";
    script.async = true;
    script.setAttribute("data-client-id", clientId);
    script.setAttribute("data-onauth", "onTelegramAuth(data)");
    script.setAttribute("data-request-access", "write phone");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      delete window.onTelegramAuth;
    };
  }, [clientId]); // authTg is stable across renders

  if (!clientId) return null;

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-foreground-subtle font-medium select-none">
          {t("auth.telegram.or")}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Telegram button */}
      <div className="flex justify-center items-center min-h-[44px]">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <div className="w-4 h-4 rounded-full border-2 border-primary-ring border-t-primary animate-spin" />
            {t("auth.telegram.loading")}
          </div>
        ) : (
          <button className="tg-auth-button" data-style="outlined shine">
            {t("auth.telegram.button")}
          </button>
        )}
      </div>

      {/* Phone fallback modal */}
      <AnimatePresence>
        {pendingTgUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-foreground">
                  {t("auth.telegram.phone_modal_title")}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setPendingTgUser(null);
                    resetPhone();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground-subtle hover:text-foreground hover:bg-hover dark:hover:bg-hover transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-foreground-muted mb-5">
                {t("auth.telegram.phone_modal_desc")}
              </p>

              <form
                onSubmit={handleSubmit(({ phone }) => {
                  authTg({ ...pendingTgUser, phone: `+${phone}` });
                  setPendingTgUser(null);
                  resetPhone();
                })}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground-muted flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {t("auth.common.phone_label")}
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {isPending ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    t("auth.telegram.phone_submit")
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
