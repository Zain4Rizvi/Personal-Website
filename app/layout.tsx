import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { getProfile } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

// Self-hosted variable fonts (latin subset), no build-time network fetch.
const sans = localFont({ src: "./fonts/inter-tight.woff2", weight: "100 900", variable: "--font-inter-tight", display: "swap" });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff2", weight: "100 800", variable: "--font-jetbrains-mono", display: "swap" });

const p = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(p.siteUrl),
  title: { default: `${p.name} | ${p.title}`, template: `%s | ${p.name}` },
  description: `${p.name}: ${p.tagline} CS and Math, University of Toronto.`,
  openGraph: { title: `${p.name} | ${p.title}`, description: p.tagline, type: "website", siteName: p.name },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <Script id="boot-enter" strategy="beforeInteractive">
          {`(function(){var r=document.documentElement;r.classList.add("boot");var stop=function(){r.classList.remove("boot")};var arm=function(){setTimeout(stop,1800)};if(document.readyState==="loading")addEventListener("DOMContentLoaded",arm);else arm();addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&t.closest("a"))stop()},true);addEventListener("popstate",stop)})()`}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        <Nav profile={p} />
        <main id="main">{children}</main>
        <Footer profile={p} />
        <Analytics />
      </body>
    </html>
  );
}
