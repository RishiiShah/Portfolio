"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

/* ---------- Particle Layer Component ---------- */
function ParticleLayer({
  count,
  radius,
  speed,
  size,
  opacity,
  theme,
  layerIndex,
}: {
  count: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  theme: string | undefined;
  layerIndex: number;
}) {
  const mesh = useRef<THREE.Points>(null);
  const light = theme === "light";

  const particles = useMemo(() => {
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Even distribution in a sphere
      const theta = seeded(i + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i + 97) - 1);
      const r = radius * (0.6 + seeded(i + 193) * 0.4);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Very slow drift velocities
      velocities[i * 3] = (seeded(i + 17) - 0.5) * 0.004;
      velocities[i * 3 + 1] = (seeded(i + 37) - 0.5) * 0.004;
      velocities[i * 3 + 2] = (seeded(i + 59) - 0.5) * 0.004;
    }

    return { positions, velocities };
  }, [count, radius]);

  useFrame((state) => {
    if (!mesh.current) return;

    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    // Gentle mouse parallax (reduced)
    const { x, y } = state.mouse;
    mesh.current.rotation.x = y * 0.05 + Math.sin(time * 0.1 + layerIndex) * 0.02;
    mesh.current.rotation.y = x * 0.05 + Math.cos(time * 0.08 + layerIndex) * 0.02;

    // Apply very slow drift movement
    for (let i = 0; i < count; i++) {
      pos[i * 3] += particles.velocities[i * 3] * speed;
      pos[i * 3 + 1] += particles.velocities[i * 3 + 1] * speed;
      pos[i * 3 + 2] += particles.velocities[i * 3 + 2] * speed;

      // Wrap bounds smoothly
      if (Math.abs(pos[i * 3]) > radius) pos[i * 3] *= -0.98;
      if (Math.abs(pos[i * 3 + 1]) > radius) pos[i * 3 + 1] *= -0.98;
      if (Math.abs(pos[i * 3 + 2]) > radius) pos[i * 3 + 2] *= -0.98;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  // Theme-aware neutral colors
  const colors = light
    ? ["#555555", "#666666", "#777777"]  // Light mode: darker grays (visible on white)
    : ["#888888", "#777777", "#666666"];  // Dark mode: slightly brighter grays

  const color = colors[layerIndex % colors.length];

  return (
    <Points
      ref={mesh}
      positions={particles.positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* ---------- Camera Float ---------- */
function CameraFloat() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Very subtle camera movement
    state.camera.position.z = 5 + Math.sin(t * 0.05) * 0.1;
    state.camera.position.y = Math.sin(t * 0.04) * 0.08;
  });

  return null;
}

/* ---------- Background Canvas ---------- */
function BackgroundCanvas() {
  const { resolvedTheme } = useTheme();
  const [particleCount, setParticleCount] = useState(2000);

  useEffect(() => {
    const updateCount = () => {
      const isMobile = window.innerWidth < 768;
      setParticleCount(isMobile ? 1000 : 2000);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
    >
      <CameraFloat />

      {/* Far layer - subtle background */}
      <ParticleLayer
        count={Math.floor(particleCount * 0.4)}
        radius={18}
        speed={0.138}
        size={0.048}
        opacity={isLight ? 0.35 : 0.25}
        theme={resolvedTheme}
        layerIndex={0}
      />

      {/* Middle layer - main particles */}
      <ParticleLayer
        count={Math.floor(particleCount * 0.5)}
        radius={14}
        speed={0.196}
        size={0.06}
        opacity={isLight ? 0.45 : 0.40}
        theme={resolvedTheme}
        layerIndex={1}
      />

      {/* Near layer - foreground particles */}
      <ParticleLayer
        count={Math.floor(particleCount * 0.3)}
        radius={10}
        speed={0.265}
        size={0.072}
        opacity={isLight ? 0.55 : 0.50}
        theme={resolvedTheme}
        layerIndex={2}
      />
    </Canvas>
  );
}

/* ---------- Export ---------- */
export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={null}>
        <BackgroundCanvas />
      </Suspense>
    </div>
  );
}
