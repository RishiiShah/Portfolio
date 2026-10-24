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
export const palette = { ink: "#111", dim: "rgba(0,0,0,0.3)", accent: "#2f37d6", glass: "#000", mono: "monospace" };

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
function pose(group: THREE.Group, yaw: number, scale = 1, tilt = 0.42) {
  group.rotation.set(tilt, yaw, 0);
  group.scale.setScalar(scale * 0.8);
  group.position.y = -0.45;
  return (t: number) => (group.rotation.y = yaw + Math.sin(t * 0.25) * 0.12);
}

/** A wire along a polyline: dim at rest, accent while hot, with a spark that can run along it. */
function wire(m: Materials, pts: THREE.Vector3[]) {
  const group = new THREE.Group();
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m.lineDim);
  const spark = solid(new THREE.SphereGeometry(0.06, 10, 8), m, true);
  const halo = glow(m, 0.7);
  group.add(line, spark, halo);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const total = cum[cum.length - 1];
  return {
    group,
    hot(on: boolean) {
      line.material = on ? m.lineAccent : m.lineDim;
    },
    /** Places the spark at fraction f of the way along, or hides it outside 0…1. */
    run(f: number) {
      const show = f >= 0 && f <= 1;
      spark.visible = halo.visible = show;
      if (!show) return;
      const d = f * total;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      spark.position.lerpVectors(pts[i - 1], pts[i], (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1));
      halo.position.copy(spark.position);
    },
  };
}
/** Right-angle route from a to b at height y, like a trace on a board. */
const trace = (a: [number, number], b: [number, number], y: number) => [
  new THREE.Vector3(a[0], y, a[1]),
  new THREE.Vector3(b[0], y, a[1]),
  new THREE.Vector3(b[0], y, b[1]),
];

/** Vertical hairline slits on a box's front (+z) and side (+x) faces: windows, vents, grilles. */
function slits(m: Materials, w: number, h: number, d: number, x: number, y: number, z: number, step = 0.13, inset = 0.09) {
  const pts: number[] = [];
  for (let u = x - w / 2 + inset; u <= x + w / 2 - inset + 1e-6; u += step) pts.push(u, y + inset, z + d / 2 + 0.002, u, y + h - inset, z + d / 2 + 0.002);
  for (let u = z - d / 2 + inset; u <= z + d / 2 - inset + 1e-6; u += step) pts.push(x + w / 2 + 0.002, y + inset, u, x + w / 2 + 0.002, y + h - inset, u);
  return lines(pts, m.lineDim);
}

// ─── Cerevia: coverage gaps caught early and staffed through approval ──────
/**
 * A gap opens at one of the network's hospitals 90 minutes ahead (it blinks on
 * the engine's lookahead and on the hospital). The engine proposes a split
 * shift; the signal runs the approval loop: clinical lead approves on the
 * tablet, the physician accepts on the phone, and the hospital is covered.
 * Every step prints a line on the append-only audit ledger.
 */
function commandCenter(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 7.2, 4.8));
  const cycle = 9;
  // 0–2 gap open · 2–3.4 proposed · 3.4–4.8 approved · 4.8–6.2 accepted · 6.2–9 covered
  const phaseAt = (t: number) => t % cycle;
  const step = (s: number) => (s < 2 ? 0 : s < 3.4 ? 1 : s < 4.8 ? 2 : s < 6.2 ? 3 : 4);

  // The engine: a console whose wide screen is the 90-minute coverage lookahead.
  group.add(box(m, 3.1, 0.5, 1.0, 0.2, 0.14, -1.55), slits(m, 3.1, 0.5, 1.0, 0.2, 0.14, -1.55, 0.25, 0.12));
  const lookahead = screen(2.9, 1.45, (c, W, H, t) => {
    const s = phaseAt(t);
    const k = step(s);
    c.font = font(H * 0.075, 700);
    c.fillStyle = palette.ink;
    c.fillText("COVERAGE", W * 0.04, H * 0.11);
    c.fillStyle = k === 4 ? palette.ink : palette.accent;
    c.textAlign = "right";
    c.fillText(["GAP · 82 MIN AHEAD", "SPLIT SHIFT PROPOSED", "APPROVED", "ACCEPTED", "COVERED ✓"][k], W * 0.96, H * 0.11);
    c.textAlign = "start";
    // One lane per hospital: shifts covered in ink on a dim track, the gap ahead in accent.
    const x0 = W * 0.27;
    const x1 = W * 0.96;
    ["ST. MARY'S", "RIVERSIDE", "MERCY"].forEach((name, r) => {
      const y = H * (0.3 + r * 0.19);
      c.font = font(H * 0.06);
      c.fillStyle = palette.dim;
      c.fillText(name, W * 0.04, y + H * 0.035);
      c.fillRect(x0, y, x1 - x0, H * 0.035);
      c.fillStyle = palette.ink;
      [[0, 0.3], [0.33, 0.62], [0.65, 1]].forEach(([u0, u1]) => c.fillRect(x0 + (x1 - x0) * u0, y, (x1 - x0) * (u1 - u0), H * 0.035));
      if (r === 1) {
        const blink = k === 0 && Math.floor(t * 3) % 2 === 1;
        c.fillStyle = k < 3 ? (blink ? palette.dim : palette.accent) : palette.ink;
        c.fillRect(x0 + (x1 - x0) * 0.5, y - H * 0.03, (x1 - x0) * 0.2, H * 0.095);
      }
    });
    // The time axis: now, and 90 minutes out.
    c.fillStyle = palette.accent;
    c.fillRect(x0, H * 0.24, 2, H * 0.52);
    c.font = font(H * 0.06);
    c.fillStyle = palette.dim;
    c.fillText("NOW", x0 - W * 0.01, H * 0.86);
    c.textAlign = "right";
    c.fillText("+90 MIN", x1, H * 0.86);
    c.textAlign = "start";
  });
  const stand = new THREE.Group();
  stand.add(box(m, 0.14, 0.5, 0.14, 0, 0, 0), box(m, 3.05, 1.6, 0.1, 0, 0.5, 0));
  lookahead.mesh.position.set(0, 1.3, 0.052);
  stand.add(lookahead.mesh);
  stand.position.set(0.2, 0.64, -1.6);
  group.add(stand);

  // The network: three hospitals on the left, wired to the engine.
  const hospitalAt: [number, number][] = [[-2.75, -0.95], [-2.6, 0.45], [-1.45, 1.55]];
  const hospitals = hospitalAt.map(([x, z], i) => {
    const h = 0.75 + (i === 1 ? 0.25 : 0);
    const b = box(m, 0.75, h, 0.6, x, 0.14, z);
    group.add(b, slits(m, 0.75, h, 0.6, x, 0.14, z, 0.15));
    // A cross on the roof.
    group.add(lines([x - 0.14, 0.15 + h, z, x + 0.14, 0.15 + h, z, x, 0.15 + h, z - 0.14, x, 0.15 + h, z + 0.14], m.line));
    return b;
  });
  const GAP = 1;
  const beacon = cyl(m, 0.07, 0.14, hospitalAt[GAP][0], 0.14 + 1.0, hospitalAt[GAP][1], false, 12);
  const beaconGlow = glow(m, 1.1);
  beaconGlow.position.set(hospitalAt[GAP][0], 1.4, hospitalAt[GAP][1]);
  group.add(beacon, beaconGlow);
  const feeds = hospitalAt.map(([x, z]) => {
    const w = wire(m, trace([x + 0.38, z], [-1.1, -1.25], 0.16));
    group.add(w.group);
    return w;
  });

  // The approval loop: engine → clinical lead's tablet → physician's phone → hospital.
  const tabletBody = box(m, 1.25, 0.06, 0.9, 0.55, 0.14, 1.25);
  const tablet = screen(1.12, 0.78, (c, W, H, t) => {
    const k = step(phaseAt(t));
    c.font = font(H * 0.1, 700);
    c.fillStyle = palette.dim;
    c.fillText("CLINICAL LEAD", W * 0.07, H * 0.16);
    c.fillStyle = palette.ink;
    c.font = font(H * 0.1);
    c.fillText("Split shift 13:30–15:00", W * 0.07, H * 0.36);
    c.fillText("Dr. Patel → Riverside", W * 0.07, H * 0.52);
    const done = k >= 2;
    c.strokeStyle = palette.accent;
    c.lineWidth = 3;
    c.strokeRect(W * 0.07, H * 0.66, W * 0.86, H * 0.22);
    if (done) {
      c.fillStyle = palette.accent;
      c.fillRect(W * 0.07, H * 0.66, W * 0.86, H * 0.22);
    }
    c.font = font(H * 0.11, 700);
    c.fillStyle = done ? palette.glass : palette.accent;
    c.fillText(done ? "APPROVED ✓" : k === 1 ? "APPROVE ?" : "APPROVE", W * 0.13, H * 0.81);
  });
  tablet.mesh.rotation.x = -Math.PI / 2;
  tablet.mesh.position.set(0.55, 0.205, 1.25);
  const phoneBody = box(m, 0.5, 0.06, 0.92, 2.3, 0.14, 1.35);
  const phone = screen(0.42, 0.8, (c, W, H, t) => {
    const k = step(phaseAt(t));
    if (k < 2) return; // dark until the approved offer arrives
    c.font = font(W * 0.12, 700);
    c.fillStyle = palette.ink;
    c.fillText("SHIFT", W * 0.1, H * 0.17);
    c.fillText("OFFER", W * 0.1, H * 0.29);
    c.font = font(W * 0.1);
    c.fillStyle = palette.dim;
    c.fillText("Riverside", W * 0.1, H * 0.43);
    c.fillStyle = palette.accent;
    c.fillRect(W * 0.1, H * 0.6, W * 0.8, H * 0.16);
    c.fillStyle = palette.glass;
    c.font = font(W * 0.1, 700);
    c.fillText(k >= 3 ? "ACCEPTED" : "ACCEPT", W * 0.15, H * 0.71);
  });
  phone.mesh.rotation.x = -Math.PI / 2;
  phone.mesh.position.set(2.3, 0.205, 1.35);
  group.add(tabletBody, tablet.mesh, phoneBody, phone.mesh);
  const toLead = wire(m, trace([0.55, -1.05], [0.55, 0.8], 0.16));
  const toPhone = wire(m, trace([1.18, 1.25], [2.05, 1.25], 0.16));
  const toHospital = wire(m, [
    new THREE.Vector3(2.3, 0.16, 1.81),
    new THREE.Vector3(2.3, 0.16, 2.15),
    new THREE.Vector3(-2.6, 0.16, 2.15),
    new THREE.Vector3(-2.6, 0.16, 0.75),
  ]);
  group.add(toLead.group, toPhone.group, toHospital.group);

  // The audit ledger: an append-only stack that grows a sheet per step.
  const sheets = Array.from({ length: 5 }, (_, k) => {
    const sh = box(m, 0.9, 0.035, 0.62, 2.55, 0.14 + k * 0.05, -0.15);
    group.add(sh);
    return sh;
  });
  const ledger = screen(0.82, 0.55, (c, W, H, t) => {
    const k = step(phaseAt(t));
    c.font = font(H * 0.13, 700);
    c.fillStyle = palette.dim;
    c.fillText("AUDIT LOG", W * 0.06, H * 0.17);
    c.font = font(H * 0.11);
    ["gap", "propose", "approve", "accept", "covered"].slice(0, k + 1).forEach((e, i) => {
      c.fillStyle = i === k ? palette.accent : palette.ink;
      c.fillText(`${String(i + 1).padStart(2, "0")} ${e}`, W * 0.06, H * (0.33 + i * 0.15));
    });
  });
  ledger.mesh.rotation.x = -Math.PI / 2;
  group.add(ledger.mesh);

  const sway = pose(group, -0.3, 0.74);
  return {
    group,
    update(t) {
      sway(t);
      lookahead.paint(t);
      tablet.paint(t);
      phone.paint(t);
      ledger.paint(t);
      const s = phaseAt(t);
      const k = step(s);
      const open = k < 3;
      const blink = Math.floor(t * 3) % 2 === 0;
      setLit(hospitals[GAP], k === 0 && blink, m);
      setLit(beacon, open, m);
      beaconGlow.visible = k === 0 && blink;
      // The gap reaches the engine; the proposal goes to the lead; the approved offer to the phone; the cover back to the hospital.
      feeds.forEach((f, i) => {
        f.hot(i === GAP && k === 0);
        f.run(i === GAP && s < 1.2 ? s / 1.2 : -1);
      });
      toLead.hot(k === 1);
      toLead.run(k === 1 && s < 2.9 ? (s - 2) / 0.9 : -1);
      toPhone.hot(k === 2);
      toPhone.run(k === 2 && s < 4.3 ? (s - 3.4) / 0.9 : -1);
      toHospital.hot(k === 3);
      toHospital.run(k === 3 && s < 6.0 ? (s - 4.8) / 1.2 : -1);
      setLit(tabletBody, k === 1, m);
      setLit(phoneBody, k === 2, m);
      // The ledger grows one sheet per step, its top one carrying the log.
      sheets.forEach((sh, i) => (sh.visible = i <= k));
      ledger.mesh.position.set(2.55, 0.14 + k * 0.05 + 0.04, -0.15);
    },
  };
}

// ─── PlaNYt: a city diorama with the day's route ────────────────────────────
/**
 * One sentence in, a day out: the itinerary stands beside the city, and a
 * walker follows the planned route street by street. The ribbon lights behind
 * them, each numbered pin lights on arrival, and the plan highlights the stop.
 */
function cityRoute(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 8.8, 5.4));
  const city = new THREE.Group();
  city.position.x = -0.85;
  group.add(city);
  const cols = 6;
  const rows = 5;
  const step = 0.95;
  const heights = [0.5, 1.4, 0.7, 2.2, 0.6, 0.9, 1.1, 0.4, 1.7, 0.8, 0.5, 2.6, 0.7, 1.0, 0.45, 1.3, 0.6, 0.9, 1.9, 0.5, 0.8, 1.2, 0.55, 0.7, 1.5, 0.4, 0.9, 0.6, 1.1, 0.5];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < rows; r++) {
      if (c === 2 && (r === 2 || r === 3)) continue; // the park
      const x = (c - (cols - 1) / 2) * step;
      const z = (r - (rows - 1) / 2) * step;
      // A skyline at the back, low blocks in front so the streets and route stay in view.
      const h = heights[(c * rows + r) % heights.length] * (r === 0 ? 0.7 : 0.24) + 0.12;
      city.add(box(m, 0.62, h, 0.62, x, 0.14, z));
      if (h > 0.45) city.add(slits(m, 0.62, h, 0.62, x, 0.14, z, 0.12, 0.1));
    }
  // The park: a lawn with a few trees.
  city.add(lines(rect(-0.79, -0.31, -0.11, 1.26, 0.16), m.lineDim));
  for (const [x, z] of [
    [-0.6, -0.05],
    [-0.3, 0.4],
    [-0.55, 0.9],
  ])
    city.add(solid(new THREE.ConeGeometry(0.13, 0.32, 10), m).translateX(x).translateY(0.32).translateZ(z));

  // The route follows the streets between blocks, as a raised ribbon.
  const at = (c: number, r: number) => new THREE.Vector3((c - cols / 2) * step, 0.15, (r - rows / 2) * step);
  const corners = [at(0, 1), at(0, 4), at(3, 4), at(3, 1), at(6, 1), at(6, 4)];
  const legLen = corners.slice(1).map((p, i) => p.distanceTo(corners[i]));
  const total = legLen.reduce((a, b) => a + b, 0);
  const ribbon = corners.slice(1).map((p, i) => {
    const a = corners[i];
    const along = new THREE.Vector3().subVectors(p, a);
    const yaw = Math.atan2(-along.z, along.x);
    const dim = box(m, legLen[i] + 0.12, 0.02, 0.12, 0, 0, 0);
    dim.position.copy(a).add(p).multiplyScalar(0.5);
    dim.rotation.y = yaw;
    const lit = box(m, 1, 0.03, 0.12, 0, 0, 0, true);
    lit.rotation.y = yaw;
    city.add(dim, lit);
    return { a, along, lit };
  });

  // Stops: numbered pins standing above the roofs, on the route's corners.
  const plan = [
    { k: 0, time: "09:30", name: "The Met", crowd: [0.3, 0.5, 0.8, 0.9, 0.6], pick: 0 },
    { k: 2, time: "12:00", name: "Central Park", crowd: [0.4, 0.7, 0.5, 0.9, 0.8], pick: 2 },
    { k: 3, time: "14:30", name: "MoMA", crowd: [0.9, 0.8, 0.4, 0.6, 0.7], pick: 2 },
    { k: 5, time: "18:00", name: "Chelsea Market", crowd: [0.5, 0.6, 0.9, 0.3, 0.6], pick: 3 },
  ];
  const pins = plan.map(({ k }, n) => {
    const base = corners[k];
    const pole = cyl(m, 0.025, 0.7, base.x, 0.15, base.z, false, 8);
    const head = cyl(m, 0.17, 0.08, base.x, 0.85, base.z, false, 24);
    const tag = screen(0.26, 0.26, (c, W, H) => {
      c.font = font(H * 0.72, 700);
      c.fillStyle = palette.ink;
      c.textAlign = "center";
      c.fillText(String(n + 1), W / 2, H * 0.78);
      c.textAlign = "start";
    });
    tag.mesh.rotation.x = -Math.PI / 2;
    tag.mesh.position.set(base.x, 0.935, base.z);
    city.add(pole, head, tag.mesh);
    return { k, head, tag };
  });

  // The itinerary, standing beside the city like a phone.
  let current = -1;
  const phone = new THREE.Group();
  phone.add(box(m, 2.0, 2.85, 0.12, 0, 0, 0));
  const ui = screen(1.84, 2.65, (c, W, H) => {
    c.font = font(W * 0.07);
    c.fillStyle = palette.dim;
    c.fillText("YOU", W * 0.08, H * 0.07);
    c.fillStyle = palette.ink;
    c.fillText("museums, long lunch,", W * 0.08, H * 0.12);
    c.fillText("no crowds.", W * 0.08, H * 0.165);
    c.fillStyle = palette.dim;
    c.fillRect(W * 0.08, H * 0.2, W * 0.84, 2);
    c.fillText("PLANYT · YOUR DAY", W * 0.08, H * 0.26);
    plan.forEach((p, n) => {
      const y = H * (0.33 + n * 0.155);
      const on = n === current;
      if (on) {
        c.fillStyle = palette.accent;
        c.fillRect(W * 0.05, y - H * 0.035, W * 0.9, H * 0.13);
      }
      c.fillStyle = on ? palette.glass : palette.ink;
      c.font = font(W * 0.08, 700);
      c.fillText(`${n + 1}  ${p.time}`, W * 0.09, y + H * 0.012);
      c.font = font(W * 0.072);
      c.fillText(p.name, W * 0.09, y + H * 0.06);
      // Crowd by hour (subway ridership); the hour PlaNYt picked is marked.
      p.crowd.forEach((v, j) => {
        const bw = W * 0.035;
        const x = W * 0.66 + j * (bw + W * 0.012);
        c.fillStyle = on ? palette.glass : j === p.pick ? palette.accent : palette.dim;
        c.fillRect(x, y + H * 0.06 - v * H * 0.06, bw, v * H * 0.06);
      });
    });
    c.fillStyle = palette.dim;
    c.fillText("4 stops · 6 sources", W * 0.08, H * 0.97);
  });
  ui.mesh.position.set(0, 1.425, 0.062);
  phone.add(ui.mesh);
  phone.position.set(3.35, 0.14, 0.75);
  phone.rotation.set(-0.12, -0.35, 0);
  group.add(phone);

  const walker = solid(new THREE.SphereGeometry(0.12, 16, 12), m, true);
  const halo = glow(m, 1.0);
  city.add(walker, halo);
  const sway = pose(group, 0.5, 0.66, 0.6);
  const pos = new THREE.Vector3();
  return {
    group,
    update(t) {
      sway(t);
      // Walk for 9 s, then hold the finished route for 2.
      const f = Math.min(1, (t % 11) / 9);
      let d = f * total;
      let i = 0;
      while (i < legLen.length - 1 && d > legLen[i]) d -= legLen[i++];
      const legF = Math.min(1, d / legLen[i]);
      pos.copy(corners[i]).addScaledVector(ribbon[i].along, legF);
      walker.position.copy(pos).setY(0.3);
      halo.position.copy(walker.position);
      ribbon.forEach((r, n) => {
        const k = n < i ? 1 : n === i ? legF : 0;
        r.lit.visible = k > 0.01;
        r.lit.scale.x = legLen[n] * k + 0.12;
        r.lit.position.copy(r.a).addScaledVector(r.along, k / 2).setY(0.16);
      });
      // The stop reached last: arrival lights its pin and its line in the plan.
      let reached = -1;
      pins.forEach((p, n) => {
        const there = p.k < i || (p.k === i && legF >= 0) || (p.k === i + 1 && legF >= 1);
        if (there) reached = n;
        setLit(p.head, there, m);
        p.tag.paint(t);
      });
      current = reached;
      ui.paint(t);
    },
  };
}

// ─── CseGraph: a repository indexed into a symbol graph ──────────────────────
/**
 * Files flow from the repository into the index (index.db). A query is typed;
 * BM25 picks a seed symbol, the walk hops along the graph and each symbol it
 * keeps rises and lights; the answer runs back to the terminal, where the
 * context shrinks from 1,540 to 273 tokens.
 */
function codeGraph(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.6, 4.8));
  const cycle = 9;

  // A label lying on a top face, readable from the camera.
  const topLabel = (w: number, d: number, x: number, y: number, z: number, draw: Parameters<typeof screen>[2]) => {
    const s = screen(w, d, draw);
    s.mesh.rotation.x = -Math.PI / 2;
    s.mesh.position.set(x, y + 0.003, z);
    group.add(s.mesh);
    return s;
  };

  // The repository: a fanned stack of source files.
  for (let k = 0; k < 5; k++) group.add(box(m, 1.15, 0.05, 0.8, -2.45 + k * 0.03, 0.14 + k * 0.09, -1.45 - k * 0.03));
  const repo = topLabel(1.0, 0.62, -2.33, 0.14 + 4 * 0.09 + 0.05, -1.57, (c, W, H) => {
    c.font = font(H * 0.22, 700);
    c.fillStyle = palette.ink;
    c.fillText("repo/", W * 0.08, H * 0.36);
    c.font = font(H * 0.17);
    c.fillText("12,245 files", W * 0.08, H * 0.72);
  });

  // The index store: a stacked drum, SQLite.
  for (let k = 0; k < 3; k++) group.add(cyl(m, 0.5, 0.2, 2.45, 0.14 + k * 0.25, -1.4));
  const db = topLabel(0.62, 0.36, 2.45, 0.14 + 2 * 0.25 + 0.2, -1.4, (c, W, H) => {
    c.font = font(H * 0.3, 700);
    c.fillStyle = palette.ink;
    c.fillText("index.db", W * 0.04, H * 0.62);
  });
  const dbLed = cyl(m, 0.05, 0.02, 2.45, 0.14 + 0.66, -1.04, false, 12);
  group.add(dbLed);

  // The symbol graph: chips with names on their tops, wired by traces.
  const names = ["login()", "Session", "verify_jwt", "User", "routes", "hash_pw", "cache", "config"];
  const spots: [number, number][] = [
    [-0.85, -0.3], [0.35, -0.95], [1.5, -0.25], [0.45, 0.45], [-0.95, -1.35], [1.75, 0.7], [0.95, 1.45], [1.55, -1.45],
  ];
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 3], [0, 4], [1, 7], [2, 5], [3, 6], [4, 1], [5, 3], [6, 0]];
  group.add(lines(edges.flatMap(([a, b]) => trace(spots[a], spots[b], 0.16).flatMap((p, k, all) => (k ? [...all[k - 1].toArray(), ...p.toArray()] : []))), m.lineDim));
  const lit = names.map(() => false);
  const chips = spots.map(([x, z], i) => {
    const g = new THREE.Group();
    const body = box(m, 0.98, 0.12, 0.42, 0, 0, 0);
    // Lit chips turn solid accent with the name knocked out.
    const tag = screen(0.9, 0.34, (c, W, H) => {
      if (lit[i]) {
        c.fillStyle = palette.accent;
        c.fillRect(0, 0, W, H);
      }
      c.font = font(H * 0.4, 700);
      c.fillStyle = lit[i] ? palette.glass : palette.ink;
      c.fillText(names[i], W * 0.06, H * 0.66);
    });
    tag.mesh.rotation.x = -Math.PI / 2;
    tag.mesh.position.y = 0.123;
    g.add(body, tag.mesh);
    g.position.set(x, 0.14, z);
    group.add(g);
    return { g, body, tag };
  });
  // The walk BM25 seeds at login() and the hops it keeps.
  const walk = [0, 1, 2, 3];
  const hops = walk.slice(1).map((p, i) => {
    const w = wire(m, trace(spots[walk[i]], spots[p], 0.17));
    group.add(w.group);
    return w;
  });

  // Indexing: repo to graph; the graph persists into index.db.
  const ingest = wire(m, trace([-1.85, -1.45], [-0.85, -0.5], 0.16));
  const persist = wire(m, trace([2.05, -1.45], [1.95, -1.1], 0.16));
  // The answer: from the last symbol back to the terminal.
  const answer = wire(m, trace([0.45, 0.66], [-1.1, 1.3], 0.16));
  group.add(ingest.group, persist.group, answer.group);

  // Terminal in front, laid back like a console so it faces the camera and hides little.
  const term = new THREE.Group();
  term.add(box(m, 2.3, 1.45, 0.24, 0, 0, 0));
  const cmd = "$ csegraph context login";
  const tty = screen(2.1, 1.25, (c, W, H, t) => {
    const s = t % cycle;
    c.font = font(H * 0.088);
    c.fillStyle = palette.ink;
    c.fillText(cmd.slice(0, Math.min(cmd.length, Math.floor(s * 14))), W * 0.05, H * 0.14);
    if (s < 5) {
      c.fillStyle = palette.dim;
      if (s > 2) c.fillText(s < 3.2 ? "bm25 → login()" : "graph walk · " + Math.min(3, Math.floor((s - 3.2) / 0.55) + 1) + " hops", W * 0.05, H * 0.3);
      return;
    }
    ["auth/login.py", "auth/session.py", "auth/jwt.py", "models/user.py"].forEach((l, i) => {
      if (s < 5 + i * 0.18) return;
      c.fillStyle = palette.accent;
      c.fillText("✓ " + l, W * 0.05, H * (0.3 + i * 0.115));
    });
    // Context budget: the full read shrinks to what the graph kept.
    const k = Math.min(1, Math.max(0, (s - 5.6) / 1.2));
    const tokens = Math.round(1540 - (1540 - 273) * k);
    c.fillStyle = palette.dim;
    c.fillRect(W * 0.05, H * 0.82, W * 0.9, H * 0.06);
    c.fillStyle = k > 0 ? palette.accent : palette.ink;
    c.fillRect(W * 0.05, H * 0.82, W * 0.9 * (tokens / 1540), H * 0.06);
    c.fillStyle = palette.ink;
    c.fillText(`${tokens.toLocaleString("en-US")} tokens` + (k >= 1 ? "  −82%" : ""), W * 0.05, H * 0.76);
  });
  tty.mesh.position.set(0, 0.725, 0.122);
  term.add(tty.mesh);
  term.position.set(-1.75, 0.14, 1.95);
  term.rotation.x = -0.8;
  group.add(term);

  const sway = pose(group, -0.5, 0.8);
  return {
    group,
    update(t) {
      sway(t);
      tty.paint(t);
      repo.paint(t);
      db.paint(t);
      const s = t % cycle;
      // 0–2 indexing hum · 2–3.2 seed · 3.2–4.85 walk · 5–7.4 answer · fade.
      ingest.hot(s < 2);
      ingest.run(s < 2 ? (s % 1) : -1);
      persist.hot(s < 2.2);
      persist.run(s > 0.5 && s < 2.2 ? (s - 0.5) / 1.7 : -1);
      setLit(dbLed as Solid, s < 2.2 ? Math.floor(s * 6) % 2 === 0 : s > 2 && s < 5, m);
      const walked = s < 3.2 ? 0 : Math.min(hops.length, (s - 3.2) / 0.55);
      const live = s >= 2 && s < 8.2;
      hops.forEach((h, i) => {
        const local = walked - i;
        h.hot(live && local > 0);
        h.run(local > 0 && local < 1 ? local : -1);
      });
      chips.forEach((c, i) => {
        const at = walk.indexOf(i);
        const on = live && at >= 0 && (at === 0 || walked >= at);
        lit[i] = on;
        setLit(c.body, on, m);
        c.g.position.y += ((on ? 0.3 : 0.14) - c.g.position.y) * 0.12;
        c.tag.paint(t);
      });
      answer.hot(s >= 4.85 && s < 8.2);
      answer.run(s >= 4.85 && s < 5.6 ? (s - 4.85) / 0.75 : -1);
    },
  };
}

// ─── SnapInterview: resume in, interview, recording stored, score out ───────
/**
 * The resume is scanned and parsed into the session; the AI interviewer's
 * question streams in; you answer while it records; the recording uploads to
 * S3; and the scorecard fills skill by skill to a score out of 100.
 */
function interviewLaptop(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 7.0, 4.6));
  const cycle = 10;
  // 0–1.8 scan · 1.8–2.4 parsed · 2.4–4.4 asking · 4.4–6.4 answering · 6.4–7.4 upload · 7.4–10 scoring
  const at = (t: number) => t % cycle;

  // Laptop in the middle.
  const LX = -0.2;
  group.add(box(m, 2.8, 0.14, 1.9, LX, 0.14, 0.45));
  const keys: number[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) keys.push(...rect(LX - 1.2 + c * 0.22, 0.0 + r * 0.19, LX - 1.04 + c * 0.22, 0.13 + r * 0.19, 0.29));
  keys.push(...rect(LX - 0.5, 0.85, LX + 0.5, 1.28, 0.29)); // trackpad
  group.add(lines(keys, m.lineDim));
  const lid = new THREE.Group();
  lid.add(box(m, 2.8, 1.85, 0.08));
  lid.position.set(LX, 0.28, -0.5);
  lid.rotation.x = -0.18;
  group.add(lid);
  const question = "Tell me about a system you scaled under load.";
  const ui = screen(2.62, 1.66, (c, W, H, t) => {
    const s = at(t);
    const asking = s >= 2.4 && s < 4.4;
    const answering = s >= 4.4 && s < 6.4;
    // Parsed from the resume, along the top.
    c.font = font(H * 0.06, 700);
    if (s >= 2.1) {
      let x = W * 0.05;
      for (const chip of ["BACKEND", "3 PROJECTS", "PYTHON"]) {
        const w = c.measureText(chip).width + W * 0.03;
        c.strokeStyle = palette.dim;
        c.lineWidth = 2;
        c.strokeRect(x, H * 0.05, w, H * 0.09);
        c.fillStyle = palette.ink;
        c.fillText(chip, x + W * 0.015, H * 0.115);
        x += w + W * 0.015;
      }
    }
    // The interviewer: an orb that speaks.
    c.strokeStyle = asking ? palette.accent : palette.dim;
    c.lineWidth = 3;
    c.beginPath();
    c.arc(W * 0.16, H * 0.45, H * 0.13, 0, Math.PI * 2);
    c.stroke();
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const amp = asking ? 0.03 + 0.07 * Math.abs(Math.sin(t * 7 + i * 1.3)) : 0.012;
      c.beginPath();
      c.moveTo(W * 0.16 + Math.cos(a) * H * 0.16, H * 0.45 + Math.sin(a) * H * 0.16);
      c.lineTo(W * 0.16 + Math.cos(a) * H * (0.16 + amp), H * 0.45 + Math.sin(a) * H * (0.16 + amp));
      c.stroke();
    }
    c.font = font(H * 0.06);
    c.fillStyle = palette.dim;
    c.fillText(answering ? "YOU · ANSWERING" : "INTERVIEWER", W * 0.05, H * 0.74);
    // The question streams in, token by token.
    const shown = s < 2.4 ? 0 : Math.min(question.length, Math.floor((s - 2.4) * 30));
    c.font = font(H * 0.072, 700);
    c.fillStyle = palette.ink;
    const words = question.slice(0, shown).split(" ");
    let line = "";
    let y = H * 0.3;
    for (const w of words) {
      if ((line + w).length > 22) {
        c.fillText(line, W * 0.36, y);
        line = "";
        y += H * 0.1;
      }
      line += w + " ";
    }
    c.fillText(line + (asking && shown < question.length ? "▌" : ""), W * 0.36, y);
    // Your answer, transcribed as you speak.
    const written = answering ? Math.floor((s - 4.4) * 2.2) : s >= 6.4 ? 4 : 0;
    c.fillStyle = palette.dim;
    for (let i = 0; i < Math.min(4, written); i++) c.fillRect(W * 0.36, H * (0.56 + i * 0.075), W * (0.56 - (i % 2) * 0.14), H * 0.03);
    if (answering && Math.floor(t * 2) % 2 === 0) {
      c.fillStyle = palette.accent;
      c.beginPath();
      c.arc(W * 0.93, H * 0.1, H * 0.03, 0, Math.PI * 2);
      c.fill();
      c.font = font(H * 0.06, 700);
      c.fillText("REC", W * 0.83, H * 0.12);
    }
  });
  ui.mesh.position.set(0, 0.93, 0.045);
  lid.add(ui.mesh);
  const cam = solid(new THREE.SphereGeometry(0.04, 10, 8), m);
  cam.position.set(0, 1.79, 0.05);
  lid.add(cam);

  // The resume, on a pad to the left, with a scan bar sweeping it.
  const pad = box(m, 1.25, 0.06, 1.6, -2.55, 0.14, 0.55);
  const resume = screen(1.05, 1.4, (c, W, H) => {
    c.font = font(W * 0.1, 700);
    c.fillStyle = palette.ink;
    c.fillText("RESUME", W * 0.1, H * 0.12);
    c.fillStyle = palette.dim;
    [0.2, 0.26, 0.38, 0.44, 0.5, 0.62, 0.68, 0.74, 0.86, 0.92].forEach((y, i) => c.fillRect(W * 0.1, H * y, W * (i % 3 === 2 ? 0.5 : 0.8), H * 0.025));
  });
  resume.mesh.rotation.x = -Math.PI / 2;
  resume.mesh.position.set(-2.55, 0.205, 0.55);
  const scan = box(m, 1.2, 0.04, 0.05, -2.55, 0.21, 0, true);
  const scanGlow = glow(m, 0.9);
  group.add(pad, resume.mesh, scan, scanGlow);
  const parsed = wire(m, trace([-1.92, 0.55], [-1.6, 0.0], 0.16));
  group.add(parsed.group);

  // S3 at the back left: a bucket, labelled.
  const bucket = solid(new THREE.CylinderGeometry(0.5, 0.38, 0.75, 28), m);
  bucket.position.set(-2.45, 0.14 + 0.375, -1.2);
  group.add(bucket);
  const bucketTag = screen(0.62, 0.5, (c, W, H) => {
    c.font = font(H * 0.36, 700);
    c.fillStyle = palette.ink;
    c.textAlign = "center";
    c.fillText("S3", W / 2, H * 0.48);
    c.font = font(H * 0.14);
    c.fillStyle = palette.dim;
    c.fillText("recordings", W / 2, H * 0.78);
    c.textAlign = "start";
  });
  bucketTag.mesh.rotation.x = -Math.PI / 2;
  bucketTag.mesh.position.set(-2.45, 0.14 + 0.751, -1.2);
  group.add(bucketTag.mesh);
  const upload = wire(m, trace([-1.6, -0.45], [-2.45, -0.72], 0.16));
  group.add(upload.group);

  // The scorecard, standing at the front right.
  const card = new THREE.Group();
  card.add(box(m, 1.5, 1.7, 0.1, 0, 0, 0));
  const score = screen(1.36, 1.56, (c, W, H, t) => {
    const s = at(t);
    const k = s < 7.4 ? 0 : Math.min(1, (s - 7.4) / 1.6);
    c.font = font(H * 0.075, 700);
    c.fillStyle = palette.dim;
    c.fillText("SCORECARD", W * 0.08, H * 0.1);
    (
      [
        ["Communication", 82],
        ["Structure", 78],
        ["Technical", 91],
      ] as const
    ).forEach(([label, v], i) => {
      const y = H * (0.2 + i * 0.17);
      c.font = font(H * 0.06);
      c.fillStyle = palette.ink;
      c.fillText(label, W * 0.08, y);
      c.fillText(String(Math.round(v * k)), W * 0.8, y);
      c.fillStyle = palette.dim;
      c.fillRect(W * 0.08, y + H * 0.03, W * 0.84, H * 0.035);
      c.fillStyle = palette.accent;
      c.fillRect(W * 0.08, y + H * 0.03, W * 0.84 * (v / 100) * k, H * 0.035);
    });
    c.font = font(H * 0.22, 700);
    c.fillStyle = k > 0 ? palette.accent : palette.dim;
    c.fillText(String(Math.round(84 * k)), W * 0.08, H * 0.9);
    c.font = font(H * 0.07);
    c.fillStyle = palette.dim;
    c.fillText("/ 100", W * 0.42, H * 0.88);
  });
  score.mesh.position.set(0, 0.85, 0.052);
  card.add(score.mesh);
  card.position.set(2.35, 0.14, 0.95);
  card.rotation.y = -0.35;
  group.add(card);
  const toCard = wire(m, trace([1.2, 0.6], [1.9, 0.95], 0.16));
  group.add(toCard.group);

  const sway = pose(group, 0.35, 0.8);
  return {
    group,
    update(t) {
      sway(t);
      ui.paint(t);
      resume.paint(t);
      bucketTag.paint(t);
      score.paint(t);
      const s = at(t);
      const scanning = s < 1.8;
      scan.visible = scanGlow.visible = scanning;
      scan.position.z = 0.55 - 0.7 + (s / 1.8) * 1.4;
      scanGlow.position.copy(scan.position).setY(0.3);
      setLit(pad, scanning, m);
      parsed.hot(s >= 1.8 && s < 2.4);
      parsed.run(s >= 1.8 && s < 2.4 ? (s - 1.8) / 0.6 : -1);
      setLit(cam as Solid, s >= 4.4 && s < 6.4, m);
      upload.hot(s >= 6.4 && s < 7.4);
      upload.run(s >= 6.4 && s < 7.4 ? s - 6.4 : -1);
      setLit(bucket as Solid, s >= 7.1 && s < 7.8, m);
      toCard.hot(s >= 7.2 && s < 9.4);
      toCard.run(s >= 7.2 && s < 7.8 ? (s - 7.2) / 0.6 : -1);
    },
  };
}

// ─── Traffic: an intersection under a camera ─────────────────────────────────
/**
 * A gantry spans the approach lane with the signal and the camera on it. The
 * light turns red; a car crosses the stop line anyway, the camera brackets it
 * and reads its plate, and the roadside cabinet prints the e-challan and texts it.
 */
function intersection(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 6.4, 5.2));
  const road: number[] = [];
  const seg = (x0: number, z0: number, x1: number, z1: number) => road.push(x0, 0.16, z0, x1, 0.16, z1);
  for (const s of [-0.7, 0.7]) {
    seg(s, -2.4, s, -0.7);
    seg(s, 0.7, s, 2.4);
    seg(-3, s, -0.7, s);
    seg(0.7, s, 3, s);
  }
  for (let z = -2.3; z < 2.3; z += 0.5) if (Math.abs(z) > 1.4) seg(0, z, 0, z + 0.25);
  for (let x = -2.9; x < 2.9; x += 0.5) if (Math.abs(x) > 1.4) seg(x, 0, x + 0.25, 0);
  group.add(lines(road, m.lineDim));
  // Zebra crossings on all four arms.
  const zebra: number[] = [];
  for (let k = -0.55; k <= 0.56; k += 0.18) {
    zebra.push(...rect(k - 0.05, 0.95, k + 0.05, 1.3, 0.16), ...rect(k - 0.05, -1.3, k + 0.05, -0.95, 0.16));
    zebra.push(...rect(0.95, k - 0.05, 1.3, k + 0.05, 0.16), ...rect(-1.3, k - 0.05, -0.95, k + 0.05, 0.16));
  }
  group.add(lines(zebra, m.lineDim));
  const STOP = 1.4;
  const stopLine = lines([0, 0.17, STOP, 0.7, 0.17, STOP], m.line);
  group.add(stopLine);
  // Corner buildings.
  for (const [x, z, h] of [
    [-2.2, -1.8, 0.45],
    [2.2, -1.9, 0.9],
    [2.2, 1.9, 0.5],
  ])
    group.add(box(m, 1.3, h, 1.0, x, 0.14, z), slits(m, 1.3, h, 1.0, x, 0.14, z, 0.16));

  // The gantry over the approach, just past the stop line: signal and camera share it.
  const GZ = 0.85;
  const TOP = 2.15;
  group.add(cyl(m, 0.05, TOP, -0.95, 0.14, GZ, false, 10), cyl(m, 0.05, TOP, 1.0, 0.14, GZ, false, 10));
  group.add(box(m, 2.1, 0.1, 0.1, 0.02, 0.14 + TOP, GZ));
  group.add(box(m, 0.3, 0.8, 0.24, 0.35, 0.14 + TOP - 0.8, GZ));
  const lamps = [0, 1, 2].map((k) => {
    const l = cyl(m, 0.08, 0.04, 0.35, 0, 0, false, 16);
    l.rotation.x = Math.PI / 2;
    l.position.set(0.35, 0.14 + TOP - 0.16 - k * 0.24, GZ + 0.13);
    group.add(l);
    return l;
  });
  const lampGlow = glow(m, 0.9);
  group.add(lampGlow);
  const cam = box(m, 0.26, 0.2, 0.42, -0.35, 0.14 + TOP - 0.24, GZ);
  const lens = cyl(m, 0.07, 0.08, 0, 0, 0, false, 16);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(-0.35, 0.14 + TOP - 0.14, GZ + 0.25);
  group.add(cam, lens);

  // Cars in the approach lane, heading into the junction (-z).
  const car = () => {
    const g = new THREE.Group();
    g.add(box(m, 0.5, 0.18, 0.95, 0, 0.07, 0), box(m, 0.42, 0.15, 0.48, 0, 0.25, 0.06));
    for (const [x, z] of [[-0.26, -0.3], [0.26, -0.3], [-0.26, 0.3], [0.26, 0.3]]) {
      const w = cyl(m, 0.08, 0.06, 0, 0, 0, false, 14);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.08, z);
      g.add(w);
    }
    const plateMark = box(m, 0.22, 0.06, 0.01, 0, 0.12, -0.48);
    g.add(plateMark);
    group.add(g);
    return { g, plateMark };
  };
  const cars = [0, 1, 2].map((k) => ({ ...car(), offset: k * 1.75 }));

  // Detection: corner brackets around the caught car, its tag, and the camera's sightlines.
  const bracket = (() => {
    const [w, h, d, k] = [0.68, 0.5, 1.1, 0.16];
    const pts: number[] = [];
    for (const sx of [-1, 1])
      for (const sy of [0, 1])
        for (const sz of [-1, 1]) {
          const x = (sx * w) / 2, y = sy * h, z = (sz * d) / 2;
          pts.push(x, y, z, x - sx * k, y, z, x, y, z, x, y + (sy ? -k : k), z, x, y, z, x, y, z - sz * k);
        }
    return lines(pts, m.lineAccent);
  })();
  const tag = screen(0.86, 0.22, (c, W, H) => {
    c.fillStyle = palette.accent;
    c.fillRect(0, 0, W, H);
    c.font = font(H * 0.58, 700);
    c.fillStyle = palette.glass;
    c.fillText("CAR · 0.97", W * 0.07, H * 0.74);
  });
  const coneGeo = new THREE.BufferGeometry();
  coneGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12), 3));
  const cone = new THREE.LineSegments(coneGeo, m.lineAccent);
  group.add(bracket, tag.mesh, cone);

  // The roadside cabinet that issues the challan, wired to the gantry.
  group.add(box(m, 1.5, 1.3, 0.34, -2.15, 0.14, 1.75));
  let step = 0;
  const challan = screen(1.36, 1.12, (c, W, H) => {
    c.font = font(H * 0.085, 700);
    c.fillStyle = palette.dim;
    c.fillText("E-CHALLAN · LANE 2", W * 0.07, H * 0.12);
    if (step === 0) {
      c.fillStyle = palette.ink;
      c.fillText("MONITORING", W * 0.07, H * 0.32);
      c.fillStyle = palette.dim;
      c.fillText("YOLOv12x · 30 fps", W * 0.07, H * 0.47);
      return;
    }
    const rows: [string, string][] = [
      ["RED-LIGHT", palette.accent],
      ["MH 02 AB 1234", palette.ink],
      ["FINE  ₹ 1,000", palette.ink],
      ["SMS SENT ✓", palette.accent],
    ];
    rows.slice(0, step).forEach(([text, col], i) => {
      c.fillStyle = col;
      c.font = font(H * (i === 1 ? 0.11 : 0.09), 700);
      c.fillText(text, W * 0.07, H * (0.32 + i * 0.17));
    });
  });
  challan.mesh.position.set(-2.15, 0.79, 1.925);
  group.add(challan.mesh);
  const feed = wire(m, trace([-0.95, GZ], [-2.15, 1.55], 0.16));
  group.add(feed.group);

  const sway = pose(group, -0.6, 0.78);
  const lensAt = new THREE.Vector3(-0.35, 0.14 + TOP - 0.14, GZ + 0.29);
  let caughtAt = -1;
  return {
    group,
    update(t) {
      sway(t);
      const red = t % 6 < 3.6;
      lamps.forEach((l, k) => setLit(l, (k === 0 && red) || (k === 2 && !red), m));
      lampGlow.position.copy(lamps[red ? 0 : 2].position);
      stopLine.material = red ? m.lineAccent : m.line;
      let caught: (typeof cars)[number] | null = null;
      for (const c of cars) {
        const z = 2.4 - (((t + c.offset) * 1.1) % 5.2);
        c.g.position.set(0.35, 0.14, z);
        setLit(c.plateMark, false, m);
        if (red && z < STOP && z > -1.6) caught = c;
      }
      const on = caught !== null;
      bracket.visible = tag.mesh.visible = cone.visible = on;
      setLit(cam, on, m);
      if (caught) {
        if (caughtAt < 0) caughtAt = t;
        const p = caught.g.position;
        setLit(caught.plateMark, true, m);
        bracket.position.copy(p);
        tag.mesh.position.set(p.x, p.y + 0.66, p.z);
        tag.paint(t);
        const arr = coneGeo.attributes.position.array as Float32Array;
        arr.set([...lensAt.toArray(), p.x - 0.34, p.y + 0.5, p.z - 0.55, ...lensAt.toArray(), p.x + 0.34, p.y + 0.5, p.z - 0.55]);
        coneGeo.attributes.position.needsUpdate = true;
      }
      // The challan prints line by line after a catch, then holds until the next one.
      if (on && caughtAt >= 0) step = Math.min(4, 1 + Math.floor((t - caughtAt) / 0.45));
      if (!red && step > 0 && t % 6 > 5.6) {
        step = 0;
        caughtAt = -1;
      }
      const sent = step > 0 && step < 4;
      feed.hot(step > 0);
      feed.run(sent ? ((t - caughtAt) % 0.9) / 0.9 : -1);
      challan.paint(t);
    },
  };
}

// ─── WGAN-GP: generator against critic ──────────────────────────────────────
/**
 * G → D ← data. The generator turns noise into synthetic series (lit panes);
 * the market feed sends real ones (ink panes) from the other side. The critic
 * scores each, its estimate settling near 0.5 as the Wasserstein distance
 * falls, and every synthetic pane it judges sends a gradient back to G.
 */
function seriesPress(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 7.6, 3.2));
  const XG = -2.85;
  const XD = 0;
  const XR = 2.85;

  // Generator (left) and market feed (right), each with a screen on its front.
  for (const x of [XG, XR]) group.add(box(m, 1.15, 1.25, 1.1, x, 0.14, 0), slits(m, 1.15, 1.25, 1.1, x, 0.14, 0, 0.16, 0.2));
  const gen = screen(0.98, 0.72, (c, W, H, t) => {
    c.font = font(H * 0.17, 700);
    c.fillStyle = palette.ink;
    c.fillText("G", W * 0.06, H * 0.2);
    c.font = font(H * 0.11);
    c.fillStyle = palette.dim;
    c.fillText("noise z", W * 0.24, H * 0.19);
    // Noise in: a field of flickering cells.
    const n = Math.floor(t * 12);
    for (let i = 0; i < 14; i++)
      for (let j = 0; j < 5; j++) {
        const v = Math.abs(Math.sin((i * 12.9898 + j * 78.233 + n * 3.1) * 43758.5)) % 1;
        c.fillStyle = v > 0.72 ? palette.accent : v > 0.4 ? palette.ink : palette.dim;
        c.fillRect(W * (0.06 + i * 0.063), H * (0.32 + j * 0.13), W * 0.045, H * 0.09);
      }
  });
  gen.mesh.position.set(XG, 0.14 + 0.66, 0.552);
  const feed = screen(0.98, 0.72, (c, W, H, t) => {
    c.font = font(H * 0.17, 700);
    c.fillStyle = palette.ink;
    c.fillText("DATA", W * 0.06, H * 0.2);
    c.font = font(H * 0.11);
    c.fillStyle = palette.dim;
    c.fillText("market", W * 0.44, H * 0.19);
    c.strokeStyle = palette.ink;
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i <= 40; i++) {
      const x = W * (0.06 + (i / 40) * 0.88);
      const y = H * (0.64 + Math.sin(i * 0.9 + t * 3) * 0.08 + Math.sin(i * 0.31 + t) * 0.12);
      if (i) c.lineTo(x, y);
      else c.moveTo(x, y);
    }
    c.stroke();
  });
  feed.mesh.position.set(XR, 0.14 + 0.66, 0.552);
  group.add(gen.mesh, feed.mesh);

  // The critic in the middle.
  group.add(box(m, 1.3, 1.75, 1.3, XD, 0.14, 0), slits(m, 1.3, 1.75, 1.3, XD, 0.14, 0, 0.2, 0.2));
  let judged = 0;
  const critic = screen(1.14, 1.4, (c, W, H, t) => {
    c.font = font(H * 0.09, 700);
    c.fillStyle = palette.ink;
    c.fillText("D · CRITIC", W * 0.07, H * 0.11);
    c.font = font(H * 0.065);
    c.fillStyle = palette.dim;
    c.fillText("P(real)", W * 0.07, H * 0.23);
    const p = 0.5 + Math.sin(t * 1.7) * 0.03;
    c.font = font(H * 0.19, 700);
    c.fillStyle = palette.accent;
    c.fillText(p.toFixed(2), W * 0.07, H * 0.42);
    c.font = font(H * 0.065);
    c.fillStyle = palette.dim;
    c.fillText("W-DISTANCE", W * 0.07, H * 0.57);
    // Wasserstein distance over training, falling toward zero.
    c.strokeStyle = palette.ink;
    c.lineWidth = 2;
    c.beginPath();
    const steps = 30;
    const shown = Math.min(steps, 6 + (judged % 25));
    for (let i = 0; i <= shown; i++) {
      const x = W * (0.07 + (i / steps) * 0.86);
      const y = H * (0.64 + 0.27 * (1 - Math.exp(-i / 7)) + Math.sin(i * 2.3) * 0.012);
      if (i) c.lineTo(x, y);
      else c.moveTo(x, y);
    }
    c.stroke();
  });
  critic.mesh.position.set(XD, 0.14 + 0.875, 0.652);
  group.add(critic.mesh);

  // Rails on each side, and panes riding them toward the critic.
  group.add(lines([XG + 0.6, 0.17, -0.2, XD - 0.65, 0.17, -0.2, XG + 0.6, 0.17, 0.2, XD - 0.65, 0.17, 0.2, XD + 0.65, 0.17, -0.2, XR - 0.6, 0.17, -0.2, XD + 0.65, 0.17, 0.2, XR - 0.6, 0.17, 0.2], m.lineDim));
  const pane = (fake: boolean, k: number) => {
    const g = new THREE.Group();
    g.add(box(m, 0.42, 0.72, 0.05, 0, 0, 0));
    const face = screen(0.37, 0.66, (c, W, H) => {
      if (fake) {
        c.fillStyle = palette.accent;
        c.fillRect(0, 0, W, H);
      }
      c.font = font(W * 0.2, 700);
      c.fillStyle = fake ? palette.glass : palette.dim;
      c.fillText(fake ? "SYN" : "REAL", W * 0.1, H * 0.14);
      c.strokeStyle = fake ? palette.glass : palette.ink;
      c.lineWidth = 3;
      c.beginPath();
      let v = 0;
      for (let i = 0; i <= 24; i++) {
        v += Math.sin(i * 1.7 + k * 3.1) * 0.06 + Math.cos(i * 0.6 + k) * 0.04;
        const x = W * (0.1 + (i / 24) * 0.8);
        const y = H * (0.58 + Math.max(-0.3, Math.min(0.3, v)));
        if (i) c.lineTo(x, y);
        else c.moveTo(x, y);
      }
      c.stroke();
    });
    face.mesh.position.set(0, 0.36, 0.027);
    g.add(face.mesh);
    group.add(g);
    return { g, face, k, fake };
  };
  const panes = [...[0, 1, 2].map((k) => pane(true, k)), ...[0, 1, 2].map((k) => pane(false, k + 5))];

  // The gradient: from the critic back to the generator, over the top.
  const grad = wire(m, [
    new THREE.Vector3(XD - 0.3, 1.9, 0),
    new THREE.Vector3(XD - 0.3, 2.2, 0),
    new THREE.Vector3(XG + 0.2, 2.2, 0),
    new THREE.Vector3(XG + 0.2, 1.39, 0),
  ]);
  group.add(grad.group);
  const genLed = cyl(m, 0.07, 0.04, XG - 0.3, 1.39, 0.25, false, 14);
  group.add(genLed);

  const sway = pose(group, -0.3, 0.74);
  const SPEED = 0.2;
  const span = XD - 0.65 - (XG + 0.6);
  return {
    group,
    update(t) {
      sway(t);
      gen.paint(t);
      feed.paint(t);
      critic.paint(t);
      panes.forEach((p) => {
        p.face.paint(t);
        const f = (t * SPEED + p.k / 3 + (p.fake ? 0 : 0.5)) % 1;
        p.g.position.set(p.fake ? XG + 0.6 + f * span : XR - 0.6 - f * span, 0.17, 0);
        p.g.visible = f > 0.03 && f < 0.97;
      });
      // A synthetic pane reaches the critic every third of a cycle; its gradient runs home.
      const beat = (t * SPEED * 3) % 1;
      judged = Math.floor(t * SPEED * 3);
      grad.hot(true);
      grad.run(beat < 0.4 ? beat / 0.4 : -1);
      setLit(genLed, beat > 0.38 && beat < 0.6, m);
    },
  };
}

// ─── JARVIS: a smart speaker running the room ───────────────────────────────
/** The crown lights as it hears a command; the Pi beside it switches its GPIO lines and the devices come on in turn. */
function smartSpeaker(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(plate(m, 5.8, 4.2));
  group.add(cyl(m, 0.7, 1.7, -0.3, 0.14, -0.3, false, 40));
  for (let k = 0; k < 6; k++) group.add(ring(0.71, 0.4 + k * 0.18, m.lineDim, 48).translateX(-0.3).translateZ(-0.3));
  const crown = cyl(m, 0.62, 0.06, -0.3, 1.84, -0.3, false, 40);
  group.add(crown);
  const waves = [0, 1, 2].map(() => {
    const r = ring(1, 1.9, m.lineAccent);
    r.position.set(-0.3, 0, -0.3);
    group.add(r);
    return r;
  });
  const halo = glow(m, 2.2);
  halo.position.set(-0.3, 1.95, -0.3);
  group.add(halo);
  // Raspberry Pi: a board with a header of GPIO pins.
  const pi = box(m, 0.9, 0.08, 0.6, 1.0, 0.14, 0.7);
  const pins: number[] = [];
  for (let k = 0; k < 10; k++) pins.push(0.63 + k * 0.08, 0.22, 0.48, 0.63 + k * 0.08, 0.3, 0.48);
  group.add(pi, lines(pins, m.line), box(m, 0.22, 0.05, 0.22, 1.15, 0.22, 0.8));
  const fromSpeaker = wire(m, trace([0.35, -0.3], [0.7, 0.55], 0.16));
  // Devices: a lamp and a bulb on GPIO, plus a screen echoing the command.
  const shade = solid(new THREE.CylinderGeometry(0.25, 0.42, 0.42, 24), m);
  shade.position.set(-2.0, 1.35, 1.1);
  group.add(cyl(m, 0.25, 0.05, -2.0, 0.14, 1.1), cyl(m, 0.035, 0.98, -2.0, 0.19, 1.1, false, 8), shade);
  const bulb = solid(new THREE.SphereGeometry(0.22, 18, 14), m);
  bulb.position.set(2.2, 0.82, -0.6);
  group.add(cyl(m, 0.08, 0.5, 2.2, 0.14, -0.6, false, 10), bulb);
  const toLamp = wire(m, trace([0.7, 1.0], [-2.0, 1.1], 0.16));
  const toBulb = wire(m, trace([1.4, 0.6], [2.2, -0.6], 0.16));
  group.add(fromSpeaker.group, toLamp.group, toBulb.group);
  const tvGroup = new THREE.Group();
  tvGroup.add(box(m, 1.3, 0.85, 0.08, 0, 0.26, 0), box(m, 0.4, 0.26, 0.24, 0, 0, 0));
  const tv = screen(1.18, 0.73, (c, W, H, t) => {
    const ph = t % 8;
    if (ph < 1.2) return;
    const said = "lights on, play jazz";
    c.font = font(H * 0.12);
    c.fillStyle = palette.accent;
    c.fillText(`“${said.slice(0, Math.floor((ph - 1.2) * 16))}”`, W * 0.06, H * 0.55);
  });
  tv.mesh.position.set(0, 0.685, 0.045);
  tvGroup.add(tv.mesh);
  tvGroup.position.set(-1.9, 0.14, -1.2);
  tvGroup.rotation.y = 0.5;
  group.add(tvGroup);
  const deviceGlows = [shade.position, bulb.position].map((p) => {
    const g = glow(m, 1.3);
    g.position.copy(p);
    group.add(g);
    return g;
  });
  const sway = pose(group, 0.5, 0.82);
  return {
    group,
    update(t) {
      sway(t);
      tv.paint(t);
      const ph = t % 8;
      const hearing = ph < 2;
      setLit(crown, hearing, m);
      halo.visible = hearing;
      waves.forEach((w, k) => {
        const r = ((t * 0.8 + k / 3) % 1) * 1.2 + 0.75;
        w.scale.set(r, 1, r);
        w.visible = hearing;
      });
      fromSpeaker.hot(ph > 1.6 && ph < 2.4);
      fromSpeaker.run(ph > 1.6 && ph < 2.4 ? (ph - 1.6) / 0.8 : -1);
      setLit(pi, ph > 2.2 && ph < 7, m);
      const lampOn = ph > 2.8;
      const bulbOn = ph > 3.6;
      toLamp.hot(lampOn);
      toLamp.run(ph > 2.4 && ph < 2.8 ? (ph - 2.4) / 0.4 : -1);
      toBulb.hot(bulbOn);
      toBulb.run(ph > 3.2 && ph < 3.6 ? (ph - 3.2) / 0.4 : -1);
      setLit(shade, lampOn, m);
      setLit(bulb, bulbOn, m);
      deviceGlows[0].visible = lampOn;
      deviceGlows[1].visible = bulbOn;
    },
  };
}

// ─── Music genre: a turntable that names what it plays ──────────────────────
/** The record turns, the spectrum dances along the front, and the classifier's top genres settle on the display. */
function turntable(m: Materials): Visual {
  const group = new THREE.Group();
  group.add(box(m, 4.6, 0.5, 3.4), cyl(m, 1.35, 0.12, -0.6, 0.5, -0.1, false, 64));
  const record = new THREE.Group();
  record.add(cyl(m, 1.28, 0.03, 0, 0, 0, false, 64));
  for (let k = 0; k < 7; k++) record.add(ring(0.5 + k * 0.11, 0.035, m.lineDim));
  record.add(lines([0.5, 0.036, 0, 1.25, 0.036, 0], m.line)); // a scratch, so it reads as turning
  record.add(cyl(m, 0.4, 0.035, 0, 0.005, 0, true, 40));
  record.position.set(-0.6, 0.62, -0.1);
  group.add(record);
  // Tonearm resting on the record, with the stylus glowing while it plays.
  const arm = box(m, 0.08, 0.08, 1.7, 1.25, 0.72, -0.4);
  arm.rotation.y = 0.45;
  const stylus = glow(m, 0.6);
  stylus.position.set(0.85, 0.7, 0.35);
  group.add(cyl(m, 0.18, 0.2, 1.6, 0.5, -1.2, false, 20), arm, box(m, 0.2, 0.1, 0.3, 0.9, 0.68, 0.35), stylus);
  // Spectrum bars along the front edge.
  const spectrum = Array.from({ length: 10 }, (_, k) => {
    const b = box(m, 0.16, 1, 0.16, -2.0 + k * 0.27, 0.5, 1.45, k % 4 === 1);
    group.add(b);
    return b;
  });
  // Display: a small standing panel with the top three genres.
  group.add(box(m, 1.3, 0.75, 0.1, 1.5, 0.5, 1.2));
  const readout = screen(1.18, 0.63, (c, W, H, t) => {
    const s = t % 7;
    const settled = Math.min(1, Math.max(0, (s - 1.5) / 1.5));
    const genres: [string, number][] = [
      ["JAZZ", 0.91],
      ["BLUES", 0.05],
      ["ROCK", 0.02],
    ];
    c.font = font(H * 0.12);
    genres.forEach(([name, p], i) => {
      const y = H * (0.12 + i * 0.3);
      const v = 0.33 + (p - 0.33) * settled;
      c.fillStyle = i === 0 && settled === 1 ? palette.accent : palette.ink;
      c.fillText(`${name} ${v.toFixed(2)}`, W * 0.06, y + H * 0.1);
      c.fillStyle = palette.dim;
      c.fillRect(W * 0.06, y + H * 0.15, W * 0.88, H * 0.06);
      c.fillStyle = i === 0 ? palette.accent : palette.ink;
      c.fillRect(W * 0.06, y + H * 0.15, W * 0.88 * v, H * 0.06);
    });
  });
  readout.mesh.position.set(1.5, 0.875, 1.252);
  group.add(readout.mesh);
  const sway = pose(group, -0.45, 0.85);
  return {
    group,
    update(t) {
      sway(t);
      record.rotation.y = -t * 1.4;
      readout.paint(t);
      spectrum.forEach((b, k) => {
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
