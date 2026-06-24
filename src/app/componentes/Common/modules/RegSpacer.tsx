"use client";

import { JSX, useEffect, useRef, useState } from "react";

const ZOOM = 85;
const REG_DROP = 0.9 + 2.6;
const GAP = 48;
const MARGIN = 12;

const RegSpacer = (): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState<number>(300);

  useEffect(() => {
    const measure = (): void => {
      const cy = document.getElementById("econ-cyber");
      const sp = ref.current;
      if (!cy || !sp) return;
      const cyberBot = cy.getBoundingClientRect().bottom + window.scrollY;
      const regLegEnd = cyberBot + REG_DROP * ZOOM;
      const spTop = sp.getBoundingClientRect().top + window.scrollY;
      const needed = Math.max(0, regLegEnd - spTop - GAP + MARGIN);
      setH((prev) => (Math.abs(prev - needed) > 1 ? needed : prev));
    };

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const timers = [300, 800, 1600, 3000].map((ms) => setTimeout(measure, ms));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return <div ref={ref} className="w-full flex relative" style={{ height: h }} />;
};

export default RegSpacer;
