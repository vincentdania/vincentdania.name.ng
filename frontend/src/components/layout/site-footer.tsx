import type { SiteSettings, SocialLink } from "@/lib/types";

interface SiteFooterProps {
  settings: SiteSettings;
  socialLinks: SocialLink[];
}

export function SiteFooter({ settings, socialLinks }: SiteFooterProps) {
  return (
    <footer className="mt-24 border-t border-border/70 bg-white/60 py-10">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <p className="font-display text-2xl text-foreground">{settings.site_name}</p>
          <p className="mt-3 text-sm leading-7 text-muted">{settings.footer_note}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {socialLinks.map((link) => (
            <a
              key={`${link.platform}-${link.label}`}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noreferrer" : undefined}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          {settings.cv_file_url ? (
            <a
              href={settings.cv_file_url}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Download CV
            </a>
          ) : null}
        </div>
      </div>
      <div className="shell mt-6 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{settings.location}</p>
        <p>© {new Date().getFullYear()} Vincent Dania. All rights reserved.</p>
      </div>
    </footer>
  );
}
