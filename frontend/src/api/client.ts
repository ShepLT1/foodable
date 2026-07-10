import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  public readonly status: number;
  public readonly detail: string;

  constructor(status: number, detail: string) {
    super(detail);

    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

// Every api request to Foodable backend will use this handler. See users.ts for example usage.
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");

  // Include Supabase bearer token as header for each request
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });
  
  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(response.status, body?.detail ?? response.statusText);
  }

  return response.json() as Promise<T>;
}
