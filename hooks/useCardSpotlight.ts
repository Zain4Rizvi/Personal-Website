"use client";

import { useEffect, useRef } from "react";

const QUERY = "(hover: none), (prefers-reduced-motion: reduce)";

export function useCardSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(QUERY);
    const rect = { left: 0, top: 0 };

    const onEnter = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      rect.left = box.left;
      rect.top = box.top;
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    const add = () => {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
    };
    const remove = () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
    };
    const sync = () => {
      remove();
      if (!mq.matches) add();
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      remove();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return ref;
}
