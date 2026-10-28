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
    <div className="ui-page-enter mx-auto max-w-7xl space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded">
              PROCUREMENT // PURCHASE ORDERS
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="font-mono text-xs text-slate-300 font-semibold">
              {orders.loading ? "Loading…" : `${filtered.length} of ${orders.items.length} orders tracked`}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Material Procurement & Purchase Orders
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={orders.reload}
            disabled={orders.loading}
            aria-label="Refresh orders"
            title="Refresh orders"
            className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${orders.loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setModal("new")}
            disabled={!ready}
            className="ui-pressable inline-flex min-h-9.5 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> New Purchase Order
          </button>
        </div>
      </div>

      {/* Unified Procurement Console */}
      <div className="border border-slate-800/90 bg-[#0b101c] rounded-xl overflow-hidden shadow-xl">
        {/* Integrated Command Strip: Filter pills + Search */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080d17] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <StatusFilterCards options={PO_STATUSES} counts={counts} active={statusFilter} onChange={setStatusFilter} />

          <div className="w-full md:w-80">
            <Input
              label=""
              aria-label="Search purchase orders"
              icon={Search}
              placeholder="Search PO code, vendor, SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        {orders.loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-300">
            <Spinner className="h-7 w-7 text-blue-400" />
            <p className="mt-3 text-xs font-semibold">Querying procurement orders…</p>
          </div>
        ) : orders.error ? (
          <div className="p-12 text-center text-rose-400">{orders.error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">No purchase orders matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-[#080d17] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Purchase Order</th>
                  <th className="py-3 px-5">Certified Vendor</th>
                  <th className="py-3 px-5">Order Date</th>
                  <th className="py-3 px-5">Expected Delivery</th>
                  <th className="py-3 px-5 text-right">Total Value</th>
                  <th className="py-3 px-5">Procurement State</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map((po) => {
                  const isExp = expanded === po._id;
                  const step = NEXT_STEP[po.status];
                  const overdue = isOverdue(po.expectedDate, po.status);
                  const canDelete = !LOCKED_FOR_DELETE.includes(po.status);
                  const isBusy = busyId === po._id;

                  return (
                    <Fragment key={po._id}>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-white">
                          <button
                            type="button"
                            onClick={() => setExpanded(isExp ? null : po._id)}
                            className="flex items-center gap-2 hover:text-blue-400 transition"
                          >
                            <ChevronRight
                              className={`h-4 w-4 text-blue-400 transition-transform ${isExp ? "rotate-90" : ""}`}
                            />
                            <span>{po.poNumber}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-5 font-sans font-semibold text-slate-100">
                          {po.supplier ? (
                            <div>
                              <p className="font-semibold text-white">{po.supplier.name}</p>
                              <p className="font-mono text-xs text-blue-400">{po.supplier.code}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400">Deleted vendor</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-slate-300">
                          {formatDate(po.orderDate)}
                        </td>
                        <td className={`py-3.5 px-5 ${overdue ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                          {formatDate(po.expectedDate)}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-white">
                          {formatMoney(orderTotal(po.items))}
                        </td>
                        <td className="py-3.5 px-5 font-sans">
                          <Badge meta={findMeta(PO_STATUSES, po.status)} />
                        </td>
                        <td className="py-3.5 px-5 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            {step && (
                              <button
                                onClick={() => advance(po, step.to)}
                                disabled={isBusy}
                                className="rounded border border-blue-500/50 bg-blue-600/20 px-2.5 py-1 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                              >
                                {isBusy ? <Spinner className="h-3 w-3" /> : step.label}
                              </button>
                            )}
                            <button
                              onClick={() => setModal(po)}
                              aria-label="Edit order"
                              title="Edit order"
                              className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-slate-600 hover:text-white"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setToDelete(po)}
                              disabled={!canDelete}
                              aria-label="Delete order"
                              title={canDelete ? "Delete order" : "Cannot delete received orders"}
                              className="ui-pressable rounded-lg border border-slate-700 bg-[#121826] p-1.5 text-slate-300 transition hover:border-rose-600 hover:bg-rose-950/40 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isExp && (
                        <tr className="bg-[#070b14]/90">
                          <td colSpan={7} className="px-5 py-4">
                            <div className="ui-tab-fade rounded-lg border border-slate-800 bg-[#0e1422] p-4 max-w-3xl">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                                Line Item Breakdown ({po.items.length} items)
                              </h4>
                              <table className="w-full text-xs">
                                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                  <tr>
                                    <th className="pb-2 text-left">Part Name & Code</th>
                                    <th className="pb-2 text-right">Quantity</th>
                                    <th className="pb-2 text-right">Unit Price</th>
                                    <th className="pb-2 text-right">Total Cost</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                  {po.items.map((i, idx) => {
                                    const total = (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0);
                                    return (
                                      <tr key={i._id ?? idx}>
                                        <td className="py-2 text-slate-200 font-sans">
                                          {i.product ? (
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-white">{i.product.name}</span>
                                              <span className="font-mono text-xs text-blue-300">[{i.product.code}]</span>
                                            </div>
                                          ) : (
                                            <span className="text-slate-400">Deleted product</span>
                                          )}
                                        </td>
                                        <td className="py-2 text-right font-bold text-white">
                                          {i.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-300 font-sans">{i.product?.unit ?? "units"}</span>
                                        </td>
                                        <td className="py-2 text-right text-slate-300">
                                          {formatMoney(i.unitPrice)}
                                        </td>
                                        <td className="py-2 text-right text-white font-bold">
                                          {formatMoney(total)}
                                        </td>
                                      </tr>
                                    );
                                  })}
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

      {/* Modal */}
      {modal && (
        <Modal
          open
          wide
          title={modal === "new" ? "Create Purchase Order" : `Edit ${modal.poNumber}`}
          onClose={() => setModal(null)}
        >
          <PurchaseOrderForm
            initial={modal === "new" ? emptyPurchaseOrderForm(suggestedNumber) : purchaseOrderToForm(modal)}
            suppliers={suppliers.items}
            products={products.items}
            submitLabel={modal === "new" ? "Create order" : "Save changes"}
            onSubmit={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete ${toDelete?.poNumber}? Vendor procurement records associated with this order will be permanently removed.`}
        confirmLabel="Confirm Deletion"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
