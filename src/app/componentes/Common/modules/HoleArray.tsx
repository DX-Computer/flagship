import { JSX } from "react";

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const COLS = 6;
const ROWS = 9;
const FX0 = 48;
const FX1 = 252;
const FY0 = 58;
const FY1 = 366;

const HOLES: { x: number; y: number; r: number }[] = [];
(() => {
  const px = (FX1 - FX0) / (COLS - 1);
  const py = (FY1 - FY0) / (ROWS - 1);
  let k = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      k++;
      HOLES.push({
        x: FX0 + c * px + (rnd(k) - 0.5) * 4,
        y: FY0 + r * py + (rnd(k * 2) - 0.5) * 4,
        r: 16 + (rnd(k * 3) - 0.5) * 2,
      });
    }
  }
})();

export default function HoleArray(): JSX.Element {
  return (
    <svg
      viewBox="0 0 300 420"
      width="270"
      height="378"
      style={{ filter: "drop-shadow(0 7px 14px rgba(0,0,0,0.6))" }}
    >
      <defs>
        <linearGradient id="plate" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#7d7158" />
          <stop offset="50%" stopColor="#665c49" />
          <stop offset="100%" stopColor="#544b3b" />
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#564d3c" />
          <stop offset="100%" stopColor="#635941" />
        </linearGradient>
        <linearGradient id="chamfer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bcad89" />
          <stop offset="45%" stopColor="#6e6450" />
          <stop offset="100%" stopColor="#312b20" />
        </linearGradient>
        <linearGradient id="holeInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161208" />
          <stop offset="58%" stopColor="#2c2618" />
          <stop offset="100%" stopColor="#9d8d6d" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect
        x="6"
        y="6"
        width="288"
        height="408"
        rx="22"
        fill="url(#plate)"
        stroke="#39322665"
        strokeWidth="2"
      />
      <rect
        x="8.5"
        y="8.5"
        width="283"
        height="403"
        rx="20"
        fill="none"
        stroke="#928568"
        strokeWidth="1.5"
        opacity="0.45"
      />

      <rect x="22" y="22" width="256" height="376" rx="14" fill="url(#field)" />
      <rect x="22" y="22" width="256" height="16" rx="14" fill="#000000" opacity="0.2" />

      {HOLES.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r={h.r} fill="url(#chamfer)" />
          <circle cx={h.x} cy={h.y} r={h.r * 0.62} fill="url(#holeInner)" />
        </g>
      ))}

      <circle cx="150" cy="212" r="4.2" fill="#15110a" />
      <circle
        cx="150"
        cy="211"
        r="4.2"
        fill="none"
        stroke="#9d8d6d"
        strokeWidth="0.9"
        opacity="0.5"
      />

      <rect
        x="6"
        y="6"
        width="288"
        height="408"
        rx="22"
        fill="#000000"
        filter="url(#grain)"
        opacity="0.12"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}
