import { createContext, useContext, useState, useEffect} from "react";
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({children}){
    const [user,setUser] = useState(()=>{
        const savedUser = localStorage.getItem("user")
        if (!savedUser) return null

        try {
            return JSON.parse(savedUser)
        } catch {
            localStorage.removeItem("user")
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

    // runs once, When the app opens of refreshes.

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if (!token) return

        axios.get("http://localhost:3000/api/user/me", {
            headers:{Authorization:`Bearer ${token}`},
        }).then((response)=>{
            setUser(response.data.user)
            localStorage.setItem("user",JSON.stringify(response.data.user))
        }).catch((error)=>{
            if(error.response?.status === 401 || error.response?.status === 403){
                logout()
            }
        })
    },[])

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}