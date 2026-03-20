"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

const TIERS = [
  { count: 120, yOffset: 6.0, thickness: 1.0, radiusX: 20, radiusZ: 20 },
  { count: 180, yOffset: 0, thickness: 1.5, radiusX: 25, radiusZ: 25 },
  { count: 120, yOffset: -6.0, thickness: 1.0, radiusX: 20, radiusZ: 20 },
] as const;

const CONNECTION_DISTANCE = 6.5;
const TOTAL_COUNT = TIERS.reduce((acc, tier) => acc + tier.count, 0);

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/* ---------- Data Packet Component ---------- */
function DataPacket({
  nodes,
  adjList,
  color,
  baseSpeed,
  seed,
}: {
  nodes: Float32Array;
  adjList: number[][];
  color: string;
  baseSpeed: number;
  seed: number;
}) {
  const ref = useRef<THREE.Group>(null);

  const initialNode = Math.floor(pseudoRandom(seed + 1) * (nodes.length / 3));
  const initialProgress = pseudoRandom(seed + 2);
  const initialSpeedScale = 0.8 + pseudoRandom(seed + 3) * 0.4;
  const initialTtl = 3 + Math.floor(pseudoRandom(seed + 4) * 5);
  const initialNeighbors = adjList[initialNode] ?? [];
  const initialNeighborIdx = initialNeighbors.length
    ? Math.floor(pseudoRandom(seed + initialNode * 13) * initialNeighbors.length)
    : -1;
  const initialNextNode = initialNeighborIdx >= 0 ? initialNeighbors[initialNeighborIdx] : initialNode;

  const state = useRef({
    currNodeIdx: initialNode,
    nextNodeIdx: initialNextNode,
    progress: initialProgress,
    speed: baseSpeed * initialSpeedScale,
    ttl: initialTtl,
    hopCount: 0,
  });

  const pickNextNode = (curr: number, hopCount: number) => {
    const neighbors = adjList[curr];
    if (!neighbors || neighbors.length === 0) return curr;
    const idx = Math.floor(pseudoRandom(seed + curr * 13 + hopCount * 7) * neighbors.length);
    return neighbors[idx];
  };

  useFrame((_, delta) => {
    if (!ref.current) return;
    state.current.progress += delta * state.current.speed;

    if (state.current.progress >= 1) {
      state.current.progress = 0;
      state.current.currNodeIdx = state.current.nextNodeIdx;
      state.current.hopCount += 1;
      state.current.nextNodeIdx = pickNextNode(state.current.currNodeIdx, state.current.hopCount);
      state.current.ttl -= 1;

      if (state.current.ttl <= 0) {
        state.current.currNodeIdx = Math.floor(
          pseudoRandom(seed + state.current.hopCount * 19) * (nodes.length / 3)
        );
        state.current.nextNodeIdx = pickNextNode(state.current.currNodeIdx, state.current.hopCount);
        state.current.ttl = 3 + Math.floor(pseudoRandom(seed + state.current.hopCount * 23) * 5);
      }
    }

    const cIdx = state.current.currNodeIdx * 3;
    const nIdx = state.current.nextNodeIdx * 3;

    ref.current.position.set(
      THREE.MathUtils.lerp(nodes[cIdx], nodes[nIdx], state.current.progress),
      THREE.MathUtils.lerp(nodes[cIdx + 1], nodes[nIdx + 1], state.current.progress),
      THREE.MathUtils.lerp(nodes[cIdx + 2], nodes[nIdx + 2], state.current.progress)
    );
  });

  return (
    <group ref={ref}>
      <Billboard>
        <mesh>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.05, 20, 20]} />
          <meshBasicMaterial color={color} transparent opacity={0.06} />
        </mesh>
      </Billboard>
    </group>
  );
}

/* ---------- Singular Layered Mesh ---------- */
// A single, globally connected mesh with nodes concentrated into horizontal architectural tiers
function SingularTieredMesh({ theme }: { theme: string | undefined }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const isLight = theme === "light";

  const { positions, linePositions, adjList } = useMemo(() => {
    const pos = new Float32Array(TOTAL_COUNT * 3);

    // Assign nodes to specific horizontal layers
    let offsetIdx = 0;
    for (const tier of TIERS) {
      for (let i = 0; i < tier.count; i++) {
        const idx = offsetIdx + i;
        const seed = idx + 1;
        pos[idx * 3] = (pseudoRandom(seed * 2.1) - 0.5) * tier.radiusX * 2;
        pos[idx * 3 + 1] = tier.yOffset + (pseudoRandom(seed * 3.7) - 0.5) * tier.thickness * 2;
        pos[idx * 3 + 2] = (pseudoRandom(seed * 5.3) - 0.5) * tier.radiusZ * 2;
      }
      offsetIdx += tier.count;
    }

    // Global adjacency configuration - connects everything together into ONE mesh
    const lpArr: number[] = [];
    const adj: number[][] = Array.from({ length: TOTAL_COUNT }, () => []);
    const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    for (let i = 0; i < TOTAL_COUNT; i++) {
      const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2];
      for (let j = i + 1; j < TOTAL_COUNT; j++) {
        const bx = pos[j * 3], by = pos[j * 3 + 1], bz = pos[j * 3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;

        if (dx * dx + dy * dy + dz * dz < maxDistSq) {
          lpArr.push(ax, ay, az, bx, by, bz);
          adj[i].push(j);
          adj[j].push(i); // Undirected graph
        }
      }
    }

    return {
      positions: pos,
      linePositions: new Float32Array(lpArr),
      adjList: adj
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Continuous ambient rotation independent of scroll or mouse.
    // Creates a slow, complex orbiting wave motion on a fixed isometric axis.
    groupRef.current.rotation.y = (Math.PI / 4) + t * 0.035;
    groupRef.current.rotation.x = 0.35 + Math.sin(t * 0.015) * 0.1;
    groupRef.current.rotation.z = Math.cos(t * 0.02) * 0.05;
  });

  const nodeColor = isLight ? "#096175" : "#1daec5";
  const lineColor = isLight ? "#096175" : "#138ca2";
  const packetColor = isLight ? "#077893" : "#1daec5";

  const packetCount = 85;

  return (
    <group ref={groupRef}>
      {/* Global Node Cloud */}
      <Points ref={meshRef} positions={positions} stride={3}>
        <PointMaterial transparent color={nodeColor} size={0.07} sizeAttenuation depthWrite={false} opacity={0.5} />
      </Points>

      {/* Global Connectivity Edges (Intra AND Inter-Tier Links) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} transparent opacity={0.25} depthWrite={false} />
      </lineSegments>

      {/* Globally Hopping Data Packets */}
      {Array.from({ length: packetCount }).map((_, i) => (
        <DataPacket
          key={i}
          nodes={positions}
          adjList={adjList}
          color={packetColor}
          baseSpeed={0.25 + pseudoRandom((i + 1) * 9.1) * 0.3}
          seed={(i + 1) * 101}
        />
      ))}
    </group>
  );
}

/* ---------- Canvas ---------- */
function BackgroundCanvas() {
  const { resolvedTheme } = useTheme();

  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 60 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <SingularTieredMesh theme={resolvedTheme} />
      </Suspense>
    </Canvas>
  );
}

/* ---------- Export ---------- */
export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none blur-[0.5px] opacity-[1]">
      <Suspense fallback={null}>
        <BackgroundCanvas />
      </Suspense>
    </div>
  );
}
