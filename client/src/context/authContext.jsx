import {useState, useEffect } from "react";
import api, { loginUser } from "../services/api";
import { AuthContext } from "./auth";


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    function applyAuth(userData, token) {
        setUser(userData);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("@RPG:user", JSON.stringify(userData));
        localStorage.setItem("@RPG:token", token);
    }

    function clearAuth() {
        localStorage.removeItem("@RPG:user");
        localStorage.removeItem("@RPG:token");
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("@RPG:user");
        const storedToken = localStorage.getItem("@RPG:token");

        if (!storedUser || !storedToken) {
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            applyAuth(parsedUser, storedToken);
        } catch {
            clearAuth();
        }
    }, []);

    async function signIn({ email, password }) {
        const response = await loginUser({ email, password });
        const { user: userData, token } = response.data;
        applyAuth(userData, token);
    }

    function signOut() {
        clearAuth();
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}