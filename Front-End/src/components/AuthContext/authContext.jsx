import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [user,setUser] = useState(()=>{
        const savedUser = localStorage.getItem("user")
        if (!savedUser) return null

        try {
            return JSON.parse(savedUser)
        } catch {
            return null
        }
    })

    const login = (token, userData)=>{
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}