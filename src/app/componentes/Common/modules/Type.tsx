"use client";

import React, { useEffect, useState } from "react";

const MIDDLE = "IGITALA";
const DOMAIN = ".COMPUTER";
const LEN_DELTA_DOMAIN = ("ΔX" + DOMAIN).length;

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
      const mLen = MIDDLE.length;

      if (u === 0 && next <= dLen) setIndex(next);
      else if (u === 1 && next <= 60) setIndex(next);
      else if (u === 2 && next <= dLen) setIndex(next);
      else if (u === 3 && next <= 30) setIndex(next);
      else if (u === 4 && next <= mLen) setIndex(next);
      else if (u === 5 && next <= 60) setIndex(next);
      else if (u === 6 && next <= mLen) setIndex(next);
      else if (u === 7 && next <= 30) setIndex(next);
      else if (u === 8 && next <= 20) setIndex(next);
      else if (u === 9 && next <= dLen) setIndex(next);
      else if (u === 10 && next <= LEN_DELTA_DOMAIN) setIndex(next);
      else if (u === 11 && next <= LEN_DELTA_DOMAIN) setIndex(next);
      else if (u === 12 && next <= dLen) setIndex(next);
      else if (u === 13 && next <= mLen) setIndex(next);
      else if (u === 14 && next <= 60) setIndex(next);
      else if (u === 15 && next <= mLen) setIndex(next);
      else if (u === 16 && next <= 20) setIndex(next);
      else if (u === 17 && next <= dLen) setIndex(next);
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
    const mid = MIDDLE.slice(0, index);
    text = "D" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 5) {
    text = "DIGITALAX";
    cursorPos = text.length;
  } else if (u === 6) {
    const remaining = Math.max(0, MIDDLE.length - index);
    const mid = MIDDLE.slice(0, remaining);
    text = "D" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 7) {
    text = "DX";
    cursorPos = text.length;
  } else if (u === 8) {
    text = "ΔX";
    cursorPos = 1;
  } else if (u === 9) {
    const part = DOMAIN.slice(0, index);
    text = "ΔX" + part;
    cursorPos = text.length;
  } else if (u === 10) {
    text = "ΔX" + DOMAIN;
    const L = text.length;
    cursorPos = Math.max(0, L - index);
  } else if (u === 11) {
    text = "δX" + DOMAIN;
    const L = text.length;
    cursorPos = Math.min(L, index);
  } else if (u === 12) {
    const remaining = Math.max(0, DOMAIN.length - index);
    const part = DOMAIN.slice(0, remaining);
    text = "δX" + part;
    cursorPos = text.length;
  } else if (u === 13) {
    const mid = MIDDLE.slice(0, index);
    text = "δ" + mid + "X";
    cursorPos = text.length - 1;
  } else if (u === 14) {
    text = "δIGITALAX";
    cursorPos = text.length;
  } else if (u === 15) {
    const remaining = Math.max(0, MIDDLE.length - index);
    const mid = MIDDLE.slice(0, remaining);
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
