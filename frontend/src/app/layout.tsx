import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { fetchSitePayload } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await fetchSitePayload().catch(() => null);
  const settings = siteData?.site_settings;
  const siteName = settings?.site_name || "Vincent Dania";
  const title = settings?.meta_title || `${siteName} | Programme Leadership, IT & Social Protection`;
  const description =
    settings?.meta_description ||
    "Senior programme and project manager, IT professional, digital builder, and thought leader working across donor-funded delivery, governance, and technology.";

  return {
    metadataBase: new URL(absoluteUrl()),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(),
      siteName,
      images: [
        {
          url: absoluteUrl("/og-default.svg"),
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-default.svg")],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Toaster richColors position="top-right" />
    </html>
  );
}
