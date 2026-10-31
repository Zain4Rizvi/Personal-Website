"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const QUERY = "(hover: none), (prefers-reduced-motion: reduce)";

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setOn(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!on || path === "/") return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.opacity = "1";
      el.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [on, path]);

  if (!on || path === "/") return null;
  return <div ref={ref} aria-hidden className="spotlight" />;
}
