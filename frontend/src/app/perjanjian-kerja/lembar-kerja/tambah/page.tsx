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
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  Check,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

import { LemabarKerja } from "@/types/perjanjian-kerja/lembar-kerja/lembar-kerja";
import { LembarKerjaAttachment } from "@/types/perjanjian-kerja/lembar-kerja/lembar-kerja-attachment";
import { CustomerPersonal } from "@/types/pelanggan/perorangan/customer-personal";
import { TemplateDeed } from "@/types/master-data/template-deed/template-deed";
import { CustomerBank } from "@/types/pelanggan/bank/customer-bank";
import { CustomerCompany } from "@/types/pelanggan/perusahaan/customer-company";

export default function CreateWorksheet() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<Partial<LemabarKerja>>({
    customer_personal_id: null,
    customer_bank_id: null,
    customer_company_id: null,
    template_deed_id: null,
    order_number: "",
    order_date: "",
    type_customer: "",
    name_worksheet: "",
    deadline_date: "",
    description: "",
    down_payment: "",
    fee: "",
    status: "",
  });

  const [open, setOpen] = useState(false);
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [typeCustomerOptions, setTypeCustomerOptions] = useState<
    Array<{ name: string; value: string }>
  >([]);
  const [statusOrderOptions, setStatusOrderOptions] = useState<
    Array<{ name: string; value: string }>
  >([]);
  const [customerPersonals, setCustomerPersonals] = useState<
    CustomerPersonal[]
  >([]);
  const [selectedAppearers, setSelectedAppearers] = useState<number[]>([]);
  const [templateDeedOptions, setTemplateDeedOptions] = useState<
    TemplateDeed[]
  >([]);
  const [customerBankOptions, setCustomerBankOptions] = useState<
    CustomerBank[]
  >([]);
  const [customerCompanyOptions, setCustomerCompanyOptions] = useState<
    CustomerCompany[]
  >([]);

  const [attachments, setAttachments] = useState<
    (LembarKerjaAttachment & { file?: File | null })[]
  >([]);

  // Define steps for the stepper
  const steps = [
    { 
      id: 1, 
      label: "Worksheet Info", 
      description: "Basic worksheet details" 
    },
    { 
      id: 2, 
      label: "Appearers & Files", 
      description: "Select appearers and attachments" 
    },
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          typeCustomerResponse,
          statusOrderOptionsResponse,
          customerPersonalsResponse,
          templateDeedsResponse,
          customerBanksResponse,
          customerCompaniesResponse,
        ] = await Promise.all([
          api.get("/worksheet-notaries/type-customer-options"),
          api.get("/worksheet-notaries/status-order-options"),
          api.get("/customer-personals"),
          api.get("/template-deeds"),
          api.get("/customer-banks"),
          api.get("/customer-companies"),
        ]);

        setTypeCustomerOptions(typeCustomerResponse.data.type_customer_options);
        setStatusOrderOptions(statusOrderOptionsResponse.data.status);
        setCustomerPersonals(
          customerPersonalsResponse.data.customer_personal.data || []
        );
        setTemplateDeedOptions(
          templateDeedsResponse.data.template_deed.data || []
        );
        setCustomerBankOptions(
          customerBanksResponse.data.customer_bank.data || []
        );
        setCustomerCompanyOptions(
          customerCompaniesResponse.data.customer_company.data || []
        );
      } catch (err: any) {
        showError(err.message || "Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (name: keyof LemabarKerja, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = (): boolean => {
    if (!formData.template_deed_id) {
      showError("Template Deed is required");
      return false;
    }
    if (!formData.order_number) {
      showError("Order number is required");
      return false;
    }
    if (!orderDate) {
      showError("Order date is required");
      return false;
    }
    if (!formData.type_customer) {
      showError("Type customer is required");
      return false;
    }
    if (!formData.name_worksheet) {
      showError("Worksheet name is required");
      return false;
    }
    if (!deadlineDate) {
      showError("Deadline date is required");
      return false;
    }
    if (!formData.fee) {
      showError("Fee is required");
      return false;
    }
    if (!formData.status) {
      showError("Status is required");
      return false;
    }
    return true;
  };

  const goToStep = (stepId: number) => {
    if (stepId === 2 && !validateStep1()) {
      return; // jangan lanjut kalau validasi gagal
    }
    setCurrentStep(stepId);
  };

  // Attachment handlers
  const addAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: 0,
        worksheet_notary_id: 0,
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
    field: keyof (LembarKerjaAttachment & { file?: File | null }),
    value: any
  ) => {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // Basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "order_date" &&
          key !== "deadline_date"
        ) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (orderDate) {
        formDataToSend.append("order_date", format(orderDate, "yyyy-MM-dd"));
      }

      if (deadlineDate) {
        formDataToSend.append(
          "deadline_date",
          format(deadlineDate, "yyyy-MM-dd")
        );
      }

      // Appearers
      selectedAppearers.forEach((appearerId, index) => {
        formDataToSend.append(
          `appearers[${index}][appearer_id]`,
          appearerId.toString()
        );
      });

      // Attachments
      attachments.forEach((att, i) => {
        if (att.file) {
          formDataToSend.append(`attachments[${i}][file]`, att.file);
        }
        formDataToSend.append(`attachments[${i}][file_name]`, att.file_name);
        if (att.note) {
          formDataToSend.append(`attachments[${i}][note]`, att.note);
        }
      });

      await api.post("/worksheet-notaries", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("Worksheet created successfully!");
      router.push("/perjanjian-kerja/lembar-kerja");
    } catch (error: any) {
      if (error.response?.status === 422) {
        showValidationErrors(error.response.data.errors);
      } else {
        showError("Failed to create worksheet!");
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

  // Multi-select handlers and state
  const handleSelectAppearer = (customerId: number) => {
    setSelectedAppearers((prevSelected) => {
      // Check if the customer is already in the array
      if (prevSelected.includes(customerId)) {
        // If it exists, filter it out (remove)
        return prevSelected.filter((id) => id !== customerId);
      } else {
        // If it doesn't exist, add it
        return [...prevSelected, customerId];
      }
    });
  };

  const getSelectedAppearerNames = () => {
    return selectedAppearers.map((id) => {
      const customer = customerPersonals.find((c) => c.id === id);
      return customer ? `${customer.first_name} ${customer.last_name}` : "";
    });
  };

  const isAppearerChecked = (customerId: number) => {
    return selectedAppearers.includes(customerId);
  };

  const removeAppearer = (customerId: number) => {
    setSelectedAppearers((prevSelected) =>
      prevSelected.filter((id) => id !== customerId)
    );
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Template Deed */}
      <div>
        <Label className="mb-2" htmlFor="template_deed_id">
          Template Deed
        </Label>
        <Select
          value={formData.template_deed_id?.toString() || ""}
          onValueChange={(value) =>
            handleInputChange("template_deed_id", parseInt(value))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Template Deed" />
          </SelectTrigger>
          <SelectContent>
            {templateDeedOptions.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Personal */}
        <div>
          <Label className="mb-2" htmlFor="customer_personal_id">
            Customer Personal
          </Label>
          <Select
            value={formData.customer_personal_id?.toString() || ""}
            onValueChange={(value) =>
              handleInputChange("customer_personal_id", parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer Personal" />
            </SelectTrigger>
            <SelectContent>
              {customerPersonals.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.first_name} {option.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Customer Bank */}
        <div>
          <Label className="mb-2" htmlFor="customer_bank_id">
            Customer Bank
          </Label>
          <Select
            value={formData.customer_bank_id?.toString() || ""}
            onValueChange={(value) =>
              handleInputChange("customer_bank_id", parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer Bank" />
            </SelectTrigger>
            <SelectContent>
              {customerBankOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Customer Company */}
        <div>
          <Label className="mb-2" htmlFor="customer_company_id">
            Customer Company
          </Label>
          <Select
            value={formData.customer_company_id?.toString() || ""}
            onValueChange={(value) =>
              handleInputChange("customer_company_id", parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer Company" />
            </SelectTrigger>
            <SelectContent>
              {customerCompanyOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order Number */}
        <div>
          <Label className="mb-2" htmlFor="order_number">
            Order Number
          </Label>
          <Input
            id="order_number"
            value={formData.order_number || ""}
            onChange={(e) => handleInputChange("order_number", e.target.value)}
            placeholder="Order Number"
          />
        </div>
        {/* Order Date */}
        <div>
          <Label className="mb-2">Order Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !orderDate && "text-muted-foreground"
                )}
              >
                <CalendarCog className="mr-2 h-4 w-4" />
                {orderDate ? (
                  format(orderDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={orderDate}
                onSelect={(date) => {
                  setOrderDate(date);
                  if (date) {
                    handleInputChange("order_date", format(date, "yyyy-MM-dd"));
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        {/* Type Customer */}
        <Label className="mb-2" htmlFor="type_customer">
          Type Customer
        </Label>
        <Select
          value={formData.type_customer || ""}
          onValueChange={(value) => handleInputChange("type_customer", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type Customer" />
          </SelectTrigger>
          <SelectContent>
            {typeCustomerOptions.map((option) => (
              <SelectItem key={option.name} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Worksheet Name */}
      <div>
        <Label className="mb-2" htmlFor="name_worksheet">
          Worksheet Name
        </Label>
        <Input
          id="name_worksheet"
          value={formData.name_worksheet || ""}
          onChange={(e) => handleInputChange("name_worksheet", e.target.value)}
          placeholder="Worksheet Name"
        />
      </div>

      {/* Deadline Date */}
      <div>
        <Label className="mb-2">Deadline Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !deadlineDate && "text-muted-foreground"
              )}
            >
              <CalendarCog className="mr-2 h-4 w-4" />
              {deadlineDate ? (
                format(deadlineDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadlineDate}
              onSelect={(date) => {
                setDeadlineDate(date);
                if (date) {
                  handleInputChange(
                    "deadline_date",
                    format(date, "yyyy-MM-dd")
                  );
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Down Payment */}
        <div>
          <Label className="mb-2" htmlFor="down_payment">
            Down Payment
          </Label>
          <Input
            id="down_payment"
            type="number"
            value={formData.down_payment || ""}
            onChange={(e) => handleInputChange("down_payment", e.target.value)}
            placeholder="Down Payment"
          />
        </div>
        {/* Fee */}
        <div>
          <Label className="mb-2" htmlFor="fee">
            Fee
          </Label>
          <Input
            id="fee"
            type="number"
            value={formData.fee || ""}
            onChange={(e) => handleInputChange("fee", e.target.value)}
            placeholder="Fee"
          />
        </div>
        <div>
          {/* Status */}
          <Label className="mb-2" htmlFor="status">
            Status Order
          </Label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOrderOptions.map((option) => (
                <SelectItem key={option.name} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label className="mb-2" htmlFor="description">
          Description
        </Label>
        <textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Description"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Appearers</h3>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {selectedAppearers.length > 0 ? (
                  getSelectedAppearerNames().map((name, index) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-1 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      {name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const customerIdToRemove = customerPersonals.find(
                            (c) => `${c.first_name} ${c.last_name}` === name
                          )?.id;
                          if (customerIdToRemove) {
                            removeAppearer(customerIdToRemove);
                          }
                        }}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">Select Appearers</span>
                )}
              </div>
              <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0">
            <Command>
              <CommandInput placeholder="Search appearer..." />
              <CommandEmpty>No appearer found.</CommandEmpty>
              <CommandGroup>
                {customerPersonals.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.first_name} ${customer.last_name}`}
                    onSelect={() => handleSelectAppearer(customer.id)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={isAppearerChecked(customer.id)}
                      onCheckedChange={() => handleSelectAppearer(customer.id)}
                    />
                    {customer.first_name} {customer.last_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              Manage Attachments
              {attachments.length > 0 && (
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
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
              <p className="text-sm text-gray-600">
                Add files and organize your attachments
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              {attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    No attachments yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Start by adding your first attachment
                  </p>
                  <Button
                    onClick={addAttachment}
                    className="gap-2 cursor-pointer bg-black hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Attachment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto pr-2 max-h-[50vh]">
                  {attachments.map((att, i) => (
                    <div
                      key={i}
                      className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Upload className="w-5 h-5 text-gray-600" />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
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
                                className="border-gray-200 focus:border-black focus:ring-black/20"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
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
                                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                <FileText className="w-4 h-4" />
                                <span>Choose File</span>
                              </label>

                              {att.file && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                                  <FileText className="w-3 h-3" />
                                  <span className="font-medium">
                                    {att.file.name}
                                  </span>
                                  <span>
                                    ({Math.round(att.file.size / 1024)} KB)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Note (Optional)
                            </Label>
                            <Input
                              placeholder="Add a note or description..."
                              value={att.note || ""}
                              onChange={(e) =>
                                updateAttachment(i, "note", e.target.value)
                              }
                              className="border-gray-200 focus:border-black focus:ring-black/20"
                            />
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
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
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={addAttachment}
                  className="w-full gap-2 border-dashed cursor-pointer border-gray-300 hover:border-black hover:bg-gray-50 text-gray-600 hover:text-black transition-colors bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Attachment
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setOpen(false)}
                className="bg-black hover:bg-gray-800 cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-12 py-8">
          <div className="min-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Create Worksheet</h1>

            {/* Modern Black & White Stepper */}
            <div className="mb-12">
              {/* Progress Bar */}
              <div className="relative mb-8">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-gray-800 to-black transition-all duration-700 ease-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step) => {
                    const status = getStepStatus(step.id);
                    return (
                      <div key={step.id} className="flex flex-col items-center group cursor-pointer" onClick={() => goToStep(step.id)}>
                        {/* Step Circle */}
                        <div className={`
                          relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out transform hover:scale-110
                          ${status === 'completed' 
                            ? 'bg-black text-white shadow-lg shadow-black/30' 
                            : status === 'active' 
                            ? 'bg-black text-white shadow-xl shadow-black/40 ring-4 ring-gray-200' 
                            : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-gray-500 group-hover:text-gray-600'
                          }
                        `}>
                          {status === 'completed' ? (
                            <Check size={16} className="animate-in zoom-in duration-300" />
                          ) : (
                            <span className="text-sm font-semibold">{step.id}</span>
                          )}
                          
                          {/* Pulse animation for active step */}
                          {status === 'active' && (
                            <div className="absolute inset-0 rounded-full bg-black animate-ping opacity-20"></div>
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="mt-3 text-center">
                          <div className={`
                            text-sm font-semibold transition-colors duration-300
                            ${status === 'active' ? 'text-black' : status === 'completed' ? 'text-black' : 'text-gray-500'}
                          `}>
                            {step.label}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 font-medium mb-4">
                    Step {currentStep} of {steps.length}
                    <ChevronRight size={16} />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {steps[currentStep - 1].label}
                  </h2>
                  
                  <p className="text-gray-600 mb-8 text-lg">
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                {/* Form Content */}
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  {currentStep === 1 ? renderStep1() : renderStep2()}
                </form>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={currentStep === 1}
                  className={`
                    px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                    ${currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                    }
                  `}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <div className="text-sm text-gray-500">
                  Progress: {Math.round(((currentStep) / steps.length) * 100)}%
                </div>
                
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) {
                        setCurrentStep(2);
                      }
                    }}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transform hover:scale-105"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? "Saving..." : "Save Worksheet"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}