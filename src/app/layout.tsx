import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Archivo est variable : on charge l'axe de largeur pour pouvoir élargir les
// titres (font-stretch) sans charger une seconde famille condensée.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ksmobile.cm"),
  title: {
    default: "KS Mobile — Téléphones neufs et reconditionnés à Akwa, Douala",
    template: "%s · KS Mobile",
  },
  description:
    "Samsung, iPhone, Google Pixel et accessoires, vendus en boutique à Akwa. Appareils vérifiés, prix affichés, commande par WhatsApp.",
  applicationName: "KS Mobile",
  keywords: [
    "téléphone Douala",
    "smartphone Cameroun",
    "iPhone Akwa",
    "Samsung Douala",
    "boutique téléphone Akwa",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "KS Mobile",
    title: "KS Mobile — Téléphones neufs et reconditionnés à Akwa, Douala",
    description:
      "Appareils vérifiés, prix affichés, commande par WhatsApp. Boutique à Akwa, Douala.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060a12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${plex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-volt-deep focus:px-4 focus:py-2 focus:text-blanc"
        >
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
