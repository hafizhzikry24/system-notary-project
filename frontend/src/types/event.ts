export interface Event {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    start_date_formatted: string;
    end_date_formatted: string;
    priority?: string;
}

export type PriorityOption = {
  name: string;
  value: string;
};
