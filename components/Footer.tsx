import type { Profile } from "@/lib/content";
import IconLinks from "./IconLinks";

export default function Footer({ profile: p }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="flex flex-col gap-4 px-5 py-8 md:px-10">
        <p>© {p.name} {process.env.BUILD_YEAR}</p>
        <IconLinks profile={p} />
      </div>
    </footer>
  );
}
