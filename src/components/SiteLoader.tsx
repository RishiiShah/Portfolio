"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 1500;
const loaderEase = [0.16, 1, 0.3, 1] as const;

export function SiteLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const startedAt = window.performance.now();
    let delayTimer = 0;
    let hideTimer = 0;
    let maxTimer = 0;
    let raf = 0;
    let finished = false;

    const hide = () => {
      setVisible(false);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(maxTimer);

      const elapsed = window.performance.now() - startedAt;
      const remaining = reduce ? 0 : Math.max(MIN_VISIBLE_MS - elapsed, 0);
      hideTimer = window.setTimeout(hide, remaining);
    };

    const onLoad = () => finish();

    if (document.readyState === "complete") {
      raf = window.requestAnimationFrame(() => {
        delayTimer = window.setTimeout(finish, reduce ? 0 : 120);
      });
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    maxTimer = window.setTimeout(finish, reduce ? 250 : MAX_VISIBLE_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(delayTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [reduce]);

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <m.div
          role="status"
          aria-label="Loading portfolio"
          className="site-loader fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.01, filter: "blur(8px)" }
          }
          transition={{ duration: reduce ? 0.01 : 0.55, ease: loaderEase }}
        >
          <div className="site-loader__field" aria-hidden />
          <div className="site-loader__content">
            <div className="site-loader__mark" aria-hidden>
              <span>RS</span>
            </div>
            <div className="site-loader__label" aria-hidden>
              signal warmup
            </div>
            <div className="site-loader__bar" aria-hidden />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
