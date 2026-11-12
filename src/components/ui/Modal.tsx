"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  focusWithoutScroll,
  getFocusableElements,
  isTopmostLayer,
  lockBodyScroll,
} from "./focus";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, title, onClose, children, wide = false }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // Track client hydration for portal
  const [hasMounted, setHasMounted] = useState(false);
  // Keep modal in DOM during exit animation (220ms)
  const [mounted, setMounted] = useState(open);
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>(children);
  const [renderedTitle, setRenderedTitle] = useState(title);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setRenderedChildren(children);
      setRenderedTitle(title);
    } else {
      const timeout = window.setTimeout(() => setMounted(false), 220);
      return () => window.clearTimeout(timeout);
    }
  }, [open, children, title]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const releaseBodyScroll = lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || !isTopmostLayer(dialog)) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusableElements(dialog);
      if (!focusable.length) {
        event.preventDefault();
        focusWithoutScroll(dialog);
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        focusWithoutScroll(last);
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        focusWithoutScroll(first);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => focusWithoutScroll(closeButtonRef.current));

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      releaseBodyScroll();
      requestAnimationFrame(() => {
        if (previouslyFocusedRef.current?.isConnected) {
          focusWithoutScroll(previouslyFocusedRef.current);
        }
      });
    };
  }, [open]);

  if (!hasMounted || (!mounted && !open)) return null;

  const content = (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto theme-scrollbar"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      {/* Full-viewport backdrop dimming sidebar and top header */}
      <div
        className={`ui-dialog-backdrop fixed inset-0 bg-black/80 backdrop-blur-xs ${
          open ? "ui-dialog-backdrop-enter" : "ui-dialog-backdrop-exit"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering wrapper preventing top clipping on all viewport heights */}
      <div className="flex min-h-full items-center justify-center p-2.5 sm:p-6 text-center">
        <div
          className={`ui-dialog-panel ${
            open ? "ui-dialog-panel-enter" : "ui-dialog-panel-exit"
          } relative my-auto flex flex-col w-full ${
            wide ? "max-w-2xl" : "max-w-lg"
          } max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] rounded-xl border border-slate-700/80 bg-[#0c111e] shadow-2xl shadow-black/80 text-left overflow-hidden`}
        >
          {/* Header - Fixed & sticky, permanently visible with Title and Close button */}
          <div className="shrink-0 flex items-center justify-between border-b border-slate-800/80 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#090d16]">
            <h2 id={titleId} className="text-base font-semibold text-white tracking-tight">
              {renderedTitle}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="ui-pressable rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content - Smooth internal scrolling */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 theme-scrollbar">
            {renderedChildren}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
