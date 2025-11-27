"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Layout from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DeleteModal } from "@/components/ui/DeleteModal";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import {
  Search,
  Trash,
  Trash2,
  Pencil,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { PaginationData } from "@/types/user";

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    isBatch: boolean;
  }>({
    isOpen: false,
    userId: null,
    isBatch: false,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setSelectedIds([]);
    try {
      const res = await api.get("/users", {
        params: { search: debouncedSearch, page, per_page: perPage },
      });
      setUsers(res.data.user);
    } catch (err: any) {
      if (err.response?.status === 422) {
        showValidationErrors(err.response.data.errors);
      } else {
        showError("Failed to fetch users.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, perPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (id: number) => router.push(`/pengguna/${id}`);
  const handleDelete = (id: number) =>
    setDeleteModal({ isOpen: true, userId: id, isBatch: false });
  const handleDeleteSelected = () =>
    setDeleteModal({ isOpen: true, userId: null, isBatch: true });

  const handleConfirmDelete = async () => {
    if (!deleteModal.isOpen) return;
    setDeletingId(deleteModal.userId || -1);

    try {
      if (deleteModal.userId) {
        await api.delete(`/users/${deleteModal.userId}`);
        showSuccess("User deleted successfully.");
      } else if (deleteModal.isBatch && selectedIds.length > 0) {
        await Promise.all(selectedIds.map((id) => api.delete(`/users/${id}`)));
        showSuccess("Selected users deleted successfully.");
      }
      await fetchUsers();
      setDeleteModal({ isOpen: false, userId: null, isBatch: false });
    } catch (err: any) {
      showError("Failed to delete user(s).");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () =>
    setDeleteModal({ isOpen: false, userId: null, isBatch: false });

  const handlePageChange = (newPage: number) => {
    if (users && newPage >= 1 && newPage <= users.last_page) setPage(newPage);
  };

  const handleSelectAll = () => {
    if (!users?.data) return;
    if (selectedIds.length === users.data.length) setSelectedIds([]);
    else setSelectedIds(users.data.map((r) => r.id));
  };

  const handleSelectOne = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const totalSelected = selectedIds.length;

  const showingRange = useMemo(() => {
    if (!users) return null;
    const start = (users.current_page - 1) * users.per_page + 1;
    const end = Math.min(users.current_page * users.per_page, users.total);
    return { start, end };
  }, [users]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Manajemen Pengguna
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Manajemen pengguna sistem. Cari, edit, dan hapus pengguna dengan mudah.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              {/* Refresh */}
              <button
                onClick={onRefresh}
                disabled={refreshing || loading}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {/* Add New */}
              <button
                onClick={() => router.push("/pengguna/tambah")}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-3 py-2 text-sm font-semibold hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" /> Pengguna
              </button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          <div
            className={[
              "mt-3 mb-3 flex items-center justify-between rounded-xl border bg-red-50 px-4 py-2 text-red-800 transition-all",
              totalSelected > 0
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden",
            ].join(" ")}
          >
            <span>
              <strong>{totalSelected}</strong> selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" /> Delete Selected
            </button>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={
                        !!(
                          users &&
                          users.data.length > 0 &&
                          selectedIds.length === users.data.length
                        )
                      }
                      onChange={handleSelectAll}
                      disabled={!users || users.data.length === 0}
                    />
                  </th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!users || users.data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.data.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => handleSelectOne(user.id)}
                        />
                      </td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role.name}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="text-blue-600 hover:underline mr-6"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="text-red-600 hover:underline"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users && users.last_page > 1 && (
            <nav className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-500">
                Showing {showingRange?.start} - {showingRange?.end} of{" "}
                {users.total} entries
              </span>
              <ul className="inline-flex -space-x-px text-sm">
                {Array.from({ length: users.last_page }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <li key={pageNumber}>
                      <button
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 h-8 border ${
                          pageNumber === users.current_page
                            ? "bg-blue-50 text-blue-600"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          )}

          {/* Delete Modal */}
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title={
              deleteModal.isBatch ? "Confirm Batch Deletion" : "Confirm Deletion"
            }
            description={
              deleteModal.isBatch
                ? `Are you sure you want to delete ${selectedIds.length} users?`
                : "Are you sure you want to delete this user?"
            }
            loading={!!deletingId}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
