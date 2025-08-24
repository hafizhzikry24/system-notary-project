import { TemplateDeedAttachment } from "./template-deed-attachment";

export interface TemplateDeed {
    id: number,
    type: string,
    description: string,
    created_at: string,
    updated_at: string
    attachments?: TemplateDeedAttachment[];
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: TemplateDeed[];
}