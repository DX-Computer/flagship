"use client";

import Image from "next/image";
import { CSSProperties, JSX } from "react";
import ChipBox from "./ChipBox";

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

const GAP = 150;
const BW = 340;
const BH = 124;
const PINS = 7;
const CONNECT = [1, 2, 3, 4, 5];
const STEP = BH / (PINS + 1);

const clamp = (n: number): CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: n,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const fanoutPaths = (left: boolean, g = GAP, h = BH): string[] =>
  CONNECT.map((k) => {
    const pinY = (h / (PINS + 1)) * (k + 1);
    const cy = h / 2;
    return left
      ? `M ${g} ${cy} L ${g * 0.62} ${cy} L ${g * 0.3} ${pinY} L 0 ${pinY}`
      : `M 0 ${cy} L ${g * 0.38} ${cy} L ${g * 0.7} ${pinY} L ${g} ${pinY}`;
  });

const MBW = 300;
const MBH = 156;

const ABW = 112;
const ABH = 40;
const AGAP = 60;
const APP_RING = 8;
const CABLE_GRAD =
  "linear-gradient(to bottom,#585d65 0%,#aeb4bb 40%,#d8dde2 50%,#9aa0a8 62%,#4e535b 100%)";

const appCard = (goApp: string): JSX.Element => (
  <div
    className="w-full h-full flex items-center justify-center"
    style={{
      color: "#cdd2d8",
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      padding: 4,
      textAlign: "center",
    }}
  >
    {goApp}
  </div>
);

const pinEnds = (left: boolean): { x: number; y: number }[] =>
  CONNECT.map((k) => ({ x: left ? 0 : GAP, y: STEP * (k + 1) }));

const renderCard = (p: any, lbl: any): JSX.Element => (
  <div className="w-full h-full flex flex-row" style={{ padding: 8, gap: 8 }}>
    <div
      className="relative flex shrink-0"
      style={{
        width: 96,
        height: "100%",
        borderRadius: 4,
        border: "1px solid #2a2a30",
        backgroundColor: "#0c0c0e",
        backgroundImage: `url(/images/${p.image}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div
      className="flex flex-col"
      style={{
        flex: 1,
        minWidth: 0,
        gap: 2,
        color: "#cdd2d8",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-row items-center" style={{ gap: 5 }}>
        <span style={{ fontSize: 8, color: "#c9a84e" }}>{p.id}</span>
        <span
          style={{
            fontSize: 7,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.6,
          }}
        >
          {p.status}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.1 }}>
        {p.title}
      </div>
      <div style={{ fontSize: 7, lineHeight: 1.25, opacity: 0.78, ...clamp(2) }}>
        {p.desc}
      </div>
      {p.hardware && (
        <div style={{ fontSize: 6.5, lineHeight: 1.25 }}>
          <span
            style={{
              color: "#c9a84e",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {lbl.hardware || "hardware"}:{" "}
          </span>
          <span style={{ opacity: 0.82, ...clamp(2) }}>{p.hardware}</span>
        </div>
      )}
      {p.software && (
        <div style={{ fontSize: 6.5, lineHeight: 1.25 }}>
          <span
            style={{
              color: "#c9a84e",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {lbl.software || "software"}:{" "}
          </span>
          <span style={{ opacity: 0.82, ...clamp(2) }}>{p.software}</span>
        </div>
      )}
    </div>
  </div>
);

const RingFunnel = ({ dict }: { dict?: any }): JSX.Element => {
  const phases: any[] = dict?.common?.roadmap?.phases ?? [];
  const lbl: any = dict?.common?.roadmap?.propose ?? {};
  const goApp: string = dict?.common?.goApp ?? "go to app";
  const appRing = CHAIN[APP_RING];

  return (
    <>
    <div
      className="relative w-full hidden lg:flex"
      style={{ height: HEIGHT, marginBottom: -64, pointerEvents: "none" }}
    >
      {CHAIN.slice(0, 6).map((c, i) => {
        const p = phases[i];
        if (!p) return null;
        const left = i % 2 === 0;
        const svgLeft = left
          ? `calc(50% + ${c.x - c.r - GAP}px)`
          : `calc(50% + ${c.x + c.r}px)`;
        const boxLeft = left
          ? `calc(50% + ${c.x - c.r - GAP - BW}px)`
          : `calc(50% + ${c.x + c.r + GAP}px)`;
        return (
          <div key={`conn-${i}`} className="hidden lg:block">
            <svg
              style={{
                position: "absolute",
                left: svgLeft,
                top: c.yc - BH / 2,
                width: GAP,
                height: BH,
                overflow: "visible",
              }}
              viewBox={`0 0 ${GAP} ${BH}`}
            >
              {fanoutPaths(left).map((d, j) => (
                <path
                  key={j}
                  d={d}
                  fill="none"
                  stroke="#9aa0a8"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {pinEnds(left).map((pt, j) => (
                <circle key={j} cx={pt.x} cy={pt.y} r={2.4} fill="#c9a84e" />
              ))}
            </svg>
            <div
              className="flex"
              style={{ position: "absolute", left: boxLeft, top: c.yc - BH / 2 }}
            >
              <ChipBox width={BW} height={BH}>{renderCard(p, lbl)}</ChipBox>
            </div>
          </div>
        );
      })}
      {appRing && (
        <div className="hidden lg:block" style={{ opacity: 0.45 }}>
          <div
            style={{
              position: "absolute",
              left: `calc(50% + ${appRing.x + appRing.r}px)`,
              top: appRing.yc - 1.5,
              width: AGAP,
              height: 3,
              borderRadius: 2,
              background: CABLE_GRAD,
            }}
          />
          <div
            className="flex"
            style={{
              position: "absolute",
              left: `calc(50% + ${appRing.x + appRing.r + AGAP}px)`,
              top: appRing.yc - ABH / 2,
            }}
          >
            <ChipBox width={ABW} height={ABH} pins={3}>
              {appCard(goApp)}
            </ChipBox>
          </div>
        </div>
      )}
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
    <div
      className="flex lg:hidden flex-col items-center w-full"
      style={{ gap: 0, pointerEvents: "none" }}
    >
      {CHAIN.map((c, i) => {
        const p = phases[i];
        const d = c.r * 2;
        return (
          <div
            key={`m-${i}`}
            className="flex flex-col items-center w-full"
            style={{ gap: 0 }}
          >
            <div
              style={{
                position: "relative",
                width: d,
                height: d,
                flexShrink: 0,
              }}
            >
              <Image src={pick(i)} alt="" fill sizes={`${d}px`} draggable={false} />
            </div>
            {p && i < 6 && (
              <div
                className="flex flex-row items-center w-full"
                style={{ pointerEvents: "none" }}
              >
                <svg
                  className="flex-1"
                  style={{ height: MBH }}
                  viewBox={`0 0 100 ${MBH}`}
                  preserveAspectRatio="none"
                >
                  {fanoutPaths(false, 100, MBH).map((d, j) => (
                    <path
                      key={j}
                      d={d}
                      fill="none"
                      stroke="#9aa0a8"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                <div className="flex shrink-0" style={{ pointerEvents: "auto" }}>
                  <ChipBox width={MBW} height={MBH}>
                    {renderCard(p, lbl)}
                  </ChipBox>
                </div>
                <svg
                  className="flex-1"
                  style={{ height: MBH }}
                  viewBox={`0 0 100 ${MBH}`}
                  preserveAspectRatio="none"
                >
                  {fanoutPaths(true, 100, MBH).map((d, j) => (
                    <path
                      key={j}
                      d={d}
                      fill="none"
                      stroke="#9aa0a8"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
              </div>
            )}
            {i === APP_RING && (
              <div className="flex" style={{ opacity: 0.45, pointerEvents: "none" }}>
                <ChipBox width={ABW} height={ABH} pins={3}>
                  {appCard(goApp)}
                </ChipBox>
              </div>
            )}
          </div>
        );
      })}
    </div>
    </>
  );
};

export default RingFunnel;
