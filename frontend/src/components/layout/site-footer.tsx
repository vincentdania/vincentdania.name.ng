import type { SiteSettings, SocialLink } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

export function SiteFooter({ settings, socialLinks }: SiteFooterProps) {
  const footerLinks = socialLinks.filter((link) => link.visible_in_footer);
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="space-y-5 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-500">
            {settings.footer_note}
          </p>

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
                {settings.navbar_cv_label}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl justify-center border-t border-slate-100 px-5 pt-8 sm:px-8">
        <p className="text-center text-sm text-slate-500">
          © {year}. {settings.footer_copyright}
        </p>
      </div>
    </footer>
  );
}
