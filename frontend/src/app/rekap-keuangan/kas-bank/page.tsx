"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import {
  Search,
  Trash2,
  Plus,
  RefreshCw,
  Loader2,
  Pencil,
  Trash,
  Download,
} from "lucide-react";
import type { PaginationData } from "@/types/report-keuangan/kas-bank/kas-bank";

export default function FundCashBankPage() {
  const router = useRouter();
  const [fund, setFund] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [perPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    fundId: number | null;
    isBatch: boolean;
  }>({
    isOpen: false,
    fundId: null,
    isBatch: false,
  });

  const [selectedFundIds, setSelectedFundIds] = useState<number[]>([]);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timerId);
  }, [search]);

  const fetchFund = useCallback(async () => {
    setLoading(true);
    setSelectedFundIds([]);
    try {
      const response = await api.get("/fund-cash-bank", {
        params: { search: debouncedSearch, page, per_page: perPage },
      });
      setFund(response.data.fund);
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Something went wrong while fetching fund data!");
      }
      console.error("Failed to fetch fund data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, perPage]);

  useEffect(() => {
    fetchFund();
  }, [fetchFund]);

  const handleEdit = (id: number) =>
    router.push(`/rekap-keuangan/kas-bank/${id}`);

  const handleDelete = (id: number) =>
    setDeleteModal({ isOpen: true, fundId: id, isBatch: false });

  const handleDeleteSelected = () =>
    setDeleteModal({ isOpen: true, fundId: null, isBatch: true });

  const handleConfirmDelete = async () => {
    if (!deleteModal.isOpen) return;
    setDeletingId(deleteModal.fundId || -1);
    try {
      if (deleteModal.fundId) {
        await api.delete(`/fund-cash-bank/${deleteModal.fundId}`);
        showSuccess("Fund deleted successfully!");
      } else if (deleteModal.isBatch && selectedFundIds.length > 0) {
        await Promise.all(
          selectedFundIds.map((id) => api.delete(`/fund-cash-bank/${id}`))
        );
        showSuccess("Selected fund records deleted successfully!");
        setSelectedFundIds([]);
      } else {
        return;
      }
      await fetchFund();
      setDeleteModal({ isOpen: false, fundId: null, isBatch: false });
    } catch (err: any) {
      showError("Failed to delete fund.");
      console.error("Deletion error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await api.get("/fund-cash-bank/export", {
        params: { search: debouncedSearch, page, per_page: perPage },
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      link.setAttribute("download", "kas_dan_bank_" + formattedDate + ".xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      showError(error.message || "Failed to load options");
    } finally {
      setExporting(false);
    }
  };

  const handleExportSelected = async () => {
    try {
      const response = await api.get("/fund-cash-bank/export", {
        params: { ids: selectedFundIds },
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
        const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      link.setAttribute("download", "kas_dan_bank_" + formattedDate + ".xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSelectedFundIds([]);
    } catch (error: any) {
      showError(error.message || "Failed to export selected worksheets");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, fundId: null, isBatch: false });
    setDeletingId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (fund && newPage >= 1 && newPage <= fund.last_page) setPage(newPage);
  };

  const handleSelectAll = () => {
    if (!fund?.data) return;
    if (selectedFundIds.length === fund.data.length) setSelectedFundIds([]);
    else setSelectedFundIds(fund.data.map((c) => c.id));
  };

  const handleSelectOne = (id: number) =>
    setSelectedFundIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const totalSelected = selectedFundIds.length;

  const showingRange = useMemo(() => {
    if (!fund) return null;
    const start = (fund.current_page - 1) * fund.per_page + 1;
    const end = Math.min(fund.current_page * fund.per_page, fund.total);
    return { start, end };
  }, [fund]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFund();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Kas & Dana Bank
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Kelola kas dan dana bank. Cari, pilih, hapus batch, dan edit
                dengan cepat.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="search"
                  type="text"
                  placeholder="Cari nama dana/kas..."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-9 py-2.5 text-sm outline-none ring-2 ring-transparent focus:ring-neutral-300 dark:focus:ring-neutral-700 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                disabled={refreshing || loading}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => router.push("/rekap-keuangan/kas-bank/tambah")}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-2 md:px-4 py-2 text-sm font-semibold shadow hover:shadow-md hover:bg-neutral-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <div className="inline md:hidden sm:hidden lg:inline">
                  Kas/Bank
                </div>
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-2 md:px-4 py-2 text-sm font-semibold shadow hover:shadow-md hover:bg-neutral-800 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <div className="inline md:hidden sm:hidden lg:inline">
                  Export Excel
                </div>
              </button>
            </div>
          </div>

          <div className="border-b-2 border-neutral-200 dark:border-neutral-700 my-6"></div>

          {/* Bulk action bar */}
          <div
            aria-live="polite"
            className={[
              // base styles
              "rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2",
              "flex items-center justify-between",
              "transition-all duration-300 ease-out",
              // responsive width
              "w-full md:w-3/5 lg:w-1/2",
              // animate show/hide
              totalSelected > 0
                ? "opacity-100 translate-y-0 max-h-20 mt-1 mb-3"
                : "opacity-0 -translate-y-2 max-h-0 mt-0 mb-0 pointer-events-none overflow-hidden",
            ].join(" ")}
          >
            <div className="text-sm text-red-800 dark:text-red-200">
              <span className="font-semibold">{totalSelected}</span> dipilih
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Hapus Terpilih
              </button>
            </div>

            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">{totalSelected}</span> dipilih
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSelected}
                className="inline-flex items-center gap-2 rounded-full bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-yellow-700 cursor-pointer"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        !!(
                          fund &&
                          fund.data.length > 0 &&
                          selectedFundIds.length === fund.data.length
                        )
                      }
                      onChange={handleSelectAll}
                      disabled={!fund || fund.data.length === 0}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">Nama</th>
                  <th className="px-6 py-3 text-center">Tipe</th>
                  <th className="px-6 py-3 text-center">Atas Nama</th>
                  <th className="px-6 py-3 text-center">Nomor Akun/Rekening</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {!fund || fund.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  fund.data.map((f) => (
                    <tr
                      key={f.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedFundIds.includes(f.id)}
                          onChange={() => handleSelectOne(f.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">{f.fund_name}</td>
                      <td className="px-6 py-4 text-center">{f.type}</td>
                      <td className="px-6 py-4 text-center">
                        {f.on_behalf_of}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {f.account_number}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(f.id)}
                          className="text-blue-600 hover:underline"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="text-red-600 hover:underline"
                          disabled={deletingId === f.id}
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

          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title={
              deleteModal.isBatch
                ? "Confirm Batch Deletion"
                : "Confirm Deletion"
            }
            description={
              deleteModal.isBatch
                ? `Yakin hapus ${selectedFundIds.length} kas/bank terpilih?`
                : "Yakin hapus kas/bank ini?"
            }
            loading={!!deletingId}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
