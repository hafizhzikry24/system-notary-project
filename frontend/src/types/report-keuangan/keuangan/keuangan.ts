import { CustomerPersonal } from "@/types/pelanggan/perorangan/customer-personal";
import { CustomerBank } from "@/types/pelanggan/bank/customer-bank";
import { CustomerCompany } from "@/types/pelanggan/perusahaan/customer-company";
import { TemplateDeed } from "@/types/master-data/template-deed/template-deed";

export interface HeaderData {
    totalDownPayment: number;
    totalPaid: number;
    totalSale: number;
    totalRemaining: number;
  }
  
  interface WorksheetData {
    id: number;
    customer_personal_id: number | null,
    customer_bank_id: number | null,
    customer_company_id: number | null,
    template_deed_id: number | null,
    order_number: string,
    type_customer: string,
    name_worksheet: string,
    order_date: string,
    order_date_formatted: string,
    deadline_date: string,
    deadline_date_formatted: string,
    status: string,
    created_at: string,
    updated_at: string
    customer_personal?: CustomerPersonal;
    customer_bank?: CustomerBank;
    customer_company?: CustomerCompany;
    template_deed?: TemplateDeed;
    fee_formatted: string;
    down_payment_formatted: string;

  }
  
  export interface PaginationData {
    data: WorksheetData[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }