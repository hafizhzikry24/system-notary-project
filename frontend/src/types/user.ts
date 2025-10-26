import { Role } from "./role";

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  username: string;
  role_id: number;
  role: Role;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: User[];
}