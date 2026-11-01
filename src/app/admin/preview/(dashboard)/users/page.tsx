"use client";

import {
  CheckCircle2,
  Eye,
  KeyRound,
  RefreshCw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import type { User as UserType } from "@/types/auth";
import { formatDate } from "@/utils/format";

const SYNTHETIC_USERS: UserType[] = [
  {
    _id: "usr_88201a4f91e0",
    username: "Sarah Jenkins",
    email: "s.jenkins@ricoz.mfg",
    role: "admin",
    isemailVerified: true,
    createdAt: "2026-03-15T08:30:00.000Z",
  },
  {
    _id: "usr_88202b5c72d1",
    username: "Marcus Vance",
    email: "m.vance@ricoz.mfg",
    role: "user",
    isemailVerified: true,
    createdAt: "2026-04-02T14:15:00.000Z",
  },
  {
    _id: "usr_88203c6d83a2",
    username: "Elena Rostova",
    email: "e.rostova@ricoz.mfg",
    role: "user",
    isemailVerified: true,
    createdAt: "2026-04-10T11:45:00.000Z",
  },
  {
    _id: "usr_88204d7e94b3",
    username: "Tariq Al-Mansoor",
    email: "t.mansoor@ricoz.mfg",
    role: "user",
    isemailVerified: false,
    createdAt: "2026-05-18T09:20:00.000Z",
  },
  {
    _id: "usr_88205e8f05c4",
    username: "Devon Price",
    email: "d.price@ricoz.mfg",
    role: "admin",
    isemailVerified: true,
    createdAt: "2026-06-01T16:00:00.000Z",
  },
];

export default function AdminPreviewUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<UserType | null>(null);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SYNTHETIC_USERS.filter((u) => {
      const matchesSearch =
        !q ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.username && u.username.toLowerCase().includes(q)) ||
        u._id.toLowerCase().includes(q);

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && u.isemailVerified) ||
        (statusFilter === "pending" && !u.isemailVerified);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const handleConfirmRoleChange = () => {
    toast("Action Disabled: Preview Mode is read-only. Live mutations are blocked.", {
      icon: "🔒",
      duration: 4000,
    });
    setRoleChangeTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        badge="PREVIEW MODE // SYNTHETIC DATA"
        title="User Governance & Directory (Preview)"
        description="Inspect registered employee accounts, role assignments, and email verification status. Displaying synthetic data for visual validation."
        breadcrumbs="Console / Preview / Users"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Refreshed synthetic user directory")}
            className="border-slate-800 bg-[#0c111e] text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Directory
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0c111e] p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <Input
              label=""
              aria-label="Search users"
              placeholder="Filter by name, email, or ID…"
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-800 bg-[#0d131f] px-3 font-mono text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Standard Users</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-800 bg-[#0d131f] px-3 font-mono text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified Email</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filteredUsers.length === 0 ? (
        <AdminEmptyState
          icon={User}
          title="No Matching Users Found"
          description="No synthetic accounts match your search filters. Try resetting the search query."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c111e] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-[#080d17] font-mono uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Verification</th>
                  <th className="px-4 py-3 font-semibold">Created Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-[#0e1424]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-[#121826] text-slate-300">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-semibold text-slate-200 truncate">
                            {u.username}
                          </span>
                          <span className="block text-[11px] text-slate-400 truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <AdminStatusBadge variant={u.role === "admin" ? "admin" : "user"}>
                        {u.role === "admin" ? "ADMINISTRATOR" : "STANDARD USER"}
                      </AdminStatusBadge>
                    </td>

                    <td className="px-4 py-3.5">
                      {u.isemailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                          <XCircle className="h-3.5 w-3.5" /> Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                      {u.createdAt ? formatDate(u.createdAt) : "—"}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                          title="Inspect Profile"
                          className="h-7 px-2 text-slate-300 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Inspect
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRoleChangeTarget(u)}
                          title="Modify Role"
                          className="h-7 px-2 text-[11px] border-slate-800 bg-[#0d131f] text-slate-300 hover:text-white"
                        >
                          <KeyRound className="h-3 w-3 mr-1 text-amber-400" />
                          Role
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-800 bg-[#080d17] px-4 py-2.5 text-right">
            <span className="font-mono text-[11px] text-slate-400">
              Showing {filteredUsers.length} of {SYNTHETIC_USERS.length} accounts (Preview Sandbox)
            </span>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          open={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="Account Profile Inspection (Preview)"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="rounded-lg border border-slate-800 bg-[#080d17] p-4 space-y-3">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Database ID:</span>
                <span className="text-slate-300 select-all">{selectedUser._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Username:</span>
                <span className="font-semibold text-white">{selectedUser.username || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-semibold text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Role Privilege:</span>
                <AdminStatusBadge variant={selectedUser.role === "admin" ? "admin" : "user"}>
                  {selectedUser.role.toUpperCase()}
                </AdminStatusBadge>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Email Verification:</span>
                <span className={selectedUser.isemailVerified ? "text-emerald-400 font-semibold" : "text-amber-400"}>
                  {selectedUser.isemailVerified ? "CONFIRMED" : "PENDING"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered At:</span>
                <span className="text-slate-300">
                  {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "—"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300">
              <strong>Preview Notice:</strong> Profile data is synthetic for demonstration purposes. Live database records are shielded.
            </div>
          </div>
        </Modal>
      )}

      {/* Role Mutation Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(roleChangeTarget)}
        title="Administrative Privilege Modification"
        message={
          roleChangeTarget
            ? `Modify privilege level for synthetic user "${roleChangeTarget.email}" (${roleChangeTarget.role})? Note: Changes are disabled in preview mode.`
            : ""
        }
        confirmLabel="Simulate Change"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setRoleChangeTarget(null)}
      />
    </div>
  );
}
