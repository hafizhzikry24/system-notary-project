"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/services/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import {
  Search,
  RefreshCw,
  Loader2,
  CalendarCog,
  Download,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { PaginationData, HeaderData } from "@/types/report-keuangan/keuangan/keuangan";

export default function FinanceReportPage() {
  const [worksheet, setWorksheet] = useState<PaginationData | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedWorksheetIds, setSelectedWorksheetIds] = useState<number[]>(
    []
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timerId);
  }, [search]);

  // Fetch finance data
  const fetchFinanceData = useCallback(async () => {
    setLoading(true);
    setSelectedWorksheetIds([]);
    try {
      const [worksheetResponse, headerResponse] = await Promise.all([
        api.get("/finance-report", {
          params: {
            search: debouncedSearch,
            page,
            per_page: perPage,
            date_from: dateRange?.from?.toISOString().split("T")[0],
            date_to: dateRange?.to?.toISOString().split("T")[0],
          },
        }),
        api.get("/finance-report/header-data", {
          params: {
            date_from: dateRange?.from?.toISOString().split("T")[0],
            date_to: dateRange?.to?.toISOString().split("T")[0],
          },
        }),
      ]);

      setWorksheet(worksheetResponse.data.finance);
      setHeaderData(headerResponse.data.finance_header);
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError(
          error.response?.data?.message ||
            "Something went wrong while fetching data!"
        );
      }
      console.error("Failed to fetch finance data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, perPage, dateRange]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  // Export all
  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get("/finance-report/export", {
        params: {
          search: debouncedSearch,
          date_from: dateRange?.from?.toISOString().split("T")[0],
          date_to: dateRange?.to?.toISOString().split("T")[0],
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "finance_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      showError(error.message || "Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  // Export selected
  const handleExportSelected = async () => {
    try {
      const response = await api.get("/finance-report/export", {
        params: { ids: selectedWorksheetIds },
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "selected_finance_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSelectedWorksheetIds([]);
    } catch (error: any) {
      showError(error.message || "Failed to export selected reports");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (worksheet && newPage >= 1 && newPage <= worksheet.last_page)
      setPage(newPage);
  };

  const handleSelectAll = () => {
    if (!worksheet?.data) return;
    if (selectedWorksheetIds.length === worksheet.data.length) {
      setSelectedWorksheetIds([]);
    } else {
      setSelectedWorksheetIds(worksheet.data.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedWorksheetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalSelected = selectedWorksheetIds.length;
  const hasData = worksheet && worksheet.data.length > 0;

  const showingRange = useMemo(() => {
    if (!worksheet) return null;
    const start = (worksheet.current_page - 1) * worksheet.per_page + 1;
    const end = Math.min(
      worksheet.current_page * worksheet.per_page,
      worksheet.total
    );
    return { start, end };
  }, [worksheet]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFinanceData();
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Rekap Keuangan
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Laporan keuangan dari semua transaksi yang telah dilakukan
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                  aria-hidden
                />
                <input
                  id="search"
                  type="text"
                  placeholder="Cari laporan..."
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-9 py-2.5 text-sm outline-none ring-2 ring-transparent focus:ring-neutral-300 dark:focus:ring-neutral-700 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search reports"
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
                type="button"
                disabled={exporting}
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-2 md:px-4 py-2 text-sm font-semibold shadow hover:shadow-md hover:bg-neutral-800 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <div className="inline md:hidden sm:hidden lg:inline">
                  Export All
                </div>
              </button>
            </div>
          </div>

          {/* Date Filter */}
          <div className="my-6">
            <Label className="mb-2">Filter Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarCog className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pilih Tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow dark:bg-neutral-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Down Payment
              </h3>
              <p className="mt-2 text-2xl font-bold text-primary">
                {headerData ? formatCurrency(headerData.totalDownPayment) : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow dark:bg-neutral-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Paid
              </h3>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {headerData ? formatCurrency(headerData.totalPaid) : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow dark:bg-neutral-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Sale
              </h3>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {headerData ? formatCurrency(headerData.totalSale) : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow dark:bg-neutral-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Remaining
              </h3>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {headerData ? formatCurrency(headerData.totalRemaining) : "-"}
              </p>
            </div>
          </div>

          {/* Bulk action bar */}
          <div
            className={[
              "rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-900 dark:bg-yellow-950",
              "flex items-center justify-between",
              "transition-all duration-300 ease-out",
              totalSelected > 0
                ? "opacity-100 translate-y-0 max-h-20 mt-1 mb-3"
                : "opacity-0 -translate-y-2 max-h-0 mt-0 mb-0 pointer-events-none overflow-hidden",
            ].join(" ")}
          >
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">{totalSelected}</span> laporan dipilih
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

          {/* Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={
                        !!(
                          worksheet &&
                          worksheet.data.length > 0 &&
                          selectedWorksheetIds.length === worksheet.data.length
                        )
                      }
                      onChange={handleSelectAll}
                      disabled={!worksheet || worksheet.data.length === 0}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3">Order Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Down Payment</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {!worksheet || worksheet.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-700 dark:text-gray-300"
                    >
                      <p className="text-lg font-semibold">No finance data found</p>
                      <p className="mt-2">
                        Try adjusting your search criteria or add new records.
                      </p>
                    </td>
                  </tr>
                ) : (
                    worksheet.data.map((worksheet) => (
                        <tr
                          key={worksheet.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id={`checkbox-table-search-${worksheet.id}`}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                checked={selectedWorksheetIds.includes(
                                  worksheet.id
                                )}
                                onChange={() => handleSelectOne(worksheet.id)}
                              />
                              <label
                                htmlFor={`checkbox-table-search-${worksheet.id}`}
                                className="sr-only"
                              >
                                checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {worksheet.order_date_formatted}
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {worksheet?.customer_personal?.full_name ||
                              worksheet.customer_bank?.name ||
                              worksheet.customer_company?.name ||
                              "-"}
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {worksheet.fee_formatted}
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {worksheet.down_payment_formatted}
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {worksheet.status}
                          </td>
                        </tr>
                      ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {hasData && (
              <nav
                className="flex items-center flex-col md:flex-row justify-between pt-4 pb-5"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 ml-4 md:mb-0 block w-full md:inline md:w-auto">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showingRange?.start}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {showingRange?.end}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {worksheet?.total}
                  </span>{" "}
                  entries
                </span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 mr-4">
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange((worksheet?.current_page || 1) - 1)
                      }
                      disabled={worksheet?.current_page === 1}
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    >
                      Previous
                    </button>
                  </li>
                  {worksheet &&
                    Array.from({ length: worksheet.last_page }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <li key={pageNumber}>
                          <button
                            onClick={() => handlePageChange(pageNumber)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight ${
                              pageNumber === worksheet.current_page
                                ? "text-blue-600 border border-gray-300 bg-blue-50 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      )
                    )}
                  <li>
                    <button
                      onClick={() =>
                        handlePageChange((worksheet?.current_page || 1) + 1)
                      }
                      disabled={worksheet?.current_page === worksheet?.last_page}
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
