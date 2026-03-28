import Link from "next/link";
import { Noto_Serif } from "next/font/google";

import { cn } from "@/lib/utils";

interface SiteNavbarProps {
  siteName: string;
  cvUrl?: string;
}

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const navItems = [
  { href: "/#about", label: "About Vincent" },
  { href: "/#experience", label: "Experience" },
  { href: "/#tech", label: "Portfolio" },
  { href: "/articles", label: "Articles" },
];

export function SiteNavbar({ siteName, cvUrl }: SiteNavbarProps) {
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

        <div className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-slate-600 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {cvUrl ? (
            <a
              className="hidden rounded-lg px-5 py-2.5 font-semibold text-accent transition-all duration-300 hover:bg-accent/5 sm:inline-flex"
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download CV
            </a>
          ) : null}
          <Link
            className="inline-flex rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-accent-strong sm:px-5"
            href="/#contact"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </nav>
  );
}
