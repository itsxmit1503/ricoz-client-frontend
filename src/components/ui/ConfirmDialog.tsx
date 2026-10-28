"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import Button from "./Button";
import { focusWithoutScroll, getFocusableElements, isTopmostLayer, lockBodyScroll } from "./focus";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(Boolean(loading));
  const titleId = useId();

  const [mounted, setMounted] = useState(open);
  const [renderedTitle, setRenderedTitle] = useState(title);
  const [renderedMessage, setRenderedMessage] = useState(message);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setRenderedTitle(title);
      setRenderedMessage(message);
    } else {
      const timeout = window.setTimeout(() => setMounted(false), 220);
      return () => window.clearTimeout(timeout);
    }
  }, [open, title, message]);

  useEffect(() => {
    onCancelRef.current = onCancel;
    loadingRef.current = Boolean(loading);
  }, [loading, onCancel]);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const releaseBodyScroll = lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || !isTopmostLayer(dialog)) return;

      if (event.key === "Escape") {
        if (!loadingRef.current) {
          event.preventDefault();
          onCancelRef.current();
        }
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
    requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        const focusable = getFocusableElements(dialog);
        if (focusable.length) focusWithoutScroll(focusable[0]);
      }
    });

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

  if (!mounted && !open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div
        className={`ui-dialog-backdrop absolute inset-0 bg-black/80 backdrop-blur-xs ${
          open ? "ui-dialog-backdrop-enter" : "ui-dialog-backdrop-exit"
        }`}
        onClick={loading ? undefined : onCancel}
      />
      <div
        className={`ui-dialog-panel ${
          open ? "ui-dialog-panel-enter" : "ui-dialog-panel-exit"
        } relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700/90 bg-[#0c111e] p-5 shadow-2xl shadow-black/60 sm:p-6`}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <div>
            <h2 id={titleId} className="font-semibold text-white tracking-tight">
              {renderedTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{renderedMessage}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" className="w-auto" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button className="w-auto bg-red-600 hover:bg-red-500" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
