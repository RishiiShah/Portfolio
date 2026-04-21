"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertex = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;    // 0..1
  uniform vec3  uAccent;   // periwinkle
  uniform vec3  uWarm;     // sand
  uniform vec3  uBg;       // bg color

  varying vec2 vUv;

  // Simplex-ish noise (cheap)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                  + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // fractal brownian motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * asp;

    // mouse offset creates a soft distortion origin
    vec2 mouse = (uMouse - 0.5) * asp;
    vec2 q = p - mouse * 0.3;

    float t = uTime * 0.06;

    // domain-warped fbm flow field
    vec2 warp;
    warp.x = fbm(q + vec2( 0.0,  0.0) + t);
    warp.y = fbm(q + vec2( 5.2,  1.3) + t);

    float field = fbm(q * 1.2 + warp * 1.5 + t * 0.5);
    field = smoothstep(-0.6, 0.8, field);

    // separate band for warm highlight
    float warmBand = smoothstep(0.55, 0.95, field + 0.25 * fbm(q * 2.0 + t));

    // Distance-to-mouse spotlight
    float md = length(p - mouse);
    float spot = smoothstep(0.9, 0.0, md) * 0.18;

    // Compose colors
    vec3 col = uBg;
    col = mix(col, uAccent * 0.65, field * 0.55);
    col = mix(col, uWarm * 0.9, warmBand * 0.35);
    col += uAccent * spot;

    // Vignette
    float vig = smoothstep(1.35, 0.2, length(uv - 0.5));
    col *= mix(0.65, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function HeroShader({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const setStaticBackdrop = () => {
      wrap.style.background =
        "radial-gradient(ellipse at 30% 30%, rgba(122,162,255,0.18), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(230,185,128,0.12), transparent 60%), #07090F";
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const smallScreen = window.matchMedia("(max-width: 1024px)").matches;
    const webglAvailable =
      typeof window.WebGLRenderingContext !== "undefined" ||
      typeof window.WebGL2RenderingContext !== "undefined";

    if (reduce || coarsePointer || smallScreen || !webglAvailable) {
      setStaticBackdrop();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    wrap.appendChild(canvas);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio, 1.25),
        antialias: false,
        alpha: false,
      });
    } catch {
      canvas.remove();
      setStaticBackdrop();
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(7 / 255, 9 / 255, 15 / 255, 1);

    const geometry = new Triangle(gl);
    let program: Program;
    let mesh: Mesh;
    try {
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [wrap.clientWidth, wrap.clientHeight] },
          uMouse: { value: [0.5, 0.5] },
          uAccent: { value: [0.478, 0.635, 1.0] },
          uWarm: { value: [0.902, 0.725, 0.502] },
          uBg: { value: [0.027, 0.035, 0.059] },
        },
      });
      mesh = new Mesh(gl, { geometry, program });
    } catch {
      canvas.remove();
      setStaticBackdrop();
      return;
    }

    function resize() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    }
    resize();
    window.addEventListener("resize", resize);

    // mouse tracking (scoped to wrapper)
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      const rect = wrap!.getBoundingClientRect();
      targetMouse.x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      targetMouse.y = Math.min(Math.max(1 - (e.clientY - rect.top) / rect.height, 0), 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let isVisible = true;

    // Pause rAF when Hero out of viewport
    const hasIntersectionObserver =
      typeof window.IntersectionObserver !== "undefined";
    const io = hasIntersectionObserver
      ? new IntersectionObserver(
          (entries) => {
            isVisible = entries[0]?.isIntersecting ?? true;
            if (isVisible && !raf) start();
          },
          { threshold: 0 }
        )
      : null;
    io?.observe(wrap);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      io?.disconnect();
      canvas.remove();
    };

    function loop(t: number) {
      // Lerp mouse
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;
      program.uniforms.uMouse.value = [currentMouse.x, currentMouse.y];
      program.uniforms.uTime.value = t * 0.001;
      try {
        renderer.render({ scene: mesh });
      } catch {
        raf = 0;
        cleanup();
        setStaticBackdrop();
        return;
      }
      if (isVisible) raf = requestAnimationFrame(loop);
      else raf = 0;
    }

    function start() {
      raf = requestAnimationFrame(loop);
    }
    start();

    return () => {
      cleanup();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
