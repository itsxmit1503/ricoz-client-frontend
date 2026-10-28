"use client";

import { ChevronRight, Pencil, Plus, RefreshCw, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PurchaseOrderForm, {
  emptyPurchaseOrderForm,
  purchaseOrderToForm,
} from "@/components/purchase/PurchaseOrderForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import StatusFilterCards from "@/components/ui/StatusFilterCards";
import { useAuth } from "@/hooks/useAuth";
import { useList } from "@/hooks/useList";
import { productService } from "@/services/product.service";
import { purchaseOrderService } from "@/services/purchaseOrder.service";
import { supplierService } from "@/services/supplier.service";
import { findMeta } from "@/types/common";
import {
  orderTotal,
  PO_STATUSES,
  type PurchaseOrder,
  type PurchaseOrderInput,
  type PurchaseOrderStatus,
} from "@/types/purchase";
import { formatDate, formatMoney, isOverdue, nextNumber } from "@/utils/format";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** One-click "next step" per status. Partial receipts and cancelling are done from Edit. */
const NEXT_STEP: Partial<Record<PurchaseOrderStatus, { label: string; to: PurchaseOrderStatus }>> = {
  DRAFT: { label: "Place order", to: "ORDERED" },
  ORDERED: { label: "Mark received", to: "RECEIVED" },
  PARTIAL: { label: "Mark received", to: "RECEIVED" },
};

const LOCKED_FOR_DELETE: PurchaseOrderStatus[] = ["RECEIVED", "PARTIAL"];

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const orders = useList(purchaseOrderService.list, "Could not load purchase orders.");
  const suppliers = useList(supplierService.list, "Could not load suppliers.");
  const products = useList(productService.list, "Could not load products.");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState<"new" | PurchaseOrder | null>(null);
  const [toDelete, setToDelete] = useState<PurchaseOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const ready = !orders.loading && !suppliers.loading && !products.loading;

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.items.forEach((o) => (map[o.status] = (map[o.status] ?? 0) + 1));
    return map;
  }, [orders.items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.items.filter(
      (o) =>
        (!q ||
          o.poNumber.toLowerCase().includes(q) ||
          (o.supplier?.name ?? "").toLowerCase().includes(q) ||
          (o.supplier?.code ?? "").toLowerCase().includes(q) ||
          o.items.some((i) => (i.product?.name ?? "").toLowerCase().includes(q))) &&
        (!statusFilter || o.status === statusFilter),
    );
  }, [orders.items, search, statusFilter]);

  const suggestedNumber = useMemo(() => nextNumber("PO", orders.items.map((o) => o.poNumber)), [orders.items]);

  async function handleSave(values: PurchaseOrderInput) {
    const editing = modal !== null && modal !== "new" ? modal : null;
    try {
      if (editing) {
        await purchaseOrderService.update(editing._id, values);
        toast.success(`${values.poNumber} updated`);
      } else {
        await purchaseOrderService.create({ ...values, createdBy: user?._id });
        toast.success(`${values.poNumber} created`);
      }
      setModal(null);
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save purchase order."));
    }
  }

  async function advance(order: PurchaseOrder, to: PurchaseOrderStatus) {
    setBusyId(order._id);
    try {
      await purchaseOrderService.update(order._id, { status: to });
      toast.success(`${order.poNumber} → ${findMeta(PO_STATUSES, to).label}`);
      orders.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change status."));
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await purchaseOrderService.remove(toDelete._id);
      orders.setItems((list) => list.filter((o) => o._id !== toDelete._id));
      toast.success(`${toDelete.poNumber} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete purchase order."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="ui-page-enter mx-auto max-w-7xl space-y-6">
      {/* Header Deck */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-blue-400">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Procurement & Orders
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Purchase Orders (PO)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {orders.loading ? "Loading purchase orders…" : `${filtered.length} of ${orders.items.length} orders tracked`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:border-slate-600 hover:bg-[#192235] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Purchase Order
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <StatusFilterCards options={PO_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

      {/* Search Input */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4">
        <Input
          label=""
          aria-label="Search purchase orders"
          icon={Search}
          placeholder="Search by PO code, vendor name, or component product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Purchase Orders Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-xl">
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading purchase order log…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-rose-400">{orders.error}</p>
            <button
              onClick={orders.reload}
              className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300"
            >
              Retry loading
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#080d17] text-slate-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No purchase orders found</h3>
            <p className="mt-1 text-xs text-slate-300">
              {orders.items.length ? "No orders match your filter criteria." : "Issue your first material purchase order to a certified vendor."}
            </p>
            {!orders.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create first PO
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] text-xs font-semibold uppercase tracking-wider text-slate-300">
                <tr>
                  <th className="w-10 px-3 py-3.5" />
                  <th className="px-5 py-3.5">PO Number</th>
                  <th className="px-5 py-3.5">Certified Supplier</th>
                  <th className="px-5 py-3.5 text-right">Items</th>
                  <th className="px-5 py-3.5 text-right">Order Total</th>
                  <th className="px-5 py-3.5">Issued Date</th>
                  <th className="px-5 py-3.5">Expected Receipt</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((o) => {
                  const open = expanded === o._id;
                  const overdue = isOverdue(o.expectedDate, o.status);
                  const next = NEXT_STEP[o.status];
                  const locked = LOCKED_FOR_DELETE.includes(o.status);
                  return (
                    <Fragment key={o._id}>
                      <tr className="ui-table-row">
                        <td className="px-3 py-3.5">
                          <button
                            onClick={() => setExpanded(open ? null : o._id)}
                            aria-label={open ? "Hide items" : "Show items"}
                            aria-expanded={open}
                            className="rounded p-1 text-slate-400 hover:bg-[#151c2d] hover:text-white"
                          >
                            <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
                          </button>
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-blue-300">
                          {o.poNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          {o.supplier ? (
                            <>
                              <p className="font-semibold text-white">{o.supplier.name}</p>
                              <p className="font-mono text-xs text-blue-300">{o.supplier.code}</p>
                            </>
                          ) : (
                            <span className="text-slate-400 font-medium">Deleted supplier reference</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-200">
                          {o.items.length}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-white">
                          {formatMoney(orderTotal(o.items))}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-300">
                          {formatDate(o.orderDate)}
                        </td>
                        <td className={`px-5 py-3.5 font-mono ${overdue ? "font-bold text-rose-400" : "text-slate-200"}`}>
                          {formatDate(o.expectedDate)}
                          {overdue && <span className="ml-2 text-[10px] uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1 rounded border border-rose-500/20 font-sans">overdue</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge meta={findMeta(PO_STATUSES, o.status)} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {next && (
                              <button
                                onClick={() => advance(o, next.to)}
                                disabled={busyId === o._id}
                                className="mr-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 bg-[#121826] px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                              >
                                {busyId === o._id && <Spinner className="h-3 w-3" />}
                                {next.label}
                              </button>
                            )}
                            <button
                              onClick={() => setModal(o)}
                              aria-label={`Edit ${o.poNumber}`}
                              title="Edit purchase order"
                              className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setToDelete(o)}
                              disabled={locked}
                              aria-label={`Delete ${o.poNumber}`}
                              title={locked ? "Received orders cannot be deleted" : "Delete order"}
                              className="rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {open && (
                        <tr className="bg-[#080d17]">
                          <td />
                          <td colSpan={8} className="px-5 py-4">
                            <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-4 max-w-3xl">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                                Ordered Line Items ({o.items.length} parts)
                              </h4>
                              <table className="w-full text-xs">
                                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                  <tr>
                                    <th className="pb-2 text-left">Component Part</th>
                                    <th className="pb-2 text-right">Order Qty</th>
                                    <th className="pb-2 text-right">Contract Unit Price</th>
                                    <th className="pb-2 text-right">Line Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                  {o.items.map((i, idx) => (
                                    <tr key={i._id ?? idx}>
                                      <td className="py-2 text-slate-200 font-sans">
                                        {i.product ? (
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{i.product.name}</span>
                                            <span className="font-mono text-xs text-blue-300">[{i.product.code}]</span>
                                          </div>
                                        ) : (
                                          <span className="text-slate-400">Deleted component</span>
                                        )}
                                      </td>
                                      <td className="py-2 text-right text-slate-100 font-bold">
                                        {i.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-300 font-sans">{i.product?.unit}</span>
                                      </td>
                                      <td className="py-2 text-right text-slate-300">
                                        {formatMoney(i.unitPrice)}
                                      </td>
                                      <td className="py-2 text-right text-white font-bold">
                                        {formatMoney(i.quantity * i.unitPrice)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal !== null} wide title={modal === "new" ? "New Purchase Order" : "Edit Purchase Order"} onClose={() => setModal(null)}>
        {modal !== null && (
          <PurchaseOrderForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyPurchaseOrderForm(suggestedNumber) : purchaseOrderToForm(modal)}
            suppliers={suppliers.items}
            products={products.items}
            submitLabel={modal === "new" ? "Issue order" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Purchase Order?"
        message={`${toDelete?.poNumber} will be permanently removed. This action cannot be reversed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
