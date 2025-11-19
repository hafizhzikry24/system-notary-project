"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

// ------------------- Component -------------------
export default function CreateRole() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState<{ name: string }>({
    name: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------- Fetch Data -------------------
  useEffect(() => {
    const Permissions = async () => {
      try {
        setLoading(true);
        // get detail role and all permissions
        const [allPermRes] = await Promise.all([
          api.get(`/roles/get-all-permissions`),
        ]);

        const allPerms = allPermRes.data.permissions || [];

        setAllPermissions(allPerms);
        setSelectedPermissions(allPerms); 
      } catch (err: any) {
        console.error(err);
        setError(err);
        showError("Failed to load role or permissions");
      } finally {
        setLoading(false);
      }
    };

    Permissions();

  }, []);

  const handleCheckboxChange = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/roles", {
        ...formData,
        permissions: selectedPermissions,
      });
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
          <h1 className="text-2xl font-bold mb-6">Create Role</h1>

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

            {/* Permissions */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Permissions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {allPermissions.map((perm) => (
                    <Label key={perm} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={() => handleCheckboxChange(perm)}
                      />
                      <span>{perm}</span>
                    </Label>
                  ))}
                </div>
              </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer px-6"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create Role"}
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
