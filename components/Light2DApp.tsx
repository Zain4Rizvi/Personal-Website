"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Browser port of the Light2D tracer: rays with random hue, mirrors / scatterers / dispersive glass (Snell + Fresnel).
type Kind = "light" | "glass" | "mirror" | "scatter";
type Shape = { id: number; kind: Kind; x: number; y: number; r: number; n: number };

const S = 720;
const FULL = 60000; // rays when idle
const DRAG = 5000; // rays while dragging
let nextId = 1;
const mk = (kind: Kind, x: number, y: number, r = kind === "light" ? 8 : 45, n = 1.3): Shape => ({ id: nextId++, kind, x, y, r, n });

const defaultScene = (): Shape[] => [
  mk("light", S / 2, S / 2),
  ...Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return mk("glass", S / 2 + Math.cos(a) * 250, S / 2 + Math.sin(a) * 250);
  }),
];

const hueRgb = (h: number) => {
  const k = (n: number) => (n + h * 6) % 6;
  const f = (n: number) => Math.round(255 * (1 - Math.max(0, Math.min(k(n), 4 - k(n), 1))));
  return [f(5), f(3), f(1)];
};

const ADD: { kind: Kind; label: string }[] = [
  { kind: "light", label: "Light" }, { kind: "glass", label: "Glass" },
  { kind: "mirror", label: "Mirror" }, { kind: "scatter", label: "Scatterer" },
];
const btn = "min-h-11 border border-line px-4 font-mono text-sm hover:border-accent hover:text-accent";

export default function Light2DApp() {
  const [shapes, setShapes] = useState<Shape[]>(defaultScene);
  const [sel, setSel] = useState<number | null>(null);
  const [disp, setDisp] = useState(0.3);
  const view = useRef<HTMLCanvasElement>(null);
  const over = useRef<HTMLCanvasElement>(null);
  const st = useRef({ shapes, disp, dirty: true, rays: 0, max: FULL, raf: 0, drag: null as null | { id: number; dx: number; dy: number } });
  st.current.shapes = shapes;
  st.current.disp = disp;

  const loop = useCallback(() => {
    const s = st.current, c = view.current?.getContext("2d");
    s.raf = 0;
    if (!c) return;
    if (s.dirty) {
      c.globalCompositeOperation = "source-over";
      c.fillStyle = "#000";
      c.fillRect(0, 0, S, S);
      c.globalCompositeOperation = "lighter";
      c.lineWidth = 1;
      s.dirty = false;
      s.rays = 0;
    }
    const lights = s.shapes.filter((o) => o.kind === "light");
    const objs = s.shapes.filter((o) => o.kind !== "light");
    if (!lights.length) return;
    const alpha = Math.min(0.6, 900 / s.max) * Math.sqrt(lights.length);

    const trace = (x: number, y: number, dx: number, dy: number, hue: number, rgb: number[], I: number, depth: number) => {
      let best = Infinity, hit: Shape | null = null;
      const tx = dx > 0 ? (S - x) / dx : dx < 0 ? -x / dx : Infinity;
      const ty = dy > 0 ? (S - y) / dy : dy < 0 ? -y / dy : Infinity;
      best = Math.min(tx, ty);
      for (const o of objs) {
        const ox = x - o.x, oy = y - o.y, b = ox * dx + oy * dy, disc = b * b - (ox * ox + oy * oy - o.r * o.r);
        if (disc < 0) continue;
        const q = Math.sqrt(disc);
        const t = -b - q > 1e-3 ? -b - q : -b + q;
        if (t > 1e-3 && t < best) { best = t; hit = o; }
      }
      const px = x + dx * best, py = y + dy * best;
      c.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * I})`;
      c.beginPath(); c.moveTo(x, y); c.lineTo(px, py); c.stroke();
      if (!hit || depth > 10 || I < 0.02) return;

      const nx = (px - hit.x) / hit.r, ny = (py - hit.y) / hit.r;
      const dn = dx * nx + dy * ny;
      if (hit.kind === "mirror") return trace(px, py, dx - 2 * dn * nx, dy - 2 * dn * ny, hue, rgb, I * 0.95, depth + 1);
      if (hit.kind === "scatter") {
        const a = Math.atan2(ny, nx) + (Math.random() - 0.5) * Math.PI;
        return trace(px, py, Math.cos(a), Math.sin(a), hue, rgb, I * 0.8, depth + 1);
      }
      const inside = dn > 0, Nx = inside ? -nx : nx, Ny = inside ? -ny : ny;
      const ng = hit.n + s.disp * hue, n1 = inside ? ng : 1, n2 = inside ? 1 : ng, eta = n1 / n2;
      const ci = -(dx * Nx + dy * Ny), k = 1 - eta * eta * (1 - ci * ci);
      const rx = dx + 2 * ci * Nx, ry = dy + 2 * ci * Ny;
      if (k < 0) return trace(px, py, rx, ry, hue, rgb, I, depth + 1); // total internal reflection
      const ct = Math.sqrt(k);
      const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci);
      const R = (rs * rs + rp * rp) / 2, m = eta * ci - ct;
      trace(px, py, rx, ry, hue, rgb, I * R, depth + 1);
      trace(px, py, eta * dx + m * Nx, eta * dy + m * Ny, hue, rgb, I * (1 - R), depth + 1);
    };

    const t0 = performance.now();
    while (s.rays < s.max && performance.now() - t0 < 12) {
      const l = lights[(Math.random() * lights.length) | 0], a = Math.random() * Math.PI * 2, h = Math.random();
      trace(l.x, l.y, Math.cos(a), Math.sin(a), h, hueRgb(h * 0.75), 1, 0);
      s.rays++;
    }
    if (s.rays < s.max) s.raf = requestAnimationFrame(loop);
  }, []);

  const restart = useCallback(() => {
    const s = st.current;
    s.dirty = true;
    s.max = s.drag ? DRAG : FULL;
    if (!s.raf) s.raf = requestAnimationFrame(loop);
  }, [loop]);

  // Re-trace on any scene / dispersion change; redraw the editing overlay.
  useEffect(() => {
    restart();
    const c = over.current?.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, S, S);
    for (const o of shapes) {
      const on = o.id === sel;
      c.lineWidth = on ? 3 : 1.5;
      c.strokeStyle = on ? "#3ddc97" : o.kind === "glass" ? "rgba(140,200,255,.45)" : o.kind === "mirror" || o.kind === "light" ? "rgba(255,255,255,.7)" : "rgba(255,170,90,.55)";
      c.setLineDash(o.kind === "scatter" ? [5, 4] : []);
      c.beginPath();
      c.arc(o.x, o.y, o.kind === "light" ? 11 : o.r, 0, Math.PI * 2);
      c.stroke();
      if (o.kind === "light") { c.fillStyle = "#fff"; c.beginPath(); c.arc(o.x, o.y, 5, 0, Math.PI * 2); c.fill(); }
    }
  }, [shapes, sel, disp, restart]);

  useEffect(() => () => {
    cancelAnimationFrame(st.current.raf);
    st.current.raf = 0; // strict mode cancels the frame but the id would still block restart()
  }, []);

  const pos = (e: React.PointerEvent) => {
    const b = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * S, y: ((e.clientY - b.top) / b.height) * S };
  };
  const patch = (id: number, p: Partial<Shape>) => setShapes((a) => a.map((o) => (o.id === id ? { ...o, ...p } : o)));
  const clamp = (v: number) => Math.max(0, Math.min(S, v));
  const cur = shapes.find((o) => o.id === sel);

  const add = (kind: Kind) => {
    const o = mk(kind, S / 2 + (Math.random() - 0.5) * 160, S / 2 + (Math.random() - 0.5) * 160);
    setShapes((a) => [...a, o]);
    setSel(o.id);
  };
  const remove = () => { if (sel != null) { setShapes((a) => a.filter((o) => o.id !== sel)); setSel(null); } };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,720px)_1fr]">
      <div className="relative aspect-square w-full border border-accent bg-black">
        <canvas ref={view} width={S} height={S} className="absolute inset-0 h-full w-full" />
        <canvas
          ref={over}
          width={S}
          height={S}
          tabIndex={0}
          aria-label="Light2D scene. Click a shape to select it, drag to move, arrow keys nudge, Delete removes."
          className="absolute inset-0 h-full w-full cursor-grab touch-none"
          onPointerDown={(e) => {
            const p = pos(e);
            const o = [...shapes].reverse().find((o) => Math.hypot(p.x - o.x, p.y - o.y) <= (o.kind === "light" ? 14 : o.r));
            setSel(o?.id ?? null);
            if (!o) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            st.current.drag = { id: o.id, dx: o.x - p.x, dy: o.y - p.y };
            restart();
          }}
          onPointerMove={(e) => {
            const d = st.current.drag;
            if (!d) return;
            const p = pos(e);
            patch(d.id, { x: clamp(p.x + d.dx), y: clamp(p.y + d.dy) });
          }}
          onPointerUp={() => { if (st.current.drag) { st.current.drag = null; restart(); } }}
          onKeyDown={(e) => {
            if (!cur) return;
            const step = e.shiftKey ? 20 : 5, m: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
            if (m[e.key]) { e.preventDefault(); patch(cur.id, { x: clamp(cur.x + m[e.key][0]), y: clamp(cur.y + m[e.key][1]) }); }
            else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); remove(); }
          }}
        />
        {!shapes.some((o) => o.kind === "light") && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-sm text-muted">Add a light to start</p>
        )}
      </div>

      <div className="flex flex-col gap-5 font-mono text-sm">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted">Add to scene</p>
          <div className="flex flex-wrap gap-2">
            {ADD.map((a) => <button key={a.kind} type="button" className={btn} onClick={() => add(a.kind)}>+ {a.label}</button>)}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted">Selected: {cur ? cur.kind : "none"}</p>
          {cur ? (
            <div className="flex flex-col gap-3">
              {cur.kind !== "light" && (
                <label className="flex flex-col gap-1">Size ({Math.round(cur.r)} px)
                  <input type="range" min={10} max={220} value={cur.r} onChange={(e) => patch(cur.id, { r: +e.target.value })} className="accent-[#3ddc97]" />
                </label>
              )}
              {cur.kind === "glass" && (
                <label className="flex flex-col gap-1">Refractive index ({cur.n.toFixed(2)})
                  <input type="range" min={1.05} max={2.5} step={0.01} value={cur.n} onChange={(e) => patch(cur.id, { n: +e.target.value })} className="accent-[#3ddc97]" />
                </label>
              )}
              <button type="button" className={btn} onClick={remove}>Remove selected</button>
            </div>
          ) : <p className="text-muted">Click a light or shape in the scene.</p>}
        </div>

        <label className="flex flex-col gap-1">Dispersion ({disp.toFixed(2)})
          <input type="range" min={0} max={1} step={0.01} value={disp} onChange={(e) => setDisp(+e.target.value)} className="accent-[#3ddc97]" />
        </label>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => { setShapes(defaultScene()); setSel(null); }}>Reset scene</button>
          <button type="button" className={btn} onClick={() => { setShapes([]); setSel(null); }}>Clear all</button>
        </div>
      </div>
    </div>
  );
}
