import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, getToken, setToken } from "@/lib/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [household, setHousehold] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshMe = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setUser(null);
            setHousehold(null);
            return null;
        }
        try {
            const me = await api.get("/auth/me");
            setUser(me.user);
            setHousehold(me.household);
            return me;
        }
        catch (err) {
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
    const login = useCallback(async (email, password) => {
        const data = await api.post("/auth/login", { email, password }, false);
        setToken(data.token);
        setUser(data.user);
        const me = await refreshMe();
        return me ?? { user: data.user, household: null };
    }, [refreshMe]);
    const register = useCallback(async (nama, email, password) => {
        const data = await api.post("/auth/register", { nama, email, password }, false);
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
    const value = useMemo(() => ({
        user,
        household,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshMe,
    }), [user, household, isLoading, login, register, logout, refreshMe]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
    return ctx;
}
