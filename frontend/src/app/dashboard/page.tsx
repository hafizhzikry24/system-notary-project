"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard!
                </h2>
                <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    User Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Name:</strong> {user?.name}
                    </p>
                    <p>
                      <strong>Username:</strong> {user?.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>User ID:</strong> {user?.id}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-gray-600">
                  This is a protected page. You can only see this if you're
                  authenticated.
                </p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
}
