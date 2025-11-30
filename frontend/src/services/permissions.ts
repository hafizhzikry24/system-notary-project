import { useAuth } from '@/contexts/AuthContext';

export const useHasPermission = (requiredPermission: string): boolean => {
  const { permissions } = useAuth();
  return permissions.includes(requiredPermission);
};