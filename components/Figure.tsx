export default function Figure({
  n, caption, note, children, className = "",
}: { n: number | string; caption: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={className}>
      <div className="border border-line bg-surface">{children}</div>
      <figcaption className="mt-2 font-mono text-xs text-muted">
        <span className="text-accent">Fig. {n}</span> {caption}
        {note ? <span className="mt-1.5 block w-fit border border-line px-1.5 py-0.5">{note}</span> : null}
      </figcaption>
    </figure>
  );
}
