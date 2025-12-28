import type { User } from "@/features/home/api/type";

export interface Board {
  id: string;
  name: string;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  boards: Board[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface CreateWorkspaceResponse {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
