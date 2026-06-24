"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Instances, Instance } from "@react-three/drei";
import { JSX, Suspense, useMemo } from "react";
import * as THREE from "three";

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function useBrushedRough(): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const v = 120 + Math.floor(rnd(x * 131 + y * 17) * 120);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(5, 5);
    return t;
  }, []);
}

function FanMesh(): JSX.Element {
  const rough = useBrushedRough();
  const totalScale = 0.25 * 2.7;
  const pitch = (1.5 / 8) * totalScale;
  const startX = 1.55 * totalScale - 0.04;
  const N = 9;
  const r = 0.009;
  const s1 = 0.16;
  const s2 = 0.16;
  const x1 = startX + 0.22;
  const x2 = x1 + s1;
  const x3 = x2 + 0.4;
  const x4 = x3 + s2;

  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const joints: [number, number][] = [];
  const pads: { x: number; y: number }[] = [];
  const vias: [number, number][] = [];

  for (let i = 0; i < N; i++) {
    const y0 = (4 - i) * pitch;
    const dir = i < 4 ? 1 : i > 4 ? -1 : 0;
    const y1 = y0 + dir * s1;
    const y2 = y1 + dir * s2;
    const x5 = i === 3 || i === 5 ? 4.0 : x4 + 0.15 + rnd(i * 5.1 + 3) * 1.7;
    const pts: [number, number][] = [
      [startX, y0],
      [x1, y0],
      [x2, y1],
      [x3, y1],
      [x4, y2],
      [x5, y2],
    ];
    for (let j = 0; j < pts.length - 1; j++) {
      const a = pts[j];
      const b = pts[j + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + r;
      segs.push({
        x: (a[0] + b[0]) / 2,
        y: (a[1] + b[1]) / 2,
        len,
        ang: Math.atan2(b[1] - a[1], b[0] - a[0]),
      });
      if (j > 0 && dir !== 0) joints.push([a[0], a[1]]);
    }
    pads.push({ x: startX - 0.04, y: y0 });
    if (i !== 3 && i !== 5) vias.push([x5, y2]);
  }

  return (
    <group position={[0, -2.38, 0.06]} rotation={[0, 0, Math.PI / 2]}>
      <Instances limit={pads.length} range={pads.length}>
        <boxGeometry args={[0.13, 0.085, 0.012]} />
        <meshPhysicalMaterial
          color="#aab0b8"
          metalness={1}
          roughness={0.35}
          roughnessMap={rough || undefined}
          clearcoat={0.4}
          envMapIntensity={1.1}
        />
        {pads.map((p, i) => (
          <Instance key={i} position={[p.x, p.y, 0]} />
        ))}
      </Instances>
      <Instances limit={pads.length} range={pads.length}>
        <boxGeometry
          args={[0.14 * totalScale, 0.07 * totalScale, 0.035 * totalScale]}
        />
        <meshPhysicalMaterial
          color="#edcb5f"
          metalness={1}
          roughness={0.4}
          roughnessMap={rough || undefined}
          bumpMap={rough || undefined}
          bumpScale={0.016}
          clearcoat={0.35}
          clearcoatRoughness={0.16}
          envMapIntensity={1.25}
        />
        {pads.map((p, i) => (
          <Instance key={i} position={[1.16 * totalScale, p.y, 0.034]} />
        ))}
      </Instances>
      <Instances limit={pads.length} range={pads.length}>
        <boxGeometry
          args={[0.34 * totalScale, 0.07 * totalScale, 0.018 * totalScale]}
        />
        <meshPhysicalMaterial
          color="#edcb5f"
          metalness={1}
          roughness={0.4}
          roughnessMap={rough || undefined}
          bumpMap={rough || undefined}
          bumpScale={0.016}
          clearcoat={0.35}
          clearcoatRoughness={0.16}
          envMapIntensity={1.25}
        />
        {pads.map((p, i) => (
          <Instance key={i} position={[1.36 * totalScale, p.y, 0]} />
        ))}
      </Instances>
      <Instances limit={segs.length} range={segs.length}>
        <cylinderGeometry args={[r, r, 1, 12]} />
        <meshPhysicalMaterial
          color="#9aa0a8"
          metalness={1}
          roughness={0.38}
          roughnessMap={rough || undefined}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.15}
        />
        {segs.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, s.y, 0]}
            rotation={[0, 0, s.ang - Math.PI / 2]}
            scale={[1, s.len, 1]}
          />
        ))}
      </Instances>
      <Instances limit={joints.length} range={joints.length}>
        <sphereGeometry args={[r, 12, 8]} />
        <meshPhysicalMaterial
          color="#9aa0a8"
          metalness={1}
          roughness={0.38}
          roughnessMap={rough || undefined}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.15}
        />
        {joints.map((p, i) => (
          <Instance key={i} position={[p[0], p[1], 0]} />
        ))}
      </Instances>
      <Instances limit={vias.length} range={vias.length}>
        <torusGeometry args={[0.028, 0.012, 8, 18]} />
        <meshPhysicalMaterial
          color="#c9a84e"
          metalness={1}
          roughness={0.3}
          clearcoat={0.5}
          envMapIntensity={1.2}
        />
        {vias.map((p, i) => (
          <Instance key={i} position={[p[0], p[1], 0]} />
        ))}
      </Instances>
    </group>
  );
}

const Fanout = (): JSX.Element => {
  return (
    <div
      id="fanout-block"
      style={{
        position: "relative",
        width: "100%",
        height: 380,
        pointerEvents: "none",
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 50], zoom: 85, near: 0.1, far: 200 }}
        gl={{ alpha: true, antialias: true }}
        dpr={1}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 9]} intensity={2.6} />
        <directionalLight position={[-6, -4, 6]} intensity={1.1} />
        <Suspense fallback={null}>
          <FanMesh />
          <Environment
            preset="warehouse"
            background={false}
            environmentIntensity={1.7}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Fanout;
