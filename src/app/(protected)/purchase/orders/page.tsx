"use client";

import { ChevronRight, Pencil, Plus, RefreshCw, Search, ShoppingCart, Trash2, X } from "lucide-react";
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

const LOCKED_FOR_DELETE: PurchaseOrderStatus[] = ["RECEIVED", "PARTIAL"]; // backend refuses these

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
      orders.reload(); // reload so supplier and product names come back populated
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
      toast.error(getErrorMessage(err, "Could not advance purchase order."));
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium text-blue-400">
              Purchasing
            </p>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Purchase Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {orders.loading ? "Loading purchase orders…" : `Displaying ${filtered.length} of ${orders.items.length} purchase orders`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2.5 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-blue-500/60 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-950/40 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> New Purchase Order
          </button>
        </div>
      </div>

      {/* Status Filter Cards */}
      <StatusFilterCards
        options={PO_STATUSES}
        counts={counts}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/70 p-3.5 shadow-sm sm:p-4">
        <div className="flex-1">
          <Input
            label=""
            aria-label="Search purchase orders"
            icon={Search}
            placeholder="Search by PO number, vendor name, code or line product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {(search || statusFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:border-slate-700 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Orders Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-xl shadow-black/20">
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-medium">Loading purchase orders…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-red-400">{orders.error}</p>
            <button onClick={orders.reload} className="mt-3 text-xs font-semibold text-blue-400 underline hover:text-blue-300">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-500">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-200">No purchase orders found</h3>
            <p className="mt-1 text-xs text-slate-400">
              {search || statusFilter ? "No orders matched your active filters." : "Create your first purchase order to get started."}
            </p>
            {!orders.items.length && ready && (
              <button
                onClick={() => setModal("new")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create Purchase Order
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/90 bg-slate-950/70 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="w-10 px-3 py-3.5" />
                  <th className="px-3 py-3.5">PO Number</th>
                  <th className="px-5 py-3.5">Supplier</th>
                  <th className="px-5 py-3.5 text-right">Line Items</th>
                  <th className="px-5 py-3.5 text-right">Total Amount</th>
                  <th className="px-5 py-3.5">Order Date</th>
                  <th className="px-5 py-3.5">Expected Delivery</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
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
                            aria-label={open ? "Hide line items" : "Show line items"}
                            aria-expanded={open}
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                          >
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                            />
                          </button>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <p className="font-mono font-medium text-blue-400">{o.poNumber}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {o.supplier ? (
                            <div>
                              <p className="font-medium text-slate-200">{o.supplier.name}</p>
                              <p className="font-mono text-[11px] text-slate-400">{o.supplier.code}</p>
                            </div>
                          ) : (
                            <span className="text-slate-500">Deleted supplier</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums text-slate-400">
                          {o.items.length} {o.items.length === 1 ? "line" : "lines"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-semibold text-slate-100 tabular-nums">
                          {formatMoney(orderTotal(o.items))}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-mono text-slate-400">
                          {formatDate(o.orderDate)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono ${overdue ? "font-semibold text-red-400" : "text-slate-300"}`}>
                              {formatDate(o.expectedDate)}
                            </span>
                            {overdue && (
                              <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.2 text-[9px] font-medium uppercase tracking-wider text-red-300">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <Badge meta={findMeta(PO_STATUSES, o.status)} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {next && (
                              <button
                                onClick={() => advance(o, next.to)}
                                disabled={busyId === o._id}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 px-2.5 py-1 text-xs font-medium text-blue-200 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
                              >
                                {busyId === o._id && <Spinner className="h-3 w-3" />}
                                <span>{next.label}</span>
                              </button>
                            )}
                            <button
                              onClick={() => setModal(o)}
                              aria-label={`Edit ${o.poNumber}`}
                              title="Edit purchase order"
                              className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setToDelete(o)}
                              disabled={locked}
                              title={locked ? "Received or partially received orders cannot be deleted" : "Delete purchase order"}
                              aria-label={`Delete ${o.poNumber}`}
                              className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable PO Line Items Sub-Table */}
                      {open && (
                        <tr className="bg-slate-950/70">
                          <td />
                          <td colSpan={8} className="px-4 py-4">
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 max-w-3xl">
                              <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-2.5">
                                Line Items
                              </h4>
                              <table className="w-full text-xs">
                                <thead className="border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400">
                                  <tr>
                                    <th className="pb-2 text-left font-medium">Product SKU / Name</th>
                                    <th className="pb-2 text-right font-medium">Purchased Qty</th>
                                    <th className="pb-2 text-right font-medium">Unit Price</th>
                                    <th className="pb-2 text-right font-medium">Line Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                  {o.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30">
                                      <td className="py-2 text-slate-200 font-sans">
                                        {item.product ? (
                                          <span>
                                            <span className="font-mono text-blue-400 font-medium">{item.product.code}</span>
                                            {" • "}
                                            {item.product.name}
                                          </span>
                                        ) : (
                                          <span className="text-slate-500">Product removed</span>
                                        )}
                                      </td>
                                      <td className="py-2 text-right text-slate-300">{item.quantity}</td>
                                      <td className="py-2 text-right text-slate-400">{formatMoney(item.unitPrice)}</td>
                                      <td className="py-2 text-right text-slate-100 font-semibold">
                                        {formatMoney(item.quantity * item.unitPrice)}
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

      <Modal
        open={modal !== null}
        wide
        title={modal === "new" ? "New Purchase Order" : "Edit Purchase Order"}
        onClose={() => setModal(null)}
      >
        {modal !== null && (
          <PurchaseOrderForm
            key={modal === "new" ? "new" : modal._id}
            initial={modal === "new" ? emptyPurchaseOrderForm(suggestedNumber) : purchaseOrderToForm(modal)}
            suppliers={suppliers.items}
            products={products.items}
            submitLabel={modal === "new" ? "Create Purchase Order" : "Save Changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete purchase order ${toDelete?.poNumber}?`}
        loading={deleting}
        confirmLabel="Delete Purchase Order"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
