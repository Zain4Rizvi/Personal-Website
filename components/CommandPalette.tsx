"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { armProjectArrive } from "./ProjectMedia";

export type PaletteProject = {
  title: string;
  slug: string;
  summary: string;
  poster?: string;
};

type Item = {
  id: string;
  title: string;
  description: string;
  kind: "Project" | "Link";
  href: string;
  external?: boolean;
  slug?: string;
  poster?: string;
};

const CommandContext = createContext<(() => void) | null>(null);

export function CommandHint() {
  const open = useContext(CommandContext);
  if (!open) return null;
  return (
    <button type="button" className="cmd-hint" aria-label="Open command menu" aria-keyshortcuts="Meta+K Control+K" onClick={open}>
      ⌘K
    </button>
  );
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function preload(src: string, ms = 400) {
  const img = new Image();
  img.src = src;
  return Promise.race([img.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, ms))]);
}

export default function CommandPalette({
  projects,
  resume,
  github,
  linkedin,
  homeDescription,
  children,
}: {
  projects: PaletteProject[];
  resume: string;
  github: string;
  linkedin: string;
  homeDescription: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);
  const dismissRef = useRef<() => void>(() => {});
  const openMenuRef = useRef<() => void>(() => {});

  const items = useMemo<Item[]>(() => {
    const work = projects.map((project) => ({
      id: project.slug,
      title: project.title,
      description: project.summary,
      kind: "Project" as const,
      href: `/projects/${project.slug}`,
      slug: project.slug,
      poster: project.poster,
    }));
    const links: Item[] = [
      { id: "home", title: "Home", description: homeDescription, kind: "Link", href: "/" },
      { id: "resume", title: "Résumé", description: "PDF", kind: "Link", href: resume },
      { id: "github", title: "GitHub", description: github, kind: "Link", href: github, external: true },
      { id: "linkedin", title: "LinkedIn", description: linkedin, kind: "Link", href: linkedin, external: true },
    ];
    return [...work, ...links];
  }, [projects, resume, github, linkedin, homeDescription]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
    : items;
  const selected = results.length === 0 ? 0 : Math.min(active, results.length - 1);
  const activeId = results[selected] ? `cmd-opt-${results[selected].id}` : undefined;

  function openMenu() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openRef.current = true;
    closingRef.current = false;
    setClosing(false);
    setQuery("");
    setActive(0);
    setOpen(true);
  }

  function dismiss() {
    if (!openRef.current || closingRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      openRef.current = false;
      setOpen(false);
      setQuery("");
      setActive(0);
      return;
    }
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      openRef.current = false;
      closingRef.current = false;
      setOpen(false);
      setClosing(false);
      setQuery("");
      setActive(0);
    }, 150);
  }

  openRef.current = open;
  closingRef.current = closing;
  dismissRef.current = dismiss;
  openMenuRef.current = openMenu;

  async function activate(item: Item) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openRef.current = false;
    closingRef.current = false;
    setOpen(false);
    setClosing(false);
    setQuery("");
    setActive(0);
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.href.endsWith(".pdf")) {
      window.location.assign(item.href);
      return;
    }
    if (item.slug) {
      if (item.poster) await preload(item.poster);
      armProjectArrive(item.slug);
      startTransition(() => {
        router.push(item.href, { scroll: false, transitionTypes: ["to-project"] });
      });
      return;
    }
    startTransition(() => {
      router.push(item.href);
    });
  }

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (metaK) {
        e.preventDefault();
        if (openRef.current && !closingRef.current) dismissRef.current();
        else openMenuRef.current();
        return;
      }
      if (!openRef.current) {
        if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
          e.preventDefault();
          openMenuRef.current();
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        dismissRef.current();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || closing) return;
    const root = dialogRef.current;
    if (!root) return;
    const onFocus = (e: FocusEvent) => {
      if (!root.contains(e.target as Node)) inputRef.current?.focus();
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, [open, closing]);

  useEffect(() => {
    if (!open || !activeId) return;
    document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [open, activeId]);

  function onDialogKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length) setActive(Math.min(results.length - 1, selected + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive(Math.max(0, selected - 1));
    } else if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const item = results[selected];
      if (item) void activate(item);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  const shown = open || closing;

  return (
    <CommandContext.Provider value={openMenu}>
      {children}
      {shown && (
        <div className={`cmd-overlay${closing ? " is-closing" : ""}`} onMouseDown={dismiss}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className={`cmd-panel${closing ? " is-closing" : ""}`}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onDialogKey}
          >
            <input
              ref={inputRef}
              className="cmd-input"
              role="combobox"
              aria-expanded={open}
              aria-controls="cmd-list"
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-label="Search projects and links"
              placeholder="Search"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
            />
            <ul id="cmd-list" role="listbox" aria-label="Commands" className="cmd-list">
              {results.length === 0 && (
                <li className="cmd-empty" role="presentation">No matches</li>
              )}
              {results.map((item, i) => (
                <li
                  key={item.id}
                  id={`cmd-opt-${item.id}`}
                  role="option"
                  aria-selected={i === selected}
                  className="cmd-option"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => void activate(item)}
                >
                  <span>{item.title}</span>
                  <span className="cmd-kind">{item.kind}</span>
                  {item.description ? <span className="cmd-desc">{item.description}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </CommandContext.Provider>
  );
}
