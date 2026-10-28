"use client";

import {
  CheckCircle2,
  Eye,
  KeyRound,
  RefreshCw,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { adminService } from "@/services/admin.service";
import type { User as UserType } from "@/types/auth";
import { formatDate } from "@/utils/format";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Inspection modal
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Role Change Confirmation Dialog
  const [roleChangeTarget, setRoleChangeTarget] = useState<UserType | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listUsers();
      setUsers(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to retrieve user directory.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
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
  }, [users, search, roleFilter, statusFilter]);

  const handleConfirmRoleChange = () => {
    if (!roleChangeTarget) return;

    // Honest check: Inform the admin that backend persistence for role mutation is not exposed
    toast.error(
      "Role mutation API endpoint (`PATCH /api/v1/users/:id/role`) is awaiting backend implementation. Privilege change not persisted.",
      { duration: 5000 }
    );
    setRoleChangeTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="User Governance & Directory"
        description="Inspect registered employee accounts, role assignments, and email verification status from the live identity database."
        breadcrumbs="Console / Users"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            loading={loading}
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
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-800 bg-[#0d131f] px-3 font-mono text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Standard Users</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-800 bg-[#0d131f] px-3 font-mono text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified Email</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table / Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0c111e] p-16">
          <Spinner className="h-8 w-8 text-purple-400" />
          <p className="mt-3 font-mono text-xs text-slate-400">Loading user records from database…</p>
        </div>
      ) : error ? (
        <AdminErrorState
          title="User Directory Unreachable"
          message={error}
          technicalDetails="Ensure NEXT_PUBLIC_BACKEND_URL is set and the Express endpoint /admin/data is accessible."
          onRetry={fetchUsers}
        />
      ) : filteredUsers.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title={users.length === 0 ? "No User Accounts Registered" : "No Matching Users"}
          description={
            users.length === 0
              ? "The database contains zero user accounts, or the user collection is empty."
              : "No user accounts match the current filter criteria. Try clearing the search query or filters."
          }
          action={
            users.length > 0 ? (
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
            ) : undefined
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
                            {u.username || "Unnamed Employee"}
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
                          <KeyRound className="h-3 w-3 mr-1 text-purple-400" />
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
              Showing {filteredUsers.length} of {users.length} accounts
            </span>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          open={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="Account Profile Inspection"
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

            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-[11px] text-purple-300">
              <strong>Security Policy:</strong> Passwords, session tokens, and cryptographic secrets are strictly excluded from client responses.
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
            ? `Are you sure you want to modify privilege level for "${roleChangeTarget.email}" (${roleChangeTarget.role})? Note that the backend role modification endpoint is not yet connected.`
            : ""
        }
        confirmLabel="Simulate Change"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setRoleChangeTarget(null)}
      />
    </div>
  );
}
