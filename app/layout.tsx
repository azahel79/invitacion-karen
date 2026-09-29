import type { Metadata, Viewport } from "next";
import { Allura, Manrope, Playfair_Display } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const script = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XV años de Karen Paola",
  description:
    "Invitación para celebrar los XV años de Karen Paola Hernández Ávila.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#005262",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className={`${display.variable} ${sans.variable} ${script.variable}`}>{children}</body>
    </html>
  );
}
