import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem("rb_token");
    if (t) authAPI.me().then(r => setUser(r.data)).catch(() => localStorage.removeItem("rb_token")).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (e, p) => { const r = await authAPI.login({ email: e, password: p }); localStorage.setItem("rb_token", r.data.token); setUser(r.data.user); return r.data; };
  const register = async d => { const r = await authAPI.register(d); localStorage.setItem("rb_token", r.data.token); setUser(r.data.user); return r.data; };
  const logout = () => { localStorage.removeItem("rb_token"); setUser(null); };
  const refresh = () => authAPI.me().then(r => setUser(r.data));
  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
