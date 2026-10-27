"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useCardSpotlight } from "@/hooks/useCardSpotlight";
import ProjectMedia, { armProjectArrive } from "./ProjectMedia";

function pinScroll() {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  const scroller = document.scrollingElement;
  if (scroller) scroller.scrollTop = scroller.scrollTop;
  root.style.scrollBehavior = prev;
}

function preload(src: string, ms = 400) {
  const img = new Image();
  img.src = src;
  return Promise.race([
    img.decode().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

export default function WorkCard({
  slug, title, summary, poster, gif, alt, fit, pixelated, bg,
}: {
  slug: string;
  title: string;
  summary: string;
  poster?: string;
  gif?: string;
  alt: string;
  fit: "cover" | "contain";
  pixelated: boolean;
  bg: string;
}) {
  const router = useRouter();
  const mediaRef = useCardSpotlight<HTMLDivElement>();
  const href = `/projects/${slug}`;

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    pinScroll();
    if (poster) await preload(poster);
    armProjectArrive(slug);
    startTransition(() => {
      router.push(href, { scroll: false, transitionTypes: ["to-project"] });
    });
  }

  return (
    <Link href={href} scroll={false} transitionTypes={["to-project"]} onClick={onClick} className="work-card block">
      <div ref={mediaRef} className={`work-media overflow-hidden rounded-2xl ${bg}`}>
        {poster ? (
          <ProjectMedia id={slug} poster={poster} gif={gif} alt={alt} named fit={fit} pixelated={pixelated} />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center p-6 text-center text-sm text-muted">{title}</div>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-snug">
        <span className="work-title font-medium">{title}</span>
        {" — "}
        {summary}
      </p>
    </Link>
  );
}
