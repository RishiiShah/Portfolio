"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * Fixed full-viewport particle field. Every particle has a home position in
 * five shapes; the shader blends between them using `uShape`, which follows
 * whichever `[data-shape]` section sits under the middle of the viewport.
 *   0 torus knot · 1 flythrough tunnel · 2 data wave · 3 double helix
 *   4 lattice cube · 5 starfield
 */

const SHAPES = 6;
const TUNNEL_LENGTH = 36;
// Where each shape sits on screen (x, y), so it frames the text instead of covering it.
const OFFSETS: [number, number][] = [
  [1.9, 0.1],
  [0, 0],
  [0, -1.1],
  [2.3, 0],
  [2.2, 0],
  [0, 0],
];

const vertex = /* glsl */ `
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute vec3 p5;
  attribute float aRand;
  uniform float uShape;
  uniform float uTime;
  uniform float uSize;
  uniform float uMaxSize;
  uniform float uAspect;
  uniform float uSpread;
  uniform vec2 uMouse;
  uniform vec2 uOff[${SHAPES}];
  varying float vRand;
  varying float vAlpha;
  varying float vGlow;

  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }

  void main() {
    float w0 = max(0.0, 1.0 - abs(uShape - 0.0));
    float w1 = max(0.0, 1.0 - abs(uShape - 1.0));
    float w2 = max(0.0, 1.0 - abs(uShape - 2.0));
    float w3 = max(0.0, 1.0 - abs(uShape - 3.0));
    float w4 = max(0.0, 1.0 - abs(uShape - 4.0));
    float w5 = max(0.0, 1.0 - abs(uShape - 5.0));

    // Each shape gets its own motion before blending.
    vec3 s0 = rotX(rotY(position, uTime * 0.12), 0.35 + sin(uTime * 0.2) * 0.1);
    // Tunnel: particles stream slowly toward the camera, wrapping at the far end.
    float a = atan(p1.y, p1.x) + uTime * 0.03;
    float rr = length(p1.xy);
    vec3 s1 = vec3(cos(a) * rr, sin(a) * rr, mod(p1.z + uTime * 0.6, ${TUNNEL_LENGTH}.0) - ${TUNNEL_LENGTH - 6}.0);
    vec3 s2 = p2;
    s2.y += sin(p2.x * 1.3 + uTime * 0.9) * 0.22 + cos(p2.z * 1.7 + uTime * 0.6) * 0.18;
    vec3 s3 = rotX(rotY(p3, uTime * 0.35), 0.25);
    vec3 s4 = rotX(rotY(p4, uTime * 0.15 + 0.6), 0.5);
    vec3 s5 = rotY(p5, uTime * 0.02);

    vec3 p = s0*w0 + s1*w1 + s2*w2 + s3*w3 + s4*w4 + s5*w5;
    // Mid-morph particles scatter a little, then settle.
    float between = 1.0 - max(max(max(w0, w1), max(w2, w3)), max(w4, w5));
    p += (vec3(fract(aRand * 13.1), fract(aRand * 71.7), fract(aRand * 37.3)) - 0.5) * between * 2.5;
    p += 0.025 * vec3(sin(uTime * 0.8 + aRand * 40.0), cos(uTime * 0.7 + aRand * 30.0), sin(uTime * 0.6 + aRand * 20.0));

    vec2 off = uOff[0]*w0 + uOff[1]*w1 + uOff[2]*w2 + uOff[3]*w3 + uOff[4]*w4 + uOff[5]*w5;
    p.xy += off * uSpread;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // Push particles away from the cursor in screen space.
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    d.x *= uAspect;
    float dist = length(d);
    float push = smoothstep(0.28, 0.0, dist) * 0.12;
    vGlow = smoothstep(0.32, 0.05, dist);
    clip.xy += normalize(d + 1e-5) * push * clip.w;

    gl_Position = clip;
    gl_PointSize = min(uSize * (0.45 + aRand) / -mv.z, uMaxSize) * (1.0 + vGlow * 0.8);
    vRand = aRand;
    vAlpha = smoothstep(14.0 + w1 * 6.0, 3.0, -mv.z) * smoothstep(0.3, 1.8, -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vRand;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Accent particles, plus any particle the cursor is near, light up.
    float lit = max(step(0.86, vRand), vGlow);
    vec3 color = mix(uInk, uAccent, lit);
    gl_FragColor = vec4(color, smoothstep(0.5, 0.15, d) * vAlpha * uOpacity * mix(0.7, 1.0, lit));
  }
`;

const rand = () => Math.random();
const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;

function buildShapes(n: number) {
  const out = Array.from({ length: SHAPES }, () => new Float32Array(n * 3));
  const set = (s: number, i: number, x: number, y: number, z: number) => {
    out[s][i * 3] = x;
    out[s][i * 3 + 1] = y;
    out[s][i * 3 + 2] = z;
  };
  const side = Math.ceil(Math.cbrt(n / 3));

  for (let i = 0; i < n; i++) {
    // 0: (2,3) torus knot with a fuzzy tube
    const t = rand() * Math.PI * 2;
    const r = Math.cos(3 * t) + 2.2;
    set(0, i, 0.62 * (r * Math.cos(2 * t) + gauss() * 0.35), 0.62 * (r * Math.sin(2 * t) + gauss() * 0.35), 0.62 * (-Math.sin(3 * t) * 1.2 + gauss() * 0.35));

    // 1: tunnel: a ring of particles around the flight path, plus a sparse core
    const ta = rand() * Math.PI * 2;
    const tr = 2.9 + gauss() * 0.7;
    set(1, i, Math.cos(ta) * tr * 1.4, Math.sin(ta) * tr, rand() * TUNNEL_LENGTH);

    // 2: grid of samples on a wide plane
    const gx = (i % 160) / 159;
    const gz = Math.floor(i / 160) / Math.ceil(n / 160);
    set(2, i, (gx - 0.5) * 11, 0, (gz - 0.5) * 6 + 0.5);

    // 3: double helix with rungs
    const h = rand();
    const a = h * Math.PI * 7;
    const y = (h - 0.5) * 5.2;
    if (rand() < 0.22) {
      const k = rand();
      set(3, i, Math.cos(a) * 0.95 * (1 - 2 * k), y, Math.sin(a) * 0.95 * (1 - 2 * k));
    } else {
      const strand = rand() < 0.5 ? 0 : Math.PI;
      set(3, i, Math.cos(a + strand) * 0.95 + gauss() * 0.06, y + gauss() * 0.06, Math.sin(a + strand) * 0.95 + gauss() * 0.06);
    }

    // 4: lattice cube, three particles per node
    const node = Math.floor(i / 3);
    const lx = node % side;
    const ly = Math.floor(node / side) % side;
    const lz = Math.floor(node / (side * side)) % side;
    const step = 2.6 / (side - 1);
    set(4, i, -1.3 + lx * step + gauss() * 0.03, -1.3 + ly * step + gauss() * 0.03, -1.3 + lz * step + gauss() * 0.03);

    // 5: starfield
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const rad = 2 + Math.pow(rand(), 0.5) * 6;
    const q = Math.sqrt(1 - u * u);
    set(5, i, q * Math.cos(phi) * rad * 1.6, u * rad, q * Math.sin(phi) * rad - 2);
  }
  return out;
}

export function Scene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 768;
    const count = narrow ? 9000 : 18000;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 6.5);

    const shapes = buildShapes(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    for (let s = 1; s < SHAPES; s++) geometry.setAttribute(`p${s}`, new THREE.BufferAttribute(shapes[s], 3));
    const rands = new Float32Array(count);
    for (let i = 0; i < count; i++) rands[i] = rand();
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));

    const uniforms = {
      uShape: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 26 * renderer.getPixelRatio() },
      uMaxSize: { value: 7 * renderer.getPixelRatio() },
      uAspect: { value: 1 },
      uSpread: { value: 1 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uOff: { value: OFFSETS.map(([x, y]) => new THREE.Vector2(x, y)) },
      uInk: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uOpacity: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      uniforms.uInk.value.set(s.getPropertyValue("--ink").trim());
      uniforms.uAccent.value.set(s.getPropertyValue("--accent").trim());
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = w / h;
      // On tall screens, pull shapes back to centre so they stay in frame.
      uniforms.uSpread.value = Math.min(1, (w / h) / 1.6);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 9, y: 9, tx: 9, ty: 9, px: 0, py: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-shape]"));
    const targetShape = () => {
      const mid = window.innerHeight / 2;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) return Number(s.dataset.shape);
      }
      return uniforms.uShape.value;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduced) uniforms.uTime.value += dt;
      const target = targetShape();
      uniforms.uShape.value += (target - uniforms.uShape.value) * (reduced ? 1 : Math.min(1, dt * 2.2));
      // Narrow screens put text on top of the shapes, so keep them faint there.
      // Fade out entirely in the project flythrough (shape 1), which has its own scene.
      const targetOpacity = (window.innerWidth < 768 ? 0.35 : 1) * Math.min(1, Math.abs(uniforms.uShape.value - 1) * 1.5);
      uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * Math.min(1, dt * 1.2);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      // Gentle camera parallax toward the cursor.
      const mx = Math.abs(mouse.tx) > 1 ? 0 : mouse.tx;
      const my = Math.abs(mouse.ty) > 1 ? 0 : mouse.ty;
      mouse.px += (mx * 0.35 - mouse.px) * 0.04;
      mouse.py += (my * 0.25 - mouse.py) * 0.04;
      camera.position.x = mouse.px;
      camera.position.y = mouse.py;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    const onVisibility = () => {
      running = !document.hidden;
      clock.getDelta();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 [&>canvas]:size-full" />;
}
