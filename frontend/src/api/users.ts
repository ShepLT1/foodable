import { api } from "./client";

export interface UserPublic {
  id: string;
  email: string;
}

export function getCurrentUser() {
  return api<UserPublic>("/users/me");
}
