import { createContext, useContext, useState, useEffect } from "react"
import api from "../../api/api.js"

const AuthContext = createContext()

function normalizeUser(userData) {
    if (!userData || typeof userData !== "object") return null

    return {
        ...userData,
        role: userData.role || "user",
        plan: userData.plan || "free",
        name: userData.name || userData.fullName || userData.email?.split("@")[0] || "User",
        email: userData.email || "",
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")
        if (!savedUser) return null

        try {
            return normalizeUser(JSON.parse(savedUser))
        } catch {
            localStorage.removeItem("user")
            return null
        }
    })

    const login = (token, userData) => {
        const normalizedUser = normalizeUser(userData)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(normalizedUser))
        setUser(normalizedUser)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        api.get("/user/me").then((response) => {
            const normalizedUser = normalizeUser(response.data.user)
            setUser(normalizedUser)
            localStorage.setItem("user", JSON.stringify(normalizedUser))
        }).catch((error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout()
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
