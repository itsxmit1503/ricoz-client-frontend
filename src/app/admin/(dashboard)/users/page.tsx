"use client";

import {
  CheckCircle2,
  Eye,
  KeyRound,
  RefreshCw,
  Search,
  User,
  UserCheck,
  UserX,
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

  // Role Change Modal & Target
  const [roleChangeTarget, setRoleChangeTarget] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserType["role"]>("user");
  const [updatingRole, setUpdatingRole] = useState(false);
  const [togglingStatusId, setTogglingStatusId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("store");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { users: data, dataSource: source } = await adminService.listUsersWithMeta();
      setUsers(data);
      setDataSource(source);
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
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u._id && u._id.toLowerCase().includes(q));

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive !== false) ||
        (statusFilter === "suspended" && u.isActive === false) ||
        (statusFilter === "verified" && u.isemailVerified) ||
        (statusFilter === "pending" && !u.isemailVerified);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleOpenRoleModal = (u: UserType) => {
    setRoleChangeTarget(u);
    setSelectedRole(u.role || "user");
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    if (roleChangeTarget.email === "admin@ricoz.mfg" && selectedRole !== "admin") {
      toast.error("Security Policy: Cannot demote the root administrator account.");
      return;
    }
    setUpdatingRole(true);
    try {
      const targetIdentifier = roleChangeTarget._id || roleChangeTarget.email;
      const updatedUser = await adminService.updateUserRole(targetIdentifier, selectedRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === roleChangeTarget._id ? { ...u, ...updatedUser, role: selectedRole } : u))
      );
      toast.success(`Role updated to ${selectedRole.toUpperCase()} for ${roleChangeTarget.email}`);
      setRoleChangeTarget(null);
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Failed to update user role.");
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleToggleStatus = async (user: UserType) => {
    if (user.email === "admin@ricoz.mfg") {
      toast.error("Security Policy: Cannot suspend the root administrator account.");
      return;
    }
    const newStatus = user.isActive === false;
    setTogglingStatusId(user._id);
    try {
      const targetIdentifier = user._id || user.email;
      const updatedUser = await adminService.updateUserStatus(targetIdentifier, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, ...updatedUser, isActive: newStatus } : u))
      );
      toast.success(`Account for ${user.email} marked as ${newStatus ? "Active" : "Suspended"}`);
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Failed to change user status.");
    } finally {
      setTogglingStatusId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="User Governance & Directory"
        description="Inspect registered employee accounts, role assignments, and email verification status from the live identity database."
        breadcrumbs="Console / Users"
        badge={dataSource === "database" ? "Live Database" : "Standby Memory"}
        badgeVariant={dataSource === "database" ? "database" : "store"}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            loading={loading}
            className="border-slate-700 bg-[#0c111e] text-slate-200 hover:text-white"
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
              className="h-9.5 rounded-lg border border-slate-700 bg-[#0d131f] px-3 font-mono text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="supervisor">Supervisors</option>
              <option value="operator">Operators</option>
              <option value="user">Standard Users</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9.5 rounded-lg border border-slate-700 bg-[#0d131f] px-3 font-mono text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
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
          <p className="mt-3 font-mono text-xs text-slate-300">Loading user records from database…</p>
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
              <thead className="border-b border-slate-800 bg-[#080d17] font-mono uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">User</th>
                  <th className="px-4 py-3 font-bold">Role</th>
                  <th className="px-4 py-3 font-bold">Account State</th>
                  <th className="px-4 py-3 font-bold">Verification</th>
                  <th className="px-4 py-3 font-bold">Created Date</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-[#0e1424]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#121826] text-slate-200">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-white truncate">
                            {u.username || u.name || "Unnamed Employee"}
                          </span>
                          <span className="block text-[11px] text-slate-300 font-mono truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <AdminStatusBadge
                        variant={
                          u.role === "admin"
                            ? "admin"
                            : u.role === "supervisor"
                            ? "warning"
                            : "user"
                        }
                      >
                        {u.role.toUpperCase()}
                      </AdminStatusBadge>
                    </td>

                    <td className="px-4 py-3.5">
                      {u.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {u.isemailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                          <XCircle className="h-3.5 w-3.5" /> Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-300 text-[11px]">
                      {u.createdAt ? formatDate(u.createdAt) : "—"}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                          title="Inspect Profile"
                          className="h-7 px-2 text-slate-200 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Inspect
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRoleModal(u)}
                          title="Modify Role"
                          className="h-7 px-2 text-[11px] border-slate-700 bg-[#0d131f] text-slate-200 hover:text-white"
                        >
                          <KeyRound className="h-3 w-3 mr-1 text-purple-400" />
                          Role
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          disabled={togglingStatusId === u._id}
                          title={u.isActive !== false ? "Suspend Account" : "Activate Account"}
                          className={`h-7 px-2 text-[11px] ${
                            u.isActive !== false
                              ? "text-rose-400 hover:bg-rose-500/15"
                              : "text-emerald-400 hover:bg-emerald-500/15"
                          }`}
                        >
                          {u.isActive !== false ? (
                            <>
                              <UserX className="h-3 w-3 mr-1" /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-800 bg-[#080d17] px-4 py-2.5 text-right">
            <span className="font-mono text-[11px] text-slate-300 font-semibold">
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
                <span className="text-slate-300">Database ID:</span>
                <span className="text-white font-mono select-all">{selectedUser._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-300">Username:</span>
                <span className="font-bold text-white">{selectedUser.username || selectedUser.name || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-300">Email Address:</span>
                <span className="font-bold text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-300">Role Privilege:</span>
                <AdminStatusBadge
                  variant={
                    selectedUser.role === "admin"
                      ? "admin"
                      : selectedUser.role === "supervisor"
                      ? "warning"
                      : "user"
                  }
                >
                  {selectedUser.role.toUpperCase()}
                </AdminStatusBadge>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-300">Account State:</span>
                <span className={selectedUser.isActive !== false ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {selectedUser.isActive !== false ? "ACTIVE" : "SUSPENDED"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-300">Email Verification:</span>
                <span className={selectedUser.isemailVerified ? "text-emerald-400 font-bold" : "text-amber-300 font-medium"}>
                  {selectedUser.isemailVerified ? "CONFIRMED" : "PENDING"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Registered At:</span>
                <span className="text-slate-200">
                  {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : "—"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-[11px] text-purple-200 font-semibold">
              <strong>Security Policy:</strong> Passwords, session tokens, and cryptographic secrets are strictly excluded from client responses.
            </div>
          </div>
        </Modal>
      )}

      {/* Role Mutation Interactive Modal */}
      {roleChangeTarget && (
        <Modal
          open={Boolean(roleChangeTarget)}
          onClose={() => setRoleChangeTarget(null)}
          title="Administrative Privilege Modification"
        >
          <div className="space-y-4 text-xs font-mono">
            <p className="text-slate-200">
              Update privilege tier for account: <strong className="text-white">{roleChangeTarget.email}</strong>
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Select Target Role:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "admin", label: "Administrator", tier: "Core Platform", desc: "Full console access & user governance" },
                  { id: "user", label: "Standard User", tier: "Core Platform", desc: "General read-only operational portal" },
                  { id: "supervisor", label: "Supervisor", tier: "Plant Floor", desc: "Line oversight & work order approval" },
                  { id: "operator", label: "Operator", tier: "Plant Floor", desc: "Machine execution & workcell logging" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id as UserType["role"])}
                    className={`rounded-lg border p-3 text-left transition ${
                      selectedRole === r.id
                        ? "border-purple-500 bg-purple-500/20 text-white font-bold ring-1 ring-purple-500"
                        : "border-slate-800 bg-[#080d17] text-slate-300 hover:border-slate-700 hover:bg-[#0c1222]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block font-bold">{r.label}</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300">
                        {r.tier}
                      </span>
                    </div>
                    <span className="mt-1 block text-[10px] text-slate-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#080d17] p-2.5 text-[11px] text-slate-400">
              <span className="text-amber-300 font-semibold">Persistence Requirement: </span>
              Role updates are committed directly to the backend database. If MongoDB is offline, administrative writes fail safely with HTTP 503 to prevent non-persistent state drift.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleChangeTarget(null)}
                disabled={updatingRole}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmRoleChange}
                loading={updatingRole}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Save Role Change
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
