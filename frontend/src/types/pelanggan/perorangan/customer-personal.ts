import { CustomerPersonalAttachment } from "./customer-personal-attachment";

export interface CustomerPersonal {
    first_name:string,
    last_name: string,
    nik: string,
    birth_date: string,
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