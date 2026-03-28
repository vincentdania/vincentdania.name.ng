import { Noto_Serif } from "next/font/google";

import type { SiteSettings, SocialLink } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export function SiteFooter({ settings, socialLinks }: SiteFooterProps) {
  const footerLinks = socialLinks.filter((link) => link.visible_in_footer);

  return (
    <footer className="w-full border-t border-slate-200 bg-white pb-8 pt-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 md:flex-row sm:px-8">
        <div className="text-center md:text-left">
          <div className={cn(notoSerif.className, "mb-2 text-lg text-slate-900")}>
            {settings.site_name}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((link) => {
            const isDownload = link.label.toLowerCase().includes("download");
            return (
              <a
                key={`${link.platform}-${link.label}`}
                className={cn(
                  "text-sm font-bold uppercase tracking-[0.18em] transition-colors",
                  isDownload
                    ? "text-accent underline underline-offset-4"
                    : "text-slate-500 hover:text-accent",
                )}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            );
          })}

          {settings.cv_file_url ? (
            <a
              className="text-sm font-bold uppercase tracking-[0.18em] text-accent underline underline-offset-4"
              href={settings.cv_file_url}
              target="_blank"
              rel="noreferrer"
            >
              Download CV
            </a>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl justify-center border-t border-slate-100 px-5 pt-8 sm:px-8">
        <p className="text-center text-sm text-slate-500">
          © 2026. Designed &amp; Developed by Vincent Dania. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
