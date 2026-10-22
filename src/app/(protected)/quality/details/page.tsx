"use client";

import { ArrowLeft, Pencil, Search, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import QualityIssueForm, { qualityIssueToForm } from "@/components/quality/QualityIssueForm";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useList } from "@/hooks/useList";
import { productService } from "@/services/product.service";
import { qualityIssueService } from "@/services/qualityIssue.service";
import { workOrderService } from "@/services/workOrder.service";
import { findMeta } from "@/types/common";
import {
  inspectorName,
  ISSUE_STATUSES,
  QUALITY_TYPES,
  SEVERITIES,
  withClosedAt,
  type IssueStatus,
  type QualityIssue,
  type QualityIssueInput,
} from "@/types/quality";
import { getErrorMessage } from "@/utils/getErrorMessage";

/** /quality/details -> pick an issue.   /quality/details?id=<id> -> view / edit it. */
function IssuePicker() {
  const issues = useList(qualityIssueService.list, "Could not load quality issues.");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return issues.items.filter(
      (i) =>
        !q ||
        i.issueNumber.toLowerCase().includes(q) ||
        (i.workOrder?.workOrderNumber ?? "").toLowerCase().includes(q) ||
        (i.product?.name ?? "").toLowerCase().includes(q) ||
        (i.defectType ?? "").toLowerCase().includes(q),
    );
  }, [issues.items, search]);

  return (
    <div className="ui-page-enter mx-auto max-w-4xl space-y-5">
      <div>
        <Link
          href="/quality/issues"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Quality Issues
        </Link>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-blue-400">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-blue-400">Quality</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Select Quality Issue</h1>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
        <Input
          label=""
          aria-label="Search issues"
          icon={Search}
          placeholder="Search by issue number, work order, product, or defect…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-black/20">
        {issues.loading ? (
          <div className="flex justify-center p-12"><Spinner className="h-6 w-6 text-blue-400" /></div>
        ) : issues.error ? (
          <p className="p-8 text-center text-xs text-red-400">{issues.error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-xs text-slate-400">No quality issues found matching your query.</p>
        ) : (
          filtered.map((i) => (
            <Link
              key={i._id}
              href={`/quality/details?id=${i._id}`}
              className="ui-table-row flex items-center justify-between px-5 py-4 transition hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-blue-300">{i.issueNumber}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {i.workOrder?.workOrderNumber ? `Work Order: ${i.workOrder.workOrderNumber}` : "Standalone"}
                  {i.product ? ` • ${i.product.name}` : ""}
                  {i.defectType ? ` • ${i.defectType}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge meta={findMeta(SEVERITIES, i.severity)} />
                <Badge meta={findMeta(ISSUE_STATUSES, i.status)} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-xs font-medium text-slate-200">{children}</dd>
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</h3>
      <p className={`mt-2 whitespace-pre-wrap text-xs leading-relaxed ${text ? "text-slate-200" : "text-slate-500 italic"}`}>
        {text || "Nothing recorded."}
      </p>
    </div>
  );
}

function IssueDetails({ id }: { id: string }) {
  const router = useRouter();
  const workOrders = useList(workOrderService.list, "Could not load work orders.");
  const products = useList(productService.list, "Could not load products.");

  const [issue, setIssue] = useState<QualityIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [savingStatus, setSavingStatus] = useState<IssueStatus | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    qualityIssueService
      .get(id)
      .then((data) => active && setIssue(data))
      .catch((err) => active && setError(getErrorMessage(err, "Could not load quality issue.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function refetch() {
    setIssue(await qualityIssueService.get(id));
  }

  async function changeStatus(status: IssueStatus) {
    if (!issue || status === issue.status) return;
    setSavingStatus(status);
    try {
      await qualityIssueService.update(id, withClosedAt({ status }, issue.closedAt));
      await refetch();
      toast.success(`Resolution state updated to ${findMeta(ISSUE_STATUSES, status).label}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update status."));
    } finally {
      setSavingStatus(null);
    }
  }

  async function handleUpdate(values: QualityIssueInput) {
    if (!issue) return;
    try {
      await qualityIssueService.update(id, withClosedAt(values, issue.closedAt));
      await refetch();
      setEditing(false);
      toast.success(`${values.issueNumber} updated`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update quality issue."));
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await qualityIssueService.remove(id);
      toast.success("Quality issue deleted");
      router.push("/quality/issues");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete quality issue."));
      setDeleting(false);
    }
  }

  const passRate =
    issue && issue.quantityInspected > 0 ? Math.round((issue.quantityPassed / issue.quantityInspected) * 100) : null;

  return (
    <div className="ui-page-enter mx-auto max-w-4xl space-y-6">
      <Link
        href="/quality/issues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Quality Issues
      </Link>

      {loading ? (
        <div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>
      ) : error || !issue ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-xs text-red-200">
          {error ?? "Quality issue record not found."}{" "}
          <Link href="/quality/details" className="font-semibold underline ml-1 text-red-300">
            Choose another issue
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-800/80 pb-5">
            <div>
              <p className="text-xs font-medium text-blue-400">Quality Issue</p>
              <h1 className="mt-1 font-mono text-2xl font-semibold tracking-tight text-white">{issue.issueNumber}</h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Badge meta={findMeta(QUALITY_TYPES, issue.type)} />
                <Badge meta={findMeta(SEVERITIES, issue.severity)} />
                <Badge meta={findMeta(ISSUE_STATUSES, issue.status)} />
              </div>
            </div>
            {!editing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(true)}
                  disabled={workOrders.loading || products.loading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Record
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <QualityIssueForm
                submitLabel="Save Changes"
                initial={qualityIssueToForm(issue)}
                workOrders={workOrders.items}
                products={products.items}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lifecycle status transition */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Lifecycle Resolution State</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">Advance or change the disposition state.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ISSUE_STATUSES.map((s) => {
                    const current = s.value === issue.status;
                    return (
                      <button
                        key={s.value}
                        onClick={() => changeStatus(s.value)}
                        disabled={current || savingStatus !== null}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          current
                            ? "border-blue-500/80 bg-blue-600/15 text-blue-200 shadow-xs"
                            : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40"
                        }`}
                      >
                        {savingStatus === s.value ? (
                          <Spinner className="h-3 w-3 text-blue-400" />
                        ) : (
                          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        )}
                        {s.label}
                        {current && <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">(Current)</span>}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Inspection metrics */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Audit Quantities & Yield</h2>
                  {passRate !== null && (
                    <span className={`text-xs font-bold font-mono tabular-nums ${passRate >= 95 ? "text-emerald-400" : passRate >= 80 ? "text-amber-400" : "text-red-400"}`}>
                      {passRate}% Inspection Pass Rate
                    </span>
                  )}
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 text-center sm:gap-4">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <dt className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Inspected</dt>
                    <dd className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-slate-100">{issue.quantityInspected}</dd>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <dt className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Passed Inspection</dt>
                    <dd className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-emerald-400">{issue.quantityPassed}</dd>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <dt className="text-[10px] uppercase tracking-wider text-red-400 font-bold">Rejected Defects</dt>
                    <dd className={`mt-1.5 text-2xl font-bold font-mono tabular-nums ${issue.quantityFailed > 0 ? "text-red-400" : "text-slate-400"}`}>
                      {issue.quantityFailed}
                    </dd>
                  </div>
                </dl>

                {passRate !== null && (
                  <div className="mt-5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                          passRate >= 95 ? "bg-emerald-500" : passRate >= 80 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Contextual properties & root-cause details */}
              <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 pb-2 border-b border-slate-800/80">
                  Traceability & Metadata
                </h2>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Associated Work Order">
                    {issue.workOrder?.workOrderNumber ? (
                      <span className="font-mono text-blue-300 font-semibold">{issue.workOrder.workOrderNumber}</span>
                    ) : (
                      <span className="text-slate-500">Unlinked</span>
                    )}
                  </Detail>
                  <Detail label="Inspected Product">
                    {issue.product ? (
                      <span>
                        <span className="text-slate-200 font-semibold">{issue.product.name}</span>{" "}
                        <span className="font-mono text-[11px] text-slate-400">({issue.product.code})</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </Detail>
                  <Detail label="Defect Type / Classification">{issue.defectType || "—"}</Detail>
                  <Detail label="Certified Inspector">{inspectorName(issue.inspector)}</Detail>
                  <Detail label="Audit Timestamp">{new Date(issue.createdAt).toLocaleString()}</Detail>
                  <Detail label="Resolution Disposition Date">
                    {issue.closedAt ? new Date(issue.closedAt).toLocaleString() : "Active / Pending Resolution"}
                  </Detail>
                </dl>
                <div className="mt-6 space-y-4 border-t border-slate-800/80 pt-5">
                  <TextBlock label="Observed Non-Conformance Description" text={issue.description} />
                  <TextBlock label="Corrective Action & Preventive Disposition" text={issue.correctiveAction} />
                </div>
              </section>
            </div>
          )}

          <ConfirmDialog
            open={confirmOpen}
            title="Delete Quality Issue Record"
            message={`Are you sure you want to permanently delete ticket ${issue.issueNumber}? Corrective logs and inspection metrics will be removed.`}
            loading={deleting}
            confirmLabel="Confirm Deletion"
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}

function DetailsRouter() {
  const id = useSearchParams().get("id");
  return id ? <IssueDetails key={id} id={id} /> : <IssuePicker />;
}

export default function IssueDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-16"><Spinner className="h-7 w-7 text-blue-400" /></div>}>
      <DetailsRouter />
    </Suspense>
  );
}
