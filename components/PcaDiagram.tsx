// Illustrative diagram: 50+ route series -> 5 PCA components -> STL+ARIMA forecast per component -> route-level forecasts.
const F = "var(--font-jetbrains-mono), monospace";
const label = { fontSize: 11, fill: "#8a9a95", fontFamily: F } as const;

export default function PcaDiagram() {
  const dots = Array.from({ length: 50 }, (_, i) => ({ x: 20 + (i % 5) * 16, y: 56 + Math.floor(i / 5) * 16 }));
  const pcs = [0, 1, 2, 3, 4].map((i) => 70 + i * 34);
  return (
    <svg
      viewBox="0 0 640 260"
      role="img"
      aria-label="Diagram: 50 plus route series are compressed to 5 PCA components, each forecast with STL plus ARIMA. Illustrative, synthetic data."
      className="block h-auto w-full"
    >
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#8a9a95" />
        </marker>
      </defs>
      <text x="20" y="30" {...label}>50+ routes</text>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x + 4} cy={d.y} r="3" fill={i % 7 === 0 ? "#e6ece9" : "#8a9a95"} opacity={i % 7 === 0 ? 1 : 0.6} />
      ))}
      <line x1="112" y1="130" x2="196" y2="130" stroke="#8a9a95" markerEnd="url(#arr)" />
      <text x="154" y="120" textAnchor="middle" {...label}>PCA</text>

      <text x="206" y="30" {...label}>5 components</text>
      {pcs.map((y, i) => (
        <g key={i}>
          <rect x="206" y={y - 14} width="92" height="26" fill="#111615" stroke="#3ddc97" strokeWidth="1" />
          <text x="216" y={y + 4} fontSize="12" fill="#e6ece9" fontFamily={F}>PC{i + 1}</text>
        </g>
      ))}
      <line x1="298" y1="130" x2="360" y2="130" stroke="#8a9a95" markerEnd="url(#arr)" />
      <text x="329" y="120" textAnchor="middle" {...label}>STL+ARIMA</text>

      <text x="370" y="30" {...label}>component forecasts</text>
      {pcs.map((y, i) => (
        <g key={i}>
          <polyline
            points={Array.from({ length: 12 }, (_, k) => `${372 + k * 8},${y + 4 - 10 * Math.sin(k / 2 + i)}`).join(" ")}
            fill="none" stroke="#e6ece9" strokeWidth="1.5"
          />
          <polyline
            points={Array.from({ length: 6 }, (_, k) => `${468 + k * 8},${y + 4 - 10 * Math.sin((k + 11) / 2 + i)}`).join(" ")}
            fill="none" stroke="#3ddc97" strokeWidth="2"
          />
        </g>
      ))}
      <line x1="520" y1="130" x2="546" y2="130" stroke="#8a9a95" markerEnd="url(#arr)" />
      <text x="596" y="118" textAnchor="middle" {...label}>route-level</text>
      <text x="596" y="134" textAnchor="middle" {...label}>forecasts</text>
      <text x="20" y="250" {...label}>50+ series, 5 models</text>
    </svg>
  );
}
