import { JSX } from "react";

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SILVERS = ["#cfd6de", "#aeb6c0", "#e4e9ef", "#9098a2", "#c2c9d2"];
const PKG = { x: 146, y: 164, w: 164, h: 150 };

type Seg = { d: string; w: number; c: string };
const SEGS: Seg[] = [];
const RINGS: { x: number; y: number; r: number; c: string }[] = [];

(() => {
  let k = 0;
  const col = (): string => SILVERS[Math.floor(rnd(++k * 1.7) * SILVERS.length)];

  const top = 50;
  for (let i = 0; i < top; i++) {
    const x = PKG.x + 5 + (i * (PKG.w - 10)) / (top - 1);
    const fan = (i / (top - 1) - 0.5) * 64;
    const leadEnd = 110 + rnd(i) * 6;
    SEGS.push({ d: `M ${x.toFixed(1)} ${PKG.y} L ${x.toFixed(1)} ${leadEnd.toFixed(1)}`, w: 1, c: col() });
    SEGS.push({
      d: `M ${x.toFixed(1)} ${leadEnd.toFixed(1)} L ${(x + fan * 0.35).toFixed(1)} ${(leadEnd - 40).toFixed(1)} L ${(x + fan).toFixed(1)} 14`,
      w: 0.85,
      c: col(),
    });
  }

  const side = 32;
  for (let i = 0; i < side; i++) {
    const y = PKG.y + 6 + (i * (PKG.h - 12)) / (side - 1);
    const fan = (i / (side - 1) - 0.5) * 52;
    const lEnd = PKG.x - 26 - rnd(i * 2) * 6;
    SEGS.push({ d: `M ${PKG.x} ${y.toFixed(1)} L ${lEnd.toFixed(1)} ${y.toFixed(1)}`, w: 1, c: col() });
    SEGS.push({
      d: `M ${lEnd.toFixed(1)} ${y.toFixed(1)} L ${(lEnd - 34).toFixed(1)} ${(y + fan * 0.35).toFixed(1)} L ${(lEnd - 100).toFixed(1)} ${(y + fan).toFixed(1)}`,
      w: 0.85,
      c: col(),
    });
    const rEnd = PKG.x + PKG.w + 26 + rnd(i * 3) * 6;
    SEGS.push({ d: `M ${PKG.x + PKG.w} ${y.toFixed(1)} L ${rEnd.toFixed(1)} ${y.toFixed(1)}`, w: 1, c: col() });
    SEGS.push({
      d: `M ${rEnd.toFixed(1)} ${y.toFixed(1)} L ${(rEnd + 34).toFixed(1)} ${(y + fan * 0.35).toFixed(1)} L ${(rEnd + 100).toFixed(1)} ${(y + fan).toFixed(1)}`,
      w: 0.85,
      c: col(),
    });
  }

  const clusters = [
    { cx: 55, cy: 55, n: 16, sp: 80 },
    { cx: 385, cy: 55, n: 12, sp: 70 },
    { cx: 45, cy: 230, n: 10, sp: 70 },
    { cx: 400, cy: 235, n: 9, sp: 60 },
  ];
  for (const cl of clusters) {
    for (let i = 0; i < cl.n; i++) {
      k++;
      RINGS.push({
        x: cl.cx + (rnd(k) - 0.5) * cl.sp,
        y: cl.cy + (rnd(k * 2) - 0.5) * cl.sp,
        r: 3 + rnd(k * 3) * 2.4,
        c: SILVERS[Math.floor(rnd(k * 5) * SILVERS.length)],
      });
    }
  }
})();

export default function QFP(): JSX.Element {
  return (
    <svg viewBox="0 0 440 290" width="640" height="422">
      <defs>
        <radialGradient id="pkg" cx="0.4" cy="0.35" r="0.9">
          <stop offset="0%" stopColor="#16161a" />
          <stop offset="70%" stopColor="#0c0c0e" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <filter id="pkgShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      <rect x="0" y="0" width="440" height="290" fill="#0a1b3e" />

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {SEGS.map((s, i) => (
          <path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} />
        ))}
      </g>

      <g fill="none">
        {RINGS.map((r, i) => (
          <circle key={i} cx={r.x} cy={r.y} r={r.r} stroke={r.c} strokeWidth={1.1} />
        ))}
      </g>

      <rect
        x={PKG.x}
        y={PKG.y}
        width={PKG.w}
        height={PKG.h}
        rx={6}
        fill="url(#pkg)"
        filter="url(#pkgShadow)"
      />
      <rect
        x={PKG.x}
        y={PKG.y}
        width={PKG.w}
        height={PKG.h * 0.18}
        rx={6}
        fill="#ffffff"
        opacity={0.03}
      />
      <circle cx={PKG.x + 16} cy={PKG.y + 16} r={4} fill="#3a3a40" />
      <circle
        cx={PKG.x + 15.4}
        cy={PKG.y + 15.2}
        r={4}
        fill="none"
        stroke="#5a5a62"
        strokeWidth={0.6}
        opacity={0.6}
      />
    </svg>
  );
}
