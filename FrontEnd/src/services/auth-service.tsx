import { api } from "../lib/api";

export interface LoginResponse {
    token: string;
    role: string;
    user: {
        id: number;
        profileId?: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        profileId?: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export class AuthService {
    static getToken(): string | null {
        return localStorage.getItem("token");
    }

    static getRole(): string | null {
        return localStorage.getItem("role");
    }

    static getId(): string | null {
        // Returns the role-specific profile ID (doctor_id or patient_id)
        // Falls back to user_id for admin
        return localStorage.getItem("profileId") || localStorage.getItem("id");
    }

    static getUserId(): string | null {
        return localStorage.getItem("id");
    }

    static getProfileId(): string | null {
        return localStorage.getItem("profileId");
    }

    static getFirstName(): string | null {
        return localStorage.getItem("firstName");
    }

    static getLastName(): string | null {
        return localStorage.getItem("lastName");
    }

    static getEmail(): string | null {
        return localStorage.getItem("email");
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        localStorage.removeItem("profileId");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");
    }

    static storeSession(token: string, role: string, user: { id: number; profileId?: number; firstName: string; lastName: string; email: string }) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role.toLowerCase());
        localStorage.setItem("id", String(user.id));
        localStorage.setItem("profileId", String(user.profileId ?? user.id));
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("email", user.email);
    }

    // Legacy helpers kept for backward compatibility
    static storeToken(token: string) {
        localStorage.setItem("token", token);
    }

    static storeRole(role: string) {
        localStorage.setItem("role", role.toLowerCase());
    }

    static storeId(id: string) {
        localStorage.setItem("id", id);
    }

    // ── API calls ──

    static async login(email: string, password: string): Promise<LoginResponse> {
        const data = await api.post("/auth/login", { email, password });
        return data as LoginResponse;
    }

    static async register(username: string, email: string, password: string): Promise<RegisterResponse> {
        const data = await api.post("/auth/register", { username, email, password });
        return data as RegisterResponse;
    }
}
