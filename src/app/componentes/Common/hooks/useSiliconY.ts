import { useEffect, useState } from "react";

const TOP_WORLD = 4.8;
const ZOOM = 85;

const MEASURED_IDS = [
  "silicon-block",
  "thesis-block",
  "fanout-block",
  "econ-canonical",
  "econ-intro",
  "econ-video",
  "econ-treeliner",
  "econ-cyber",
  "site-footer",
];

const measureY = (id: string): { top: number; bot: number } | null => {
  const b = document.getElementById(id);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return {
    top: TOP_WORLD - (r.top + window.scrollY) / ZOOM,
    bot: TOP_WORLD - (r.bottom + window.scrollY) / ZOOM,
  };
};

const measureThesis = (
  id: string
): { top: number; bot: number; halfW: number } | null => {
  const b = document.getElementById(id);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return {
    top: TOP_WORLD - (r.top + window.scrollY) / ZOOM,
    bot: TOP_WORLD - (r.bottom + window.scrollY) / ZOOM,
    halfW: r.width / 2 / ZOOM + 0.12,
  };
};

const FAN_CONN_OFFSET = 52;
const FAN_BOX5_OFFSET = 310;

const measureFan = (id: string): { conn: number; box5: number } | null => {
  const b = document.getElementById(id);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  const top = r.top + window.scrollY;
  return {
    conn: TOP_WORLD - (top + FAN_CONN_OFFSET) / ZOOM,
    box5: TOP_WORLD - (top + FAN_BOX5_OFFSET) / ZOOM,
  };
};

const ECON_IDS = [
  "econ-canonical",
  "econ-intro",
  "econ-video",
  "econ-treeliner",
  "econ-cyber",
];

const measureEcon = (): { top: number; bot: number }[] => {
  const out: { top: number; bot: number }[] = [];
  for (const id of ECON_IDS) {
    const m = measureY(id);
    if (m) out.push(m);
  }
  return out;
};

const measureFootPage = (): number => {
  const b = document.getElementById("site-footer");
  if (!b) return 0;
  return Math.round(b.getBoundingClientRect().bottom + window.scrollY);
};

export const useSiliconY = (): {
  sil: { top: number; bot: number };
  thesis: { top: number; bot: number; halfW: number };
  fan: { conn: number; box5: number };
  econ: { top: number; bot: number }[];
  footPage: number;
  ready: boolean;
} => {
  const [frames, setFrames] = useState({
    sil: { top: -16, bot: -18 },
    thesis: { top: -22, bot: -27, halfW: 4 },
    fan: { conn: -15, box5: -19 },
    econ: [] as { top: number; bot: number }[],
    footPage: 0,
    ready: false,
  });

  useEffect(() => {
    let raf = 0;

    const measure = (): void => {
      const sil = measureY("silicon-block");
      const thesis = measureThesis("thesis-block");
      const fan = measureFan("fanout-block");
      const econ = measureEcon();
      const footPage = measureFootPage();
      if (!sil || !thesis || !fan) return;
      setFrames((prev) => {
        if (
          prev.ready &&
          prev.sil.top === sil.top &&
          prev.sil.bot === sil.bot &&
          prev.thesis.top === thesis.top &&
          prev.thesis.bot === thesis.bot &&
          prev.thesis.halfW === thesis.halfW &&
          prev.fan.conn === fan.conn &&
          prev.footPage === footPage &&
          JSON.stringify(prev.econ) === JSON.stringify(econ)
        ) {
          return prev;
        }
        return { sil, thesis, fan, econ, footPage, ready: true };
      });
    };

    const schedule = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();

    window.addEventListener("resize", schedule);

    const ro = new ResizeObserver(schedule);
    for (const id of MEASURED_IDS) {
      const el = document.getElementById(id);
      if (el) ro.observe(el);
    }
    ro.observe(document.body);

    const imgs = Array.from(document.images);
    for (const img of imgs) {
      if (!img.complete) img.addEventListener("load", schedule);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule);
    }

    const timers = [400, 1600].map((ms) => setTimeout(measure, ms));

    return () => {
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      for (const img of imgs) img.removeEventListener("load", schedule);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return frames;
};
