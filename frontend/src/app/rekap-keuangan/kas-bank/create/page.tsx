"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
export default function CreateCashBank() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const fetchedRef = useRef(false);

  const [formData, setFormData] = useState<Partial<CashBank>>({
    fund_name: "",
    type: "",
    on_behalf_of: "",
    account_number: "",
    amount: 0,
  });

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchData = async () => {
      try {
        const [typeResponse] = await Promise.all([
          api.get(`/fund-cash-bank/type-options`),
        ]);

        const typeOptions = typeResponse.data.type_of_fund; 

        setTypeOptions(typeOptions);

      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (name: keyof CashBank, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/fund-cash-bank", formData);

      showSuccess("Kas/Bank created successfully!");
      router.push("/rekap-keuangan/kas-bank");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create Kas/Bank!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Create Kas & Dana Bank</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fund Name */}
            <LabelInputContainer>
              <Label htmlFor="fund_name">Nama Dana/Kas</Label>
              <Input
                id="fund_name"
                value={formData.fund_name || ""}
                onChange={(e) => handleInputChange("fund_name", e.target.value)}
                placeholder="Nama dana/kas"
              />
            </LabelInputContainer>

            {/* Type */}
            <LabelInputContainer>
              <Label htmlFor="type">Tipe Dana</Label>
              <Select
                name="type"
                value={formData.type || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
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
                value={formData.on_behalf_of || ""}
                onChange={(e) =>
                  handleInputChange("on_behalf_of", e.target.value)
                }
                placeholder="Atas nama rekening"
              />
            </LabelInputContainer>

            {/* Account Number */}
            <LabelInputContainer>
              <Label htmlFor="account_number">Nomor Rekening</Label>
              <Input
                id="account_number"
                value={formData.account_number || ""}
                onChange={(e) =>
                  handleInputChange("account_number", e.target.value)
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
                value={formData.amount ?? ""}
                onChange={(e) =>
                  handleInputChange("amount", parseFloat(e.target.value))
                }
                placeholder="Saldo awal"
              />
            </LabelInputContainer>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Kas/Bank"}
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
