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
import { Role } from "@/types/role";

// ------------------- Component -------------------
export default function EditRole() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null);


  const [formData, setFormData] = useState<{ name: string }>({
    name: "",
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/roles/${id}`);
        const role = response.data.role;
        setFormData(role);
        console.log(role);

      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRole();
  }, [id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post(`/roles/${id}?_method=PUT`, formData);
      showSuccess("Role created successfully!");
      router.push("/role");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create role!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-6 sm:px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit Role</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <LabelInputContainer>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter role name"
                required
              />
            </LabelInputContainer>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer px-6"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
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
