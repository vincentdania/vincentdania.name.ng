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
    <header className="sticky top-0 z-50 bg-[rgba(243,238,229,0.92)] backdrop-blur-xl">
      <div className="shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <p className="font-display text-[1.35rem] leading-none text-foreground">
              {siteName}
            </p>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {cvUrl ? (
            <Button asChild size="sm" className="ml-auto sm:ml-2">
              <a href={cvUrl} target="_blank" rel="noreferrer">
                Download CV
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
