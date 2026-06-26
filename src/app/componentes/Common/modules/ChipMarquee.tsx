"use client";

import { JSX } from "react";
import ChipBox from "./ChipBox";

const CW = 124;
const CH = 86;
const CPINS = 5;
const FW = 46;
const PLACAS = [1, 2, 3, 4, 5];
const GOLD = "#c9a84e";
const STEP = CH / (CPINS + 1);

const Fan = (): JSX.Element => (
  <svg
    width={FW}
    height={CH}
    viewBox={`0 0 ${FW} ${CH}`}
    style={{ flexShrink: 0, overflow: "visible" }}
  >
    {Array.from({ length: CPINS }, (_, k) => {
      const y = STEP * (k + 1);
      return (
        <path
          key={k}
          d={`M 0 ${y} L ${FW / 2} ${CH / 2} L ${FW} ${y}`}
          fill="none"
          stroke="#9aa0a8"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    })}
    {Array.from({ length: CPINS }, (_, k) => {
      const y = STEP * (k + 1);
      return (
        <g key={`v${k}`}>
          <circle cx={0} cy={y} r={2.2} fill={GOLD} />
          <circle cx={FW} cy={y} r={2.2} fill={GOLD} />
        </g>
      );
    })}
  </svg>
);

const Cell = ({ n }: { n: number }): JSX.Element => (
  <div className="flex flex-row items-center" style={{ flexShrink: 0 }}>
    <ChipBox width={CW} height={CH} pins={CPINS} notch={false}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 5,
          backgroundColor: "#0c0c0e",
          backgroundImage: `url(/images/digitalax_placa_${n}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </ChipBox>
    <Fan />
  </div>
);

const ChipMarquee = (): JSX.Element => {
  return (
    <div
      className="relative w-full overflow-hidden flex"
      style={{ pointerEvents: "none", paddingTop: 10, paddingBottom: 2 }}
    >
      <div
        className="flex flex-row"
        style={{ width: "max-content", animation: "marquee 30s linear infinite" }}
      >
        {[...PLACAS, ...PLACAS].map((n, i) => (
          <Cell key={i} n={n} />
        ))}
      </div>
    </div>
  );
};

export default ChipMarquee;
