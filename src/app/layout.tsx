import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const heading = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arthur Bont | Drummer, Percussionist, Cajon Specialist",
  description:
    "Onepager MVP voor Arthur Bont met Bio, Milk 2.0, Discografie, DVD, Gigs/Studio, Lessen en Contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${heading.variable} ${body.variable} ${mono.variable} antialiased`}>{children}</body>
    </html>
  );
}
