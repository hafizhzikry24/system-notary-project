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
import { Checkbox } from "@/components/ui/checkbox";

export default function EditRole() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [formData, setFormData] = useState<{ name: string }>({ name: "" });
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // ------------------- Fetch Data -------------------
  useEffect(() => {
    const fetchRoleAndPermissions = async () => {
      try {
        setLoading(true);
        // get detail role and all permissions
        const [roleRes, allPermRes] = await Promise.all([
          api.get(`/roles/${id}`),
          api.get(`/roles/get-all-permissions`),
        ]);

        const role = roleRes.data.role;
        const rolePerms = role.permissions || [];
        const allPerms = allPermRes.data.permissions || [];

        setFormData({ name: role.name });
        setAllPermissions(allPerms);
        setSelectedPermissions(rolePerms); // checklist permission that role has
      } catch (err: any) {
        console.error(err);
        setError(err);
        showError("Failed to load role or permissions");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoleAndPermissions();
  }, [id]);

  // ------------------- Handlers -------------------
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post(`/roles/${id}?_method=PUT`, {
        ...formData,
        permissions: selectedPermissions,
      });

      showSuccess("Role updated successfully!");
      router.push("/role");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to update role!");
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

          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Name */}
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

              {/* Submit */}
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
          )}
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
