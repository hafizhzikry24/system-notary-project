import { CustomerPersonalAttachment } from "./customer-personal-attachment";

export interface CustomerPersonal {
    id: number;
    first_name:string,
    last_name: string,
    full_name: string,
    nik: string,
    birth_date: string,
    birth_date_formatted: string,
    birth_place: string,
    gender: string,
    marital_status: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    province: string,
    postal_code: string,
    npwp: string,
    note: string,
    created_at: string,
    updated_at: string
    customer_personal_attachments: CustomerPersonalAttachment[]
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: CustomerPersonal[];
}