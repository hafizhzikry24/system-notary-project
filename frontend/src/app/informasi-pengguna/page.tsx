'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, User as UserIcon, Mail, Shield } from 'lucide-react';
import Layout from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function InformasiPengguna() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute>
        <Layout>
            <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Pengguna</h1>
                </div>

                <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Detail Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                        <h3 className="font-medium">{user?.name}</h3>
                    </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Informasi Akun</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                <p className="text-sm font-medium">{user?.username}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bergabung Sejak</p>
                                <p className="text-sm font-medium">{formatDate(user?.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status Akun</p>
                                <div className="inline-flex items-center">
                                    <span className="h-2 w-2 rounded-full mr-2 bg-green-500"></span>
                                    <span className="text-sm font-medium">Aktif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
        </Layout>
    </ProtectedRoute>
  );
}