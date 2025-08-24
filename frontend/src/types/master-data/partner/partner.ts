export interface Partner {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    province: string,
    postal_code: string,
    contact_person: string,
    contact_number: string,
    description: string,
    created_at: string,
    updated_at: string
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Partner[];
}