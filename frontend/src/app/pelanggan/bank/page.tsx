"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { PaginationData } from "@/types/pelanggan/bank/customer-bank";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import { Search, Trash2, Plus, RefreshCw, Loader2, Pencil, Trash } from "lucide-react";

export default function CustomerBankPage() {
  const router = useRouter();
  const [bank, setBank] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Fixed per page for simplicity
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    bankId: number | null; // For single deletion
    isBatch: boolean; // Flag to indicate if it's a batch delete
  }>({
    isOpen: false,
    bankId: null,
    isBatch: false,
  });

  const [selectedbankIds, setSelectedbankIds] = useState<number[]>([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timerId);
  }, [search]);

  const fetchBank = useCallback(async () => {
    setLoading(true);
    // Clear selections when data is re-fetched due to search/page changes
    setSelectedbankIds([]);
    try {
      const response = await api.get("/customer-banks", {
        params: { search: debouncedSearch, page, per_page: perPage },
      });
      setBank(response.data.customer_bank);
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError(
            "Something went wrong while fetching data!"
        );
      }
      // eslint-disable-next-line no-console
      console.error("Failed to fetch customer bank data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, perPage]);

  useEffect(() => {
    fetchBank();
  }, [fetchBank]);

  const handleEditBank = (id: number) => router.push(`/pelanggan/bank/${id}`);

  // Single delete modal
  const handleDelete = (id: number) => setDeleteModal({ isOpen: true, bankId: id, isBatch: false });

  // Batch delete modal
  const handleDeleteSelected = () => setDeleteModal({ isOpen: true, bankId: null, isBatch: true });

  const handleConfirmDelete = async () => {
    if (!deleteModal.isOpen) return;
    setDeletingId(deleteModal.bankId || -1);
    try {
      if (deleteModal.bankId) {
        await api.delete(`/customer-banks/${deleteModal.bankId}`);
        showSuccess("Customer bank deleted successfully!");
      } else if (deleteModal.isBatch && selectedbankIds.length > 0) {
        await Promise.all(selectedbankIds.map((id) => api.delete(`/customer-banks/${id}`)));
        showSuccess("Selected customer bank records deleted successfully!");
        setSelectedbankIds([]);
      } else {
        return;
      }
      await fetchBank();
      setDeleteModal({ isOpen: false, bankId: null, isBatch: false });
    } catch (err: any) {
      showError("Failed to delete customer bank.");
      // eslint-disable-next-line no-console
      console.error("Deletion error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, bankId: null, isBatch: false });
    setDeletingId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (bank && newPage >= 1 && newPage <= bank.last_page) setPage(newPage);
  };

  const handleSelectAll = () => {
    if (!bank?.data) return;
    if (selectedbankIds.length === bank.data.length) setSelectedbankIds([]);
    else setSelectedbankIds(bank.data.map((c) => c.id));
  };

  const handleSelectOne = (id: number) =>
    setSelectedbankIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const totalSelected = selectedbankIds.length;
  const hasData = bank && bank.data.length > 0;

  const showingRange = useMemo(() => {
    if (!bank) return null;
    const start = (bank.current_page - 1) * bank.per_page + 1;
    const end = Math.min(bank.current_page * bank.per_page, bank.total);
    return { start, end };
  }, [bank]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBank();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Pelanggan Bank & Leasing
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Kelola data pelanggan bank/leasing. Cari, pilih, hapus batch, dan edit dengan cepat.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden />
                <input
                  id="search"
                  type="text"
                  placeholder="Cari nama bank, PIC, atau kota..."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-9 py-2.5 text-sm outline-none ring-2 ring-transparent focus:ring-neutral-300 dark:focus:ring-neutral-700 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search customers"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                disabled={refreshing || loading}
                aria-label="Refresh"
              >
                {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {/* Optional add button (uncomment if route ready) */}
              <button
                onClick={() => router.push("/pelanggan/bank/create")}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-2 md:px-4 py-2 text-sm font-semibold shadow hover:shadow-md hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />  
                <div className="inline md:hidden sm:hidden lg:inline">
                  Bank/Leasing
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
                : "opacity-0 -translate-y-2 max-h-0 mt-0 mb-0 pointer-events-none overflow-hidden"
            ].join(" ")}
            >
            <div className="text-sm text-red-800 dark:text-red-200">
                <span className="font-semibold">{totalSelected}</span> dipilih
            </div>

            <div className="flex items-center gap-2">
                <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                <Trash2 className="h-4 w-4" /> Hapus Terpilih
                </button>
            </div>
            </div>

          {/* Table/Card container */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {/* Checkbox for "select all" on current page */}
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all-search"
                            type="checkbox"
                            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            checked={
                              !!(
                                bank &&
                                bank.data.length > 0 &&
                                selectedbankIds.length ===
                                  bank.data.length
                              )
                            }
                            onChange={handleSelectAll}
                            disabled={!bank || bank.data.length === 0}
                          />
                          <label
                            htmlFor="checkbox-all-search"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Nama Bank/Leasing
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Utusan
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Nomor Bank/Leasing
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Kota
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!bank || bank.data.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-10 text-gray-700 dark:text-gray-300"
                        >
                          <p className="text-lg font-semibold">
                            No customer bank data found.
                          </p>
                          <p className="mt-2">
                            Try adjusting your search criteria or add a new
                            customer.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      bank.data.map((customer) => (
                        <tr
                          key={customer.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id={`checkbox-table-search-${customer.id}`}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                checked={selectedbankIds.includes(
                                  customer.id
                                )}
                                onChange={() => handleSelectOne(customer.id)}
                              />
                              <label
                                htmlFor={`checkbox-table-search-${customer.id}`}
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {customer.contact_person}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {customer.license_number}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {customer.city}
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button
                              onClick={() => handleEditBank(customer.id)}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-2 py-1 rounded"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id)}
                              className="font-medium text-red-600 dark:text-red-500 hover:underline px-2 py-1 rounded"
                              disabled={deletingId === customer.id}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {bank && bank.data.length > 0 && (
                  <nav
                    className="flex items-center flex-col md:flex-row justify-between pt-4 pb-5"
                    aria-label="Table navigation"
                  >
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 ml-4 md:mb-0 block w-full md:inline md:w-auto">
                      Showing{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(bank.current_page - 1) * bank.per_page + 1}
                      </span>{" "}
                      -{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.min(
                          bank.current_page * bank.per_page,
                          bank.total
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {bank.total}
                      </span>{" "}
                      entries
                    </span>
                    <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 mr-4">
                      <li>
                        <button
                          onClick={() =>
                            handlePageChange(bank.current_page - 1)
                          }
                          disabled={bank.current_page === 1}
                          className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        { length: bank.last_page },
                        (_, i) => i + 1
                      ).map((pageNumber) => (
                        <li key={pageNumber}>
                          <button
                            onClick={() => handlePageChange(pageNumber)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight ${
                              pageNumber === bank.current_page
                                ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() =>
                            handlePageChange(bank.current_page + 1)
                          }
                          disabled={
                            bank.current_page === bank.last_page
                          }
                          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>

          {/* Delete Confirmation Modal */}
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title={deleteModal.isBatch ? "Confirm Batch Deletion" : "Confirm Deletion"}
            description={
              deleteModal.isBatch
                ? `Are you sure you want to delete ${selectedbankIds.length} selected customer bank records? This action cannot be undone.`
                : "Are you sure you want to delete this customer bank record? This action cannot be undone."
            }
            loading={!!deletingId}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

/* --------------------------------- Helpers -------------------------------- */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <Search className="h-5 w-5 text-neutral-500" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        No customer bank data found
      </h3>
      <p className="mt-1 max-w-md text-sm text-neutral-600 dark:text-neutral-300">
        Coba ubah kata kunci pencarian Anda atau tambah data pelanggan baru.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onReset}
          className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800"
        >
          Reset Search
        </button>
        {/* <button
          onClick={() => router.push("/pelanggan/perorangan/create")}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button> */}
      </div>
    </div>
  );
}

