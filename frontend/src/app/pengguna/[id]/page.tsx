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
import { User } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PermissionRoute } from "@/components/PermissionRoute";



// ------------------- Component -------------------
export default function CreateUser() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null);
  const [roleResponse, setRoleResponse] = useState<any[]>([]);


  const [formData, setFormData] = useState<{ name: string, username: string, email: string, password: string, password_confirmation: string, current_password: string, role_id: string }>({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    current_password: "",
    role_id: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`);
        const user = response.data.user;
        setFormData({...formData, name: user.name, username: user.username, email: user.email, role_id: user.role_id.toString()});
        console.log(user);

      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

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

    if (id) fetchUser();
  }, [id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.post(`/users/${id}?_method=PUT`, formData);
      showSuccess("User updated successfully!");
      router.push("/pengguna");
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Handle validation errors
        if (error.response.data.errors) {
          showValidationErrors(error.response.data.errors);
        } else if (error.response.data.error_message) {
          // Handle error message from repository (e.g., incorrect current password)
          showError(error.response.data.error_message);
        } else {
          showError("Validation failed. Please check your input.");
        }
      } else if (error.response?.data?.error_message) {
        // Handle error message from repository
        showError(error.response.data.error_message);
      } else {
        showError(error.response?.data?.message || "Failed to update user!");
      }
    } finally {
      setSaving(false);
    }
  };

  // ------------------- Render -------------------
   return (
    <ProtectedRoute>
      <PermissionRoute requiredPermissions={['User-Edit']}>
        <Layout>
        <div className="container mx-auto px-6 sm:px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Create User</h1>

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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Masukkan username"
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
                <Label htmlFor="current_password">Password Saat Ini</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => handleInputChange("current_password", e.target.value)}
                  placeholder="Masukkan password saat ini untuk mengubah password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Kosongkan password fields jika tidak ingin mengubah password
                </p>
              </LabelInputContainer>
            </div>
            {(formData.current_password || formData.password || formData.password_confirmation) && (
              <div className="flex space-x-6">
                <LabelInputContainer>
                  <Label htmlFor="password">Password Baru</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Harus memiliki minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus (@$!%*?&)
                  </p>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                    placeholder="Masukkan konfirmasi password baru"
                  />
                </LabelInputContainer>
              </div>
            )}
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
                      <p className="px-3 py-2 text-sm text-gray-500">No roles available</p>
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
                {saving ? "Saving..." : "Update User"}
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
