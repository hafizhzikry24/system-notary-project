import api from "@/services/api";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { PaginationData } from "@/types/pelanggan/perorangan/customer-personal";

export default function customerPersonalTable() {
  const router = useRouter();
  const [personal, setPersional] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    personalId: number | null;
  }>({
    isOpen: false,
    personalId: null,
  });

  const fetchPersonal = async () => {
    try {
      const response = await api.get("/customer-personals", {
        params: {
          search,
          page,
          per_page: perPage,
        },
      });
      setPersional(response.data.customer_personal);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonal();
  }, [search, page, perPage]);
  const handleEditRPersonal = (id: number) => {
    router.push(`/pelanggan/perorangan/${id}`);
  };
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setDeleteModal({ isOpen: true, personalId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.personalId) return;

    setDeletingId(deleteModal.personalId);
    try {
      await api.delete(`/customer-personals/${deleteModal.personalId}`);
      await fetchPersonal();
      setDeleteModal({ isOpen: false, personalId: null });
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to delete role:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return <div></div>;
}
