export interface Role {
  id: number;
  name: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Role[];
}