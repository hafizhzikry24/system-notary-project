'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  redirectTo?: string;
  showErrorToast?: boolean;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  children, 
  requiredPermissions = [], 
  redirectTo = '/dashboard',
  showErrorToast = true
}) => {
  const { isAuthenticated, isLoading, permissions } = useAuth();
  const router = useRouter();

  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => permissions.includes(permission));

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRequiredPermissions) {
      if (showErrorToast) {
        showError('You do not have permission to access this page');
      }
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, hasRequiredPermissions, router, redirectTo, showErrorToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div role="status" aria-busy="true" className="flex flex-col items-center">
          <div className="animate-spin inline-block w-16 h-16 border-4 border-current border-t-transparent text-gray600 rounded-full mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mt-2">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRequiredPermissions) {
    return null;
  }

  return <>{children}</>;
};