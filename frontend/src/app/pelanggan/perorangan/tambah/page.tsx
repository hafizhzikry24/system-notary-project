"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarCog,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CustomerPersonal } from "@/types/pelanggan/perorangan/customer-personal";
import { CustomerPersonalAttachment } from "@/types/pelanggan/perorangan/customer-personal-attachment";

// ------------------- Component -------------------
export default function CreateCustomerPersonal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<CustomerPersonal>>({
    first_name: "",
    last_name: "",
    nik: "",
    birth_date: "",
    birth_place: "",
    gender: "",
    marital_status: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    npwp: "",
    note: "",
  });

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [maritalOptions, setMaritalOptions] = useState<string[]>([]);

  const [attachments, setAttachments] = useState<
    (CustomerPersonalAttachment & { file?: File | null })[]
  >([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [genderResponse, maritalResponse] = await Promise.all([
          api.get("/customer-personals/gender-options"),
          api.get("/customer-personals/marital-options"),
        ]);
        setGenderOptions(genderResponse.data.gender_values);
        setMaritalOptions(maritalResponse.data.marital_status);
      } catch (err: any) {
        showError(err.message || "Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (name: keyof CustomerPersonal, value: string) => {
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
        customer_id: 0,
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
    field: keyof (CustomerPersonalAttachment & { file?: File | null }),
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
      if (date) {
        formDataToSend.append("birth_date", format(date, "yyyy-MM-dd"));
      }

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

      await api.post("/customer-personals", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("Customer Personal created successfully!");
      router.push("/pelanggan/perorangan");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create customer personal!");
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
          <h1 className="text-2xl font-bold mb-6">Create Customer Personal</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ""}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="First Name"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ""}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Last Name"
                />
              </LabelInputContainer>
            </div>

            {/* NIK + Birth Place */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  value={formData.nik || ""}
                  onChange={(e) => handleInputChange("nik", e.target.value)}
                  placeholder="NIK"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="birth_place">Birth Place</Label>
                <Input
                  id="birth_place"
                  value={formData.birth_place || ""}
                  onChange={(e) =>
                    handleInputChange("birth_place", e.target.value)
                  }
                  placeholder="Birth Place"
                />
              </LabelInputContainer>
            </div>

            {/* Birth Date */}
            <LabelInputContainer>
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarCog className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </LabelInputContainer>

            {/* Gender + Marital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="marital_status">Marital Status</Label>
                <Select
                  value={formData.marital_status || ""}
                  onValueChange={(value) =>
                    handleInputChange("marital_status", value)
                  }
                >
                  <SelectTrigger id="marital_status" className="w-full">
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabelInputContainer>
            </div>

            {/* Email, Phone, Address */}
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

            <LabelInputContainer>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Address"
              />
            </LabelInputContainer>

            {/* City, Province, Postal Code, NPWP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <LabelInputContainer>
                <Label htmlFor="npwp">NPWP</Label>
                <Input
                  id="npwp"
                  value={formData.npwp || ""}
                  onChange={(e) => handleInputChange("npwp", e.target.value)}
                  placeholder="NPWP"
                  type="number"
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
                    className="gap-2 hover:bg-slate-50 transition-colors bg-transparent cursor-pointer"
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
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
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
                        className="w-full gap-2 border-dashed cursor-pointer border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors bg-transparent"
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
              {saving ? "Creating..." : "Create Customer Personal"}
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