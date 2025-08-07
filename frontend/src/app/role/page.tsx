  "use client";

  import { useState, useEffect } from "react";
  import { ProtectedRoute } from "@/components/ProtectedRoute";
  import { DeleteModal } from "@/components/ui/DeleteModal";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Search, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
  import { useRouter } from "next/navigation";
  import api from "@/services/api";
  import Layout from "@/components/layout/Layout";
  import { Role } from "@/types/role";

  interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Role[];
  }

  export default function Roles() {
    const router = useRouter();
    const [roles, setRoles] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
      isOpen: boolean;
      roleId: number | null;
    }>({
      isOpen: false,
      roleId: null,
    });

    const fetchRoles = async () => {
      try {
        const response = await api.get("/roles", {
          params: {
            search,
            page,
            per_page: perPage,
          },
        });
        setRoles(response.data.roles);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchRoles();
    }, [search, page, perPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    };

    const handleEditRole = (id: number) => {
      router.push(`/role/${id}`);
    };

    const handleDeleteRole = (id: number) => {
      setDeleteModal({ isOpen: true, roleId: id });
    };

    const handleConfirmDelete = async () => {
      if (!deleteModal.roleId) return;

      setDeletingId(deleteModal.roleId);
      try {
        await api.delete(`/roles/${deleteModal.roleId}`);
        await fetchRoles();
        setDeleteModal({ isOpen: false, roleId: null });
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to delete role:", err);
      } finally {
        setDeletingId(null);
      }
    };

    if (loading) {
      return (
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </ProtectedRoute>
      );
    }

    if (error) {
      return (
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center text-red-600">
            An error occurred: {error}
          </div>
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute>
        <Layout>
        <div className="min-h-screen bg-gray-50 p-3 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-sm sm:text-2xl font-bold text-gray-900">
                  Roles Management
                </h1>
                <Button className="flex items-center p-2 text-xs sm:text-sm" onClick={() => router.push("/role/create")}>
                  Add New Role
                </Button>
              </div>

              {/* Search Section */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search roles..."
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 w-full max-w-sm"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-center">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles?.data.length ? (
                    roles.data.map((role, index) => (
                      <TableRow key={role.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-center">
                          {(roles.current_page - 1) * roles.per_page + index + 1}
                        </TableCell>
                        <TableCell className="w-2/3">{role.name}</TableCell>
                        <TableCell className="text-center flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={deletingId === role.id}
                          >
                            {deletingId === role.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            ) : (
                              <Trash2 size={16} className="text-red-500" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-12 text-center">
                        No roles found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {roles && roles.last_page > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-700">
                    Showing {(roles.current_page - 1) * roles.per_page + 1} to{" "}
                    {Math.min(roles.current_page * roles.per_page, roles.total)}{" "}
                    of {roles.total} results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === roles.last_page}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Modal */}
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, roleId: null })}
            onConfirm={handleConfirmDelete}
            title="Delete Role"
            description="Are you sure you want to delete this role? This action cannot be undone."
            loading={deletingId === deleteModal.roleId}
          />
        </div>
        </Layout>
      </ProtectedRoute>
    );
  }
