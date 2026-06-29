"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,

} from "lucide-react";
import Image from "next/image";
import { LogoIcons } from "@/constants/icons";
import { useUIStore } from "@/store/useUIStore";

export default function Footer() {
  const { theme, setTheme } = useUIStore();
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("marketing.footer.product"),
      links: [
        { label: t("marketing.nav.features"), href: "/features" },
        { label: t("marketing.nav.pricing"), href: "/pricing" },
        { label: t("marketing.footer.updates"), href: "/blog" },
        { label: t("marketing.footer.docs"), href: "/features" },
      ],
    },
    {
      title: t("marketing.footer.company"),
      links: [
        { label: t("marketing.nav.about"), href: "/about" },
        { label: t("marketing.nav.contact"), href: "/contact" },
        { label: t("marketing.footer.blog"), href: "/blog" },
        { label: t("marketing.footer.careers"), href: "/about" },
      ],
    },
    {
      title: t("marketing.footer.support"),
      links: [
        { label: t("marketing.footer.help"), href: "/contact" },
        { label: t("marketing.footer.privacy"), href: "/about" },
        { label: t("marketing.footer.terms"), href: "/about" },
        { label: t("marketing.footer.security"), href: "/about" },
      ],
    },
  ];
  const socials = [
    { icon: Send, href: "https://t.me/edumrx", label: "Telegram" },
    { icon: "Instagram", href: "https://instagram.com/edumrx", label: "Instagram" },
    { icon: "Youtube", href: "https://youtube.com/@edumrx", label: "YouTube" },
  ];
  return (
    <footer className="relative bg-layout border-t border-border-subtle overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4">

        {/* Top: CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border-subtle"
        >
          <div>
            <h3 className="text-xl font-black text-foreground">
              {t("marketing.footer.cta_title")}
            </h3>
            <p className="text-sm text-foreground-muted mt-1">
              {t("marketing.footer.cta_desc")}
            </p>
          </div>
          <Link
            href="/pricing"
            className="group shrink-0 inline-flex h-11 px-6 bg-primary hover:bg-primary-hover text-primary-fg text-sm font-bold rounded-xl items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span>{t("marketing.footer.cta_button")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Middle: links */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="mb-2">
              <Link href="/" className="mb-5 block">
                {
                  theme == "dark" ?
                    <Image src={LogoIcons.logoDark} width={250} height={350} alt="EduMRX — o'quv markazlari boshqaruv tizimi" />
                    :
                    <Image src={LogoIcons.logo} width={250} height={350} alt="EduMRX — o'quv markazlari boshqaruv tizimi" />
                }
              </Link>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-xs mb-5">
              {t("marketing.footer.brand_desc")}
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:edumrxm@gmail.com" className="flex items-center gap-2.5 text-sm text-foreground-muted hover:text-primary  transition-colors">
                <Mail className="w-4 h-4" />
                <span>edumrxm@gmail.com</span>
              </a>
              <a href="tel:+998908182299" className="flex items-center gap-2.5 text-sm text-foreground-muted hover:text-primary  transition-colors">
                <Phone className="w-4 h-4" />
                <span>+998 90 818 22 99</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
                <MapPin className="w-4 h-4" />
                <span>{t("marketing.footer.location")}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-sm font-bold text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-primary  transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom: copyright + socials */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle">
          <p className="text-xs text-foreground-subtle">
            © {year} EduMRX. {t("marketing.footer.rights")}
          </p>

          <div className="flex items-center gap-2">
            {/* {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary/40 transition-all hover:-translate-y-0.5"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))} */}
          </div>
        </div>
      </div>
    </footer>
  );
}