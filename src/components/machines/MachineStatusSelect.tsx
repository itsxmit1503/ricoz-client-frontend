"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { MachineStatus } from "@/types/machine";

interface Props {
  value: MachineStatus;
  options: readonly { value: MachineStatus; label: string; dot: string }[];
  onChange: (value: MachineStatus) => void;
  disabled?: boolean;
}

export default function MachineStatusSelect({ value, options, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const buttonId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectIndex(index: number) {
    const option = options[index];
    if (!option) return;
    setActiveIndex(index);
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + direction + options.length) % options.length;
      setActiveIndex(next);
      setOpen(true);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      setOpen(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) selectIndex(activeIndex);
      else {
        setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        setOpen(true);
      }
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        role="combobox"
        id={buttonId}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${listboxId}-${options[activeIndex]?.value}` : undefined}
        aria-label="Status"
        onClick={() => {
          setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-slate-700/90 bg-slate-950/50 px-3 text-left text-sm text-slate-100 transition duration-200 ease-out hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
      >
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${selected.dot}`} />
          {selected.label}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Machine status options"
          className="ui-dropdown-enter absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-700/90 bg-slate-900 p-1.5 shadow-xl shadow-black/30"
        >
          {options.map((option, index) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                id={`${listboxId}-${option.value}`}
                onClick={() => selectIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-150 motion-reduce:transition-none ${
                  index === activeIndex ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                  {option.label}
                </span>
                {option.value === value && <Check className="h-4 w-4 text-blue-300" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
