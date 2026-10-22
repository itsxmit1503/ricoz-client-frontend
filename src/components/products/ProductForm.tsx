"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PRODUCT_TYPES, UNIT_SUGGESTIONS, type ProductInput } from "@/types/product";

type Errors = Partial<Record<"name" | "code" | "type" | "unit", string>>;

const EMPTY: ProductInput = { name: "", code: "", type: "" as ProductInput["type"], unit: "PCS", isActive: true };

interface Props {
  initial?: ProductInput;
  submitLabel: string;
  onSubmit: (values: ProductInput) => Promise<void>;
}

/** Shared by Add Product and Edit Product. */
export default function ProductForm({ initial = EMPTY, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<ProductInput>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Product name is required";
    if (!form.code.trim()) next.code = "Product code is required";
    else if (!/^[A-Za-z0-9_-]+$/.test(form.code.trim())) next.code = "Use letters, numbers, - or _ only";
    if (!form.type) next.type = "Select a product type";
    if (!form.unit.trim()) next.unit = "Unit is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        type: form.type,
        unit: form.unit.trim().toUpperCase(),
        isActive: form.isActive,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-slate-800/90 bg-slate-900/95 p-5 shadow-xl shadow-black/20 sm:p-7"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Product Specifications
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Define item classification, identification SKU, and default inventory measuring units.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Product Name"
              placeholder="e.g. High-Grade Aluminum Billet 50mm"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
            />
          </div>

          <Input
            label="Product SKU Code"
            placeholder="e.g. RM-ALU-001"
            className="uppercase font-mono"
            value={form.code}
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            error={errors.code}
          />

          <Select
            label="Product Classification"
            value={form.type}
            onChange={(e) => update("type", e.target.value as ProductInput["type"])}
            error={errors.type}
          >
            <option value="" disabled>Select classification…</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>

          <div>
            <Input
              label="Measurement Unit"
              list="unit-suggestions"
              placeholder="PCS"
              className="uppercase font-mono"
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              error={errors.unit}
            />
            <datalist id="unit-suggestions">
              {UNIT_SUGGESTIONS.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>

          <div className="flex items-end">
            <label className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3.5 text-xs font-medium text-slate-200 transition duration-150 hover:border-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-blue-600 focus:ring-blue-500"
              />
              <span>Active in Manufacturing Operations</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800/80 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/products"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 px-5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Cancel
        </Link>
        <Button type="submit" loading={submitting} className="sm:w-auto sm:px-8">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
