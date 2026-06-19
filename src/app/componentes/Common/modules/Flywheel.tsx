"use client";

import { FunctionComponent, JSX, useState } from "react";
import { FlywheelNode, FlywheelProps } from "../types/common.types";

const NODE_POS = [
  { x: 180, y: 60 },
  { x: 294.1, y: 142.9 },
  { x: 250.5, y: 277.1 },
  { x: 109.5, y: 277.1 },
  { x: 65.9, y: 142.9 },
];

const ARCS = [
  "M217.1 65.9 A120 120 0 0 1 277.1 109.5",
  "M300 180 A120 120 0 0 1 277.1 250.5",
  "M217.1 294.1 A120 120 0 0 1 142.9 294.1",
  "M82.9 250.5 A120 120 0 0 1 60 180",
  "M82.9 109.5 A120 120 0 0 1 142.9 65.9",
];

const Flywheel: FunctionComponent<FlywheelProps> = ({ dict }): JSX.Element => {
  const flywheel = dict?.common?.flywheel ?? {};
  const nodes: FlywheelNode[] = flywheel?.nodes ?? [];
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="relative w-full h-fit flex flex-col gap-8 items-center justify-start text-mainText px-2">
      <div className="relative w-fit h-fit py-1 px-2 border border-mainText font-nerd text-xs uppercase tracking-widest">
        {flywheel?.label}
      </div>
      <div className="relative w-fit max-w-md h-fit font-nerd text-[0.6rem] uppercase tracking-wider opacity-60 text-center">
        {flywheel?.agents}
      </div>
      <div className="relative w-full max-w-sm h-fit flex items-center justify-center">
        <svg viewBox="0 0 360 360" className="relative w-full h-auto" fill="none">
          <defs>
            <marker
              id="flyArrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>
          <circle
            cx="180"
            cy="180"
            r="120"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.25"
          />
          {ARCS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="currentColor"
              strokeWidth="0.75"
              markerEnd="url(#flyArrow)"
            />
          ))}
          {NODE_POS.map((pos, i) => {
            const isSel = selected === i;
            return (
              <g
                key={i}
                onClick={() => setSelected(i)}
                className="cursor-sewingHS"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="36"
                  stroke="currentColor"
                  strokeWidth={isSel ? "1.5" : "0.75"}
                  fill="currentColor"
                  fillOpacity={isSel ? "0.12" : "0"}
                />
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  className="font-nerd uppercase"
                  fontSize="11"
                  fill="currentColor"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {nodes[i]?.label}
                </text>
              </g>
            );
          })}
          <text
            x="180"
            y="184"
            textAnchor="middle"
            className="font-nerd"
            fontSize="13"
            fill="currentColor"
          >
            {flywheel?.hub}
          </text>
        </svg>
      </div>
      <div className="relative w-full max-w-md h-fit flex flex-col gap-2 border border-mainText p-4">
        <div className="relative w-fit h-fit font-nerd text-xs uppercase tracking-wider">
          {nodes[selected]?.label}
        </div>
        <div className="relative w-full h-fit font-firaL text-[0.8rem] leading-relaxed opacity-80">
          {nodes[selected]?.detail}
        </div>
      </div>
      <div className="relative w-fit max-w-md h-fit font-nerd text-[0.6rem] uppercase tracking-wider opacity-60 text-center">
        {flywheel?.substrate}
      </div>
    </div>
  );
};

export default Flywheel;
