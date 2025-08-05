'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function RolePage( ) {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/roles/`,  { name });
      router.push('/roles');
    } catch (err: any) {
      setError(err);
      console.error("Failed to create role:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/roles')}
                  className="mr-4"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                  {error.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex items-center"
                  >
                    {saving && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}