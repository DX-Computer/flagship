"use client";

import { JSX } from "react";

const CX = 800;
const CY = 500;

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const BLOBS: { cx: number; cy: number; r: number }[] = [];
const SPECS: { cx: number; cy: number; r: number }[] = [];
(() => {
  const N = 56;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const rad = 205 + (rnd(i) - 0.5) * 44;
    BLOBS.push({
      cx: CX + Math.cos(a) * rad,
      cy: CY + Math.sin(a) * rad,
      r: 16 + rnd(i * 2) * 22,
    });
  }
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.25;
    const rad = 192 + (rnd(i * 3) - 0.5) * 40;
    SPECS.push({
      cx: CX + Math.cos(a) * rad - 3,
      cy: CY + Math.sin(a) * rad - 3,
      r: 2 + rnd(i * 5) * 4,
    });
  }
})();

export default function Board(): JSX.Element {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="liqSilver"
          x1="600"
          y1="300"
          x2="1000"
          y2="720"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="28%" stopColor="#dde4ec" />
          <stop offset="52%" stopColor="#a7b0bc" />
          <stop offset="74%" stopColor="#6c7580" />
          <stop offset="100%" stopColor="#d2d9e1" />
        </linearGradient>
        <filter id="liquid" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
            result="goo"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.025"
            numOctaves="2"
            seed="6"
            result="n"
          />
          <feDisplacementMap
            in="goo"
            in2="n"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter="url(#liquid)">
        {BLOBS.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="url(#liqSilver)" />
        ))}
      </g>
      <g>
        {SPECS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#ffffff" opacity={0.75} />
        ))}
      </g>
    </svg>
  );
}
