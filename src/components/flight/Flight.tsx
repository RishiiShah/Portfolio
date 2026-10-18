"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { legAt } from "@/lib/flight";
import { motion } from "@/lib/motion";
import { buildVisual, palette, type Materials } from "./visuals";

const SPACING = 30; // distance between stations along -z
const VIEW_DISTANCE = 8.5; // how far in front of each visual the camera parks
const FRAME_SHIFT = 2.6; // sideways look offset so the visual sits opposite its panel

interface Layout {
  curve: THREE.CatmullRomCurve3;
  stationT: number[];
  look: THREE.Vector3[];
}

/** Builds the spline: approach → park at each station, swooping wide between them. */
function buildLayout(stations: THREE.Vector3[], narrow: boolean): Layout {
  const cams = stations.map((s) => s.clone().add(new THREE.Vector3(0, 0.6, VIEW_DISTANCE)));
  const pts: THREE.Vector3[] = [cams[0].clone().add(new THREE.Vector3(-4, 4, 26))];
  cams.forEach((c, i) => {
    pts.push(c);
    const next = cams[i + 1];
    if (next) {
      const side = i % 2 ? 1 : -1;
      pts.push(c.clone().lerp(next, 0.5).add(new THREE.Vector3(side * 7, (i % 2 ? -1 : 1) * 2.5, 0)));
    }
  });
  pts.push(cams[cams.length - 1].clone().add(new THREE.Vector3(3, 2, -24)));
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const stationT = cams.map((_, i) => (1 + 2 * i) / (pts.length - 1));
  // Even stations: visual on the right (panel left); odd: the reverse. Narrow: visual above the panel.
  const look = stations.map((s, i) =>
    s.clone().add(narrow ? new THREE.Vector3(0, -1.6, 0) : new THREE.Vector3(i % 2 ? FRAME_SHIFT : -FRAME_SHIFT, 0, 0))
  );
  return { curve, stationT, look };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function Flight({ slugs, className }: { slugs: string[]; className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 36);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 140);

    const dot = dotTexture();
    const mats: Materials = {
      line: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 }),
      lineDim: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 }),
      lineAccent: new THREE.LineBasicMaterial({ transparent: true, opacity: 1 }),
      point: new THREE.PointsMaterial({ size: 0.07, map: dot, transparent: true, depthWrite: false, alphaTest: 0.01 }),
      pointAccent: new THREE.PointsMaterial({ size: 0.16, map: dot, transparent: true, depthWrite: false, alphaTest: 0.01 }),
      // Faces sit just behind their edges so the hairlines stay crisp.
      face: new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
      faceLit: new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
      // Light spill draws over geometry (no depth test), so it never gets cut by a face.
      glow: new THREE.SpriteMaterial({ map: dot, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 }),
    };
    const trailMat = new THREE.LineDashedMaterial({ dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0.9 });
    const dustMat = new THREE.PointsMaterial({ size: 0.05, map: dot, transparent: true, depthWrite: false, opacity: 0.55 });

    const applyColors = () => {
      const s = getComputedStyle(document.documentElement);
      const ink = new THREE.Color(s.getPropertyValue("--ink").trim());
      const accent = new THREE.Color(s.getPropertyValue("--accent").trim());
      (scene.fog as THREE.Fog).color.set(s.getPropertyValue("--bg").trim());
      mats.line.color.copy(ink);
      mats.lineDim.color.copy(ink);
      mats.point.color.copy(ink);
      mats.lineAccent.color.copy(accent);
      mats.pointAccent.color.copy(accent);
      mats.face.color.set(s.getPropertyValue("--bg-2").trim());
      mats.faceLit.color.copy(accent);
      mats.glow.color.copy(accent);
      // Iso-glow: light spills only in the dark theme; in light, lit parts are flat accent.
      const dark = document.documentElement.dataset.theme === "dark";
      mats.glow.opacity = dark ? 0.35 : 0;
      palette.ink = s.getPropertyValue("--ink").trim();
      palette.dim = s.getPropertyValue("--line").trim();
      palette.accent = s.getPropertyValue("--accent").trim();
      palette.glass = s.getPropertyValue("--bg").trim();
      palette.mono = getComputedStyle(document.body).getPropertyValue("--font-jetbrains").trim() || "monospace";
      trailMat.color.copy(accent);
      dustMat.color.copy(ink);
    };
    applyColors();
    const themeObserver = new MutationObserver(applyColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const stations = slugs.map(
      (_, i) => new THREE.Vector3((i % 2 ? -1 : 1) * 6, Math.sin(i * 1.7) * 2, -i * SPACING)
    );
    const visuals = slugs.map((slug, i) => {
      const v = buildVisual(slug, mats);
      v.group.position.add(stations[i]);
      scene.add(v.group);
      return v;
    });

    // Path-dependent pieces are rebuilt when the layout flips between wide and narrow.
    let narrow = window.innerWidth < 768;
    let layout = buildLayout(stations, narrow);
    const pathGroup = new THREE.Group();
    scene.add(pathGroup);
    const buildPath = () => {
      pathGroup.children.forEach((c) => (c as THREE.Line | THREE.Points).geometry.dispose());
      pathGroup.clear();
      // The flight path itself, drawn as a dashed line just below the camera's route.
      const trail = layout.curve.getSpacedPoints(1600).map((p) => new THREE.Vector3(p.x, p.y - 1.1, p.z));
      const trailLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(trail), trailMat);
      trailLine.computeLineDistances();
      pathGroup.add(trailLine);
      // Dust around the route gives a sense of speed.
      const dust: number[] = [];
      for (let i = 0; i < 4500; i++) {
        const p = layout.curve.getPoint(Math.random());
        const a = Math.random() * Math.PI * 2;
        const r = 3 + Math.random() * 14;
        dust.push(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 0.7, p.z + (Math.random() - 0.5) * 6);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
      pathGroup.add(new THREE.Points(dustGeo, dustMat));
    };
    buildPath();

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const nowNarrow = window.innerWidth < 768;
      if (nowNarrow !== narrow) {
        narrow = nowNarrow;
        layout = buildLayout(stations, narrow);
        buildPath();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = false;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const legs = slugs.length;
    const clock = new THREE.Clock();
    const pos = new THREE.Vector3();
    const ahead = new THREE.Vector3();
    const look = new THREE.Vector3();
    let bank = 0;
    let time = 0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      time += dt;
      // Lenis already smooths the scroll; easing again here would leave the camera behind the panels.
      const f = motion.flight;

      const { leg, eased } = legAt(f, legs);
      const t0 = leg === 0 ? 0 : layout.stationT[leg - 1];
      const t1 = layout.stationT[leg];
      const t = t0 + (t1 - t0) * eased;
      layout.curve.getPoint(t, pos);
      layout.curve.getPoint(Math.min(1, t + 0.012), ahead);

      // Look along the route mid-leg, and at the station's framing point when parked.
      look.copy(ahead);
      if (leg > 0) look.lerp(layout.look[leg - 1], 1 - smooth(0, 0.5, eased));
      look.lerp(layout.look[leg], smooth(0.5, 1, eased));

      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      camera.position.copy(pos).add(new THREE.Vector3(mouse.sx * 0.5, -mouse.sy * 0.3, 0));
      camera.lookAt(look);
      // Bank into turns while moving, level out when parked.
      const travel = Math.sin(Math.PI * eased);
      const lateral = ahead.x - pos.x;
      bank += (-lateral * 1.6 * travel - bank) * Math.min(1, dt * 3);
      camera.rotateZ(bank);

      visuals.forEach((v, i) => {
        // Only animate visuals near the camera.
        if (Math.abs(stations[i].z - pos.z) < 50) v.update(time);
      });
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o instanceof THREE.Points || o instanceof THREE.Line || o instanceof THREE.Mesh) o.geometry.dispose();
        // Canvas screens own their material and texture.
        if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial && o.material.map) {
          o.material.map.dispose();
          o.material.dispose();
        }
      });
      [...Object.values(mats), trailMat, dustMat].forEach((m) => m.dispose());
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [slugs]);

  return <div ref={host} aria-hidden="true" className={`[&>canvas]:block [&>canvas]:size-full ${className ?? ""}`} />;
}

function smooth(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
