"use client";

import { ArrowLeft, Pencil, Search, Trash2 } from "lucide-react";
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
    <div className="ui-page-enter mx-auto max-w-4xl">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Quality Assurance</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Issue Details</h1>
        <p className="mt-1 text-sm text-slate-400">Choose an issue to view inspection breakdown and corrective actions.</p>
      </div>

      <div className="ui-surface mt-6 rounded-xl p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Find quality issue</p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
            >
              Clear search
            </button>
          )}
        </div>
        <Input
          label=""
          aria-label="Search issues"
          icon={Search}
          placeholder="Search by issue, work order, product or defect…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ui-section-enter mt-4 divide-y divide-slate-800/90 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/80 shadow-lg shadow-slate-950/10">
        {issues.loading ? (
          <div className="flex justify-center p-12"><Spinner /></div>
        ) : issues.error ? (
          <p className="p-8 text-center text-red-400">{issues.error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-slate-400">No issues found.</p>
        ) : (
          filtered.map((i) => (
            <Link
              key={i._id}
              href={`/quality/details?id=${i._id}`}
              className="ui-table-row flex items-center justify-between px-5 py-4 transition hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              <div>
                <p className="font-mono text-sm font-semibold text-blue-300">{i.issueNumber}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {i.workOrder?.workOrderNumber ? `Order ${i.workOrder.workOrderNumber}` : "Deleted work order"}
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
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-200">{children}</dd>
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</h3>
      <p className={`mt-2 whitespace-pre-wrap text-sm leading-relaxed ${text ? "text-slate-200" : "text-slate-500 italic"}`}>
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

  // The update response isn't populated, so fetch the issue again after every change.
  async function refetch() {
    setIssue(await qualityIssueService.get(id));
  }

  async function changeStatus(status: IssueStatus) {
    if (!issue || status === issue.status) return;
    setSavingStatus(status);
    try {
      await qualityIssueService.update(id, withClosedAt({ status }, issue.closedAt));
      await refetch();
      toast.success(`Status set to ${findMeta(ISSUE_STATUSES, status).label}`);
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
    <div className="ui-page-enter mx-auto max-w-4xl">
      <Link
        href="/quality/issues"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <ArrowLeft className="h-4 w-4" /> Back to quality issues
      </Link>

      {loading ? (
        <div className="flex justify-center p-16"><Spinner className="h-7 w-7" /></div>
      ) : error || !issue ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
          {error ?? "Quality issue not found."}{" "}
          <Link href="/quality/details" className="font-medium underline">Choose another issue</Link>
        </div>
      ) : (
        <>
          <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300/80">Quality Issue Record</p>
              <h1 className="mt-1 font-mono text-2xl font-semibold tracking-tight text-slate-100">{issue.issueNumber}</h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Badge meta={findMeta(QUALITY_TYPES, issue.type)} />
                <Badge meta={findMeta(SEVERITIES, issue.severity)} />
                <Badge meta={findMeta(ISSUE_STATUSES, issue.status)} />
              </div>
            </div>
            {!editing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  disabled={workOrders.loading || products.loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700/90 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <QualityIssueForm
                submitLabel="Save changes"
                initial={qualityIssueToForm(issue)}
                workOrders={workOrders.items}
                products={products.items}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <section className="ui-section-enter rounded-xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                <h2 className="text-sm font-semibold text-slate-200">Lifecycle status transition</h2>
                <p className="mt-1 text-xs text-slate-500">Advance or change the current resolution state.</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {ISSUE_STATUSES.map((s) => {
                    const current = s.value === issue.status;
                    return (
                      <button
                        key={s.value}
                        onClick={() => changeStatus(s.value)}
                        disabled={current || savingStatus !== null}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          current
                            ? "border-blue-500 bg-blue-500/15 text-blue-200 shadow-sm shadow-blue-950/20"
                            : "border-slate-700/80 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
                        }`}
                      >
                        {savingStatus === s.value ? (
                          <Spinner className="h-3.5 w-3.5" />
                        ) : (
                          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        )}
                        {s.label}
                        {current && <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider">(Current)</span>}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="ui-section-enter rounded-xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">Inspection metrics</h2>
                  {passRate !== null && (
                    <span className={`text-xs font-semibold tabular-nums ${passRate >= 95 ? "text-emerald-400" : passRate >= 80 ? "text-amber-400" : "text-red-400"}`}>
                      {passRate}% Pass Rate
                    </span>
                  )}
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 text-center sm:gap-4">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                    <dt className="text-xs uppercase tracking-wider text-slate-400 font-medium">Inspected</dt>
                    <dd className="mt-1.5 text-2xl font-bold tabular-nums text-slate-100">{issue.quantityInspected}</dd>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <dt className="text-xs uppercase tracking-wider text-emerald-400/90 font-medium">Passed</dt>
                    <dd className="mt-1.5 text-2xl font-bold tabular-nums text-emerald-400">{issue.quantityPassed}</dd>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <dt className="text-xs uppercase tracking-wider text-red-400/90 font-medium">Failed</dt>
                    <dd className={`mt-1.5 text-2xl font-bold tabular-nums ${issue.quantityFailed > 0 ? "text-red-400" : "text-slate-400"}`}>
                      {issue.quantityFailed}
                    </dd>
                  </div>
                </dl>

                {passRate !== null && (
                  <div className="mt-5">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          passRate >= 95 ? "bg-emerald-500" : passRate >= 80 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="ui-section-enter rounded-xl border border-slate-800/90 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                <h2 className="text-sm font-semibold text-slate-200">Contextual properties</h2>
                <dl className="mt-4 grid gap-6 sm:grid-cols-2">
                  <Detail label="Work order">
                    {issue.workOrder?.workOrderNumber ?? <span className="text-slate-500">Deleted</span>}
                  </Detail>
                  <Detail label="Product">
                    {issue.product ? (
                      <>
                        <span className="text-slate-100">{issue.product.name}</span>{" "}
                        <span className="font-mono text-xs text-slate-400">({issue.product.code})</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </Detail>
                  <Detail label="Defect type">{issue.defectType || "—"}</Detail>
                  <Detail label="Inspector">{inspectorName(issue.inspector)}</Detail>
                  <Detail label="Reported">{new Date(issue.createdAt).toLocaleString()}</Detail>
                  <Detail label="Closed">{issue.closedAt ? new Date(issue.closedAt).toLocaleString() : "Not closed"}</Detail>
                </dl>
                <div className="mt-6 space-y-4 border-t border-slate-800 pt-6">
                  <TextBlock label="Observed non-conformance" text={issue.description} />
                  <TextBlock label="Corrective response & disposition" text={issue.correctiveAction} />
                </div>
              </section>
            </div>
          )}

          <ConfirmDialog
            open={confirmOpen}
            title="Delete quality issue?"
            message={`${issue.issueNumber} will be permanently removed. This can't be undone.`}
            loading={deleting}
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
    <Suspense fallback={null}>
      <DetailsRouter />
    </Suspense>
  );
}