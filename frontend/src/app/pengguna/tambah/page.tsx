"use client";

import React, { use, useState, useEffect } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PermissionRoute } from "@/components/PermissionRoute";

// ------------------- Component -------------------
export default function CreateRole() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleResponse, setRoleResponse] = useState<any[]>([]);

  const [formData, setFormData] = useState<{ name: string, username: string, email: string, password: string, role_id: string, password_confirmation: string }>({
    name: "",
    username: "",
    email: "",
    password: "",
    role_id: "",
    password_confirmation: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const roleResponse = await api.get("/roles");
        setRoleResponse(roleResponse.data.roles.data || []);
      } catch (err: any) {
        showError(err.message || "Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/users", {
        ...formData,
        role_id: Number(formData.role_id),
      });
      showSuccess("User created successfully!");
      router.push("/pengguna");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create user!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <PermissionRoute requiredPermissions={['User-Create']}>            
        <Layout>
        <div className="container mx-auto px-6 sm:px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Tambah User</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex space-x-6">
              <LabelInputContainer>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="name">User Name</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Masukkan user name"
                  required
                />
              </LabelInputContainer>
            </div>
            <div className="flex space-x-6">
              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Masukkan password"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password_confirmation">
                  Konfirmasi Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Masukkan konfirmasi password"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    handleInputChange("password_confirmation", e.target.value)
                  }
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer>
              <Label htmlFor="role_id">Role</Label>
              <Select
                value={formData.role_id}
                onValueChange={(value) => handleInputChange("role_id", value)}
              >
                <SelectTrigger id="role_id" className="w-full">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleResponse.length > 0 ? (
                    roleResponse.map((option: any) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name}
                      </SelectItem>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Tidak ada role tersedia
                    </p>
                  )}
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="cursor-pointer px-6"
                disabled={saving}
              >
                {saving ? "Menambahkan..." : "Tambah Pengguna"}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
      </PermissionRoute>
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
