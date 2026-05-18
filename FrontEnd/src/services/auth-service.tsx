export class AuthService {
    static getToken(): string | null {
        return localStorage.getItem("token");
    }
    
    static getRole(): string | null {
        return localStorage.getItem("role");
    }

    static getId(): string | null {
        return localStorage.getItem("id");
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
    }

    static storeToken(token: string) {
        localStorage.setItem("token", token);
    }

    static storeRole(role: string) {
        localStorage.setItem("role", role);
    }

    static storeId(id: string) {
        localStorage.setItem("id", id);
    }
}