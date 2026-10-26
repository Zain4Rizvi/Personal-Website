"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/content";
import IconLinks from "./IconLinks";

export default function Nav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const pill = scrolled ? "rounded-full border border-line bg-black/80 px-4 py-2 backdrop-blur-md" : "";
  return (
    <header className={`sticky top-0 z-50 border-b ${scrolled ? "border-transparent" : "border-line bg-bg"}`}>
      <nav aria-label="Primary" className="flex h-12 items-center justify-between gap-4 px-5 md:px-10">
        <Link
          href="/"
          className={`text-[13px] uppercase tracking-[0.14em] ${pill}${pathname === "/" ? " enter" : ""}`}
          style={pathname === "/" ? ({ "--i": 0 } as React.CSSProperties) : undefined}
        >
          {profile.name}
        </Link>
        <div className={pill}>
          <IconLinks profile={profile} />
        </div>
      </nav>
    </header>
  );
}
