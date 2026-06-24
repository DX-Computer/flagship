"use client";

import { JSX } from "react";
import Image from "next/legacy/image";
import useChip from "../hooks/useChip";
import { metalStops, metalRadial } from "../hooks/metal";
import { METAL_GOLD, METAL_SILVER } from "../../../lib/constants";

const PER_SIDE = 12;
const AREA_START = 250;
const AREA_END = 750;
const SIDES = [0, 90, 180, 270];
const GOLD_STOPS = metalStops(METAL_GOLD);
const SOLDER_STOPS = metalRadial(METAL_SILVER);

export default function Chip(): JSX.Element {
  const { n, glitch } = useChip();

  const pitch = (AREA_END - AREA_START) / PER_SIDE;
  const lw = pitch * 0.32;
  const pw = pitch * 0.5;

  const pins = Array.from(
    { length: PER_SIDE },
    (_, i) => AREA_START + pitch * (i + 0.5)
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative aspect-square"
        style={{
          width: "clamp(140px, 20vmin, 240px)",
          filter:
            "drop-shadow(0 0.4vw 0.8vw rgba(0,0,0,0.5)) drop-shadow(0 0.1vw 0.2vw rgba(0,0,0,0.45))",
        }}
      >
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

        <div
          className={`absolute overflow-hidden ${glitch ? "glitch-rgb" : ""}`}
          style={{
            inset: "18%",
            borderRadius: "1.4%",
            boxShadow:
              "inset 0 0 0.8vw rgba(0,0,0,0.6), inset 0 0 0 1px rgba(38,28,14,0.55)",
          }}
        >
          <Image
            src={`/images/dxcomputer-opensourcehardware-${n}.png`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            alt="DX.COMPUTER | OPEN CONFIDENTIAL COMPUTING"
          />
          {glitch && <div className="absolute inset-0 glitch-static" />}
        </div>

        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <defs>
            <linearGradient id="goldBody" x1="0" y1="0" x2="0" y2="1">
              {GOLD_STOPS.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            <linearGradient id="leadSatin" x1="0" y1="0" x2="1" y2="0">
              {GOLD_STOPS.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            <radialGradient id="solderSatin" cx="0.4" cy="0.32" r="0.78">
              {SOLDER_STOPS.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </radialGradient>
            <linearGradient id="bezelGold" x1="0" y1="0" x2="1" y2="1">
              {GOLD_STOPS.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            <filter
              id="goldEmboss"
              x="-12%"
              y="-12%"
              width="124%"
              height="124%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" />
              <feSpecularLighting
                in="b"
                surfaceScale="2.4"
                specularConstant="0.75"
                specularExponent="20"
                lightingColor="#fff2cf"
                result="s"
              >
                <feDistantLight azimuth="235" elevation="60" />
              </feSpecularLighting>
              <feComposite
                in="s"
                in2="SourceAlpha"
                operator="in"
                result="sc"
              />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="sc" />
              </feMerge>
            </filter>
          </defs>

          {SIDES.map((deg) => (
            <g key={deg} transform={`rotate(${deg} 500 500)`}>
              {pins.map((cx, i) => (
                <g key={i}>
                  <rect
                    x={cx - pw / 2}
                    y={88}
                    width={pw}
                    height={64}
                    rx={pw * 0.28}
                    fill="url(#goldBody)"
                    stroke="#3a2c12"
                    strokeWidth={0.8}
                  />
                  <rect
                    x={cx - pw / 2}
                    y={88}
                    width={pw}
                    height={3}
                    rx={1.5}
                    fill="#f3e6bb"
                    opacity={0.7}
                  />
                  <rect
                    x={cx - lw / 2}
                    y={110}
                    width={lw}
                    height={76}
                    rx={lw * 0.4}
                    fill="url(#leadSatin)"
                  />
                  <rect
                    x={cx - pw * 0.46}
                    y={98}
                    width={pw * 0.92}
                    height={42}
                    rx={pw * 0.42}
                    fill="url(#solderSatin)"
                  />
                  <ellipse
                    cx={cx - pw * 0.12}
                    cy={108}
                    rx={pw * 0.16}
                    ry={pw * 0.12}
                    fill="#f6efe1"
                    opacity={0.55}
                  />
                </g>
              ))}
            </g>
          ))}

          <rect
            x={180}
            y={180}
            width={640}
            height={640}
            rx={16}
            fill="none"
            stroke="url(#bezelGold)"
            strokeWidth={9}
            filter="url(#goldEmboss)"
          />
          <rect
            x={184.5}
            y={184.5}
            width={631}
            height={631}
            rx={14}
            fill="none"
            stroke="#261c0e"
            strokeWidth={1.4}
            opacity={0.6}
          />
          <rect
            x={175.5}
            y={175.5}
            width={649}
            height={649}
            rx={18}
            fill="none"
            stroke="#fbf1d4"
            strokeWidth={1}
            opacity={0.45}
          />
          <circle cx={212} cy={212} r={7} fill="#ecd6a2" opacity={0.85} />
          <circle cx={213} cy={213} r={2.4} fill="#2a200f" opacity={0.7} />
        </svg>
      </div>
    </div>
  );
}
