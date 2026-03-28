"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteNavbarProps {
  siteName: string;
  cvUrl?: string;
}

const navItems = [
  { href: "/", label: "About Vincent" },
  { href: "/articles", label: "Articles" },
];

export function SiteNavbar({ siteName, cvUrl }: SiteNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-[rgba(244,241,235,0.9)] backdrop-blur-xl">
      <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              VD
            </div>
            <p className="font-display text-lg leading-none text-foreground">
              {siteName}
            </p>
          </Link>
          <div className="hidden gap-2 sm:flex">
            {cvUrl ? (
              <Button asChild size="sm" variant="secondary">
                <a href={cvUrl} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Button asChild size="sm" className="ml-auto sm:ml-0">
            <Link href="/#contact">Contact Me</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
