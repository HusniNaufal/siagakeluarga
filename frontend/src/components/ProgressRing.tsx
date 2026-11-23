export function ProgressRing({
  value,
  size = 80,
  tone = "terang",
}: {
  value: number;
  size?: number;
  /** "gelap" dipakai di atas ubin gelap. */
  tone?: "terang" | "gelap";
}) {
  const stroke = Math.max(8, Math.round(size * 0.086));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = c * (1 - clamped / 100);
  const gelap = tone === "gelap";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={`Skor ${Math.round(clamped)} dari 100`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={gelap ? "rgba(255,255,255,0.22)" : "var(--color-line)"}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={gelap ? "#ffb591" : "var(--color-accent-dark)"}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        className={`font-display font-semibold tabular-nums ${gelap ? "fill-white" : "fill-ink"}`}
        style={{ fontSize: Math.round(size * 0.3) }}
      >
        {Math.round(clamped)}
      </text>
    </svg>
  );
}
