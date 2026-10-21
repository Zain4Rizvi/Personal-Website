"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/content";
import IconLinks from "./IconLinks";

export default function Nav({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const pill = scrolled ? "rounded-full border border-line bg-black/80 px-4 py-2 backdrop-blur-md" : "";
  return (
    <header className={`sticky top-0 z-50 ${scrolled ? "" : "border-b border-line bg-bg"}`}>
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className={`text-[13px] uppercase tracking-[0.14em] ${pill}`}>
          {profile.name}
        </Link>
        <div className={pill}>
          <IconLinks profile={profile} />
        </div>
      </nav>
    </header>
  );
}
