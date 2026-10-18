/**
 * One hue per project for the Selected work objects and their cards:
 * a bright variant for the dark theme and a deeper one that reads on the light paper.
 */
export const HUES: Record<string, { dark: string; light: string }> = {
  cerevia: { dark: "#34d3a0", light: "#0b8a63" },
  planyt: { dark: "#4cc3ff", light: "#0a74b8" },
  csegraph: { dark: "#8a93ff", light: "#3340e6" },
  "snap-interview": { dark: "#ff7a93", light: "#d0244a" },
  "traffic-violation-detection": { dark: "#ffb547", light: "#b86a00" },
  "wgan-gp-financial-timeseries": { dark: "#e27bff", light: "#a12fc7" },
  "jarvis-voice-assistant": { dark: "#3fe0e8", light: "#06808a" },
  "music-genre-detection": { dark: "#b5ea4a", light: "#5a8a0c" },
};

export const hueOf = (slug: string) => HUES[slug] ?? HUES.csegraph;
