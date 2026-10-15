import Figure from "./Figure";

/*
 * ============================================================
 *  RAY-TRACER HERO MOUNT POINT
 *  The interactive ray tracer (move a light, watch the shading
 *  update) mounts into <div id="hero-raytracer-mount">.
 *  Replace the <img> child with a client component, e.g.
 *    <RayTracerCanvas width={512} height={512} />
 *  and keep the static render as the no-JS / reduced-motion fallback.
 *  Keep the 1:1 aspect ratio so layout does not shift.
 * ============================================================
 */
export default function HeroMount() {
  return (
    <Figure n={1} caption="Ray tracer in C, rendered output.">
      <div id="hero-raytracer-mount" className="aspect-square w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/ray-tracer/full.webp"
          alt="Two ellipsoids and a floor rendered by a ray tracer written in C, with reflections and shadows"
          width={512}
          height={512}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>
    </Figure>
  );
}
