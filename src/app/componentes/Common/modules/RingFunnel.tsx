"use client";

import Image from "next/image";
import { JSX } from "react";

const NODES = [
  { x: 0, r: 92 },
  { x: -55, r: 72 },
  { x: 50, r: 62 },
  { x: -28, r: 46 },
  { x: 30, r: 42 },
  { x: -12, r: 32 },
  { x: 16, r: 27 },
  { x: -7, r: 22 },
  { x: 8, r: 18 },
  { x: -3, r: 15 },
];

const buildChain = (): { x: number; r: number; yc: number }[] => {
  const out: { x: number; r: number; yc: number }[] = [];
  let yc = NODES[0].r;
  out.push({ x: NODES[0].x, r: NODES[0].r, yc });
  for (let i = 1; i < NODES.length; i++) {
    const prev = NODES[i - 1];
    const cur = NODES[i];
    const sum = prev.r + cur.r;
    const dx = cur.x - prev.x;
    const dy = Math.sqrt(Math.max(0, sum * sum - dx * dx));
    yc += dy;
    out.push({ x: cur.x, r: cur.r, yc });
  }
  return out;
};

const CHAIN = buildChain();
const HEIGHT = CHAIN[CHAIN.length - 1].yc + CHAIN[CHAIN.length - 1].r;

const pick = (i: number): string => {
  const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453);
  const n = Math.floor((r - Math.floor(r)) * 6);
  return `/images/ring-${n + 1}.png`;
};

const RingFunnel = (): JSX.Element => {
  return (
    <div
      className="relative w-full flex"
      style={{ height: HEIGHT, marginBottom: -64, pointerEvents: "none" }}
    >
      {CHAIN.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${c.x}px)`,
            top: c.yc - c.r,
            width: c.r * 2,
            height: c.r * 2,
            transform: "translateX(-50%)",
          }}
        >
          <Image
            src={pick(i)}
            alt=""
            fill
            sizes={`${c.r * 2}px`}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default RingFunnel;
