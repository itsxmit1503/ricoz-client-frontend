const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let bodyScrollLocks = 0;
let previousBodyOverflow = "";

export function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.getAttribute("aria-hidden") !== "true",
  );
}

export function isTopmostLayer(container: HTMLElement) {
  const layers = document.querySelectorAll<HTMLElement>('[role="dialog"]');
  return layers[layers.length - 1] === container;
}

export function lockBodyScroll() {
  if (bodyScrollLocks === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  bodyScrollLocks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    bodyScrollLocks -= 1;
    if (bodyScrollLocks === 0) {
      document.body.style.overflow = previousBodyOverflow;
    }
  };
}

export function focusWithoutScroll(element: HTMLElement | null) {
  element?.focus({ preventScroll: true });
}
