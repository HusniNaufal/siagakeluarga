// Client fetch tipis untuk backend SiagaKeluarga. Semua respons backend berbentuk
// { success, message, data? } (sukses) atau { success:false, message, errors? } (gagal)
// — lihat backend/src/middlewares/errorHandler.js & validate.js.

const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
// Menggunakan relative path '/api' agar otomatis diteruskan oleh proxy (Vite di lokal, Vercel Rewrite di produksi)
// sehingga browser bebas dari kendala CORS (No Access-Control-Allow-Origin).
const BASE_URL = !envUrl || envUrl === "/api" || envUrl === "https://siagakeluarga.vercel.app"
  ? "/api"
  : (envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`);
const TOKEN_KEY = "siagakeluarga.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean; // default true — kirim Authorization kalau ada token
}

function buildQuery(query?: RequestOptions["query"]) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}${buildQuery(query)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const message = json?.message ?? `Permintaan gagal (${res.status})`;
    throw new ApiError(res.status, message, json?.errors);
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"], auth = true) =>
    request<T>(path, { method: "GET", query, auth }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PUT", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PATCH", body, auth }),
  delete: <T>(path: string, auth = true) => request<T>(path, { method: "DELETE", auth }),
};
