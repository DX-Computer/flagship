import { MetalStop } from "../types/common.types";

const LINEAR = [
  { o: 0, l: 16, s: 0.95 },
  { o: 22, l: 42, s: 1 },
  { o: 45, l: 67, s: 0.95 },
  { o: 50, l: 90, s: 0.68 },
  { o: 55, l: 67, s: 0.95 },
  { o: 78, l: 42, s: 1 },
  { o: 100, l: 16, s: 0.95 },
];

const RADIAL = [
  { o: 0, l: 90, s: 0.68 },
  { o: 32, l: 66, s: 0.95 },
  { o: 66, l: 42, s: 1 },
  { o: 100, l: 18, s: 0.95 },
];

const FOLD = [
  { o: 0, l: 24, s: 1 },
  { o: 15, l: 66, s: 0.88 },
  { o: 15, l: 32, s: 1 },
  { o: 33, l: 82, s: 0.76 },
  { o: 33, l: 42, s: 1 },
  { o: 50, l: 92, s: 0.64 },
  { o: 50, l: 34, s: 1 },
  { o: 68, l: 74, s: 0.84 },
  { o: 68, l: 28, s: 1 },
  { o: 85, l: 62, s: 0.9 },
  { o: 100, l: 20, s: 1 },
];

const toHsl = (hex: string): { h: number; s: number } => {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s };
};

const build = (
  tint: string,
  profile: { o: number; l: number; s: number }[]
): MetalStop[] => {
  const { h, s } = toHsl(tint);
  return profile.map((p) => ({
    offset: `${p.o}%`,
    color: `hsl(${Math.round(h)}, ${Math.min(
      100,
      Math.round(s * p.s * 100)
    )}%, ${p.l}%)`,
  }));
};

export const metalStops = (tint: string): MetalStop[] => build(tint, LINEAR);

export const metalRadial = (tint: string): MetalStop[] => build(tint, RADIAL);

export const metalFold = (tint: string): MetalStop[] => build(tint, FOLD);
