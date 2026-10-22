"use client";

import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductForm from "@/components/products/ProductForm";
import { productService } from "@/services/product.service";
import type { ProductInput } from "@/types/product";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function AddProductPage() {
  const router = useRouter();

  async function handleCreate(values: ProductInput) {
    try {
      const product = await productService.create(values);
      toast.success(`${product.code} registered to catalog`);
      router.push("/products");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create product."));
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
            <PackagePlus className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-blue-400">Products</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">New Product</h1>
          </div>
        </div>
      </div>

      <ProductForm submitLabel="Create Product" onSubmit={handleCreate} />
    </div>
  );
}
