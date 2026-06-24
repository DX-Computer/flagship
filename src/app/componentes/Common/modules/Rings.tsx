"use client";

import Image from "next/image";
import { JSX, useEffect, useState } from "react";

const ZOOM = 85;
const TOP_WORLD = 4.8;
const SCALE = 0.9;

const RINGS = [
  { src: "/images/ring-1.png", x: -3.95, y: 4.05, size: 3.6 },
  { src: "/images/ring-2.png", x: -6.83, y: 2.95, size: 3 },
  { src: "/images/ring-3.png", x: -4.6, y: -2.6, size: 1.8 },
  { src: "/images/ring-4.png", x: 1.7, y: -4.8, size: 3.6 },
  { src: "/images/ring-5.png", x: 6.8, y: -3.7, size: 2.4 },
  { src: "/images/ring-6.png", x: -8, y: -3.4, size: 3.2 },
  { src: "/images/ring-3.png", x: 4.6, y: 3.8, size: 1.4 },
  { src: "/images/ring-4.png", x: 6.4, y: 4.2, size: 1.0 },
  { src: "/images/ring-5.png", x: 6.1, y: 3.0, size: 1.2 },
];

const Rings = (): JSX.Element => {
  const [w, setW] = useState(0);

  useEffect(() => {
    const onResize = (): void => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (w === 0) return <></>;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 0,
        pointerEvents: "none",
      }}
    >
      {RINGS.map((r, i) => {
        const s = r.size * ZOOM * SCALE;
        const left = w / 2 + r.x * ZOOM - s / 2;
        const top = (TOP_WORLD - r.y) * ZOOM - s / 2;
        return (
          <div
            key={i}
            style={{ position: "absolute", left, top, width: s, height: s }}
          >
            <Image
              src={r.src}
              alt=""
              fill
              sizes={`${Math.round(s)}px`}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Rings;
