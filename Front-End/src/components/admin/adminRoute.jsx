import { Navigate } from "react-router-dom"
import { useAuth } from "../AuthContext/authContext.jsx"

export default function AdminRoute({ children }) {
  const { user } = useAuth()

  if (!user) return null

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
