"use client";

import { FunctionComponent, JSX } from "react";
import { ChipBoxProps } from "../types/common.types";

const LEG_W = 9;
const LEG_H = 5;
const LEG_GRAD =
  "linear-gradient(to bottom,#e3e7eb 0%,#b6bbc2 38%,#888e97 55%,#54595f 100%)";
const BODY_GRAD = "linear-gradient(155deg,#2c2c33 0%,#1a1a1f 55%,#101013 100%)";

const ChipBox: FunctionComponent<ChipBoxProps> = ({
  width = 170,
  height = 116,
  pins = 7,
  notch = true,
  children,
}): JSX.Element => {
  const legs = Array.from({ length: pins });
  const step = height / (pins + 1);

  return (
    <div
      className="relative flex"
      style={{ width, height, pointerEvents: "none" }}
    >
      {legs.map((_, i) => (
        <div
          key={`l-${i}`}
          className="absolute flex"
          style={{
            left: 0,
            top: step * (i + 1) - LEG_H / 2,
            width: LEG_W + 3,
            height: LEG_H,
            background: LEG_GRAD,
            borderRadius: "2px 1px 1px 2px",
            boxShadow: "0 1px 1px rgba(0,0,0,0.45)",
          }}
        />
      ))}
      {legs.map((_, i) => (
        <div
          key={`r-${i}`}
          className="absolute flex"
          style={{
            right: 0,
            top: step * (i + 1) - LEG_H / 2,
            width: LEG_W + 3,
            height: LEG_H,
            background: LEG_GRAD,
            borderRadius: "1px 2px 2px 1px",
            boxShadow: "0 1px 1px rgba(0,0,0,0.45)",
          }}
        />
      ))}
      <div
        className="absolute flex flex-col items-center justify-center overflow-hidden"
        style={{
          left: LEG_W,
          right: LEG_W,
          top: 0,
          bottom: 0,
          background: BODY_GRAD,
          borderRadius: 7,
          border: "1px solid #000",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 6px rgba(0,0,0,0.6), 0 3px 8px rgba(0,0,0,0.45)",
          pointerEvents: "auto",
        }}
      >
        {notch && (
          <div
            className="absolute flex"
            style={{
              top: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 16,
              height: 8,
              background: "#0a0a0c",
              borderRadius: "0 0 16px 16px",
              boxShadow: "inset 0 -1px 2px rgba(255,255,255,0.06)",
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default ChipBox;
