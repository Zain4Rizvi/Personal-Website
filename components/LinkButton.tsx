import Link from "next/link";

export const isExternal = (h: string) => /^https?:/.test(h) || h.endsWith(".html");

// Primary = filled accent button; otherwise outlined.
export default function LinkButton({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const cls = `inline-flex min-h-11 items-center border px-5 font-mono text-sm transition-colors ${
    primary ? "border-accent bg-accent text-bg hover:border-text hover:bg-text" : "border-line hover:border-accent hover:text-accent"
  }`;
  return isExternal(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children} &#8599;</a>
    : <Link href={href} className={cls}>{children}</Link>;
}
