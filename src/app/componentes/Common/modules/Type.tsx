"use client";

import React, { useEffect, useState } from "react";

const MIDDLE_UP = "IGITALA";
const MIDDLE_LOW = "IGITALA";
const DOMAIN = ".COMPUTER";

const nextPhase = (p: number) => (p === 17 ? 1 : p + 1);

export default function TypeReverse() {
  const [phase, setPhase] = useState(0);
  const [index, setIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      const next = index + 1;
      const u = phase;
      const dLen = DOMAIN.length;
      const mUpLen = MIDDLE_UP.length;
      const mLowLen = MIDDLE_LOW.length;

      if (u === 0 && next <= dLen) setIndex(next);          // type DX.COMPUTER
      else if (u === 1 && next <= 60) setIndex(next);       // pause DX.COMPUTER
      else if (u === 2 && next <= dLen) setIndex(next);     // delete .COMPUTER -> DX
      else if (u === 3 && next <= 30) setIndex(next);       // pause DX
      else if (u === 4 && next <= mUpLen) setIndex(next);   // type IGITALA -> DIGITALAX
      else if (u === 5 && next <= 60) setIndex(next);       // pause DIGITALAX
      else if (u === 6 && next <= mUpLen) setIndex(next);   // delete IGITALA -> DX
      else if (u === 7 && next <= 30) setIndex(next);       // pause DX
      else if (u === 8 && next <= 20) setIndex(next);       // Δx hold
      else if (u === 9 && next <= dLen) setIndex(next);     // Δx + .COMPUTER
      else if (u === 10 && next <= 60) setIndex(next);      // pause Δx.COMPUTER
      else if (u === 11 && next <= 20) setIndex(next);      // δx.COMPUTER hold
      else if (u === 12 && next <= dLen) setIndex(next);    // delete .COMPUTER -> δx
      else if (u === 13 && next <= mLowLen) setIndex(next); // type igitala -> δigitalax
      else if (u === 14 && next <= 60) setIndex(next);      // pause δigitalax
      else if (u === 15 && next <= mLowLen) setIndex(next); // delete iginala -> δx
      else if (u === 16 && next <= 20) setIndex(next);      // change δx -> DX hold
      else if (u === 17 && next <= dLen) setIndex(next);    // type .COMPUTER -> DX.COMPUTER
      else {
        setPhase(nextPhase(phase));
        setIndex(0);
      }
    }, 80);

    return () => clearInterval(tick);
  }, [phase, index]);

  useEffect(() => {
    const id = setInterval(() => {
      setCursorOn((v) => !v);
    }, 450);
    return () => clearInterval(id);
  }, []);

  const u = phase;
  let text = "";
  let cursorPos = 0;

  if (u === 0) {
    const part = DOMAIN.slice(0, index);
    text = "DX" + part;
    cursorPos = text.length;
  } else if (u === 1) {
    text = "DX" + DOMAIN;
    cursorPos = text.length;
  } else if (u === 2) {
    const remaining = Math.max(0, DOMAIN.length - index);
    const part = DOMAIN.slice(0, remaining);
    text = "DX" + part;
    cursorPos = text.length;
  } else if (u === 3) {
    text = "DX";
    cursorPos = text.length;
  } else if (u === 4) {
    const mid = MIDDLE_UP.slice(0, index);
    text = "D" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 5) {
    text = "DIGITALAX";
    cursorPos = text.length;
  } else if (u === 6) {
    const remaining = Math.max(0, MIDDLE_UP.length - index);
    const mid = MIDDLE_UP.slice(0, remaining);
    text = "D" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 7) {
    text = "DX";
    cursorPos = text.length;
  } else if (u === 8) {
    text = "ΔX";
    cursorPos = text.length;
  } else if (u === 9) {
    const part = DOMAIN.slice(0, index);
    text = "ΔX" + part;
    cursorPos = text.length;
  } else if (u === 10) {
    text = "ΔX" + DOMAIN;
    cursorPos = text.length;
  } else if (u === 11) {
    text = "δX" + DOMAIN;
    cursorPos = text.length;
  } else if (u === 12) {
    const remaining = Math.max(0, DOMAIN.length - index);
    const part = DOMAIN.slice(0, remaining);
    text = "δX" + part;
    cursorPos = text.length;
  } else if (u === 13) {
    const mid = MIDDLE_LOW.slice(0, index);
    text = "δ" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 14) {
    text = "δIGITALAX";
    cursorPos = text.length;
  } else if (u === 15) {
    const remaining = Math.max(0, MIDDLE_LOW.length - index);
    const mid = MIDDLE_LOW.slice(0, remaining);
    text = "δ" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 16) {
    text = "DX";
    cursorPos = text.length;
  } else if (u === 17) {
    const part = DOMAIN.slice(0, index);
    text = "DX" + part;
    cursorPos = text.length;
  }

  const maxShrink = 0.25;
  let scale = 1;

  if (u === 0) {
    const p = Math.min(1, index / DOMAIN.length);
    scale = 1 - maxShrink * p;
  } else if (u === 1) {
    scale = 1 - maxShrink;
  } else if (u === 2) {
    const remaining = Math.max(0, DOMAIN.length - index);
    const p = remaining / DOMAIN.length;
    scale = 1 - maxShrink * p;
  } else if (u === 9) {
    const p = Math.min(1, index / DOMAIN.length);
    scale = 1 - maxShrink * p;
  } else if (u === 10 || u === 11) {
    scale = 1 - maxShrink;
  } else if (u === 12) {
    const remaining = Math.max(0, DOMAIN.length - index);
    const p = remaining / DOMAIN.length;
    scale = 1 - maxShrink * p;
  } else if (u === 17) {
    const p = Math.min(1, index / DOMAIN.length);
    scale = 1 - maxShrink * p;
  }

  const before = text.slice(0, cursorPos);
  const after = text.slice(cursorPos);

  return (
    <h1
      className="flex items-center justify-center relative w-fit h-fit cursor-sewingHS"
      onClick={() => window.open("https://digitalax.xyz")}
    >
      <span
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {before}
        <span
          style={{
            marginLeft: "0.05em",
            marginRight: "0.05em",
            opacity: cursorOn ? 1 : 0,
          }}
        >
          |
        </span>
        {after}
      </span>
    </h1>
  );
}
