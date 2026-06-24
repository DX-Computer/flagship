"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { SiliconBox } from "../types/common.types";

const CABLE_START_Y = 1345;

const SiliconFrame: FunctionComponent = () => {
  const [box, setBox] = useState<SiliconBox | null>(null);

  useEffect(() => {
    const measure = (): void => {
      const b = document.getElementById("silicon-block");
      if (!b) return;
      const r = b.getBoundingClientRect();
      setBox({
        top: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
        pageW: document.documentElement.clientWidth,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1200);
    const t3 = setTimeout(measure, 2600);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!box) return null;

  const pad = 16;
  const fx = box.left - pad;
  const fy = box.top - pad;
  const fw = box.width + pad * 2;
  const fh = box.height + pad * 2;
  const cx = box.left + box.width / 2;
  const rad = 12;
  const svgH = fy + fh + 40;

  const r1x = fx + rad;
  const r2x = fx + fw - rad;
  const r1y = fy + rad;
  const r2y = fy + fh - rad;
  const fr =
    "M " +
    r1x +
    " " +
    fy +
    " H " +
    r2x +
    " A " +
    rad +
    " " +
    rad +
    " 0 0 1 " +
    (fx + fw) +
    " " +
    r1y +
    " V " +
    r2y +
    " A " +
    rad +
    " " +
    rad +
    " 0 0 1 " +
    r2x +
    " " +
    (fy + fh) +
    " H " +
    r1x +
    " A " +
    rad +
    " " +
    rad +
    " 0 0 1 " +
    fx +
    " " +
    r2y +
    " V " +
    r1y +
    " A " +
    rad +
    " " +
    rad +
    " 0 0 1 " +
    r1x +
    " " +
    fy +
    " Z";

  const feed = "M " + cx + " " + CABLE_START_Y + " V " + fy;

  const corners = [
    [fx, fy],
    [fx + fw, fy],
    [fx + fw, fy + fh],
    [fx, fy + fh],
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: svgH + "px",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg
        width="100%"
        height={svgH}
        viewBox={"0 0 " + box.pageW + " " + svgH}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="sfMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5f666e" />
            <stop offset="0.35" stopColor="#d3dae2" />
            <stop offset="0.55" stopColor="#eef2f6" />
            <stop offset="0.75" stopColor="#aab0b8" />
            <stop offset="1" stopColor="#5f666e" />
          </linearGradient>
          <radialGradient id="sfPad" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#eef2f6" />
            <stop offset="0.6" stopColor="#aab0b8" />
            <stop offset="1" stopColor="#6b7178" />
          </radialGradient>
        </defs>

        <path
          d={feed}
          fill="none"
          stroke="url(#sfMetal)"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <path
          d={fr}
          fill="none"
          stroke="url(#sfMetal)"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />

        {corners.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r={4.5} fill="url(#sfPad)" />
        ))}
        <circle cx={cx} cy={fy} r={5.5} fill="url(#sfPad)" />
        <circle cx={cx} cy={CABLE_START_Y} r={4} fill="url(#sfPad)" />
      </svg>
    </div>
  );
};

export default SiliconFrame;
