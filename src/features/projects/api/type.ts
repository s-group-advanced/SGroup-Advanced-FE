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
  archive?: boolean;
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

export interface GetAllMemberOfWorkspaceButNotInWorkspaceResponse {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  roles: string[];
}

export interface InviteMemberToWorkspaceRequest {
  workspaceId: string;
  email: string;
}

export interface ArchiveWorkspaceRequest {
  workspaceId: string;
}

export interface UpdateWorkspaceRequest {
  workspaceId: string;
  name: string;
  description?: string;
}

export interface CreateLinkInvitationToWorkspaceRequest {
  workspaceId: string;
}

export interface CreateLinkInvitationToWorkspaceResponse {
  inviteUrl: string;
  token: string;
}

export interface DisableLinkInvitationToWorkspaceRequest {
  workspaceId: string;
  token: string;
}

export interface GetCurrentLinkInvitationToWorkspaceResponse {
  exists: boolean;
  inviteUrl?: string;
  token?: string;
  createdAt?: string;
}
