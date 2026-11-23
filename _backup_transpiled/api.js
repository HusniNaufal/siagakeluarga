// Client fetch tipis untuk backend SiagaKeluarga. Semua respons backend berbentuk
// { success, message, data? } (sukses) atau { success:false, message, errors? } (gagal)
// — lihat backend/src/middlewares/errorHandler.js & validate.js.
const BASE_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`;
const TOKEN_KEY = "siagakeluarga.token";
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
    if (token)
        localStorage.setItem(TOKEN_KEY, token);
    else
        localStorage.removeItem(TOKEN_KEY);
}
export class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}
function buildQuery(query) {
    if (!query)
        return "";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null)
            params.set(key, String(value));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}
async function request(path, options = {}) {
    const { method = "GET", body, query, auth = true } = options;
    const headers = {};
    if (body !== undefined)
        headers["Content-Type"] = "application/json";
    if (auth) {
        const token = getToken();
        if (token)
            headers.Authorization = `Bearer ${token}`;
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
    return json.data;
}
export const api = {
    get: (path, query, auth = true) => request(path, { method: "GET", query, auth }),
    post: (path, body, auth = true) => request(path, { method: "POST", body, auth }),
    put: (path, body, auth = true) => request(path, { method: "PUT", body, auth }),
    patch: (path, body, auth = true) => request(path, { method: "PATCH", body, auth }),
    delete: (path, auth = true) => request(path, { method: "DELETE", auth }),
};
