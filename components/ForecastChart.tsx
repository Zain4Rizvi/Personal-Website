// Illustrative, synthetic data. Deterministic so server and client render the same SVG.
const W = 640, H = 320, L = 44, R = 12, T = 16, B = 60;
const N = 52; // weeks

const actual = (i: number) =>
  100 + 14 * Math.sin((i / 52) * 2 * Math.PI * 2) + 6 * Math.sin(i * 1.7) + 0.25 * i;
// old forecast: refreshed every two weeks, so it holds a stale level and lags the trend
const old = (i: number) => {
  const k = Math.floor(i / 2) * 2;
  return 100 + 7 * Math.sin(((k - 6) / 52) * 2 * Math.PI * 2) + 0.1 * k + 4;
};
// new forecast: tracks the signal closely
const next = (i: number) => actual(i) + 0.8 * Math.sin(i * 0.9);

const xs = (i: number) => L + (i / (N - 1)) * (W - L - R);
const lo = 70, hi = 135;
const ys = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
const path = (f: (i: number) => number) =>
  Array.from({ length: N }, (_, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(f(i)).toFixed(1)}`).join("");
// stepped path for the biweekly forecast
const stepped = () => {
  let d = "";
  for (let i = 0; i < N; i += 2) {
    const y = ys(old(i)).toFixed(1);
    d += `${d ? "L" : "M"}${xs(i).toFixed(1)},${y}L${xs(Math.min(i + 2, N - 1)).toFixed(1)},${y}`;
  }
  return d;
};

export default function ForecastChart() {
  const ticks = [80, 100, 120];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Line chart of weekly volume: actuals, the previous biweekly forecast which lags, and the new forecast which tracks actuals closely. Illustrative, synthetic data."
      className="block h-auto w-full"
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={ys(t)} y2={ys(t)} stroke="#1f2927" strokeWidth="1" />
          <text x={L - 8} y={ys(t) + 4} textAnchor="end" fontSize="11" fill="#8a9a95" fontFamily="var(--font-jetbrains-mono), monospace">
            {t}
          </text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#8a9a95" strokeWidth="1" />
      {[0, 13, 26, 39, 51].map((i) => (
        <text key={i} x={xs(i)} y={H - B + 16} textAnchor="middle" fontSize="11" fill="#8a9a95" fontFamily="var(--font-jetbrains-mono), monospace">
          wk {i + 1}
        </text>
      ))}
      <path d={stepped()} fill="none" stroke="#8a9a95" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={path(actual)} fill="none" stroke="#e6ece9" strokeWidth="1.5" />
      <path d={path(next)} fill="none" stroke="#3ddc97" strokeWidth="2" />
      {/* legend */}
      {[
        ["#e6ece9", "Actual", 0, ""],
        ["#3ddc97", "New forecast", 96, ""],
        ["#8a9a95", "Previous (biweekly)", 236, "4 3"],
      ].map(([c, label, dx, dash]) => (
        <g key={label as string} transform={`translate(${L + (dx as number)},${H - 8})`}>
          <line x1="0" x2="18" y1="-4" y2="-4" stroke={c as string} strokeWidth="2" strokeDasharray={dash as string} />
          <text x="24" y="0" fontSize="11" fill="#8a9a95" fontFamily="var(--font-jetbrains-mono), monospace">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}
