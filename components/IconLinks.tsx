import type { Profile } from "@/lib/content";

const icon = "h-4 w-4";

export default function IconLinks({ profile: p }: { profile: Profile }) {
  const a = "text-text hover:opacity-70";
  return (
    <ul className="flex items-center gap-3">
      <li>
        <a className={a} href={`mailto:${p.email}`} aria-label="Email">
          <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 7 9-7" />
          </svg>
        </a>
      </li>
      <li>
        <a className={a} href={p.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" className={icon} fill="currentColor" aria-hidden>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </li>
      <li>
        <a className={a} href={p.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" className={icon} fill="currentColor" aria-hidden>
            <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 1a2.5 2.5 0 0 1 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
          </svg>
        </a>
      </li>
      <li>
        <a className={a} href={p.links.resume} aria-label="Resume">
          <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M14 3v6h6M8 13h8M8 17h8" />
          </svg>
        </a>
      </li>
    </ul>
  );
}
