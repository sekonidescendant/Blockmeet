import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "BlockMeet — Discover Web3 events worth showing up for.",
  description:
    "Discover conferences, meetups, hackathons, workshops and community events across the Web3 ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}