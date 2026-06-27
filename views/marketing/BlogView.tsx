"use client";

import { useTranslation } from "react-i18next";

export default function BlogView() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-black text-foreground">
        {t("marketing.blog.title")}
      </h1>
      <p className="text-sm text-foreground-muted leading-relaxed font-medium">
        {t("marketing.blog.coming_soon")}
      </p>
    </div>
  );
}
