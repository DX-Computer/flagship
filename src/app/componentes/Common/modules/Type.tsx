"use client";

import React, { useEffect, useState } from "react";

type Transition = {
  from: string;
  to: string;
  fa: number;
  ta: number;
  al: number;
  hold: number;
};

const TRANSITIONS: Transition[] = [
  { from: "DX.COMPUTER", to: "CC0", fa: 3, ta: 0, al: 1, hold: 10 },
  { from: "CC0", to: "0CC", fa: 0, ta: 1, al: 2, hold: 10 },
  { from: "0CC", to: "0penConfidentialComputing", fa: 0, ta: 0, al: 1, hold: 16 },
  { from: "0penConfidentialComputing", to: "DX.COMPUTER", fa: 4, ta: 3, al: 1, hold: 16 },
  { from: "DX.COMPUTER", to: "ΔX.COMPUTER", fa: 1, ta: 1, al: 10, hold: 10 },
  { from: "ΔX.COMPUTER", to: "δX.COMPUTER", fa: 1, ta: 1, al: 10, hold: 10 },
  { from: "δX.COMPUTER", to: "δIGITALAX", fa: 0, ta: 0, al: 1, hold: 12 },
  { from: "δIGITALAX", to: "DIGITALAX", fa: 1, ta: 1, al: 8, hold: 12 },
  { from: "DIGITALAX", to: "DX.COMPUTER", fa: 0, ta: 0, al: 1, hold: 16 },
];

const parts = (t: Transition) => {
  const anchor = t.from.slice(t.fa, t.fa + t.al);
  const aPre = t.from.slice(0, t.fa);
  const aSuf = t.from.slice(t.fa + t.al);
  const bPre = t.to.slice(0, t.ta);
  const bSuf = t.to.slice(t.ta + t.al);
  return { anchor, aPre, aSuf, bPre, bSuf };
};

const morphLen = (t: Transition) => {
  const { anchor, aPre, aSuf, bPre, bSuf } = parts(t);
  const travel = aPre.length > 0 || bPre.length > 0 ? anchor.length : 0;
  return aSuf.length + aPre.length + bPre.length + bSuf.length + travel * 2;
};

const totalLen = (t: Transition) => morphLen(t) + t.hold;

const frame = (t: Transition, k: number) => {
  const { anchor, aPre, aSuf, bPre, bSuf } = parts(t);
  const aLen = anchor.length;
  const e1 = aSuf.length;
  const e2 = aPre.length;
  const t1 = bPre.length;
  const t2 = bSuf.length;
  const travel = e2 > 0 || t1 > 0 ? aLen : 0;
  const s1 = e1;
  const s2 = s1 + travel;
  const s3 = s2 + e2;
  const s4 = s3 + t1;
  const s5 = s4 + travel;
  const s6 = s5 + t2;

  if (k <= s1) {
    const suf = aSuf.slice(0, e1 - k);
    const text = aPre + anchor + suf;
    return { text, cursorPos: text.length };
  }
  if (k <= s2) {
    const text = aPre + anchor;
    return { text, cursorPos: aPre.length + aLen - (k - s1) };
  }
  if (k <= s3) {
    const pre = aPre.slice(0, e2 - (k - s2));
    const text = pre + anchor;
    return { text, cursorPos: pre.length };
  }
  if (k <= s4) {
    const pre = bPre.slice(0, k - s3);
    const text = pre + anchor;
    return { text, cursorPos: pre.length };
  }
  if (k <= s5) {
    const text = bPre + anchor;
    return { text, cursorPos: bPre.length + (k - s4) };
  }
  if (k <= s6) {
    const suf = bSuf.slice(0, k - s5);
    const text = bPre + anchor + suf;
    return { text, cursorPos: text.length };
  }
  return { text: t.to, cursorPos: t.to.length };
};

export default function TypeReverse() {
  const [ti, setTi] = useState(0);
  const [k, setK] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      if (k < totalLen(TRANSITIONS[ti])) setK(k + 1);
      else {
        setTi((ti + 1) % TRANSITIONS.length);
        setK(0);
      }
    }, 80);
    return () => clearInterval(id);
  }, [ti, k]);

  useEffect(() => {
    const id = setInterval(() => {
      setCursorOn((v) => !v);
    }, 450);
    return () => clearInterval(id);
  }, []);

  const { text, cursorPos } = frame(TRANSITIONS[ti], k);
  const scale = Math.min(1, 10 / Math.max(1, text.length));
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
