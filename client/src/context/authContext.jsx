import { useCallback, useEffect, useState } from "react";
import api, { loginUser } from "../services/api";
import { AuthContext } from "./auth";

function decodeJwtPayload(token) {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
        return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    try {
        return JSON.parse(atob(paddedBase64));
    } catch {
        return null;
    }
}

function getTokenExpiration(token) {
    const payload = decodeJwtPayload(token);

    if (!payload?.exp) {
        return null;
    }

    return payload.exp * 1000;
}

function loadStoredAuth() {
    const storedUser = localStorage.getItem("@RPG:user");
    const storedToken = localStorage.getItem("@RPG:token");

    if (!storedUser || !storedToken) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(storedUser);
        const expiresAt = getTokenExpiration(storedToken);

        if (!expiresAt || expiresAt <= Date.now()) {
            localStorage.removeItem("@RPG:user");
            localStorage.removeItem("@RPG:token");
            return null;
        }

        return { user: parsedUser, token: storedToken };
    } catch {
        localStorage.removeItem("@RPG:user");
        localStorage.removeItem("@RPG:token");
        return null;
    }
}

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => loadStoredAuth());

    const clearAuth = useCallback(() => {
        localStorage.removeItem("@RPG:user");
        localStorage.removeItem("@RPG:token");
        setAuth(null);
    }, []);

    const applyAuth = useCallback((userData, token) => {
        setAuth({ user: userData, token });
        localStorage.setItem("@RPG:user", JSON.stringify(userData));
        localStorage.setItem("@RPG:token", token);
    }, []);

    useEffect(() => {
        if (auth?.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
            return;
        }

        delete api.defaults.headers.common["Authorization"];
    }, [auth]);

    useEffect(() => {
        if (!auth?.token) {
            return;
        }

        const expiresAt = getTokenExpiration(auth.token);

        if (!expiresAt) {
            clearAuth();
            return;
        }

        const millisecondsUntilExpiration = expiresAt - Date.now();

        if (millisecondsUntilExpiration <= 0) {
            clearAuth();
            return;
        }

        const timeoutId = window.setTimeout(() => {
            clearAuth();
        }, millisecondsUntilExpiration);

        return () => window.clearTimeout(timeoutId);
    }, [auth, clearAuth]);

    useEffect(() => {
        const interceptorId = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    clearAuth();
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptorId);
        };
    }, [clearAuth]);

    async function signIn({ email, password }) {
        const response = await loginUser({ email, password });
        const { user: userData, token } = response.data;
        applyAuth(userData, token);
    }

    function signOut() {
        clearAuth();
    }

    return (
        <AuthContext.Provider value={{ signed: !!auth, user: auth?.user ?? null, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}