import { ContentType } from "../../../lib/constants/content-types";
import { getAuthToken } from "../../../lib/utils/auth-token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ContentRecord = {
  contentType: ContentType;
  content: string;
  updatedAt?: string;
};

export class ContentApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ContentApiError";
    this.status = status;
  }
}

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ContentApiError(
      body?.message ?? `Request failed with status ${res.status}`,
      res.status
    );
  }

  return res.json();
}

/** GET {{baseUrl}}/content/:contentType */
export function fetchContent(contentType: ContentType): Promise<ContentRecord> {
  return authFetch<ContentRecord>(`/content/${contentType}`, { method: "GET" });
}

/** POST {{baseUrl}}/content — upserts by contentType */
export function saveContent(
  contentType: ContentType,
  content: string
): Promise<ContentRecord> {
  return authFetch<ContentRecord>(`/content`, {
    method: "POST",
    body: JSON.stringify({ contentType, content }),
  });
}