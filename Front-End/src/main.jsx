import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './components/landingPage/landingPage.jsx'
import SignupPage from './components/signupPage/signupPage.jsx'
import LoginPage from './components/loginPage/loginPage.jsx'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashBoard from './components/dashBoard/dashBoard.jsx'
import CreatePage from './components/createPage/createPage.jsx'
import PublishPage from './components/publishPage/publishPage.jsx'
import { AuthProvider } from './components/AuthContext/authContext.jsx'
import ProtectedRoute from './components/protectedRoute/protectedRoute.jsx'
import ComingSoon from './components/comingSoon/comingSoon.jsx'
import AiToolsPage from './components/aiToolsPage/aiToolsPage.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<LandingPage/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  },
  {
    path:"/signup",
    element:<SignupPage/>
  },
  {
    path:"/dashboard",
    element:(<ProtectedRoute><DashBoard/></ProtectedRoute>)
  },
  {
    path:"/createpage",
    element:(<ProtectedRoute><CreatePage/></ProtectedRoute>)
  },
    {
    path:"/publishpage",
    element:(<ProtectedRoute><PublishPage/></ProtectedRoute>)
  },
    {
      path: "/aitools",
      element: (<ProtectedRoute><AiToolsPage /></ProtectedRoute>)
    },
  {
  path: "/settings",
  element: (<ProtectedRoute><ComingSoon title="Settings" /></ProtectedRoute>)
  },
  {
  path: "/channels",
  element: (<ProtectedRoute><ComingSoon title="Channels" /></ProtectedRoute>)
  },
  {
  path: "/pricing",
  element: (<ProtectedRoute><ComingSoon title="Pricing" /></ProtectedRoute>)
  },
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>
)
