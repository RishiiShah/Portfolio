import * as THREE from "three";

/*
 * One small 3D visual per project, built from points and lines so they share
 * the site's ink/accent palette. Each returns a group plus a per-frame update.
 */

export interface Materials {
  line: THREE.LineBasicMaterial;
  lineDim: THREE.LineBasicMaterial;
  lineAccent: THREE.LineBasicMaterial;
  point: THREE.PointsMaterial;
  pointAccent: THREE.PointsMaterial;
}

export interface Visual {
  group: THREE.Group;
  update(time: number): void;
}

const rand = () => Math.random();
const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;

const lines = (pts: number[], m: THREE.Material) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(g, m);
};
const points = (pts: number[], m: THREE.Material) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.Points(g, m);
};
const circle = (r: number, segments: number, m: THREE.Material) => {
  const pts: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(Math.cos(a) * r, Math.sin(a) * r, 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineLoop(g, m);
};

/** CseGraph: a code graph, with one retrieval path lit in accent. */
function codeGraph(m: Materials): Visual {
  const group = new THREE.Group();
  const nodes = Array.from({ length: 90 }, () => new THREE.Vector3(gauss() * 2.2, gauss() * 1.6, gauss() * 2.2));
  const seen = new Set<string>();
  const edges: number[] = [];
  const nearest = (i: number, k: number) =>
    nodes
      .map((n, j) => ({ j, d: n.distanceTo(nodes[i]) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
      .map((x) => x.j);
  nodes.forEach((n, i) => {
    for (const j of nearest(i, 2)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(n.x, n.y, n.z, nodes[j].x, nodes[j].y, nodes[j].z);
    }
  });
  // Walk a chain of nearest neighbours for the highlighted "context" path.
  const path = [0];
  while (path.length < 7) {
    const next = nearest(path[path.length - 1], 6).find((j) => !path.includes(j));
    if (next === undefined) break;
    path.push(next);
  }
  const pathEdges: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const a = nodes[path[i - 1]];
    const b = nodes[path[i]];
    pathEdges.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  group.add(lines(edges, m.lineDim));
  group.add(lines(pathEdges, m.lineAccent));
  group.add(points(nodes.flatMap((n) => [n.x, n.y, n.z]), m.point));
  group.add(points(path.flatMap((i) => [nodes[i].x, nodes[i].y, nodes[i].z]), m.pointAccent));
  return {
    group,
    update(t) {
      group.rotation.y = t * 0.18;
      group.rotation.x = Math.sin(t * 0.25) * 0.2;
    },
  };
}

/** SnapInterview: a circular voice equalizer, as if the interviewer is speaking. */
function voiceRing(m: Materials): Visual {
  const group = new THREE.Group();
  const bars = 72;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(bars * 6);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.LineSegments(geo, m.line));
  group.add(circle(1.25, 96, m.lineAccent));
  group.add(circle(2.9, 128, m.lineDim));
  const dots: number[] = [];
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2;
    const r = 3.2 + rand() * 0.8;
    dots.push(Math.cos(a) * r, Math.sin(a) * r, gauss() * 0.3);
  }
  group.add(points(dots, m.pointAccent));
  group.scale.setScalar(0.72);
  return {
    group,
    update(t) {
      for (let i = 0; i < bars; i++) {
        const a = (i / bars) * Math.PI * 2;
        const amp =
          0.15 +
          1.1 * Math.abs(Math.sin(t * 3.1 + i * 0.37) * Math.sin(t * 1.3 + i * 0.11)) +
          0.25 * Math.max(0, Math.sin(t * 9 + i * 1.7));
        const r0 = 1.4;
        const r1 = r0 + amp;
        pos.set([Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * r1, Math.sin(a) * r1, 0], i * 6);
      }
      geo.attributes.position.needsUpdate = true;
      group.rotation.z = t * 0.05;
      group.rotation.y = Math.sin(t * 0.4) * 0.3;
    },
  };
}

/** Traffic violation detection: lanes, moving cars, and two tracked with accent boxes. */
function road(m: Materials): Visual {
  const group = new THREE.Group();
  const laneX = [-2.4, -1.2, 0, 1.2, 2.4];
  const len = 12;
  const laneLines: number[] = [];
  for (const x of laneX) {
    if (x === laneX[0] || x === laneX[laneX.length - 1]) laneLines.push(x, 0, -len / 2, x, 0, len / 2);
    else for (let z = -len / 2; z < len / 2; z += 0.8) laneLines.push(x, 0, z, x, 0, z + 0.4);
  }
  group.add(lines(laneLines, m.lineDim));
  group.add(lines([-2.4, 0, 1.5, 2.4, 0, 1.5], m.lineAccent)); // stop line

  const carGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.4, 1));
  const boxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.95, 0.75, 1.4));
  const cars = Array.from({ length: 8 }, (_, i) => {
    const car = new THREE.LineSegments(carGeo, m.line);
    const lane = i % 4;
    const tracked = i === 1 || i === 6 ? new THREE.LineSegments(boxGeo, m.lineAccent) : null;
    group.add(car);
    if (tracked) group.add(tracked);
    return { car, tracked, x: (laneX[lane] + laneX[lane + 1]) / 2, offset: rand() * len, speed: 1 + rand() * 1.6 };
  });
  group.rotation.set(0.42, -0.35, 0);
  group.position.set(0, -0.8, -2);
  group.scale.setScalar(0.62);
  return {
    group,
    update(t) {
      for (const c of cars) {
        const z = len / 2 - ((t * c.speed + c.offset) % len);
        c.car.position.set(c.x, 0.2, z);
        c.tracked?.position.set(c.x, 0.3, z);
      }
    },
  };
}

/** WGAN-GP: stacked price series; accent rows are the synthetic ones. */
function ridgeline(m: Materials): Visual {
  const group = new THREE.Group();
  const rows = 11;
  const n = 140;
  const series = Array.from({ length: rows }, () => {
    const walk: number[] = [];
    let v = 0;
    for (let k = 0; k < n; k++) {
      v += gauss() * 0.12;
      v *= 0.985;
      walk.push(v);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    return { walk, geo };
  });
  series.forEach((s, r) => group.add(new THREE.Line(s.geo, r % 3 === 1 ? m.lineAccent : m.line)));
  group.rotation.set(0.2, -0.45, 0);
  group.scale.setScalar(0.8);
  return {
    group,
    update(t) {
      series.forEach((s, r) => {
        const arr = s.geo.attributes.position.array as Float32Array;
        for (let k = 0; k < n; k++) {
          const x = (k / (n - 1) - 0.5) * 6.5;
          const y = s.walk[k] * 1.2 + 0.07 * Math.sin(t * 1.8 + k * 0.15 + r) + (r - rows / 2) * 0.22;
          arr.set([x, y, (rows / 2 - r) * 0.45], k * 3);
        }
        s.geo.attributes.position.needsUpdate = true;
      });
    },
  };
}

/** JARVIS: a breathing voice orb with smart-home devices on orbit. */
function orb(m: Materials): Visual {
  const group = new THREE.Group();
  const count = 1500;
  const dirs: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    dirs.push(new THREE.Vector3(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r));
  }
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  group.add(new THREE.Points(geo, m.point));
  const ringA = circle(2.4, 128, m.lineAccent);
  const ringB = circle(2.9, 128, m.lineDim);
  ringA.rotation.x = 1.2;
  ringB.rotation.set(1.4, 0.5, 0);
  group.add(ringA, ringB);
  const devices = new THREE.Points(new THREE.BufferGeometry(), m.pointAccent);
  const devicePos = new Float32Array(5 * 3);
  devices.geometry.setAttribute("position", new THREE.BufferAttribute(devicePos, 3));
  ringA.add(devices);
  return {
    group,
    update(t) {
      dirs.forEach((d, i) => {
        const r = 1.55 + 0.14 * Math.sin(d.y * 7 + t * 3) + 0.08 * Math.sin(d.x * 11 - t * 2.2);
        pos.set([d.x * r, d.y * r, d.z * r], i * 3);
      });
      geo.attributes.position.needsUpdate = true;
      for (let i = 0; i < 5; i++) {
        const a = t * 0.5 + (i / 5) * Math.PI * 2;
        devicePos.set([Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0], i * 3);
      }
      devices.geometry.attributes.position.needsUpdate = true;
      group.rotation.y = t * 0.12;
    },
  };
}

/** Music genre detection: a moving spectrogram of bars; the front row is accent. */
function spectrogram(m: Materials): Visual {
  const group = new THREE.Group();
  const cols = 40;
  const rows = 14;
  const back = new THREE.BufferGeometry();
  const front = new THREE.BufferGeometry();
  const backPos = new Float32Array(cols * (rows - 1) * 6);
  const frontPos = new Float32Array(cols * 6);
  back.setAttribute("position", new THREE.BufferAttribute(backPos, 3));
  front.setAttribute("position", new THREE.BufferAttribute(frontPos, 3));
  group.add(new THREE.LineSegments(back, m.line), new THREE.LineSegments(front, m.lineAccent));
  group.rotation.set(0.35, -0.5, 0);
  group.position.y = -0.9;
  return {
    group,
    update(t) {
      let b = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c / (cols - 1) - 0.5) * 6.5;
          const z = (r / (rows - 1) - 0.5) * 4;
          const wave = Math.sin(c * 0.33 + t * 2.4 - r * 0.4) * Math.cos(c * 0.12 - t * 1.1 + r * 0.25);
          const h = 0.08 + 2 * Math.pow(Math.max(0, wave), 2) * (1 - c / cols * 0.5);
          const seg = [x, 0, z, x, h, z];
          if (r === rows - 1) frontPos.set(seg, c * 6);
          else backPos.set(seg, b++ * 6);
        }
      }
      back.attributes.position.needsUpdate = true;
      front.attributes.position.needsUpdate = true;
    },
  };
}

/** Cerevia: a hospital network fed by physicians above it; consults are reassigned in accent as gaps open. */
function careNetwork(m: Materials): Visual {
  const group = new THREE.Group();
  const hospitals = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + gauss() * 0.15;
    const r = 1.6 + rand() * 1.3;
    return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
  });
  const doctors = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    return new THREE.Vector3(Math.cos(a) * 1.1, 1.7 + gauss() * 0.2, Math.sin(a) * 1.1);
  });
  // Each hospital is covered by the nearest physician; those links sit dim.
  const coverBy = hospitals.map((h) => doctors.reduce((best, d, j) => (d.distanceTo(h) < doctors[best].distanceTo(h) ? j : best), 0));
  const dim: number[] = [];
  hospitals.forEach((h, i) => dim.push(doctors[coverBy[i]].x, doctors[coverBy[i]].y, doctors[coverBy[i]].z, h.x, h.y, h.z));
  group.add(lines(dim, m.lineDim));
  group.add(points(hospitals.flatMap((h) => [h.x, h.y, h.z]), m.point));
  group.add(points(doctors.flatMap((d) => [d.x, d.y, d.z]), m.pointAccent));
  const rings = hospitals.map((h) => {
    const ring = circle(0.28, 40, m.lineDim);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(h);
    group.add(ring);
    return ring;
  });
  // The live fix: one accent link from a physician to the hospital with a gap, re-picked every few seconds.
  const fixGeo = new THREE.BufferGeometry();
  const fixPos = new Float32Array(6);
  fixGeo.setAttribute("position", new THREE.BufferAttribute(fixPos, 3));
  group.add(new THREE.LineSegments(fixGeo, m.lineAccent));
  const gapRing = circle(0.28, 40, m.lineAccent);
  gapRing.rotation.x = Math.PI / 2;
  group.add(gapRing);
  group.rotation.x = 0.35;
  group.position.y = -0.6;
  let shown = -1;
  return {
    group,
    update(t) {
      const beat = Math.floor(t / 2.6);
      if (beat !== shown) {
        shown = beat;
        const h = (beat * 5) % hospitals.length;
        const d = doctors[(coverBy[h] + 1 + (beat % 3)) % doctors.length];
        fixPos.set([d.x, d.y, d.z, hospitals[h].x, hospitals[h].y, hospitals[h].z]);
        fixGeo.attributes.position.needsUpdate = true;
        gapRing.position.copy(hospitals[h]);
        rings.forEach((r, i) => (r.visible = i !== h));
      }
      // The gap ring swells while the offer is out, then settles once it's filled.
      const phase = (t / 2.6) % 1;
      gapRing.scale.setScalar(1 + 1.4 * Math.sin(Math.min(1, phase * 1.6) * Math.PI));
      group.rotation.y = t * 0.12;
    },
  };
}

/** PlaNYt: a street grid of wireframe blocks, with the day's route lit across it and a marker walking it. */
function cityRoute(m: Materials): Visual {
  const group = new THREE.Group();
  const cols = 9;
  const rows = 7;
  const step = 0.72;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rand() < 0.2) continue; // parks and plazas
      const h = 0.12 + Math.pow(rand(), 3) * 1.7;
      const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, h, 0.5)), m.lineDim);
      box.position.set((c - (cols - 1) / 2) * step, h / 2, (r - (rows - 1) / 2) * step);
      group.add(box);
    }
  }
  // The route runs down the avenues between blocks, turning at four stops.
  const at = (c: number, r: number) => new THREE.Vector3((c - cols / 2) * step, 0.02, (r - rows / 2) * step);
  const stops = [at(1, 1), at(1, 4), at(4, 4), at(4, 2), at(7, 2), at(7, 6)];
  const route: number[] = [];
  for (let i = 1; i < stops.length; i++) route.push(...stops[i - 1].toArray(), ...stops[i].toArray());
  group.add(lines(route, m.lineAccent));
  const pins: number[] = [];
  stops.forEach((s, i) => i % 2 === 0 && pins.push(s.x, 0, s.z, s.x, 0.9, s.z));
  group.add(lines(pins, m.lineAccent));
  group.add(points(stops.filter((_, i) => i % 2 === 0).flatMap((s) => [s.x, 0.9, s.z]), m.pointAccent));
  const walker = points([0, 0, 0], m.pointAccent);
  group.add(walker);
  const lengths = stops.slice(1).map((s, i) => s.distanceTo(stops[i]));
  const total = lengths.reduce((a, b) => a + b, 0);
  group.rotation.set(0.5, -0.6, 0);
  group.position.y = -0.7;
  group.scale.setScalar(0.85);
  return {
    group,
    update(t) {
      let d = ((t * 0.9) % total + total) % total;
      let i = 0;
      while (d > lengths[i]) d -= lengths[i++];
      walker.position.lerpVectors(stops[i], stops[i + 1], d / lengths[i]).setY(0.12);
      group.rotation.y = -0.6 + Math.sin(t * 0.2) * 0.25;
    },
  };
}

/** Visuals keyed by project slug; anything unlisted falls back to the code graph. */
const BUILDERS: Record<string, (m: Materials) => Visual> = {
  cerevia: careNetwork,
  planyt: cityRoute,
  csegraph: codeGraph,
  "snap-interview": voiceRing,
  "traffic-violation-detection": road,
  "wgan-gp-financial-timeseries": ridgeline,
  "jarvis-voice-assistant": orb,
  "music-genre-detection": spectrogram,
};

export function buildVisual(slug: string, m: Materials): Visual {
  return (BUILDERS[slug] ?? codeGraph)(m);
}
