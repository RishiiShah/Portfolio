import * as THREE from "three";

/*
 * One iso-glow object per project: opaque faces with hairline edges, and the
 * accent only on what is live (a lit lamp, a screen, a wire carrying signal).
 * Each object acts out what the project does. Each returns a group plus a
 * per-frame update.
 */

export interface Materials {
  line: THREE.LineBasicMaterial;
  lineDim: THREE.LineBasicMaterial;
  lineAccent: THREE.LineBasicMaterial;
  point: THREE.PointsMaterial;
  pointAccent: THREE.PointsMaterial;
  face: THREE.MeshBasicMaterial;
  faceLit: THREE.MeshBasicMaterial;
  glow: THREE.SpriteMaterial;
}

export interface Visual {
  group: THREE.Group;
  update(time: number): void;
}

/** Theme colours for canvas-drawn screens, kept current by Flight. */
export const palette = { ink: "#111", dim: "rgba(0,0,0,0.3)", accent: "#2a36f0", glass: "#000", mono: "monospace" };

// ─── Kit ─────────────────────────────────────────────────────────────────────

type Solid = THREE.Group & { userData: { mesh: THREE.Mesh; edges: THREE.LineSegments } };

/** A solid: opaque faces plus its creases as hairlines. */
function solid(geo: THREE.BufferGeometry, m: Materials, lit = false): Solid {
  const g = new THREE.Group() as Solid;
  const mesh = new THREE.Mesh(geo, lit ? m.faceLit : m.face);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lit ? m.lineAccent : m.line);
  g.add(mesh, edges);
  g.userData = { mesh, edges };
  return g;
}
function setLit(s: Solid, on: boolean, m: Materials) {
  s.userData.mesh.material = on ? m.faceLit : m.face;
  s.userData.edges.material = on ? m.lineAccent : m.line;
}
/** A box standing on y, centred on x/z. */
function box(m: Materials, w: number, h: number, d: number, x = 0, y = 0, z = 0, lit = false) {
  const s = solid(new THREE.BoxGeometry(w, h, d), m, lit);
  s.position.set(x, y + h / 2, z);
  return s;
}
function cyl(m: Materials, r: number, h: number, x = 0, y = 0, z = 0, lit = false, seg = 32) {
  const s = solid(new THREE.CylinderGeometry(r, r, h, seg), m, lit);
  s.position.set(x, y + h / 2, z);
  return s;
}
const lines = (pts: number[], mat: THREE.Material) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(g, mat);
};
const ring = (r: number, y: number, mat: THREE.Material, seg = 64) => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) pts.push(new THREE.Vector3(Math.cos((i / seg) * Math.PI * 2) * r, y, Math.sin((i / seg) * Math.PI * 2) * r));
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
};
/** Outline of an x/z rectangle at height y. */
const rect = (x0: number, z0: number, x1: number, z1: number, y: number) =>
  [x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0];
/** Ground plate with a hairline inset, like every iso-glow figure stands on. */
function plate(m: Materials, w: number, d: number) {
  const g = new THREE.Group();
  g.add(box(m, w, 0.14, d));
  g.add(lines(rect(-w / 2 + 0.18, -d / 2 + 0.18, w / 2 - 0.18, d / 2 - 0.18, 0.15), m.lineDim));
  return g;
}
function glow(m: Materials, size: number) {
  const s = new THREE.Sprite(m.glow);
  s.scale.setScalar(size);
  return s;
}

/** A canvas screen on a plane facing +z; `draw` repaints it about 12 times a second. */
function screen(w: number, h: number, draw: (c: CanvasRenderingContext2D, W: number, H: number, t: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * 180);
  canvas.height = Math.round(h * 180);
  const ctx = canvas.getContext("2d")!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  let last = -1;
  return {
    mesh,
    paint(t: number) {
      if (Math.abs(t - last) < 0.08) return;
      last = t;
      ctx.fillStyle = palette.glass;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height, t);
      tex.needsUpdate = true;
    },
  };
}
const font = (px: number, weight = 500) => `${weight} ${Math.round(px)}px ${palette.mono}`;

/** Holds the object in a 3/4 view from above, swaying gently instead of spinning. */
function pose(group: THREE.Group, yaw: number, scale = 1) {
  group.rotation.set(0.42, yaw, 0);
  group.scale.setScalar(scale * 0.8);
  return (t: number) => (group.rotation.y = yaw + Math.sin(t * 0.25) * 0.12);
}

// ─── Cerevia: a command-center console ───────────────────────────────────────
/** Monitors show the coverage outlook; a gap opens, an offer is approved and sent, and it's filled once accepted. */
function commandCenter(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.2, 3.6));
  group.add(box(m, 4.6, 0.55, 1.3, 0, 0.14, 0.6));
  const led = box(m, 0.18, 0.04, 0.18, 1.9, 0.69, 0.95, true);
  group.add(led);
  const cycle = 7;
  const phaseAt = (t: number) => (t % cycle) / cycle; // 0–.3 gap open, .3–.6 offer out, .6–1 covered
  const centre = screen(2.1, 1.25, (c, W, H, t) => {
    const ph = phaseAt(t);
    c.font = font(H * 0.07);
    c.fillStyle = palette.dim;
    c.fillText("COVERAGE · NEXT 90 MIN", W * 0.05, H * 0.12);
    for (let r = 0; r < 6; r++) {
      const y = H * (0.2 + r * 0.12);
      c.fillStyle = palette.dim;
      c.fillRect(W * 0.05, y, W * 0.9, H * 0.07);
      c.fillStyle = palette.ink;
      c.fillRect(W * 0.05, y, W * (0.5 + ((r * 37) % 30) / 100), H * 0.07);
      // Row 3 has the gap: blinking while open, lit while offered, ink once covered.
      if (r === 3) {
        const blinkOff = ph < 0.3 && Math.floor(t * 3) % 2 === 1;
        c.fillStyle = ph < 0.6 && !blinkOff ? palette.accent : ph < 0.6 ? palette.dim : palette.ink;
        c.fillRect(W * 0.55, y, W * 0.22, H * 0.07);
      }
    }
    // The clock sweeps across the outlook.
    c.fillStyle = palette.accent;
    c.fillRect(W * (0.05 + 0.9 * ph), H * 0.18, 2, H * 0.74);
    c.fillStyle = ph < 0.6 ? palette.accent : palette.ink;
    c.fillText(ph < 0.3 ? "GAP · ST. MARY'S 14:20" : ph < 0.6 ? "OFFER SENT · DR. PATEL" : "COVERED · ACCEPTED", W * 0.05, H * 0.97);
  });
  const queue = screen(1.35, 1.0, (c, W, H, t) => {
    const ph = phaseAt(t);
    c.font = font(H * 0.09);
    c.fillStyle = palette.dim;
    c.fillText("ATTENTION", W * 0.07, H * 0.14);
    ["STROKE · 14m", "EEG · 32m", "CONSULT · 41m", "CONSULT · 58m"].forEach((label, i) => {
      const hot = i === 0 && ph < 0.6;
      c.fillStyle = hot ? palette.accent : palette.dim;
      c.fillRect(W * 0.07, H * (0.24 + i * 0.18), W * 0.86, H * 0.13);
      c.fillStyle = hot ? palette.glass : palette.ink;
      c.fillText(label, W * 0.11, H * (0.34 + i * 0.18));
    });
  });
  const approve = screen(1.35, 1.0, (c, W, H, t) => {
    const done = phaseAt(t) >= 0.3;
    c.font = font(H * 0.09);
    c.fillStyle = palette.dim;
    c.fillText("SPLIT SHIFT", W * 0.07, H * 0.14);
    c.fillStyle = palette.ink;
    c.fillText("13:30 → 15:00", W * 0.07, H * 0.34);
    c.fillText("DR. PATEL · NEURO", W * 0.07, H * 0.5);
    c.strokeStyle = palette.accent;
    c.lineWidth = 3;
    c.strokeRect(W * 0.07, H * 0.64, W * 0.86, H * 0.22);
    if (done) {
      c.fillStyle = palette.accent;
      c.fillRect(W * 0.07, H * 0.64, W * 0.86, H * 0.22);
    }
    c.fillStyle = done ? palette.glass : palette.accent;
    c.fillText(done ? "APPROVED ✓" : "APPROVE", W * 0.12, H * 0.79);
  });
  // Monitors on stands, the side ones angled in.
  const mount = (s: { mesh: THREE.Mesh }, w: number, h: number, x: number, yaw: number) => {
    const g = new THREE.Group();
    g.add(box(m, 0.12, 0.5, 0.12), box(m, w + 0.12, h + 0.12, 0.1, 0, 0.5, 0));
    s.mesh.position.set(0, 0.56 + h / 2, 0.052);
    g.add(s.mesh);
    g.position.set(x, 0.69, 0.25);
    g.rotation.y = yaw;
    group.add(g);
  };
  mount(centre, 2.1, 1.25, 0, 0);
  mount(queue, 1.35, 1.0, -2.05, 0.45);
  mount(approve, 1.35, 1.0, 2.05, -0.45);
  const sway = pose(group, -0.35, 0.78);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      centre.paint(t);
      queue.paint(t);
      approve.paint(t);
      setLit(led, phaseAt(t) >= 0.3 && phaseAt(t) < 0.6, m);
    },
  };
}

// ─── PlaNYt: a city diorama with the day's route ────────────────────────────
/** Blocks on a street grid; the route lights up behind a marker walking it, and each stop lights as it's reached. */
function cityRoute(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.4, 5));
  const cols = 6;
  const rows = 5;
  const step = 0.95;
  const heights = [0.5, 1.4, 0.7, 2.2, 0.6, 0.9, 1.1, 0.4, 1.7, 0.8, 0.5, 2.6, 0.7, 1.0, 0.45, 1.3, 0.6, 0.9, 1.9, 0.5, 0.8, 1.2, 0.55, 0.7, 1.5, 0.4, 0.9, 0.6, 1.1, 0.5];
  const blocks: Solid[] = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      const x = (c - (cols - 1) / 2) * step;
      const z = (r - (rows - 1) / 2) * step;
      if (c === 2 && (r === 2 || r === 3)) continue; // a park
      const b = box(m, 0.62, heights[(c * rows + r) % heights.length] * 0.55, 0.62, x, 0.14, z);
      group.add(b);
      blocks.push(b);
    }
  group.add(lines(rect(-0.79, -0.31, -0.11, 1.26, 0.16), m.lineDim)); // the park's lawn
  // The route follows the streets between blocks.
  const at = (c: number, r: number) => new THREE.Vector3((c - cols / 2) * step, 0.17, (r - rows / 2) * step);
  const stops = [at(0, 1), at(0, 4), at(3, 4), at(3, 1), at(6, 1), at(6, 4)];
  const legLen = stops.slice(1).map((s, i) => s.distanceTo(stops[i]));
  const total = legLen.reduce((a, b) => a + b, 0);
  const routeGeo = new THREE.BufferGeometry().setFromPoints(stops);
  const routePos = routeGeo.attributes.position as THREE.BufferAttribute;
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(stops), m.lineDim), new THREE.Line(routeGeo, m.lineAccent));
  const pins = [0, 2, 3, 5].map((k) => {
    const head = solid(new THREE.SphereGeometry(0.1, 16, 12), m);
    head.position.set(stops[k].x, 0.82, stops[k].z);
    group.add(cyl(m, 0.05, 0.55, stops[k].x, 0.14, stops[k].z, false, 10), head);
    return { k, head };
  });
  const walker = solid(new THREE.SphereGeometry(0.11, 16, 12), m, true);
  const halo = glow(m, 0.9);
  group.add(walker, halo);
  const sway = pose(group, 0.55, 0.8);
  group.position.y = -0.45;
  const pos = new THREE.Vector3();
  return {
    group,
    update(t) {
      sway(t);
      let d = ((t % 9) / 9) * total;
      let i = 0;
      while (i < legLen.length - 1 && d > legLen[i]) d -= legLen[i++];
      pos.lerpVectors(stops[i], stops[i + 1], Math.min(1, d / legLen[i]));
      walker.position.copy(pos).setY(0.28);
      halo.position.copy(walker.position);
      // The lit line runs from the first stop to the walker.
      routeGeo.setDrawRange(0, i + 2);
      for (let k = 0; k < stops.length; k++) routePos.setXYZ(k, stops[k].x, stops[k].y, stops[k].z);
      routePos.setXYZ(i + 1, pos.x, pos.y, pos.z);
      routePos.needsUpdate = true;
      pins.forEach((p) => setLit(p.head, p.k <= i, m));
    },
  };
}

// ─── CseGraph: file slabs wired into a graph ─────────────────────────────────
/** A query is typed on the terminal; signal travels the graph and the files it returns light up. */
function codeGraph(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6, 4.4));
  const spots: [number, number][] = [
    [-2.1, -1.4], [-0.7, -1.5], [0.8, -1.3], [2.1, -1.5],
    [-1.6, -0.2], [0.1, -0.1], [1.7, 0], [-2.2, 1.1], [-0.5, 1.2], [1.0, 1.3],
  ];
  const files = spots.map(([x, z], i) => {
    const s = box(m, 0.9, 0.12 + (i % 3) * 0.06, 0.62, x, 0.14, z);
    group.add(s);
    return s;
  });
  const top = (i: number) => new THREE.Vector3(spots[i][0], 0.2, spots[i][1]);
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [4, 7], [5, 8], [8, 9], [6, 9], [7, 8]];
  group.add(lines(edges.flatMap(([a, b]) => [...top(a).toArray(), ...top(b).toArray()]), m.lineDim));
  const path = [8, 5, 2, 3];
  const pathPts = path.map(top);
  const pathLine = lines(path.slice(1).flatMap((p, i) => [...top(path[i]).toArray(), ...top(p).toArray()]), m.lineAccent);
  group.add(pathLine);
  // Terminal in front.
  group.add(box(m, 2.0, 1.3, 0.3, -1.6, 0.14, 1.95));
  const cmd = '$ csegraph context "auth"';
  const tty = screen(1.8, 1.1, (c, W, H, t) => {
    const s = t % 6;
    c.font = font(H * 0.09);
    c.fillStyle = palette.ink;
    c.fillText(cmd.slice(0, Math.min(cmd.length, Math.floor(s * 12))), W * 0.05, H * 0.16);
    if (s < 2.6) return;
    c.fillStyle = palette.accent;
    ["auth/session.py  0.94", "api/routes.py    0.81", "db/users.py      0.77"].forEach((l, i) => {
      if (s > 2.6 + i * 0.4) c.fillText(l, W * 0.05, H * (0.36 + i * 0.16));
    });
    c.fillStyle = palette.dim;
    c.fillText("1,184 / 2,000 tokens", W * 0.05, H * 0.9);
  });
  tty.mesh.position.set(-1.6, 0.79, 2.11);
  group.add(tty.mesh);
  const dot = solid(new THREE.SphereGeometry(0.08, 12, 10), m, true);
  const pulse = glow(m, 0.7);
  group.add(dot, pulse);
  const sway = pose(group, -0.5, 0.82);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      tty.paint(t);
      const s = t % 6;
      const k = Math.max(0, Math.min(1, (s - 2.2) / 1.6)) * (path.length - 1); // 0 → 3 along the path
      const seg = Math.min(path.length - 2, Math.floor(k));
      dot.position.lerpVectors(pathPts[seg], pathPts[seg + 1], k - seg).setY(0.32);
      pulse.position.copy(dot.position);
      dot.visible = pulse.visible = s > 2.2 && s < 3.8;
      pathLine.visible = s > 2.2;
      files.forEach((f, i) => setLit(f, s > 2.2 && path.indexOf(i) >= 0 && path.indexOf(i) <= k, m));
    },
  };
}

// ─── SnapInterview: a laptop mid-interview ───────────────────────────────────
/** The interviewer speaks (waveform), the mic listens to the answer, and the score lands. */
function interviewLaptop(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 5.6, 3.8));
  group.add(box(m, 3.0, 0.14, 2.0, -0.3, 0.14, 0.4));
  const keys: number[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) keys.push(...rect(-1.55 + c * 0.22, 0.05 + r * 0.2, -1.39 + c * 0.22, 0.19 + r * 0.2, 0.29));
  group.add(lines(keys, m.lineDim));
  const lid = new THREE.Group();
  lid.add(box(m, 3.0, 1.9, 0.08));
  lid.position.set(-0.3, 0.28, -0.6);
  lid.rotation.x = -0.18;
  group.add(lid);
  const ui = screen(2.8, 1.72, (c, W, H, t) => {
    const s = t % 5;
    const speaking = s < 2.8;
    c.strokeStyle = speaking ? palette.accent : palette.dim;
    c.lineWidth = 3;
    c.beginPath();
    c.arc(W * 0.2, H * 0.36, H * 0.17, 0, Math.PI * 2);
    c.stroke();
    // Voice bars around the interviewer.
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const amp = speaking ? 0.04 + 0.08 * Math.abs(Math.sin(t * 7 + i * 1.3)) : 0.015;
      c.beginPath();
      c.moveTo(W * 0.2 + Math.cos(a) * H * 0.2, H * 0.36 + Math.sin(a) * H * 0.2);
      c.lineTo(W * 0.2 + Math.cos(a) * H * (0.2 + amp), H * 0.36 + Math.sin(a) * H * (0.2 + amp));
      c.stroke();
    }
    c.font = font(H * 0.07);
    c.fillStyle = palette.dim;
    c.fillText(speaking ? "INTERVIEWER" : "YOU · ANSWERING", W * 0.08, H * 0.7);
    c.fillStyle = palette.ink;
    ["Tell me about a system", "you scaled under load."].forEach((l, i) => c.fillText(l, W * 0.42, H * (0.24 + i * 0.1)));
    c.fillStyle = palette.dim;
    for (let i = 0; i < 4; i++) c.fillRect(W * 0.42, H * (0.42 + i * 0.08), W * (0.48 - (i % 2) * 0.12), H * 0.03);
    c.fillStyle = palette.accent;
    c.font = font(H * 0.16, 700);
    c.fillText(`${Math.min(86, Math.floor(s * 22))}`, W * 0.42, H * 0.9);
    c.font = font(H * 0.07);
    c.fillStyle = palette.dim;
    c.fillText("/ 100  SCORE", W * 0.58, H * 0.88);
  });
  ui.mesh.position.set(0, 0.95, 0.045);
  lid.add(ui.mesh);
  const cam = solid(new THREE.SphereGeometry(0.04, 10, 8), m, true);
  cam.position.set(0, 1.84, 0.05);
  lid.add(cam);
  // Desk mic.
  group.add(cyl(m, 0.3, 0.06, 2.0, 0.14, 0.3), cyl(m, 0.04, 0.9, 2.0, 0.2, 0.3, false, 10));
  const capsule = cyl(m, 0.16, 0.42, 2.0, 1.1, 0.3, false, 20);
  const micGlow = glow(m, 1.2);
  micGlow.position.set(2.0, 1.3, 0.3);
  group.add(capsule, micGlow);
  const sway = pose(group, 0.45, 0.85);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      ui.paint(t);
      const answering = t % 5 >= 2.8;
      setLit(capsule, answering, m);
      micGlow.visible = answering;
    },
  };
}

// ─── Traffic: an intersection under a camera ─────────────────────────────────
/** The light turns red; a car runs it, the camera boxes it, and a challan is issued. */
function intersection(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.4, 5.2));
  const road: number[] = [];
  const seg = (x0: number, z0: number, x1: number, z1: number) => road.push(x0, 0.16, z0, x1, 0.16, z1);
  seg(-0.7, -2.4, -0.7, -0.7);
  seg(-0.7, 0.7, -0.7, 2.4);
  seg(0.7, -2.4, 0.7, -0.7);
  seg(0.7, 0.7, 0.7, 2.4);
  seg(-3, -0.7, -0.7, -0.7);
  seg(0.7, -0.7, 3, -0.7);
  seg(-3, 0.7, -0.7, 0.7);
  seg(0.7, 0.7, 3, 0.7);
  for (let z = -2.3; z < 2.3; z += 0.5) if (Math.abs(z) > 0.8) seg(0, z, 0, z + 0.25);
  for (let x = -2.9; x < 2.9; x += 0.5) if (Math.abs(x) > 0.8) seg(x, 0, x + 0.25, 0);
  group.add(lines(road, m.lineDim));
  const stopLine = lines([0, 0.17, 0.95, 0.7, 0.17, 0.95], m.line);
  group.add(stopLine);
  // Signal pole with three lamps facing the oncoming lane.
  group.add(cyl(m, 0.06, 2.1, 1.05, 0.14, 1.05, false, 10), box(m, 0.36, 0.95, 0.3, 1.05, 2.24, 1.05));
  const lamps = [0, 1, 2].map((k) => {
    const l = solid(new THREE.SphereGeometry(0.1, 14, 10), m);
    l.position.set(1.05, 3.0 - k * 0.28, 1.22);
    group.add(l);
    return l;
  });
  const lampGlow = glow(m, 1.0);
  group.add(lampGlow);
  // Camera on an arm over the lane.
  group.add(cyl(m, 0.05, 2.6, -1.1, 0.14, 1.3, false, 10), box(m, 1.0, 0.06, 0.06, -0.6, 2.7, 1.3));
  const cam = box(m, 0.42, 0.24, 0.28, -0.25, 2.5, 1.3);
  group.add(cam);
  const cars = [0, 1, 2].map((k) => {
    const g = new THREE.Group();
    g.add(box(m, 0.5, 0.22, 0.9), box(m, 0.42, 0.18, 0.5, 0, 0.22, -0.05));
    group.add(g);
    return { g, offset: k * 1.9 };
  });
  const tag = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.75, 0.6, 1.15)), m.lineAccent);
  group.add(tag);
  const slip = screen(1.3, 0.7, (c, W, H) => {
    c.font = font(H * 0.15, 700);
    c.fillStyle = palette.accent;
    c.fillText("RED-LIGHT", W * 0.07, H * 0.3);
    c.font = font(H * 0.13);
    c.fillStyle = palette.ink;
    c.fillText("MH 02 AB 1234", W * 0.07, H * 0.56);
    c.fillStyle = palette.dim;
    c.fillText("CHALLAN · SMS SENT", W * 0.07, H * 0.82);
  });
  group.add(slip.mesh);
  const sway = pose(group, -0.6, 0.78);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      const red = t % 6 < 3.6;
      lamps.forEach((l, k) => setLit(l, (k === 0 && red) || (k === 2 && !red), m));
      lampGlow.position.copy(lamps[red ? 0 : 2].position);
      stopLine.material = red ? m.lineAccent : m.line;
      let caught: THREE.Group | null = null;
      for (const c of cars) {
        const z = 2.4 - (((t + c.offset) * 1.1) % 5.2);
        c.g.position.set(0.35, 0.14, z);
        if (red && z < 0.95 && z > -1.2) caught = c.g;
      }
      tag.visible = slip.mesh.visible = caught !== null;
      setLit(cam, caught !== null, m);
      if (caught) {
        tag.position.copy(caught.position).setY(0.48);
        slip.mesh.position.set(caught.position.x - 1.4, 1.5, caught.position.z);
        slip.paint(t);
      }
    },
  };
}

// ─── WGAN-GP: generator, panes of series, critic ────────────────────────────
/** The generator prints series on panes that ride a rail into the critic; the synthetic ones (accent) pass as real. */
function seriesPress(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.6, 3.2));
  group.add(box(m, 1.1, 1.5, 1.4, -2.55, 0.14, 0), box(m, 1.1, 1.5, 1.4, 2.55, 0.14, 0));
  group.add(lines([-2, 0.2, -0.25, 2, 0.2, -0.25, -2, 0.2, 0.25, 2, 0.2, 0.25], m.lineDim));
  const labels = [
    ["G", -2.55],
    ["D", 2.55],
  ].map(([txt, x]) => {
    const s = screen(0.8, 0.5, (c, W, H) => {
      c.font = font(H * 0.42, 700);
      c.fillStyle = palette.ink;
      c.fillText(String(txt), W * 0.38, H * 0.68);
    });
    s.mesh.position.set(Number(x), 1.1, 0.71);
    group.add(s.mesh);
    return s;
  });
  // Each pane carries a walk; every other one is synthetic.
  const panes = Array.from({ length: 6 }, (_, k) => {
    const g = new THREE.Group();
    g.add(box(m, 0.06, 1.1, 0.9));
    const pts: number[] = [];
    let v = 0;
    for (let i = 0; i <= 30; i++) {
      v += Math.sin(i * 1.7 + k * 3.1) * 0.08 + Math.cos(i * 0.6 + k) * 0.05;
      pts.push(0.04, 0.55 + v, -0.4 + (i / 30) * 0.8);
    }
    const segs: number[] = [];
    for (let i = 0; i < 30; i++) segs.push(...pts.slice(i * 3, i * 3 + 6));
    g.add(lines(segs, k % 2 ? m.lineAccent : m.line));
    g.rotation.y = Math.PI / 2 - 0.5;
    group.add(g);
    return { g, k };
  });
  group.add(box(m, 0.16, 0.06, 0.16, -2.55, 1.64, 0, true));
  const critLed = box(m, 0.16, 0.06, 0.16, 2.55, 1.64, 0);
  group.add(critLed);
  const sway = pose(group, -0.4, 0.8);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      labels.forEach((l) => l.paint(t));
      let judging = false;
      panes.forEach(({ g, k }) => {
        const u = ((t * 0.18 + k / panes.length) % 1) * 4 - 2; // -2 → 2 along the rail
        g.position.set(u, 0.2, 0);
        g.visible = u > -1.95 && u < 1.95;
        if (u > 1.6) judging = true;
      });
      setLit(critLed, judging, m);
    },
  };
}

// ─── JARVIS: a smart speaker running the room ───────────────────────────────
/** The speaker's crown lights as it hears a command; sound rings spread and the devices switch on in turn. */
function smartSpeaker(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 5.6, 4.2));
  group.add(cyl(m, 0.7, 1.7, 0, 0.14, 0, false, 40));
  for (let k = 0; k < 6; k++) group.add(ring(0.71, 0.4 + k * 0.18, m.lineDim, 48));
  const crown = cyl(m, 0.62, 0.06, 0, 1.84, 0, false, 40);
  group.add(crown);
  const waves = [0, 1, 2].map(() => {
    const r = ring(1, 1.9, m.lineAccent);
    group.add(r);
    return r;
  });
  const halo = glow(m, 2.2);
  halo.position.set(0, 1.95, 0);
  group.add(halo);
  // Devices: a lamp, a bulb and a screen around the speaker.
  const shade = solid(new THREE.CylinderGeometry(0.25, 0.42, 0.42, 24), m);
  shade.position.set(-2.0, 1.35, 1.0);
  group.add(cyl(m, 0.25, 0.05, -2.0, 0.14, 1.0), cyl(m, 0.035, 0.98, -2.0, 0.19, 1.0, false, 8), shade);
  const bulb = solid(new THREE.SphereGeometry(0.22, 18, 14), m);
  bulb.position.set(1.9, 0.82, 0.9);
  group.add(cyl(m, 0.08, 0.5, 1.9, 0.14, 0.9, false, 10), bulb);
  group.add(box(m, 1.3, 0.85, 0.08, -1.5, 0.4, -1.3), box(m, 0.4, 0.26, 0.24, -1.5, 0.14, -1.3));
  const tv = screen(1.18, 0.73, (c, W, H) => {
    c.font = font(H * 0.12);
    c.fillStyle = palette.accent;
    c.fillText("“lights on, play jazz”", W * 0.06, H * 0.55);
  });
  tv.mesh.position.set(-1.5, 0.825, -1.255);
  group.add(tv.mesh);
  const deviceGlows = [shade.position, bulb.position].map((p) => {
    const g = glow(m, 1.3);
    g.position.copy(p);
    group.add(g);
    return g;
  });
  const sway = pose(group, 0.5, 0.82);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      const ph = t % 8;
      const hearing = ph < 2;
      setLit(crown, hearing, m);
      halo.visible = hearing;
      waves.forEach((w, k) => {
        const r = ((t * 0.8 + k / 3) % 1) * 1.2 + 0.75;
        w.scale.set(r, 1, r); // spread outward on the crown's plane
        w.visible = hearing;
      });
      setLit(shade, ph > 2.4, m);
      setLit(bulb, ph > 3.2, m);
      deviceGlows[0].visible = ph > 2.4;
      deviceGlows[1].visible = ph > 3.2;
      tv.mesh.visible = ph > 4;
      if (tv.mesh.visible) tv.paint(t);
    },
  };
}

// ─── Music genre: a turntable that names what it plays ──────────────────────
/** The record turns, the spectrum dances along the front, and the genre readout settles. */
function turntable(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(box(m, 4.4, 0.5, 3.4), cyl(m, 1.35, 0.12, -0.5, 0.5, 0, false, 64));
  const record = new THREE.Group();
  record.add(cyl(m, 1.28, 0.03, 0, 0, 0, false, 64));
  for (let k = 0; k < 7; k++) record.add(ring(0.5 + k * 0.11, 0.035, m.lineDim));
  record.add(lines([0.5, 0.036, 0, 1.25, 0.036, 0], m.line)); // a scratch, so it reads as turning
  record.add(cyl(m, 0.4, 0.035, 0, 0.005, 0, true, 40));
  record.position.set(-0.5, 0.62, 0);
  group.add(record);
  // Tonearm.
  const arm = box(m, 0.08, 0.08, 1.7, 1.45, 0.72, -0.35);
  arm.rotation.y = 0.45;
  group.add(cyl(m, 0.18, 0.2, 1.45, 0.5, -1.15, false, 20), arm, box(m, 0.2, 0.1, 0.3, 1.1, 0.68, 0.4));
  // Spectrum bars along the front edge.
  const bars = Array.from({ length: 9 }, (_, k) => {
    const b = box(m, 0.16, 1, 0.16, -1.9 + k * 0.29, 0.5, 1.45, k % 4 === 1);
    group.add(b);
    return b;
  });
  const readout = screen(1.2, 0.5, (c, W, H, t) => {
    const settled = t % 7 > 2.5;
    c.font = font(H * 0.32, 700);
    c.fillStyle = settled ? palette.accent : palette.dim;
    c.fillText(settled ? "JAZZ" : "· · ·", W * 0.06, H * 0.48);
    c.font = font(H * 0.2);
    c.fillStyle = palette.ink;
    c.fillText(settled ? "p = 0.91" : "listening", W * 0.06, H * 0.84);
  });
  readout.mesh.rotation.x = -Math.PI / 2;
  readout.mesh.position.set(1.35, 0.56, 1.15);
  group.add(readout.mesh);
  const sway = pose(group, -0.45, 0.85);
  group.position.y = -0.45;
  return {
    group,
    update(t) {
      sway(t);
      record.rotation.y = -t * 1.4;
      readout.paint(t);
      bars.forEach((b, k) => {
        const h = 0.08 + 0.7 * Math.pow(Math.abs(Math.sin(t * 2.6 + k * 0.55) * Math.cos(t * 1.1 - k * 0.3)), 1.5);
        b.scale.y = h;
        b.position.y = 0.5 + h / 2;
      });
    },
  };
}

/** Objects keyed by project slug; anything unlisted falls back to the code graph. */
const BUILDERS: Record<string, (m: Materials) => Visual> = {
  cerevia: commandCenter,
  planyt: cityRoute,
  csegraph: codeGraph,
  "snap-interview": interviewLaptop,
  "traffic-violation-detection": intersection,
  "wgan-gp-financial-timeseries": seriesPress,
  "jarvis-voice-assistant": smartSpeaker,
  "music-genre-detection": turntable,
};

export function buildVisual(slug: string, m: Materials): Visual {
  return (BUILDERS[slug] ?? codeGraph)(m);
}
