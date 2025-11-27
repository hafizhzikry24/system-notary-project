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
      router.push("/user");
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
      <Layout>
        <div className="container mx-auto px-6 sm:px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Create User</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex space-x-6">
              <LabelInputContainer>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="name">User Name</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter user name"
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
                  placeholder="Enter email"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => handleInputChange("current_password", e.target.value)}
                  placeholder="Enter current password to change password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave password fields empty if you don't want to change the password
                </p>
              </LabelInputContainer>
            </div>
            {(formData.current_password || formData.password || formData.password_confirmation) && (
              <div className="flex space-x-6">
                <LabelInputContainer>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
                  </p>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="password_confirmation">Confirm New Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                    placeholder="Confirm new password"
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
                    <SelectValue placeholder="Select Role" />
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
