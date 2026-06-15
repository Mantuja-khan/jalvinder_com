import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Ctx = {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const C = createContext<Ctx | null>(null);
const TOKEN_KEY = "lh_token_v1";
const SESSION_KEY = "lh_session_v1";
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://api.jalvindercomputer.com/api" : "http://localhost:5009/api");

const ADMIN_EMAIL = "jalvindercomputertechnology@gmail.com";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch {
        // Fallback to local session storage if server is offline
        const s = localStorage.getItem(SESSION_KEY);
        if (s) setUser(JSON.parse(s));
      } finally {
        setLoading(false);
      }
    }
    verifyToken();
  }, []);

  const persist = (u: AuthUser | null, token?: string) => {
    setUser(u);
    if (u) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const login: Ctx["login"] = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid email or password");
    }
    
    const data = await res.json();
    persist(data.user, data.token);
  };

  const register: Ctx["register"] = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to register account");
    }

    const data = await res.json();
    persist(data.user, data.token);
  };

  const adminLogin: Ctx["adminLogin"] = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid admin credentials");
    }
    
    const data = await res.json();
    if (data.user.role !== "admin") {
      throw new Error("Unauthorized: Not an administrator account.");
    }
    persist(data.user, data.token);
  };

  const logout = () => persist(null);

  return (
    <C.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
        login,
        register,
        adminLogin,
        logout,
      }}
    >
      {!loading && children}
    </C.Provider>
  );
}

export function useAuth() {
  const v = useContext(C);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}

export const ADMIN_HINT = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
export { API_BASE, TOKEN_KEY };
