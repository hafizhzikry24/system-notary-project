"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { CashBank } from "@/types/report-keuangan/kas-bank/kas-bank";

// ------------------- Component -------------------
export default function EditCashBank() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [fund, setFund] = useState<CashBank | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [fundResponse, typeResponse] = await Promise.all([
          api.get(`/fund-cash-bank/${id}`),
          api.get(`/fund-cash-bank/type-options`),
        ]);

        setFund(fundResponse.data.fund);
        setTypeOptions(typeResponse.data.type_of_fund);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fund) return;

    setSaving(true);
    try {
      await api.post(`/fund-cash-bank/${id}?_method=PUT`, fund);
      showSuccess("Kas/Bank updated successfully!");
      router.push("/rekap-keuangan/kas-bank");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to update Kas/Bank!");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit Kas & Dana Bank</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fund Name */}
            <LabelInputContainer>
              <Label htmlFor="fund_name">Nama Dana/Kas</Label>
              <Input
                id="fund_name"
                value={fund?.fund_name || ""}
                onChange={(e) =>
                  setFund((prev) =>
                    prev ? { ...prev, fund_name: e.target.value } : null
                  )
                }
                placeholder="Nama dana/kas"
              />
            </LabelInputContainer>

            {/* Type */}
            <LabelInputContainer>
              <Label htmlFor="type">Tipe Dana</Label>
              <Select
                value={fund?.type || ""}
                onValueChange={(value) =>
                  setFund((prev) => (prev ? { ...prev, type: value } : null))
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Pilih tipe dana" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </LabelInputContainer>

            {/* On Behalf Of */}
            <LabelInputContainer>
              <Label htmlFor="on_behalf_of">Atas Nama</Label>
              <Input
                id="on_behalf_of"
                value={fund?.on_behalf_of || ""}
                onChange={(e) =>
                  setFund((prev) =>
                    prev ? { ...prev, on_behalf_of: e.target.value } : null
                  )
                }
                placeholder="Atas nama rekening"
              />
            </LabelInputContainer>

            {/* Account Number */}
            <LabelInputContainer>
              <Label htmlFor="account_number">Nomor Rekening</Label>
              <Input
                id="account_number"
                value={fund?.account_number || ""}
                onChange={(e) =>
                  setFund((prev) =>
                    prev ? { ...prev, account_number: e.target.value } : null
                  )
                }
                placeholder="Nomor rekening"
              />
            </LabelInputContainer>

            {/* Amount */}
            <LabelInputContainer>
              <Label htmlFor="amount">Saldo Awal</Label>
              <Input
                id="amount"
                type="number"
                value={fund?.amount ?? ""}
                onChange={(e) =>
                  setFund((prev) =>
                    prev
                      ? { ...prev, amount: parseFloat(e.target.value) || 0 }
                      : null
                  )
                }
                placeholder="Saldo awal"
              />
            </LabelInputContainer>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Kas/Bank"}
            </Button>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

// ------------------- Helper -------------------
function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
}