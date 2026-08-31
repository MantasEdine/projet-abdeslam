import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Regiis Security — Gardiennage, rondes de nuit & alarmes",
    template: "%s | Regiis Security",
  },
  description:
    "Société de sécurité privée : gardiennage sur site, rondes de surveillance de nuit, alarmes et télésurveillance avec intervention 24/7. Devis gratuit sous 24 h.",
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE.name, images: ["/assets/img/og.jpg"] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/assets/img/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#0A0B0D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
