import type { Profile } from "@/lib/content";

export default function Footer({ profile: p }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-xs text-muted md:flex-row md:justify-between md:px-8">
        <span>
          {p.name}, {new Date().getFullYear()}
        </span>
        <span>
          <a className="hover:text-accent" href="/llms.txt">llms.txt</a>
          {" / "}
          <a className="hover:text-accent" href="/api/profile">/api/profile</a>
        </span>
      </div>
    </footer>
  );
}
