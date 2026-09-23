import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const grotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  variable: "--font-grotesk",
  weight: "300 700",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DR Engineering & Manufacturing — Precision CAD, 3D Printing & Moulding",
    template: "%s · DR Engineering & Manufacturing",
  },
  description:
    "DR Engineering & Manufacturing specialises in 3D CAD modelling, technical engineering drawings, reverse engineering, 3D printing, rapid prototyping, injection moulding and post-processing.",
  keywords: [
    "3D CAD modelling",
    "technical drawings",
    "reverse engineering",
    "3D printing",
    "rapid prototyping",
    "injection moulding",
    "post processing",
  ],
};

export const viewport: Viewport = {
  themeColor: "#060B14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
