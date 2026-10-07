import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './components/landingPage/landingPage.jsx'
import SignupPage from './components/signupPage/signupPage.jsx'
import LoginPage from './components/loginPage/loginPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashBoard from './components/dashBoard/dashBoard.jsx'

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
    element:<DashBoard/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
