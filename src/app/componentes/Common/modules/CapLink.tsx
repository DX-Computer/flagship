"use client";

import { Canvas } from "@react-three/fiber";
import { JSX } from "react";

function CapMesh(): JSX.Element {
  const r = 0.011;
  const capLen = 0.22;
  const capRad = 0.045;
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[r, r, 1.0, 12]} />
        <meshStandardMaterial color="#aab0b8" metalness={0.85} roughness={0.32} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.04]}>
        <cylinderGeometry args={[capRad, capRad, capLen, 24]} />
        <meshStandardMaterial color="#20232a" metalness={0.5} roughness={0.42} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-(capLen / 2 - 0.025), 0, 0.04]}>
        <cylinderGeometry args={[capRad * 1.28, capRad * 1.28, 0.05, 24]} />
        <meshStandardMaterial color="#dfe4ea" metalness={0.95} roughness={0.22} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[capLen / 2 - 0.025, 0, 0.04]}>
        <cylinderGeometry args={[capRad * 1.28, capRad * 1.28, 0.05, 24]} />
        <meshStandardMaterial color="#dfe4ea" metalness={0.95} roughness={0.22} />
      </mesh>
    </group>
  );
}

const CapLink = (): JSX.Element => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 150,
        marginTop: -36,
        marginBottom: -36,
        pointerEvents: "none",
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 50], zoom: 150, near: 0.1, far: 200 }}
        gl={{ alpha: true }}
        dpr={1}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[3, 5, 8]} intensity={2.4} />
        <directionalLight position={[-5, -3, 6]} intensity={1.2} />
        <CapMesh />
      </Canvas>
    </div>
  );
};

export default CapLink;
