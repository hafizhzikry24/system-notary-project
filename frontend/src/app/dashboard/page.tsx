'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Username:</strong> {user?.username}</p>
              </CardContent>
            </Card>
            {/* Add more cards for dashboard stats */}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}