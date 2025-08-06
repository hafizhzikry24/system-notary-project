'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/auth/login');
    } else {
      router.push('/dashboard');
    }
  }, []);
  

  // Show loading spinner while checking authentication
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div role="status" aria-busy="true" className="flex flex-col items-center">

          <div className="animate-spin inline-block w-16 h-16 border-4 border-current border-t-transparent text-gray-600 rounded-full mb-4" />

          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mt-2">Loading...</p>
        </div>
      </div>
  );
}
