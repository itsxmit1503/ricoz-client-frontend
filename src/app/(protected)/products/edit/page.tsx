"use client";

import { ArrowLeft, Pencil, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ProductForm from "@/components/products/ProductForm";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useProducts } from "@/hooks/useProducts";
import { productService } from "@/services/product.service";
import { productTypeLabel, type Product, type ProductInput } from "@/types/product";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** /products/edit  -> pick a product.   /products/edit?id=<id> -> edit it. */
function ProductPicker() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [products, search]);

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
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-blue-400">Products</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Select Product</h1>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <Input
          label=""
          aria-label="Search products"
          icon={Search}
          placeholder="Search by product name or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-black/20">
        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-6 w-6 text-blue-400" /></div>
        ) : error ? (
          <p className="p-8 text-center text-xs text-red-400">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-xs text-slate-400">No catalog products found matching your search.</p>
        ) : (
          filtered.map((p) => (
            <Link
              key={p._id}
              href={`/products/edit?id=${p._id}`}
              className="ui-table-row flex items-center justify-between gap-4 px-5 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div>
                <p className="font-semibold text-sm text-slate-200">{p.name}</p>
                <p className="font-mono text-xs text-blue-300">{p.code}</p>
              </div>
              <span className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                {productTypeLabel(p.type)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function EditProduct({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    productService
      .get(id)
      .then((data) => active && setProduct(data))
      .catch((err) => active && setError(getErrorMessage(err, "Could not load product.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleUpdate(values: ProductInput) {
    try {
      const updated = await productService.update(id, values);
      toast.success(`${updated.code} updated`);
      router.push("/products");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update product."));
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
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-blue-400">Products</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Edit Product</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>
      ) : error || !product ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-xs text-red-200">
          {error ?? "Product specification not found."}{" "}
          <Link href="/products/edit" className="font-semibold underline ml-1 text-red-300">
            Choose another product
          </Link>
        </div>
      ) : (
        <ProductForm
          initial={{
            name: product.name,
            code: product.code,
            type: product.type,
            unit: product.unit,
            isActive: product.isActive,
          }}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}

export default function EditProductPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <Suspense fallback={<div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>}>
      {id ? <EditProduct id={id} /> : <ProductPicker />}
    </Suspense>
  );
}
