import type { User } from "@/features/home/api/type";

export interface Board {
  id: string;
  name: string;
  description: string;
  invite_link_token: string;
  created_at: string;
  updated_at: string;
  visibility: string;
  workspace_id: string;
  cover_url: string;
  is_closed: boolean;
  created_by: User;
}

export interface AddBoardToWorkspaceRequest {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface AddBoardToWorkspaceResponse {
  workspace_id: string;
  name: string;
  description?: string;
  invite_link_token: string;
  created_by: User;
  cover_url: string;
  created_at: string;
  updated_at: string;
  id: string;
  is_closed: boolean;
  visibility: string;
}
