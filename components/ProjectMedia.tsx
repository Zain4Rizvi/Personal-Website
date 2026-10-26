"use client";

import { useEffect, useLayoutEffect, useRef, useState, ViewTransition } from "react";

const share = { "to-project": "project-media", default: "none" } as const;

let arriveId: string | null = null;
export const armProjectArrive = (id: string) => {
  arriveId = id;
};

// One media box on the card and the project page. The named element is the poster.
export default function ProjectMedia({
  id, poster, gif, alt, named = false, fit = "cover", pixelated = false,
}: {
  id: string;
  poster: string;
  gif?: string;
  alt: string;
  named?: boolean;
  fit?: "cover" | "contain";
  pixelated?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";
  const pix = pixelated ? { imageRendering: "pixelated" as const } : undefined;

  useLayoutEffect(() => {
    if (!named || arriveId !== id) return;
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const el = frame.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
    root.style.scrollBehavior = "";
  }, [named, id]);

  useEffect(() => {
    if (named && arriveId === id) arriveId = null;
  }, [named, id]);

  useEffect(() => {
    if (!gif || gif === poster) return;
    let gone = false;
    const t = setTimeout(() => {
      const img = new Image();
      img.src = gif;
      img.decode().catch(() => {}).finally(() => {
        if (!gone) setLive(true);
      });
    }, 400);
    return () => {
      gone = true;
      clearTimeout(t);
    };
  }, [gif, poster]);

  const posterImg = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={poster} alt={alt} loading="eager" decoding="sync" className={`absolute inset-0 h-full w-full ${fitClass}`} style={pix} />
  );

  return (
    <div ref={frame} className="relative aspect-[16/9] w-full overflow-hidden">
      {named ? (
        <ViewTransition name={`project-${id}`} share={share} default="none">{posterImg}</ViewTransition>
      ) : posterImg}
      {live && gif ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={gif} alt="" className={`pointer-events-none absolute inset-0 h-full w-full ${fitClass}`} style={pix} />
      ) : null}
    </div>
  );
}
