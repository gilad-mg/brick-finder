"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

const BRAND_RED = "#D6232A";
const BRAND_RED_DARK = "#EF4444";

interface BrickProps {
  color: string;
  paused: boolean;
}

function Brick({ color, paused }: BrickProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const lastInteractionRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    lastInteractionRef.current = performance.now();
  }, []);

  useFrame((_, delta) => {
    if (paused || !groupRef.current) return;
    const last = lastInteractionRef.current;
    if (last === null) return;
    const sinceInteract = performance.now() - last;
    if (sinceInteract > 3000) {
      groupRef.current.rotation.y += 0.4 * delta;
    }
  });

  // 2x4 brick: width 4u, depth 2u, height ~1.2u (LEGO ratio)
  const studPositions = React.useMemo(() => {
    const positions: [number, number, number][] = [];
    const xCount = 4;
    const zCount = 2;
    const spacing = 1.0;
    const startX = -(xCount - 1) * spacing * 0.5;
    const startZ = -(zCount - 1) * spacing * 0.5;
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < zCount; j++) {
        positions.push([startX + i * spacing, 0.7, startZ + j * spacing]);
      }
    }
    return positions;
  }, []);

  return (
    <group
      ref={groupRef}
      onPointerDown={() => (lastInteractionRef.current = performance.now())}
      onPointerMove={() => (lastInteractionRef.current = performance.now())}
    >
      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Studs */}
      {studPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 20]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
        </mesh>
      ))}
      {/* Stud tops with subtle highlight */}
      {studPositions.map((pos, i) => (
        <mesh key={`top-${i}`} position={[pos[0], pos[1] + 0.151, pos[2]]}>
          <circleGeometry args={[0.27, 18]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

interface HeroBrick3DProps {
  paused?: boolean;
  interactive?: boolean;
}

export default function HeroBrick3D({ paused = false, interactive = true }: HeroBrick3DProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const color = isDark ? BRAND_RED_DARK : BRAND_RED;

  return (
    <Canvas
      shadows
      camera={{ position: [4.5, 3, 5.5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={isDark ? 0.35 : 0.5} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={isDark ? 0.9 : 1.1}
        color={isDark ? "#cfe2ff" : "#ffffff"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 3, -2]} intensity={isDark ? 0.25 : 0.4} color="#ffd9c8" />
      <Brick color={color} paused={paused} />
      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          rotateSpeed={0.7}
        />
      )}
    </Canvas>
  );
}
