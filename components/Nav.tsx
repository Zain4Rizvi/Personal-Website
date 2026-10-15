import Link from "next/link";

const items = [
  ["Experience", "/#experience"],
  ["Projects", "/#projects"],
  ["Education", "/#education"],
  ["Skills", "/#skills"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
] as const;

export default function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-5 md:px-8">
        <Link href="/" className="shrink-0 font-mono text-sm text-text hover:text-accent">
          {name}
        </Link>
        <ul className="flex items-center gap-x-4 font-mono text-xs text-muted md:gap-x-6">
          {items.map(([label, href]) => (
            <li key={href} className={label === "Education" || label === "Skills" ? "hidden md:block" : label === "Experience" ? "hidden sm:block" : ""}>
              <Link href={href} className="whitespace-nowrap py-2 hover:text-accent">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
