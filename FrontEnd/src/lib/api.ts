import { AuthService } from "../services/auth-service";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hospitalsystem-esdw.onrender.com/api";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = AuthService.getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorMessage = "An error occurred during the request.";
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
            // Ignored, fallback to default message
        }

        if (response.status === 401 || response.status === 403) {
            AuthService.logout();
            window.location.href = "/auth";
        }

        throw new ApiError(response.status, errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const api = {
    get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
    post: (endpoint: string, body: unknown) =>
        fetchWithAuth(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint: string, body: unknown) =>
        fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    patch: (endpoint: string, body?: unknown) =>
        fetchWithAuth(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
    delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" })
};
