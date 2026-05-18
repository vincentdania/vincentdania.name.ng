"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Noto_Serif } from "next/font/google";
import { useState } from "react";

import type { NavigationItem } from "@/lib/types";
import { getPrimaryNavigationItems, isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SiteNavbarProps {
  siteName: string;
  navigationItems: NavigationItem[];
  cvUrl?: string;
  cvLabel?: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
}

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export function SiteNavbar({
  siteName,
  navigationItems,
  cvUrl,
  cvLabel,
  primaryCtaLabel,
  primaryCtaLink,
}: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryNavigationItems = getPrimaryNavigationItems(navigationItems);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 sm:px-8 sm:py-6">
        <Link
          href="/"
          className={cn(
            notoSerif.className,
            "text-xl tracking-tight text-slate-900 sm:text-2xl",
          )}
        >
          {siteName}
        </Link>

        <div className="hidden items-center gap-5 text-sm lg:gap-8 lg:text-base md:flex">
          {primaryNavigationItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = isNavigationItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "border-b-2 pb-1 font-medium transition-colors",
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-slate-600 hover:text-accent",
                  )}
                  target={item.open_in_new_tab ? "_blank" : undefined}
                  rel={item.open_in_new_tab ? "noreferrer" : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {cvUrl ? (
            <a
              className="hidden rounded-lg px-5 py-2.5 font-semibold text-accent transition-all duration-300 hover:bg-accent/5 sm:inline-flex"
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
            >
              {cvLabel || "Download CV"}
            </a>
          ) : null}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-white text-foreground transition-colors hover:border-accent/30 hover:text-accent md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="site-mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            className="inline-flex rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-accent-strong sm:px-5"
            href={primaryCtaLink}
          >
            {primaryCtaLabel}
          </Link>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="site-mobile-navigation"
          className="border-t border-border/70 bg-white/95 md:hidden"
        >
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-2">
              {primaryNavigationItems
              .filter((item) => item.visible)
              .map((item) => {
                  const isActive = isNavigationItemActive(pathname, item.href);

                  return (
                    <Link
                      key={`mobile-${item.href}`}
                      href={item.href}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                        isActive
                          ? "border-accent/30 bg-accent/5 text-accent"
                          : "border-border/70 text-slate-600 hover:border-accent/20 hover:text-accent",
                      )}
                      target={item.open_in_new_tab ? "_blank" : undefined}
                      rel={item.open_in_new_tab ? "noreferrer" : undefined}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>

            {cvUrl ? (
              <a
                className="mt-4 inline-flex rounded-lg px-1 py-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cvLabel || "Download CV"}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
