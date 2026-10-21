import type { Profile } from "@/lib/content";
import IconLinks from "./IconLinks";

export default function Footer({ profile: p }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:px-8">
        <p>© {p.name} {new Date().getFullYear()}</p>
        <IconLinks profile={p} />
      </div>
    </footer>
  );
}
