"use client";

import { useId, useState } from "react";

/**
 * Stat-tile trend line: 2px stroke, ~10% area wash, 8px end marker with a
 * surface ring. Single series, so no legend — the card title names it.
 * Hover snaps a crosshair to the nearest point and reads out its value.
 */
export default function Sparkline({
  points, direction, format, labels,
}: {
  points: number[];
  direction: "up" | "down";
  format: (v: number) => string;
  labels: [string, string];
}) {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const pad = (max - min || Math.abs(max) || 1) * 0.18;
  const lo = min - pad;
  const hi = max + pad;

  const W = 100;
  const H = 42;
  const x = (i: number) => (i / (points.length - 1)) * W;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const line = points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  const idx = active ?? points.length - 1;

  return (
    <figure className={`spark ${direction}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Illustrative trend, ${labels[0]} to ${labels[1]}. Latest ${format(points[points.length - 1])}.`}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - box.left) / box.width;
          setActive(Math.max(0, Math.min(points.length - 1, Math.round(ratio * (points.length - 1)))));
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="spark-stop-a" />
            <stop offset="100%" className="spark-stop-b" />
          </linearGradient>
        </defs>
        <polygon className="spark-area" points={area} fill={`url(#${gradientId})`} />
        <polyline className="spark-line" points={line} vectorEffect="non-scaling-stroke" />
        {active !== null && (
          <line className="spark-cross" x1={x(idx)} y1="0" x2={x(idx)} y2={H} vectorEffect="non-scaling-stroke" />
        )}
        <circle className="spark-dot" cx={x(idx)} cy={y(points[idx])} r="2.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="spark-axis">
        <span>{labels[0]}</span>
        <b className={active !== null ? "on" : undefined}>
          {active !== null ? format(points[idx]) : `${format(min)} – ${format(max)}`}
        </b>
        <span>{labels[1]}</span>
      </figcaption>
    </figure>
  );
}
