export default function Section({
  n, title, id, children,
}: { n: string; title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 id={`${id}-h`} className="mb-10 font-mono text-sm tracking-wide text-muted">
          <span className="text-accent">{n}</span> / {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
