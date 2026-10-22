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
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        selectIndex(activeIndex);
      }
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        id={buttonId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? `${listboxId}-${options[activeIndex]?.value}` : undefined}
        aria-label="Status"
        onClick={() => {
          setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        className="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 text-left text-xs font-semibold text-slate-100 transition duration-150 ease-out hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${selected.dot}`} />
          {selected.label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Machine status options"
          className="ui-dropdown-enter absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-slate-700/80 bg-slate-900 p-1 shadow-xl shadow-black/40"
        >
          {options.map((option, index) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                id={`${listboxId}-${option.value}`}
                onClick={() => selectIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex min-h-8 w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  index === activeIndex ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                  {option.label}
                </span>
                {option.value === value && <Check className="h-3.5 w-3.5 text-blue-400" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
