"use client";

import { useEffect, useState } from "react";
import Image from "next/legacy/image";

const NUMBERS = Array.from({ length: 42 }, (_, i) => i + 1).filter(
  (n) => n !== 33
);

export default function Backdrop() {
  const [n, setN] = useState(1);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let last = 1;
    let remaining: number[] = [];
    let clear: ReturnType<typeof setTimeout>;

    const pick = () => {
      if (remaining.length === 0) {
        remaining = [...NUMBERS];
      }
      let idx = Math.floor(Math.random() * remaining.length);
      if (remaining[idx] === last && remaining.length > 1) {
        idx = (idx + 1) % remaining.length;
      }
      const next = remaining[idx];
      remaining.splice(idx, 1);
      last = next;
      setN(next);
      setGlitch(true);
      clear = setTimeout(() => setGlitch(false), 480);
    };

    const timer = setInterval(pick, 10000);
    return () => {
      clearInterval(timer);
      clearTimeout(clear);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="dx-rgbsplit">
          <feOffset in="SourceGraphic" dx="6" dy="0" result="r" />
          <feColorMatrix
            in="r"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="rr"
          />
          <feOffset in="SourceGraphic" dx="-6" dy="0" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="bb"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="gg"
          />
          <feBlend in="rr" in2="gg" mode="screen" result="rg" />
          <feBlend in="rg" in2="bb" mode="screen" />
        </filter>
      </svg>
      <div className={`absolute inset-0 ${glitch ? "glitch-rgb" : ""}`}>
        <Image
          src={`/images/dxcomputer-opensourcehardware-${n}.png`}
          layout="fill"
          objectFit="cover"
          draggable={false}
          alt="DX.COMPUTER | OPEN CONFIDENTIAL COMPUTING"
        />
      </div>
      {glitch && <div className="absolute inset-0 glitch-static" />}
    </>
  );
}
