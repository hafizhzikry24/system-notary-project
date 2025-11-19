"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PermissionAccessProps {
  permission: string | string[]; // allow single or multiple permissions
  children: ReactNode;
  fallback?: ReactNode; // optional: show something else if denied
}

/**
 * <Can permission="User-Edit">...</Can>
 * or <Can permission={["User-Edit", "User-Delete"]}>...</Can>
 */
export const PermissionAccess = ({ permission, children, fallback = null }: PermissionAccessProps) => {
  const { permissions } = useAuth();

  if (!permissions || permissions.length === 0) return null;

  // handle multiple permissions (require ANY match)
  const required = Array.isArray(permission) ? permission : [permission];
  const hasPermission = required.some((perm) => permissions.includes(perm));

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
