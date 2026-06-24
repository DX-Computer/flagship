"use client";

import { useEffect, useState } from "react";

const NUMBERS = Array.from({ length: 42 }, (_, i) => i + 1).filter(
  (n) => n !== 33
);

const useChip = () => {
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

  return { n, glitch };
};

export default useChip;
