import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
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

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: "Vincent Dania | Programme Leadership, IT & Social Protection",
    template: "%s | Vincent Dania",
  },
  description:
    "Senior programme and project manager, IT professional, digital builder, and thought leader working across donor-funded delivery, governance, and technology.",
  openGraph: {
    title: "Vincent Dania | Programme Leadership, IT & Social Protection",
    description:
      "Portfolio and articles for Vincent Dania, a senior programme and project leader with strong digital and policy fluency.",
    url: absoluteUrl(),
    siteName: "Vincent Dania",
    images: [
      {
        url: absoluteUrl("/og-default.svg"),
        width: 1200,
        height: 630,
        alt: "Vincent Dania",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Dania | Programme Leadership, IT & Social Protection",
    description:
      "Portfolio and articles for Vincent Dania, a senior programme and project leader with strong digital and policy fluency.",
    images: [absoluteUrl("/og-default.svg")],
  },
};

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
