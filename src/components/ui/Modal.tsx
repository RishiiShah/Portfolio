"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
const EXIT_ANIMATION_MS = 400;

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [renderTitle, setRenderTitle] = useState(title);
  const [renderChildren, setRenderChildren] = useState(children);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRenderTitle(title);
    setRenderChildren(children);
  }, [children, isOpen, title]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (!shouldRender) {
      return;
    }

    setIsClosing(true);
    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, EXIT_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const elements = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-70 flex items-center justify-center p-4 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={renderTitle}
        className={`relative z-71 w-full max-w-2xl rounded-xl border border-foreground/15 bg-background/95 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${isClosing ? "animate-fade-out-down" : "animate-fade-in-up"}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-foreground/10 pb-3">
          <h3 className="text-base sm:text-lg font-semibold">{renderTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-foreground/20 px-3 py-1.5 text-xs font-medium transition-[transform,background-color,border-color,color] duration-300 ease-out hover:bg-foreground/5 hover:border-foreground/30 hover:scale-[1.02] active:scale-95"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{renderChildren}</div>
      </div>
    </div>
  );
}
