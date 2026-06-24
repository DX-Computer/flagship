"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  RoundedBox,
  Instances,
  Instance,
} from "@react-three/drei";
import { JSX, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useChip from "../hooks/useChip";
import { useSiliconY } from "../hooks/useSiliconY";
import {
  RegulatorProps,
  Trace3DProps,
  RegTracesProps,
  ZenerProps,
  CapacitorProps,
} from "../types/common.types";

function useScratched(): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#8a8a8a";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) {
      const x = rnd(i * 3) * 256;
      const y = rnd(i * 7) * 256;
      const ang = rnd(i * 11) * Math.PI * 2;
      const len = 3 + rnd(i * 13) * 20;
      ctx.strokeStyle =
        rnd(i * 17) > 0.5 ? "rgba(255,255,255,0.7)" : "rgba(25,25,25,0.7)";
      ctx.lineWidth = 0.5 + rnd(i * 19) * 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    return t;
  }, []);
}

function ScratchedGold({
  tex,
  color = "#edcb5f",
  rough = 0.4,
  env = 1.25,
  cc = 0.35,
}: {
  tex: THREE.CanvasTexture | null;
  color?: string;
  rough?: number;
  env?: number;
  cc?: number;
}): JSX.Element {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={rough}
      roughnessMap={tex || undefined}
      bumpMap={tex || undefined}
      bumpScale={0.016}
      clearcoat={cc}
      clearcoatRoughness={0.16}
      envMapIntensity={env}
    />
  );
}

function Leads({
  tex,
  w = 2,
  h = 2,
}: {
  tex: THREE.CanvasTexture | null;
  w?: number;
  h?: number;
}): JSX.Element {
  const pitch = 1.5 / 8;
  const hSpread = w - 0.5;
  const vSpread = h - 0.5;
  const hN = Math.max(2, Math.round(hSpread / pitch) + 1);
  const vN = Math.max(2, Math.round(vSpread / pitch) + 1);
  const wHalf = w / 2;
  const hHalf = h / 2;
  const out: JSX.Element[] = [];
  for (let i = 0; i < hN; i++) {
    const x = -hSpread / 2 + (hSpread / (hN - 1)) * i;
    for (const s of [1, -1]) {
      out.push(
        <group key={`h${i}_${s}`}>
          <mesh position={[x, s * (hHalf + 0.16), 0.05]}>
            <boxGeometry args={[0.07, 0.14, 0.035]} />
            <ScratchedGold tex={tex} />
          </mesh>
          <mesh position={[x, s * (hHalf + 0.36), 0]}>
            <boxGeometry args={[0.07, 0.34, 0.018]} />
            <ScratchedGold tex={tex} />
          </mesh>
        </group>
      );
    }
  }
  for (let i = 0; i < vN; i++) {
    const y = -vSpread / 2 + (vSpread / (vN - 1)) * i;
    for (const s of [1, -1]) {
      out.push(
        <group key={`v${i}_${s}`}>
          <mesh position={[s * (wHalf + 0.16), y, 0.05]}>
            <boxGeometry args={[0.14, 0.07, 0.035]} />
            <ScratchedGold tex={tex} />
          </mesh>
          <mesh position={[s * (wHalf + 0.36), y, 0]}>
            <boxGeometry args={[0.34, 0.07, 0.018]} />
            <ScratchedGold tex={tex} />
          </mesh>
        </group>
      );
    }
  }
  return <>{out}</>;
}

export function Chip({
  dieTex = null,
  dieW = 1.72,
  dieH = 1.72,
  bodyW = 2,
  bodyH = 2,
}: {
  dieTex?: THREE.Texture | null;
  dieW?: number;
  dieH?: number;
  bodyW?: number;
  bodyH?: number;
} = {}): JSX.Element {
  const { n, glitch } = useChip();
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const die = useRef<THREE.Mesh>(null);
  const gold = useScratched();
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    if (dieTex) return;
    const loader = new THREE.TextureLoader();
    loader.load(`/images/dxcomputer-opensourcehardware-${n}.png`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.magFilter = THREE.LinearFilter;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
      const ar = t.image.width / t.image.height;
      if (ar > 1) {
        t.repeat.set(1 / ar, 1);
        t.offset.set((1 - 1 / ar) / 2, 0);
      } else {
        t.repeat.set(1, ar);
        t.offset.set(0, (1 - ar) / 2);
      }
      setTex(t);
    });
  }, [n, gl, dieTex]);

  useFrame(() => {
    if (!die.current) return;
    if (glitch && !dieTex) {
      die.current.position.x = (Math.random() - 0.5) * 0.07;
      die.current.position.y = (Math.random() - 0.5) * 0.07;
    } else {
      die.current.position.x = 0;
      die.current.position.y = 0;
    }
  });

  return (
    <group scale={0.25}>
      <RoundedBox args={[bodyW, bodyH, 0.2]} radius={0.035} smoothness={6}>
        <ScratchedGold
          tex={gold}
          color="#f9e7a4"
          rough={0.15}
          env={2.6}
          cc={1}
        />
      </RoundedBox>
      <Leads tex={gold} w={bodyW} h={bodyH} />
      {(dieTex || tex) && (
        <mesh ref={die} position={[0, 0, 0.11]}>
          <planeGeometry args={[dieW, dieH]} />
          <meshStandardMaterial
            map={dieTex || tex}
            metalness={0.15}
            roughness={0.5}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

const rnd = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// function QfpLeads(): JSX.Element {
//   const per = 13;
//   const spread = 1.6;
//   const edge = 1.2;
//   return (
//     <>
//       {[0, 1, 2, 3].map((s) => (
//         <group key={s} rotation={[0, 0, (Math.PI / 2) * s]}>
//           {Array.from({ length: per }).map((_, i) => {
//             const x = -spread / 2 + (spread / (per - 1)) * i;
//             return (
//               <mesh key={i} position={[x, edge, 0.04]}>
//                 <boxGeometry args={[0.05, 0.42, 0.05]} />
//                 <meshPhysicalMaterial
//                   color="#cdd4dc"
//                   metalness={1}
//                   roughness={0.2}
//                   clearcoat={0.6}
//                 />
//               </mesh>
//             );
//           })}
//         </group>
//       ))}
//     </>
//   );
// }

// function QfpRings(): JSX.Element {
//   const rings: { x: number; y: number; r: number }[] = [];
//   let k = 0;
//   const clusters: [number, number][] = [
//     [-1.6, 1.5],
//     [1.6, 1.5],
//     [-1.7, -1.4],
//     [1.7, -1.4],
//   ];
//   for (const [cx, cy] of clusters) {
//     for (let i = 0; i < 8; i++) {
//       k++;
//       rings.push({
//         x: cx + (rnd(k) - 0.5) * 0.9,
//         y: cy + (rnd(k * 2) - 0.5) * 0.9,
//         r: 0.05 + rnd(k * 3) * 0.03,
//       });
//     }
//   }
//   return (
//     <>
//       {rings.map((r, i) => (
//         <mesh key={i} position={[r.x, r.y, 0.03]}>
//           <torusGeometry args={[r.r, r.r * 0.32, 8, 18]} />
//           <meshPhysicalMaterial
//             color="#cdd4dc"
//             metalness={1}
//             roughness={0.22}
//           />
//         </mesh>
//       ))}
//     </>
//   );
// }

// function Grommet3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#75654b",
//   ringR = 0.6,
//   tubeR = 0.28,
//   roughness = 0.34,
//   holeColor = "#1a160f",
//   holeMetalness = 0.3,
//   holeRoughness = 0.85,
// }: GrommetProps): JSX.Element {
//   const holeR = ringR - tubeR + 0.05;
//   return (
//     <group position={position} scale={scale}>
//       <mesh>
//         <torusGeometry args={[ringR, tubeR, 24, 56]} />
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness}
//           clearcoat={0.4}
//           clearcoatRoughness={0.45}
//         />
//       </mesh>
//       <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
//         <cylinderGeometry args={[holeR, holeR, 0.5, 40]} />
//         <meshStandardMaterial
//           color={holeColor}
//           metalness={holeMetalness}
//           roughness={holeRoughness}
//         />
//       </mesh>
//     </group>
//   );
// }

// function Can3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#c8ccd2",
//   radius = 0.8,
//   height = 0.35,
//   roughness = 0.28,
//   dome = 0.28,
// }: CanProps): JSX.Element {
//   return (
//     <group position={position} scale={scale}>
//       <mesh rotation={[Math.PI / 2, 0, 0]}>
//         <cylinderGeometry args={[radius, radius, height, 56]} />
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness}
//           clearcoat={0.5}
//           clearcoatRoughness={0.3}
//         />
//       </mesh>
//       <mesh position={[0, 0, height / 2]} scale={[1, 1, dome]}>
//         <sphereGeometry args={[radius, 48, 32]} />
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness}
//           clearcoat={0.5}
//           clearcoatRoughness={0.3}
//         />
//       </mesh>
//     </group>
//   );
// }

// function Crystal3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#c8ccd2",
//   w = 1.6,
//   h = 1.15,
//   roughness = 0.3,
//   pins = 0,
//   leadColor = "#b8bcc2",
// }: CrystalProps): JSX.Element {
//   const r = Math.min(w, h) * 0.22;
//   const spread = w * 0.84;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox args={[w, h, 0.3]} radius={r} smoothness={6}>
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness}
//           clearcoat={0.5}
//           clearcoatRoughness={0.3}
//         />
//       </RoundedBox>
//       <RoundedBox
//         args={[w - 0.18, h - 0.18, 0.36]}
//         radius={r * 0.85}
//         smoothness={6}
//         position={[0, 0, 0.04]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness + 0.05}
//           clearcoat={0.5}
//           clearcoatRoughness={0.3}
//         />
//       </RoundedBox>
//       {pins > 0 &&
//         Array.from({ length: pins }).map((_, i) => {
//           const lx = pins > 1 ? -spread / 2 + (spread / (pins - 1)) * i : 0;
//           return (
//             <mesh key={i} position={[lx, -h / 2 - 0.1, 0.03]}>
//               <boxGeometry args={[0.04, 0.22, 0.05]} />
//               <meshPhysicalMaterial
//                 color={leadColor}
//                 metalness={1}
//                 roughness={0.28}
//                 clearcoat={0.5}
//               />
//             </mesh>
//           );
//         })}
//     </group>
//   );
// }

// function QfpChip3D({
//   position = [0, 0, 0],
//   scale = 1,
//   size = 2,
//   pins = 17,
//   color = "#0b0b0d",
//   leadColor = "#b8bcc2",
// }: QfpProps): JSX.Element {
//   const half = size / 2;
//   const depth = 0.34;
//   const leadLen = size * 0.22;
//   const spread = size * 0.86;
//   const edge = half + leadLen / 2 - 0.02;
//   const dimpleR = size * 0.035;
//   const dimples: [number, number][] = [
//     [-half + size * 0.16, half - size * 0.16],
//     [-half + size * 0.16, -half + size * 0.16],
//   ];
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[size, size, depth]}
//         radius={size * 0.045}
//         smoothness={5}
//         position={[0, 0, depth / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={0.15}
//           roughness={0.5}
//           clearcoat={0.3}
//           clearcoatRoughness={0.5}
//         />
//       </RoundedBox>
//       {dimples.map(([dx, dy], i) => (
//         <mesh
//           key={i}
//           position={[dx, dy, depth - 0.015]}
//           rotation={[Math.PI / 2, 0, 0]}
//         >
//           <cylinderGeometry args={[dimpleR, dimpleR, 0.05, 20]} />
//           <meshStandardMaterial color="#050506" roughness={0.6} />
//         </mesh>
//       ))}
//       {[0, 1, 2, 3].map((s) => (
//         <group key={s} rotation={[0, 0, (Math.PI / 2) * s]}>
//           {Array.from({ length: pins }).map((_, i) => {
//             const x = -spread / 2 + (spread / (pins - 1)) * i;
//             return (
//               <mesh key={i} position={[x, edge, 0.03]}>
//                 <boxGeometry args={[size * 0.022, leadLen, 0.05]} />
//                 <meshPhysicalMaterial
//                   color={leadColor}
//                   metalness={1}
//                   roughness={0.28}
//                   clearcoat={0.5}
//                 />
//               </mesh>
//             );
//           })}
//         </group>
//       ))}
//     </group>
//   );
// }

// function HolePlate3D({
//   position = [0, 0, 0],
//   scale = 1,
//   w = 2.4,
//   h = 3.2,
//   color = "#6f604a",
//   border = true,
// }: HolePlateProps): JSX.Element {
//   const depth = 0.22;
//   const margin = 0.24;
//   const pitch = 0.33;
//   const holeR = 0.1;
//   const tx = w / 2 - margin - 1.7 * pitch;
//   const ty = h / 2 - margin - 1.7 * pitch;
//   const holes: [number, number][] = [];
//   let k = 0;
//   for (let x = -w / 2 + margin; x <= w / 2 - margin + 0.001; x += pitch) {
//     for (let y = -h / 2 + margin; y <= h / 2 - margin + 0.001; y += pitch) {
//       k++;
//       if (!border || Math.abs(x) > tx || Math.abs(y) > ty) {
//         holes.push([x + (rnd(k) - 0.5) * 0.06, y + (rnd(k * 2) - 0.5) * 0.06]);
//       }
//     }
//   }
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[w, h, depth]}
//         radius={0.08}
//         smoothness={5}
//         position={[0, 0, depth / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={0.42}
//           clearcoat={0.2}
//           clearcoatRoughness={0.5}
//         />
//       </RoundedBox>
//       {holes.map(([hx, hy], i) => (
//         <group key={i} position={[hx, hy, depth]}>
//           <mesh>
//             <torusGeometry args={[holeR, holeR * 0.42, 8, 18]} />
//             <meshPhysicalMaterial color={color} metalness={1} roughness={0.3} />
//           </mesh>
//           <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
//             <cylinderGeometry args={[holeR * 0.72, holeR * 0.72, 0.14, 14]} />
//             <meshStandardMaterial color="#0a0805" roughness={0.7} />
//           </mesh>
//         </group>
//       ))}
//       <mesh position={[0, 0, depth - 0.01]} rotation={[Math.PI / 2, 0, 0]}>
//         <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
//         <meshStandardMaterial color="#0a0805" roughness={0.7} />
//       </mesh>
//     </group>
//   );
// }

// function Block3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#7a6a4e",
//   size = 0.45,
//   roughness = 0.35,
// }: BlockProps): JSX.Element {
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[size, size, size * 0.7]}
//         radius={size * 0.16}
//         smoothness={5}
//         position={[0, 0, (size * 0.7) / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={roughness}
//           clearcoat={0.4}
//           clearcoatRoughness={0.4}
//         />
//       </RoundedBox>
//     </group>
//   );
// }

// function BlockField3D({
//   position = [0, 0, 0],
//   scale = 1,
//   w = 2.2,
//   h = 2.2,
//   color = "#8a8276",
//   size = 0.09,
// }: BlockFieldProps): JSX.Element {
//   const pads: [number, number][] = [];
//   let s = 0;
//   const step = 0.42;
//   for (let gx = -w / 2; gx <= w / 2; gx += step) {
//     for (let gy = -h / 2; gy <= h / 2; gy += step) {
//       s++;
//       if (rnd(s * 3) < 0.3) continue;
//       const cols = 2 + Math.floor(rnd(s * 5) * 3);
//       const rows = 2 + Math.floor(rnd(s * 7) * 3);
//       const cxp = gx + (rnd(s) - 0.5) * 0.18;
//       const cyp = gy + (rnd(s * 2) - 0.5) * 0.18;
//       for (let c = 0; c < cols; c++) {
//         for (let r = 0; r < rows; r++) {
//           pads.push([cxp + c * (size + 0.05), cyp + r * (size + 0.05)]);
//         }
//       }
//     }
//   }
//   return (
//     <group position={position} scale={scale}>
//       <Instances limit={pads.length} range={pads.length}>
//         <boxGeometry args={[size, size, size * 0.8]} />
//         <meshPhysicalMaterial color={color} metalness={1} roughness={0.35} />
//         {pads.map((p, i) => (
//           <Instance key={i} position={[p[0], p[1], size * 0.4]} />
//         ))}
//       </Instances>
//     </group>
//   );
// }

// function TraceField3D({
//   position = [0, 0, 0],
//   scale = 1,
//   w = 3,
//   count = 46,
//   color = "#d8b15c",
//   angle = Math.PI / 5,
// }: TraceFieldProps): JSX.Element {
//   const lineW = 0.018;
//   const lineH = 0.04;
//   const lines = Array.from({ length: count }, (_, i) => ({
//     y: -w / 2 + (w / (count - 1)) * i,
//     len: w * 0.72 + (rnd(i) - 0.5) * w * 0.22,
//     off: (rnd(i * 2) - 0.5) * w * 0.12,
//   }));
//   return (
//     <group position={position} scale={scale} rotation={[0, 0, angle]}>
//       <Instances limit={count} range={count}>
//         <boxGeometry args={[1, lineW, lineH]} />
//         <meshPhysicalMaterial
//           color={color}
//           metalness={1}
//           roughness={0.3}
//           clearcoat={0.5}
//         />
//         {lines.map((l, i) => (
//           <Instance
//             key={i}
//             position={[l.off, l.y, lineH / 2]}
//             scale={[l.len, 1, 1]}
//           />
//         ))}
//       </Instances>
//     </group>
//   );
// }

// function Resistor3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#1c1c1e",
//   length = 0.7,
//   w = 0.35,
// }: ChipPartProps): JSX.Element {
//   const h = 0.18;
//   const cap = length * 0.22;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[length, w, h]}
//         radius={0.03}
//         smoothness={4}
//         position={[0, 0, h / 2]}
//       >
//         <meshPhysicalMaterial color={color} metalness={0.2} roughness={0.6} />
//       </RoundedBox>
//       <mesh position={[-length / 2 + cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial color="#cdd2da" metalness={1} roughness={0.3} />
//       </mesh>
//       <mesh position={[length / 2 - cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial color="#cdd2da" metalness={1} roughness={0.3} />
//       </mesh>
//     </group>
//   );
// }

// function Capacitor3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#c2a06a",
//   length = 0.6,
//   w = 0.42,
// }: ChipPartProps): JSX.Element {
//   const h = 0.26;
//   const cap = length * 0.2;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[length, w, h]}
//         radius={0.05}
//         smoothness={5}
//         position={[0, 0, h / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={0.15}
//           roughness={0.5}
//           clearcoat={0.3}
//         />
//       </RoundedBox>
//       <mesh position={[-length / 2 + cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial color="#cdd2da" metalness={1} roughness={0.3} />
//       </mesh>
//       <mesh position={[length / 2 - cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial color="#cdd2da" metalness={1} roughness={0.3} />
//       </mesh>
//     </group>
//   );
// }

// function Transistor3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#0c0c0e",
//   leadColor = "#b8bcc2",
//   size = 0.5,
// }: TransistorProps): JSX.Element {
//   const bw = size;
//   const bh = size * 0.8;
//   const bd = 0.18;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[bw, bh, bd]}
//         radius={0.025}
//         smoothness={4}
//         position={[0, 0, bd / 2]}
//       >
//         <meshPhysicalMaterial color={color} metalness={0.15} roughness={0.5} />
//       </RoundedBox>
//       <mesh position={[-bw * 0.3, -bh / 2 - 0.09, 0.03]}>
//         <boxGeometry args={[0.1, 0.18, 0.05]} />
//         <meshPhysicalMaterial color={leadColor} metalness={1} roughness={0.3} />
//       </mesh>
//       <mesh position={[bw * 0.3, -bh / 2 - 0.09, 0.03]}>
//         <boxGeometry args={[0.1, 0.18, 0.05]} />
//         <meshPhysicalMaterial color={leadColor} metalness={1} roughness={0.3} />
//       </mesh>
//       <mesh position={[0, bh / 2 + 0.09, 0.03]}>
//         <boxGeometry args={[0.1, 0.18, 0.05]} />
//         <meshPhysicalMaterial color={leadColor} metalness={1} roughness={0.3} />
//       </mesh>
//     </group>
//   );
// }

// const TRACES: {
//   x: number;
//   y: number;
//   w: number;
//   count: number;
//   angle: number;
// }[] = [
//   { x: 10.8, y: 3.8, w: 5, count: 130, angle: Math.PI / 6 },
//   { x: 12, y: 2.4, w: 3.6, count: 95, angle: Math.PI / 6 },
// ];

const ANCHORS: {
  k: string;
  x: number;
  y: number;
  s: number;
  w?: number;
  h?: number;
  v?: number;
}[] = [];

const COMPS: { k: string; x: number; y: number; s: number; rot: number }[] = [];

(() => {
  const occ: { x: number; y: number; r: number }[] = [];
  const inCorner = (x: number, y: number): boolean => x > 7 && y > 1;
  const free = (x: number, y: number, r: number): boolean => {
    if (Math.hypot(x, y) < 2.6 + r) return false;
    if (Math.abs(x) > 13 || Math.abs(y) > 5.5) return false;
    if (inCorner(x, y)) return false;
    for (const o of occ)
      if (Math.hypot(x - o.x, y - o.y) < r + o.r) return false;
    return true;
  };

  const bigs: {
    k: string;
    x: number;
    y: number;
    s: number;
    r: number;
    w?: number;
    h?: number;
    v?: number;
  }[] = [
    { k: "qfp", x: -6.5, y: 2.6, s: 0.68, r: 1.35 },
    { k: "qfp", x: 4.5, y: -2.9, s: 0.6, r: 1.2 },
    { k: "holeplate", x: -9.5, y: -1, s: 0.4, w: 2.2, h: 2.6, v: 1, r: 1.2 },
    { k: "holeplate", x: 2, y: 3.4, s: 0.42, w: 2.4, h: 2, v: 0, r: 1.2 },
    { k: "holeplate", x: 8.5, y: -2.4, s: 0.38, w: 2, h: 2.4, v: 0, r: 1.1 },
    { k: "padfield", x: 10.5, y: -3.4, s: 1, w: 2.2, h: 1.8, r: 1.1 },
    { k: "padfield", x: -5, y: -3.6, s: 1, w: 1.8, h: 1.6, r: 1 },
    { k: "grommetBig", x: -11.5, y: 1.5, s: 1, r: 0.35 },
    { k: "grommetBig", x: -3.5, y: 4.2, s: 1, r: 0.35 },
    { k: "grommetBig", x: 11.5, y: -1.5, s: 1, r: 0.35 },
    { k: "grommetBig", x: -9, y: -4, s: 1, r: 0.35 },
    { k: "grommetBig", x: 1, y: -4.6, s: 1, r: 0.35 },
  ];
  for (const b of bigs)
    if (free(b.x, b.y, b.r)) {
      ANCHORS.push({ k: b.k, x: b.x, y: b.y, s: b.s, w: b.w, h: b.h, v: b.v });
      occ.push({ x: b.x, y: b.y, r: b.r });
    }

  const TYPES = [
    "resistor",
    "capacitor",
    "transistor",
    "block",
    "grommet",
    "can",
    "crystal",
  ];
  const counts: Record<string, number> = {
    resistor: 0,
    capacitor: 0,
    transistor: 0,
    block: 0,
    grommet: 0,
    can: 0,
    crystal: 0,
  };
  let seed = 100;
  const blob = (cx: number, cy: number, R: number, forced?: string): void => {
    const step = 0.15;
    const bt = forced || TYPES[Math.floor(rnd((seed += 5)) * TYPES.length)];
    for (let dx = -R; dx <= R; dx += step)
      for (let dy = -R; dy <= R; dy += step) {
        seed += 1;
        if (dx * dx + dy * dy > R * R) continue;
        if (rnd(seed) < 0.05) continue;
        const x = cx + dx + (rnd(seed * 11) - 0.5) * 0.03;
        const y = cy + dy + (rnd(seed * 13) - 0.5) * 0.03;
        const k = forced
          ? bt
          : TYPES[Math.floor(rnd(seed * 17) * TYPES.length)];
        const s = 0.2 + rnd(seed * 19) * 0.14;
        const rad =
          (k === "crystal" ? 0.5 : k === "grommet" ? 0.36 : 0.27) * s + 0.01;
        if (!free(x, y, rad)) continue;
        COMPS.push({ k, x, y, s, rot: rnd(seed * 23) * Math.PI });
        occ.push({ x, y, r: rad });
        counts[k]++;
      }
  };

  const masses: { x: number; y: number; R: number; t?: string }[] = [
    { x: -8, y: 2.4, R: 2 },
    { x: -9.3, y: -1.6, R: 1.7, t: "block" },
    { x: -4.2, y: -4, R: 1.7 },
    { x: 0.8, y: -4, R: 1.9, t: "capacitor" },
    { x: 6.2, y: -2.4, R: 2.1 },
    { x: 10, y: -3.2, R: 1.5, t: "grommet" },
    { x: -6.5, y: 4.2, R: 1.2 },
  ];
  for (const m of masses) blob(m.x, m.y, m.R, m.t);

  let guard = 0;
  while (TYPES.some((t) => counts[t] < 50) && guard < 200) {
    guard++;
    const low = TYPES.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    let cx = 0;
    let cy = 0;
    for (let t = 0; t < 40; t++) {
      seed += 3;
      cx = (rnd(seed) * 2 - 1) * 11;
      cy = (rnd(seed * 2) * 2 - 1) * 4.8;
      if (Math.hypot(cx, cy) > 3.5 && !inCorner(cx, cy)) break;
    }
    blob(cx, cy, 1, low);
  }
})();

// function TinyParts(): JSX.Element {
//   const pick = (t: string) => COMPS.filter((c) => c.k === t);
//   const res = pick("resistor");
//   const cap = pick("capacitor");
//   const tr = pick("transistor");
//   const bl = pick("block");
//   const gr = pick("grommet");
//   const cn = pick("can");
//   const cr = pick("crystal");
//   return (
//     <>
//       <Instances limit={res.length} range={res.length}>
//         <boxGeometry args={[0.7, 0.35, 0.18]} />
//         <meshPhysicalMaterial
//           color="#1c1c1e"
//           metalness={0.35}
//           roughness={0.5}
//         />
//         {res.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.05]}
//             scale={c.s}
//             rotation={[0, 0, c.rot]}
//           />
//         ))}
//       </Instances>
//       <Instances limit={cap.length} range={cap.length}>
//         <boxGeometry args={[0.6, 0.42, 0.26]} />
//         <meshPhysicalMaterial color="#c2a06a" metalness={0.2} roughness={0.5} />
//         {cap.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.06]}
//             scale={c.s}
//             rotation={[0, 0, c.rot]}
//           />
//         ))}
//       </Instances>
//       <Instances limit={tr.length} range={tr.length}>
//         <boxGeometry args={[0.5, 0.4, 0.18]} />
//         <meshPhysicalMaterial
//           color="#0c0c0e"
//           metalness={0.15}
//           roughness={0.5}
//         />
//         {tr.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.05]}
//             scale={c.s}
//             rotation={[0, 0, c.rot]}
//           />
//         ))}
//       </Instances>
//       <Instances limit={bl.length} range={bl.length}>
//         <boxGeometry args={[0.3, 0.3, 0.24]} />
//         <meshPhysicalMaterial color="#c4c9d1" metalness={1} roughness={0.35} />
//         {bl.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.05]}
//             scale={c.s}
//             rotation={[0, 0, c.rot]}
//           />
//         ))}
//       </Instances>
//       <Instances limit={gr.length} range={gr.length}>
//         <torusGeometry args={[0.3, 0.12, 8, 20]} />
//         <meshPhysicalMaterial color="#b08d3c" metalness={1} roughness={0.35} />
//         {gr.map((c, i) => (
//           <Instance key={i} position={[c.x, c.y, 0.03]} scale={c.s} />
//         ))}
//       </Instances>
//       <Instances limit={cn.length} range={cn.length}>
//         <cylinderGeometry args={[0.28, 0.3, 0.5, 18]} />
//         <meshPhysicalMaterial color="#c4c9d1" metalness={1} roughness={0.28} />
//         {cn.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.25 * c.s]}
//             scale={c.s}
//             rotation={[Math.PI / 2, 0, 0]}
//           />
//         ))}
//       </Instances>
//       <Instances limit={cr.length} range={cr.length}>
//         <boxGeometry args={[1.3, 1, 0.28]} />
//         <meshPhysicalMaterial color="#b8bcc2" metalness={1} roughness={0.3} />
//         {cr.map((c, i) => (
//           <Instance
//             key={i}
//             position={[c.x, c.y, 0.06]}
//             scale={c.s}
//             rotation={[0, 0, c.rot]}
//           />
//         ))}
//       </Instances>
//     </>
//   );
// }

// function FitWidth({ children }: { children: ReactNode }): JSX.Element {
//   const { viewport } = useThree();
//   return <group scale={viewport.width / 26}>{children}</group>;
// }

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

export function Trace3D({
  frames,
  bodyW = 2,
  bodyH = 2,
  dropBottom = 0,
  videoMode = false,
}: Trace3DProps): JSX.Element {
  const { viewport } = useThree();
  const rough = useBrushedRough();
  const totalScale = 0.25 * 2.7;
  const pitch = (1.5 / 8) * totalScale;
  const r = 0.009;
  const s1 = 0.16;
  const s2 = 0.16;
  const edgeW = viewport.width / 2 + 0.6;
  const edgeH = viewport.height / 2 + 0.6;

  const rot = (px: number, py: number, th: number): [number, number] => [
    px * Math.cos(th) - py * Math.sin(th),
    px * Math.sin(th) + py * Math.cos(th),
  ];
  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const joints: [number, number][] = [];
  const vias: [number, number][] = [];
  const pads: { x: number; y: number; ang: number }[] = [];
  let k = 0;
  for (let s = 0; s < 4; s++) {
    const th = (Math.PI / 2) * s;
    const reach = s % 2 === 0 ? edgeW : edgeH;
    const yOff = s === 3 ? -dropBottom : 0;
    const isVert = s === 0 || s === 2;
    const startX = ((isVert ? bodyW : bodyH) / 2 + 0.55) * totalScale - 0.04;
    const x1 = startX + 0.22;
    const x2 = x1 + s1;
    const x3 = x2 + 0.4;
    const x4 = x3 + s2;
    const spread = ((isVert ? bodyH : bodyW) - 0.5) * totalScale;
    const N = Math.max(2, Math.round(spread / pitch) + 1);
    const mid = (N - 1) / 2;
    for (let i = 0; i < N; i++) {
      k++;
      const y0 = spread / 2 - (spread / (N - 1)) * i;
      const dir = i < mid ? 1 : i > mid ? -1 : 0;
      const y1 = y0 + dir * s1;
      const y2 = y1 + dir * s2;
      const heroBottom = s === 3 && frames != null;
      const long = videoMode
        ? isVert || i === mid
        : heroBottom
        ? i === 3 || i === 5
        : rnd(k * 2.3) < 0.28;
      const x5 = long
        ? heroBottom && frames
          ? -frames.fan.conn
          : reach
        : videoMode
        ? x4 + 0.1 + rnd(k * 5.1) * 0.7
        : x4 + 0.15 + rnd(k * 5.1) * 1.7;
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
        const [ax, ay] = rot(a[0], a[1], th);
        const [bx, by] = rot(b[0], b[1], th);
        const len = Math.hypot(bx - ax, by - ay) + r;
        segs.push({
          x: (ax + bx) / 2,
          y: (ay + by) / 2 + yOff,
          len,
          ang: Math.atan2(by - ay, bx - ax),
        });
        if (j > 0 && dir !== 0) joints.push([ax, ay + yOff]);
      }
      const [px, py] = rot(startX - 0.04, y0, th);
      pads.push({ x: px, y: py + yOff, ang: th });
      if (!long) {
        const [vx, vy] = rot(x5, y2, th);
        vias.push([vx, vy + yOff]);
      }
    }
  }

  if (frames != null) {
    const silNear = frames.sil.top - 0.24;
    const by = (frames.fan.box5 + silNear) / 2;
    const blen = Math.abs(frames.fan.box5 - silNear) + r;
    segs.push({ x: 0, y: by, len: blen, ang: Math.PI / 2 });

    const stTop = frames.sil.bot + 0.24;
    const stBot = frames.thesis.top - 0.15;
    const sty = (stTop + stBot) / 2;
    const stlen = Math.abs(stTop - stBot) + r;
    segs.push({ x: 0, y: sty, len: stlen, ang: Math.PI / 2 });

    const regCY = frames.thesis.bot - 0.9;
    const rTop = frames.thesis.bot + 0.15;
    const rBot = regCY + 0.15;
    const ry = (rTop + rBot) / 2;
    const rlen = Math.abs(rTop - rBot) + r;
    segs.push({ x: 0, y: ry, len: rlen, ang: Math.PI / 2 });
  }

  return (
    <group position={[0, 0, 0.06]}>
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
          <Instance key={i} position={[p.x, p.y, 0]} rotation={[0, 0, p.ang]} />
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

// function Led3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#8f6328",
//   glow = true,
// }: Led3DProps): JSX.Element {
//   return (
//     <group position={position} scale={scale}>
//       <mesh position={[-0.11, 0, 0.035]}>
//         <boxGeometry args={[0.05, 0.16, 0.085]} />
//         <meshPhysicalMaterial
//           color="#6b6f74"
//           metalness={0.8}
//           roughness={0.62}
//         />
//       </mesh>
//       <mesh position={[0.11, 0, 0.035]}>
//         <boxGeometry args={[0.05, 0.16, 0.085]} />
//         <meshPhysicalMaterial
//           color="#6b6f74"
//           metalness={0.8}
//           roughness={0.62}
//         />
//       </mesh>
//       <RoundedBox
//         args={[0.2, 0.16, 0.09]}
//         radius={0.025}
//         smoothness={4}
//         position={[0, 0, 0.05]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           emissive={color}
//           emissiveIntensity={0.14}
//           metalness={0.2}
//           roughness={0.45}
//           clearcoat={0.8}
//           clearcoatRoughness={0.18}
//         />
//       </RoundedBox>
//       {glow && (
//         <pointLight
//           position={[0, 0, 0.18]}
//           color={color}
//           intensity={0.08}
//           distance={0.7}
//         />
//       )}
//     </group>
//   );
// }

// function LedCluster3D({
//   position = [0, 0, 0],
//   rows = [4, 3, 5, 2],
//   scale = 0.4,
//   fill = false,
//   fillRows = 8,
// }: LedClusterProps): JSX.Element {
//   const { viewport } = useThree();
//   const px = scale * 0.38;
//   const py = scale * 0.26;
//   const base = position[0] * 31.1 + position[1] * 17.3;
//   const nRows = fill ? fillRows : rows.length;
//   const edgeCols = fill
//     ? Math.max(1, Math.floor((viewport.width / 2 + 0.3 - position[0]) / px))
//     : 0;
//   const maxLen = fill ? edgeCols : Math.max(...rows);
//   const bodies: { x: number; y: number; sc: number }[] = [];
//   const terms: { x: number; y: number; z: number; sc: number }[] = [];
//   let k = 0;
//   for (let r = 0; r < nRows; r++) {
//     const len = fill ? edgeCols - Math.floor(rnd(r * 9.1 + base) * 4) : rows[r];
//     const off = fill
//       ? Math.round((edgeCols - len) / 2)
//       : Math.round((maxLen - len) / 2);
//     const anchor = fill ? 0 : -(maxLen - 1) / 2;
//     for (let c = 0; c < len; c++) {
//       k++;
//       const sc = scale * (0.82 + rnd(k * 7.3 + base) * 0.36);
//       const x = (c + off + anchor) * px;
//       const y = (r - (nRows - 1) / 2) * py;
//       bodies.push({ x, y, sc });
//       terms.push({ x: x - 0.11 * sc, y, z: 0.035 * sc, sc });
//       terms.push({ x: x + 0.11 * sc, y, z: 0.035 * sc, sc });
//     }
//   }
//   return (
//     <group position={position}>
//       <Instances limit={bodies.length} range={bodies.length}>
//         <boxGeometry args={[0.2, 0.16, 0.09]} />
//         <meshPhysicalMaterial
//           color="#8f6328"
//           emissive="#8f6328"
//           emissiveIntensity={0.32}
//           metalness={0.2}
//           roughness={0.38}
//           clearcoat={1}
//           clearcoatRoughness={0.12}
//           envMapIntensity={1.4}
//         />
//         {bodies.map((b, i) => (
//           <Instance key={i} position={[b.x, b.y, 0.05 * b.sc]} scale={b.sc} />
//         ))}
//       </Instances>
//       <Instances limit={terms.length} range={terms.length}>
//         <boxGeometry args={[0.05, 0.16, 0.085]} />
//         <meshPhysicalMaterial
//           color="#6b6f74"
//           metalness={0.8}
//           roughness={0.62}
//         />
//         {terms.map((t, i) => (
//           <Instance key={i} position={[t.x, t.y, t.z]} scale={t.sc} />
//         ))}
//       </Instances>
//     </group>
//   );
// }

function Regulator3D({
  position = [0, 0, 0],
  scale = 1,
  color = "#1b1b20",
}: RegulatorProps): JSX.Element {
  const rough = useBrushedRough();
  const scratch = useScratched();
  return (
    <group position={position} scale={scale}>
      <RoundedBox
        args={[0.9, 0.55, 0.13]}
        radius={0.02}
        smoothness={5}
        position={[0, 0, 0.065]}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.5}
          roughnessMap={rough || undefined}
          bumpMap={rough || undefined}
          bumpScale={0.012}
          clearcoat={0.7}
          clearcoatRoughness={0.3}
          envMapIntensity={1}
        />
      </RoundedBox>
      <mesh position={[0, 0.5, 0.03]}>
        <boxGeometry args={[0.9, 0.5, 0.045]} />
        <meshPhysicalMaterial
          color="#dfe4ea"
          metalness={1}
          roughness={0.16}
          roughnessMap={scratch || undefined}
          bumpMap={scratch || undefined}
          bumpScale={0.016}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh position={[0, 0.62, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.08, 24]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.4} roughness={0.7} />
      </mesh>
      {[-0.28, 0, 0.28].map((lx, i) => (
        <mesh key={i} position={[lx, -0.42, 0.015]}>
          <boxGeometry args={[0.07, 0.34, 0.03]} />
          <meshPhysicalMaterial
            color="#dfe4ea"
            metalness={1}
            roughness={0.18}
            roughnessMap={scratch || undefined}
            bumpMap={scratch || undefined}
            bumpScale={0.012}
            clearcoat={0.6}
            envMapIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function RegTraces3D({ side = 1, frames, cx, cy }: RegTracesProps): JSX.Element {
  const { viewport } = useThree();
  const rough = useBrushedRough();
  const rscale = 0.26;
  const halfW = frames ? frames.thesis.halfW : 4;
  const regX = cx != null ? cx : side * halfW;
  const ry =
    cy != null
      ? cy
      : frames
      ? (frames.thesis.top + frames.thesis.bot) / 2
      : -22;
  const xTip = regX + side * 0.16;
  const edgeX = side * (viewport.width / 2 + 0.4);
  const r = 0.009;
  const legY = [-0.28, 0, 0.28].map((l) => ry + l * rscale);
  const busY = [-0.16, 0, 0.16].map((b) => ry + b);
  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const joints: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    const ly = legY[i];
    const by = busY[i];
    const escX = xTip + side * 0.18;
    const diagX = escX + side * Math.abs(by - ly);
    const pts: [number, number][] = [
      [xTip, ly],
      [escX, ly],
      [diagX, by],
      [edgeX, by],
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
      if (j > 0 && Math.abs(by - ly) > 0.001) joints.push(a);
    }
  }
  return (
    <group>
      <group position={[regX, ry, 0.12]} rotation={[0, 0, (side * Math.PI) / 2]}>
        <Regulator3D scale={rscale} />
      </group>
      <group position={[0, 0, 0.08]}>
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
        <Instances limit={Math.max(joints.length, 1)} range={joints.length}>
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
      </group>
    </group>
  );
}

function RegDown3D({
  position = [0, 0, 0],
  scale = 0.26,
}: {
  position?: [number, number, number];
  scale?: number;
}): JSX.Element {
  const rough = useBrushedRough();
  const r = 0.009;
  const rx = position[0];
  const ry = position[1];
  const legTipY = ry - 0.59 * scale;
  const legXs = [-0.28, 0, 0.28].map((l) => rx + l * scale);
  const colXs = [-0.16, 0, 0.16].map((c) => rx + c);
  const busY = ry - 2.6;
  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const joints: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    const lx = legXs[i];
    const colx = colXs[i];
    const escY = legTipY - 0.14;
    const diagY = escY - Math.abs(colx - lx);
    const pts: [number, number][] = [
      [lx, legTipY],
      [lx, escY],
      [colx, diagY],
      [colx, busY],
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
      if (j > 0 && Math.abs(colx - lx) > 0.001) joints.push([a[0], a[1]]);
    }
  }
  return (
    <group>
      <group position={[rx, ry, position[2]]}>
        <Regulator3D scale={scale} />
      </group>
      <group position={[0, 0, 0.08]}>
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
        <Instances limit={Math.max(joints.length, 1)} range={joints.length}>
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
      </group>
    </group>
  );
}

// function Diode3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#17171a",
//   band = "#e4e8ee",
// }: DiodeProps): JSX.Element {
//   const rough = useBrushedRough();
//   const scratch = useScratched();
//   const len = 0.42;
//   const w = 0.2;
//   const h = 0.11;
//   const cap = 0.075;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[len, w, h]}
//         radius={0.02}
//         smoothness={4}
//         position={[0, 0, h / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={0.25}
//           roughness={0.45}
//           roughnessMap={rough || undefined}
//           bumpMap={rough || undefined}
//           bumpScale={0.008}
//           clearcoat={0.6}
//           clearcoatRoughness={0.3}
//           envMapIntensity={1}
//         />
//       </RoundedBox>
//       <mesh position={[len * 0.3, 0, h + 0.003]}>
//         <boxGeometry args={[len * 0.13, w * 1.02, 0.025]} />
//         <meshPhysicalMaterial
//           color={band}
//           metalness={0.5}
//           roughness={0.3}
//           roughnessMap={scratch || undefined}
//           envMapIntensity={1.3}
//         />
//       </mesh>
//       <mesh position={[-len / 2 + cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial
//           color="#cdd2da"
//           metalness={1}
//           roughness={0.28}
//           roughnessMap={scratch || undefined}
//           bumpMap={scratch || undefined}
//           bumpScale={0.01}
//           envMapIntensity={1.5}
//         />
//       </mesh>
//       <mesh position={[len / 2 - cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial
//           color="#cdd2da"
//           metalness={1}
//           roughness={0.28}
//           roughnessMap={scratch || undefined}
//           bumpMap={scratch || undefined}
//           bumpScale={0.01}
//           envMapIntensity={1.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function useLabel(code: string): THREE.CanvasTexture | null {
//   return useMemo(() => {
//     if (typeof document === "undefined") return null;
//     const c = document.createElement("canvas");
//     c.width = 256;
//     c.height = 128;
//     const ctx = c.getContext("2d");
//     if (!ctx) return null;
//     ctx.clearRect(0, 0, 256, 128);
//     ctx.fillStyle = "#eef0f2";
//     ctx.font = "bold 80px monospace";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(code, 128, 70);
//     const t = new THREE.CanvasTexture(c);
//     return t;
//   }, [code]);
// }

// function ChipResistor3D({
//   position = [0, 0, 0],
//   scale = 1,
//   color = "#1a1a1d",
//   code = "103",
// }: ChipResistorProps): JSX.Element {
//   const rough = useBrushedRough();
//   const scratch = useScratched();
//   const label = useLabel(code);
//   const len = 0.42;
//   const w = 0.22;
//   const h = 0.1;
//   const cap = 0.09;
//   return (
//     <group position={position} scale={scale}>
//       <RoundedBox
//         args={[len, w, h]}
//         radius={0.012}
//         smoothness={4}
//         position={[0, 0, h / 2]}
//       >
//         <meshPhysicalMaterial
//           color={color}
//           metalness={0.15}
//           roughness={0.5}
//           roughnessMap={rough || undefined}
//           bumpMap={rough || undefined}
//           bumpScale={0.006}
//           clearcoat={0.4}
//           clearcoatRoughness={0.3}
//         />
//       </RoundedBox>
//       {label && (
//         <mesh position={[0, 0, h + 0.003]}>
//           <planeGeometry args={[len * 0.62, w * 0.62]} />
//           <meshBasicMaterial map={label} transparent toneMapped={false} />
//         </mesh>
//       )}
//       <mesh position={[-len / 2 + cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial
//           color="#d2d7de"
//           metalness={1}
//           roughness={0.25}
//           roughnessMap={scratch || undefined}
//           bumpMap={scratch || undefined}
//           bumpScale={0.01}
//           envMapIntensity={1.5}
//         />
//       </mesh>
//       <mesh position={[len / 2 - cap / 2, 0, h / 2]}>
//         <boxGeometry args={[cap, w + 0.01, h + 0.01]} />
//         <meshPhysicalMaterial
//           color="#d2d7de"
//           metalness={1}
//           roughness={0.25}
//           roughnessMap={scratch || undefined}
//           bumpMap={scratch || undefined}
//           bumpScale={0.01}
//           envMapIntensity={1.5}
//         />
//       </mesh>
//     </group>
//   );
// }

// function DotPainting3D(): JSX.Element {
//   const { viewport } = useThree();
//   const W = viewport.width / 2 + 0.3;
//   const H = viewport.height / 2 + 0.3;
//   const blocked = (x: number, y: number): boolean => {
//     if (Math.hypot(x, y) < 3.0) return true;
//     if (Math.abs(y) < 0.95) return true;
//     if (Math.abs(x) < 0.95) return true;
//     if (Math.hypot(x - 3.8, y + 2.4) < 0.85) return true;
//     if (x > 3.6 && Math.abs(y + 2.4) < 0.5) return true;
//     return false;
//   };
//   const dotPitch = 0.4;
//   const centers: [number, number][] = [
//     [-5, 3.2],
//     [5.4, 3.3],
//     [-6.3, -2.6],
//     [6, -3],
//     [-3.4, 4.3],
//     [3.6, -4.2],
//     [8, 2],
//     [-8, -2],
//   ];
//   const dots: { x: number; y: number; rot: number; t: number }[] = [];
//   let n = 0;
//   for (const [cx, cy] of centers) {
//     const rings = 3 + Math.floor(rnd(cx * 7.1 + cy * 3.3) * 3);
//     for (let ri = 1; ri <= rings; ri++) {
//       const rad = ri * 0.46;
//       const count = Math.max(6, Math.round((2 * Math.PI * rad) / dotPitch));
//       for (let a = 0; a < count; a++) {
//         const ang = (a / count) * Math.PI * 2;
//         const x = cx + Math.cos(ang) * rad;
//         const y = cy + Math.sin(ang) * rad;
//         n++;
//         if (Math.abs(x) > W || Math.abs(y) > H || blocked(x, y)) continue;
//         dots.push({ x, y, rot: ang + Math.PI / 2, t: n % 3 });
//       }
//     }
//     n++;
//     if (!blocked(cx, cy)) dots.push({ x: cx, y: cy, rot: 0, t: n % 3 });
//   }
//   for (let i = 0; i < centers.length; i++) {
//     const [ax, ay] = centers[i];
//     const [bx, by] = centers[(i + 1) % centers.length];
//     const dist = Math.hypot(bx - ax, by - ay);
//     const steps = Math.round(dist / dotPitch);
//     const pang = Math.atan2(by - ay, bx - ax);
//     for (let s = 1; s < steps; s++) {
//       const x = ax + (bx - ax) * (s / steps);
//       const y = ay + (by - ay) * (s / steps);
//       n++;
//       if (Math.abs(x) > W || Math.abs(y) > H || blocked(x, y)) continue;
//       dots.push({ x, y, rot: pang, t: n % 3 });
//     }
//   }
//   const leds = dots.filter((d) => d.t === 0);
//   const ress = dots.filter((d) => d.t === 1);
//   const dios = dots.filter((d) => d.t === 2);
//   return (
//     <group position={[0, 0, 0.05]}>
//       <Instances limit={Math.max(leds.length, 1)} range={leds.length}>
//         <boxGeometry args={[0.14, 0.1, 0.06]} />
//         <meshPhysicalMaterial
//           color="#8f6328"
//           emissive="#8f6328"
//           emissiveIntensity={0.3}
//           metalness={0.3}
//           roughness={0.4}
//           clearcoat={1}
//           clearcoatRoughness={0.15}
//           envMapIntensity={1.3}
//         />
//         {leds.map((d, i) => (
//           <Instance key={i} position={[d.x, d.y, 0]} rotation={[0, 0, d.rot]} />
//         ))}
//       </Instances>
//       <Instances limit={Math.max(ress.length, 1)} range={ress.length}>
//         <boxGeometry args={[0.16, 0.09, 0.05]} />
//         <meshPhysicalMaterial
//           color="#1a1a1d"
//           metalness={0.2}
//           roughness={0.5}
//           clearcoat={0.4}
//         />
//         {ress.map((d, i) => (
//           <Instance key={i} position={[d.x, d.y, 0]} rotation={[0, 0, d.rot]} />
//         ))}
//       </Instances>
//       <Instances limit={Math.max(dios.length, 1)} range={dios.length}>
//         <boxGeometry args={[0.14, 0.09, 0.05]} />
//         <meshPhysicalMaterial
//           color="#c2c7cf"
//           metalness={1}
//           roughness={0.3}
//           envMapIntensity={1.4}
//         />
//         {dios.map((d, i) => (
//           <Instance key={i} position={[d.x, d.y, 0]} rotation={[0, 0, d.rot]} />
//         ))}
//       </Instances>
//       <Instances limit={Math.max(dios.length, 1)} range={dios.length}>
//         <boxGeometry args={[0.032, 0.092, 0.052]} />
//         <meshPhysicalMaterial color="#2a2a2e" metalness={0.3} roughness={0.5} />
//         {dios.map((d, i) => (
//           <Instance
//             key={i}
//             position={[
//               d.x + Math.cos(d.rot) * 0.045,
//               d.y + Math.sin(d.rot) * 0.045,
//               0.002,
//             ]}
//             rotation={[0, 0, d.rot]}
//           />
//         ))}
//       </Instances>
//     </group>
//   );
// }

// function DotRing3D({
//   position = [0, 0, 0],
//   radius = 1.4,
//   rings = 10,
//   ringGap = 0.13,
//   pattern = [0, 1, 2],
//   inner = 0.4,
// }: DotRingProps): JSX.Element {
//   const CODES = ["103", "470", "220", "10R", "4R7", "101", "152", "330"];
//   const mainScale = 0.5;
//   const fillScale = 0.3;
//   const gap = 0.025;
//   const wOf = (t: number, sc: number): number => (t === 0 ? 0.27 : 0.42) * sc;
//   const buildRing = (
//     rad: number,
//     off: number,
//   ): {
//     x: number;
//     y: number;
//     ang: number;
//     kind: number;
//     sc: number;
//     code: string;
//   }[] => {
//     const circ = 2 * Math.PI * rad;
//     const seq: { kind: number; sc: number; c: number }[] = [];
//     let raw = 0;
//     let mainIdx = 0;
//     let seed = 100 + off * 37;
//     while (raw < circ) {
//       const t = pattern[mainIdx % pattern.length];
//       const w = wOf(t, mainScale);
//       seq.push({ kind: t, sc: mainScale, c: raw + w / 2 });
//       raw += w + gap;
//       mainIdx++;
//       const k = 1 + Math.floor(rnd(seed) * 3);
//       seed++;
//       for (let j = 0; j < k; j++) {
//         const lw = wOf(0, fillScale);
//         seq.push({ kind: 0, sc: fillScale, c: raw + lw / 2 });
//         raw += lw + gap;
//       }
//     }
//     const total = raw;
//     return seq.map((it, i) => {
//       const ang = (it.c / total) * Math.PI * 2;
//       return {
//         x: Math.cos(ang) * rad,
//         y: Math.sin(ang) * rad,
//         ang,
//         kind: it.kind,
//         sc: it.sc,
//         code: CODES[(i + off) % CODES.length],
//       };
//     });
//   };
//   const all: {
//     x: number;
//     y: number;
//     ang: number;
//     kind: number;
//     sc: number;
//     code: string;
//   }[] = [];
//   for (let ri = 0; ri < rings; ri++) {
//     const rad = radius - ri * ringGap;
//     if (rad < inner) break;
//     all.push(...buildRing(rad, ri));
//   }
//   all.push({ x: 0, y: 0, ang: 0, kind: 0, sc: fillScale, code: "" });
//   return (
//     <group position={position}>
//       {all.map((it, i) => (
//         <group
//           key={i}
//           position={[it.x, it.y, 0]}
//           rotation={[0, 0, it.ang + Math.PI / 2]}
//         >
//           {it.kind === 0 ? (
//             <Led3D scale={it.sc} glow={false} />
//           ) : it.kind === 1 ? (
//             <ChipResistor3D scale={it.sc} code={it.code} />
//           ) : (
//             <Diode3D scale={it.sc} />
//           )}
//         </group>
//       ))}
//     </group>
//   );
// }

const BOARD_CANVAS_H = 2040;

function CameraRig({
  tile = 0,
  height = BOARD_CANVAS_H,
}: {
  tile?: number;
  height?: number;
}): null {
  const { camera } = useThree();
  useFrame(() => {
    const topWorld = 4.8;
    const tileTop = tile * BOARD_CANVAS_H;
    camera.position.y = topWorld - (tileTop + height / 2) / camera.zoom;
  });
  return null;
}

function Zener3D({
  position = [0, 0, 0],
  scale = 1,
  glass = "#cfe2ea",
  band = "#16161a",
  leads = true,
}: ZenerProps): JSX.Element {
  const len = 0.5;
  const rad = 0.085;
  const glassMat = {
    color: glass,
    transparent: true,
    opacity: 0.62,
    roughness: 0.04,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    metalness: 0,
    envMapIntensity: 2.6,
    specularIntensity: 1,
  };
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, rad]}>
        <cylinderGeometry args={[rad, rad, len, 32]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      <mesh position={[-len / 2, 0, rad]}>
        <sphereGeometry args={[rad, 20, 14]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      <mesh position={[len / 2, 0, rad]}>
        <sphereGeometry args={[rad, 20, 14]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, rad]}>
        <cylinderGeometry args={[rad * 0.4, rad * 0.4, len * 0.4, 10]} />
        <meshStandardMaterial color="#3a3a42" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[len * 0.3, 0, rad]}>
        <cylinderGeometry args={[rad * 1.06, rad * 1.06, len * 0.12, 32]} />
        <meshStandardMaterial color={band} metalness={0.2} roughness={0.45} />
      </mesh>
      {leads && (
        <>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-len * 0.82, 0, rad]}>
            <cylinderGeometry args={[rad * 0.32, rad * 0.32, len * 0.62, 10]} />
            <meshPhysicalMaterial
              color="#cfd4da"
              metalness={1}
              roughness={0.3}
              envMapIntensity={1.4}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[len * 0.82, 0, rad]}>
            <cylinderGeometry args={[rad * 0.32, rad * 0.32, len * 0.62, 10]} />
            <meshPhysicalMaterial
              color="#cfd4da"
              metalness={1}
              roughness={0.3}
              envMapIntensity={1.4}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function Capacitor3D({
  position = [0, 0, 0],
  scale = 1,
  color = "#20232a",
  band = "#dfe4ea",
  leads = true,
}: CapacitorProps): JSX.Element {
  const rough = useBrushedRough();
  const scratch = useScratched();
  const len = 0.5;
  const rad = 0.1;
  const capW = 0.09;
  const capR = rad * 1.2;
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, rad]}>
        <cylinderGeometry args={[rad, rad, len, 28]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.45}
          roughness={0.4}
          roughnessMap={rough || undefined}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>
      {[-1, 1].map((s, i) => (
        <mesh
          key={i}
          rotation={[0, 0, Math.PI / 2]}
          position={[s * (len / 2 - capW / 2), 0, rad]}
        >
          <cylinderGeometry args={[capR, capR, capW, 28]} />
          <meshPhysicalMaterial
            color={band}
            metalness={1}
            roughness={0.18}
            roughnessMap={scratch || undefined}
            clearcoat={0.9}
            clearcoatRoughness={0.12}
            envMapIntensity={1.7}
          />
        </mesh>
      ))}
      {leads &&
        [-1, 1].map((s, i) => (
          <mesh
            key={`l${i}`}
            rotation={[0, 0, Math.PI / 2]}
            position={[s * len * 0.85, 0, rad]}
          >
            <cylinderGeometry args={[rad * 0.22, rad * 0.22, len * 0.55, 12]} />
            <meshPhysicalMaterial
              color="#cfd4da"
              metalness={1}
              roughness={0.3}
              envMapIntensity={1.4}
            />
          </mesh>
        ))}
    </group>
  );
}

function CapTraces({ cx, cy }: { cx: number; cy: number }): JSX.Element {
  const { viewport } = useThree();
  const rough = useBrushedRough();
  const r = 0.011;
  const edgeX = viewport.width / 2 + 0.4;
  const half = 0.28;
  const leftX = cx - half;
  const rightX = cx + half;
  const s1 = 0.45;
  const st = 0.3;
  const rightPts: [number, number][] = [
    [rightX, cy],
    [rightX + s1, cy],
    [rightX + s1 + st, cy + st],
    [edgeX, cy + st],
  ];
  const leftPts: [number, number][] = [
    [leftX, cy],
    [leftX, cy - st],
    [edgeX, cy - st],
  ];
  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const joints: [number, number][] = [];
  const addPath = (pts: [number, number][]): void => {
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
      if (j > 0) joints.push(a);
    }
  };
  addPath(leftPts);
  addPath(rightPts);
  return (
    <group position={[0, 0, 0.15]}>
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
      <Instances limit={Math.max(joints.length, 1)} range={joints.length}>
        <sphereGeometry args={[r * 1.4, 10, 8]} />
        <meshPhysicalMaterial
          color="#9aa0a8"
          metalness={1}
          roughness={0.38}
          clearcoat={1}
          envMapIntensity={1.15}
        />
        {joints.map((p, i) => (
          <Instance key={i} position={[p[0], p[1], 0]} />
        ))}
      </Instances>
    </group>
  );
}

function EconomyCircuit3D({
  frames,
}: {
  frames: {
    thesis: { top: number; bot: number; halfW: number };
    econ: { top: number; bot: number }[];
  };
}): JSX.Element {
  const rough = useBrushedRough();
  const r = 0.009;
  const econ = frames.econ;
  const segs: { x: number; y: number; len: number; ang: number }[] = [];
  const pushV = (top: number, bot: number): void => {
    if (top - bot <= 0.04) return;
    segs.push({ x: 0, y: (top + bot) / 2, len: top - bot + r, ang: Math.PI / 2 });
  };
  let finalRegY: number | null = null;
  if (econ.length >= 1) {
    pushV(frames.thesis.bot - 3.5, econ[0].top - 0.12);
    for (let i = 0; i < econ.length - 1; i++) {
      pushV(econ[i].bot + 0.12, econ[i + 1].top - 0.12);
    }
    const last = econ[econ.length - 1];
    finalRegY = last.bot - 1.1;
    pushV(last.bot + 0.12, finalRegY + 0.15);
  }
  const capY = econ.length >= 2 ? (econ[0].bot + econ[1].top) / 2 : null;
  const zenY = econ.length >= 4 ? (econ[2].bot + econ[3].top) / 2 : null;
  return (
    <group>
      <group position={[0, 0, 0.06]}>
        <Instances limit={Math.max(segs.length, 1)} range={segs.length}>
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
      </group>
      {capY != null && (
        <group position={[0, capY, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <Capacitor3D scale={0.5} leads={false} />
        </group>
      )}
      {zenY != null && (
        <group position={[0, zenY, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <Zener3D scale={0.5} leads={false} />
        </group>
      )}
      {finalRegY != null && (
        <RegDown3D position={[0, finalRegY, 0.12]} scale={0.26} />
      )}
    </group>
  );
}

function EconCap3D({
  econ,
}: {
  econ: { top: number; bot: number }[];
}): JSX.Element {
  const rough = useBrushedRough();
  const r = 0.009;
  if (econ.length < 2) return <group />;
  const top = econ[0].bot + 0.15;
  const bot = econ[1].top - 0.15;
  const midY = (top + bot) / 2;
  const segLen = Math.abs(top - bot) + r;
  const capY = (econ[0].bot + econ[1].top) / 2;
  const hasZ = econ.length >= 5;
  const zTop = hasZ ? econ[3].bot + 0.15 : 0;
  const zBot = hasZ ? econ[4].top - 0.15 : 0;
  const zMidY = (zTop + zBot) / 2;
  const zLen = Math.abs(zTop - zBot) + r;
  const zenY = hasZ ? (econ[3].bot + econ[4].top) / 2 : 0;
  const regCY = hasZ ? econ[4].bot - 0.9 : 0;
  const rTop = hasZ ? econ[4].bot + 0.15 : 0;
  const rBot = regCY + 0.15;
  const rMidY = (rTop + rBot) / 2;
  const rLen = Math.abs(rTop - rBot) + r;
  return (
    <group>
      <mesh position={[0, midY, 0.06]}>
        <cylinderGeometry args={[r, r, segLen, 12]} />
        <meshPhysicalMaterial
          color="#9aa0a8"
          metalness={1}
          roughness={0.38}
          roughnessMap={rough || undefined}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.15}
        />
      </mesh>
      <group position={[0, capY, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <Capacitor3D scale={0.5} leads={false} />
      </group>
      {hasZ && (
        <>
          <mesh position={[0, zMidY, 0.06]}>
            <cylinderGeometry args={[r, r, zLen, 12]} />
            <meshPhysicalMaterial
              color="#9aa0a8"
              metalness={1}
              roughness={0.38}
              roughnessMap={rough || undefined}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.15}
            />
          </mesh>
          <group position={[0, zenY, 0.12]} rotation={[0, 0, Math.PI / 2]}>
            <Zener3D scale={0.5} leads={false} />
          </group>
          <mesh position={[0, rMidY, 0.06]}>
            <cylinderGeometry args={[r, r, rLen, 12]} />
            <meshPhysicalMaterial
              color="#9aa0a8"
              metalness={1}
              roughness={0.38}
              roughnessMap={rough || undefined}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.15}
            />
          </mesh>
          <RegDown3D position={[0, regCY, 0.12]} scale={0.26} />
        </>
      )}
    </group>
  );
}

function SpineMid3D({
  frames,
}: {
  frames: ReturnType<typeof useSiliconY>;
}): JSX.Element {
  return (
    <>
      <Trace3D frames={frames} />
      <group
        position={[
          0,
          (frames.sil.bot + 0.24 + (frames.thesis.top - 0.15)) / 2,
          0.12,
        ]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <Zener3D scale={0.5} leads={false} />
      </group>
      <RegDown3D position={[0, frames.thesis.bot - 0.9, 0.12]} scale={0.26} />
      <EconCap3D econ={frames.econ} />
    </>
  );
}

export default function Board3D(): JSX.Element {
  const frames = useSiliconY();
  const dpr = 1;
  const ZOOM_PX = 85;
  const TOPW = 4.8;
  const regLegEndPage =
    frames.econ.length >= 5
      ? (TOPW - frames.econ[4].bot) * ZOOM_PX + 3.5 * ZOOM_PX
      : 4 * BOARD_CANVAS_H + 600;
  const boardEndPage =
    frames.footPage > 0
      ? Math.min(regLegEndPage + 20, frames.footPage)
      : regLegEndPage + 20;
  const lastTile = Math.max(
    1,
    Math.floor((boardEndPage - 1) / BOARD_CANVAS_H)
  );
  const tileH = (i: number): number => {
    if (i >= lastTile) {
      return Math.max(200, boardEndPage - lastTile * BOARD_CANVAS_H);
    }
    return BOARD_CANVAS_H;
  };
  const econTiles: number[] = [];
  for (let i = 2; i <= lastTile; i++) econTiles.push(i);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${tileH(0)}px`,
          pointerEvents: "none",
        }}
      >
        <Canvas
          orthographic
          camera={{ position: [0, 0, 50], zoom: 85, near: 0.1, far: 200 }}
          gl={{
            alpha: true,
            failIfMajorPerformanceCaveat: false,
            antialias: true,
          }}
          dpr={dpr}
        >
          <CameraRig tile={0} height={tileH(0)} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 5, 9]} intensity={2.6} />
          <directionalLight position={[-6, -4, 6]} intensity={1.1} />
          <Suspense fallback={null}>
            <group position={[0, 0, 0.1]} scale={2.7}>
              <Chip />
            </group>
            {frames.ready && <Trace3D frames={frames} />}
            <RegTraces3D side={1} cx={3.8} cy={-2.4} />
            <Capacitor3D position={[2.4, 1.5, 0.1]} scale={0.5} />
            <CapTraces cx={2.4} cy={1.5} />
            {/* Anillos 3D crudos (comentados — conservados por si se reusan):
          <DotRing3D position={[-4.5, 2.8, 0]} radius={1.4} />
          <DotRing3D position={[-6.83, 1.9, 0]} radius={1.1} pattern={[2, 2, 2, 1, 2, 0]} inner={0.2} />
          <group position={[-4.6, -2.6, 0]} scale={0.5}>
            <DotRing3D pattern={[2, 2, 1, 2, 2, 0, 2]} />
          </group>
          <DotRing3D position={[1.7, -4.8, 0]} radius={1.4} pattern={[1, 1, 1, 2, 1, 0, 1]} inner={0.22} />
          <DotRing3D position={[6.8, -3.7, 0]} radius={0.8} pattern={[0, 0, 0, 2, 0, 1]} inner={0.22} />
          <DotRing3D position={[-8, -3.4, 0]} radius={1.2} pattern={[2, 2, 2, 1, 2, 0]} inner={0.22} />
          */}
            <Environment
              preset="warehouse"
              background={false}
              environmentIntensity={1.7}
            />
          </Suspense>
        </Canvas>
      </div>
      {lastTile >= 1 && (
      <div
        style={{
          position: "absolute",
          top: `${BOARD_CANVAS_H}px`,
          left: 0,
          width: "100%",
          height: `${tileH(1)}px`,
          pointerEvents: "none",
        }}
      >
        <Canvas
          orthographic
          camera={{ position: [0, 0, 50], zoom: 85, near: 0.1, far: 200 }}
          gl={{
            alpha: true,
            failIfMajorPerformanceCaveat: false,
            antialias: true,
          }}
          dpr={dpr}
        >
          <CameraRig tile={1} height={tileH(1)} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 5, 9]} intensity={2.6} />
          <directionalLight position={[-6, -4, 6]} intensity={1.1} />
          <Suspense fallback={null}>
            {frames.ready && (
              <SpineMid3D frames={frames} />
            )}
            <Environment
              preset="warehouse"
              background={false}
              environmentIntensity={1.7}
            />
          </Suspense>
        </Canvas>
      </div>
      )}
      {econTiles.map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${i * BOARD_CANVAS_H}px`,
            left: 0,
            width: "100%",
            height: `${tileH(i)}px`,
            pointerEvents: "none",
          }}
        >
          <Canvas
            orthographic
            camera={{ position: [0, 0, 50], zoom: 85, near: 0.1, far: 200 }}
            gl={{
              alpha: true,
              failIfMajorPerformanceCaveat: false,
              antialias: true,
            }}
            dpr={dpr}
          >
            <CameraRig tile={i} height={tileH(i)} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 5, 9]} intensity={2.6} />
            <directionalLight position={[-6, -4, 6]} intensity={1.1} />
            <Suspense fallback={null}>
              {frames.ready && <SpineMid3D frames={frames} />}
              <Environment
                preset="warehouse"
                background={false}
                environmentIntensity={1.7}
              />
            </Suspense>
          </Canvas>
        </div>
      ))}
    </>
  );
}
