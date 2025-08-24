"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paperclip,
  Plus,
  X,
  Upload,
  FileText,
} from "lucide-react";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import {
  showSuccess,
  showError,
  showValidationErrors,
} from "@/services/toastService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CustomerBank } from "@/types/pelanggan/bank/customer-bank";
import { CustomerBankAttachment } from "@/types/pelanggan/bank/customer-bank-attachment";

// ------------------- Component -------------------
export default function CreateCustomerBank() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerBank>>({
    name: "",
    contact_person: "",
    license_number: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    note: "",
  });

  const [open, setOpen] = useState(false);

  const [attachments, setAttachments] = useState<
    (CustomerBankAttachment & { file?: File | null })[]
  >([]);


  const handleInputChange = (name: keyof CustomerBank, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------- Attachment handlers -------------------
  const addAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: 0,
        customer_bank_id: 0,
        file_name: "",
        file_path: "",
        file_url: "",
        note: "",
        created_at: "",
        updated_at: "",
        file: null,
      },
    ]);
  };

  const updateAttachment = (
    index: number,
    field: keyof (CustomerBankAttachment & { file?: File | null }),
    value: any
  ) => {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------- Submit -------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value as string);
        }
      });
      // attachments
      attachments.forEach((att, i) => {
        if (att.file) {
          formDataToSend.append(`attachments[${i}][file]`, att.file);
        }
        formDataToSend.append(`attachments[${i}][file_name]`, att.file_name);
        if (att.note) {
          formDataToSend.append(`attachments[${i}][note]`, att.note);
        }
      });

      await api.post("/customer-banks", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("Customer bank created successfully!");
      router.push("/pelanggan/bank");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create customer bank!");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // ------------------- Render -------------------
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-16 py-8">
          <h1 className="text-2xl font-bold mb-6">Create Customer Bank</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="name">Nama Bank/Leasing</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  placeholder="Nama Bank/Leasing"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="contact_person">Penanggung Jawab</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person || ""}
                  onChange={(e) =>
                    handleInputChange("contact_person", e.target.value)
                  }
                  placeholder="Penanggung Jawab"
                />
              </LabelInputContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="license_number">No Identitas Bank/Leasing</Label>
                <Input
                  id="license_number"
                  type="number"
                  value={formData.license_number || ""}
                  onChange={(e) => handleInputChange("license_number", e.target.value)}
                  placeholder="No Identitas Bank/Leasing"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Address"
                />
            </LabelInputContainer>
            </div>

            {/* Email, Phone, Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email"
                />
                </LabelInputContainer>
                <LabelInputContainer>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Phone Number"
                />
                </LabelInputContainer>
            </div>

            {/* City, Province, Postal Code, NPWP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LabelInputContainer>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={formData.province || ""}
                  onChange={(e) =>
                    handleInputChange("province", e.target.value)
                  }
                  placeholder="Province"
                />
              </LabelInputContainer>
                <LabelInputContainer>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                    id="postal_code"
                    value={formData.postal_code || ""}
                    onChange={(e) =>
                        handleInputChange("postal_code", e.target.value)
                    }
                    placeholder="Postal Code"
                    />
                </LabelInputContainer>
            </div>

            <LabelInputContainer>
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                value={formData.note || ""}
                onChange={(e) => handleInputChange("note", e.target.value)}
                placeholder="Note"
              />
            </LabelInputContainer>

            {/* Attachments */}
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer hover:bg-slate-50 transition-colors bg-transparent"
                  >
                    <Paperclip className="w-4 h-4" />
                    Manage Attachments
                    {attachments.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {attachments.length}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">
                      Manage Attachments
                    </DialogTitle>
                    <p className="text-sm text-slate-600">
                      Add files and organize your attachments
                    </p>
                  </DialogHeader>

                  <div className="flex-1 overflow-hidden">
                    {attachments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-2">
                          No attachments yet
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                          Start by adding your first attachment
                        </p>
                        <Button onClick={addAttachment} className="gap-2 cursor-pointer">
                          <Plus className="w-4 h-4" />
                          Add First Attachment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 overflow-y-auto pr-2 max-h-[50vh]">
                        {attachments.map((att, i) => (
                          <div
                            key={i}
                            className="group border border-slate-200 rounded-xl p-5 bg-white hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Upload className="w-5 h-5 text-blue-600" />
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">
                                      Display Name
                                    </Label>
                                    <Input
                                      placeholder="Enter a custom name..."
                                      value={att.file_name}
                                      onChange={(e) =>
                                        updateAttachment(
                                          i,
                                          "file_name",
                                          e.target.value
                                        )
                                      }
                                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">
                                      File
                                    </Label>

                                    {/* Hidden real input */}
                                    <input
                                      id={`attachment-${i}`}
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx"
                                      onChange={(e) =>
                                        updateAttachment(
                                          i,
                                          "file",
                                          e.target.files?.[0] || null
                                        )
                                      }
                                      className="hidden"
                                    />

                                    {/* Custom trigger */}
                                    <label
                                      htmlFor={`attachment-${i}`}
                                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 cursor-pointer"
                                    >
                                      <FileText className="w-4 h-4" />
                                      <span>Choose File</span>
                                    </label>

                                    {att.file && (
                                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-md">
                                        <FileText className="w-3 h-3" />
                                        <span className="font-medium">
                                          {att.file.name}
                                        </span>
                                        <span>
                                          ({Math.round(att.file.size / 1024)}{" "}
                                          KB)
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">
                                    Note (Optional)
                                  </Label>
                                  <Input
                                    placeholder="Add a note or description..."
                                    value={att.note || ""}
                                    onChange={(e) =>
                                      updateAttachment(
                                        i,
                                        "note",
                                        e.target.value
                                      )
                                    }
                                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                  />
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(i)}
                                className="opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {attachments.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <Button
                        variant="outline"
                        onClick={addAttachment}
                        className="w-full gap-2 cursor-pointer border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Attachment
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setOpen(false)}
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={saving}>
              {saving ? "Creating..." : "Create Customer Bank"}
            </Button>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

// ------------------- Helper -------------------
function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
}