export interface CashBank {
    id: number,
    fund_name: string,
    type: string,
    on_behalf_of: string,
    account_number: string,
    amount: number,
    amount_formatted: string,
    created_at: string,
    updated_at: string
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: CashBank[];
}