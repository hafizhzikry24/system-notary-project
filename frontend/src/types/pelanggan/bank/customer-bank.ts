import { CustomerBankAttachment } from "./customer-bank-attachment";

export interface CustomerBank {
    id: number;
    name: string,
    contact_person: string,
    license_number: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    province: string,
    postal_code: string,
    note: string,
    created_at: string,
    updated_at: string
    customer_bank_attachments: CustomerBankAttachment[]
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: CustomerBank[];
}