import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, ApiError, getToken, setToken } from "@/lib/api";
import type { AuthResponseLogin, AuthResponseRegister, MeResponse, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  household: MeResponse["household"];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<MeResponse>;
  register: (nama: string, email: string, password: string) => Promise<MeResponse>;
  logout: () => void;
  refreshMe: () => Promise<MeResponse | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [household, setHousehold] = useState<MeResponse["household"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setHousehold(null);
      return null;
    }
    try {
      const me = await api.get<MeResponse>("/auth/me");
      setUser(me.user);
      setHousehold(me.household);
      return me;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setToken(null);
        setUser(null);
        setHousehold(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    refreshMe().finally(() => setIsLoading(false));
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponseLogin>("/auth/login", { email, password }, false);
    setToken(data.token);
    setUser(data.user);
    const me = await refreshMe();
    return me ?? { user: data.user, household: null };
  }, [refreshMe]);

  const register = useCallback(async (nama: string, email: string, password: string) => {
    const data = await api.post<AuthResponseRegister>("/auth/register", { nama, email, password }, false);
    setToken(data.token);
    setUser(data.user);
    const me = await refreshMe();
    return me ?? { user: data.user, household: null };
  }, [refreshMe]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setHousehold(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      household,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, household, isLoading, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
