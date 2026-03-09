import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Problems from './pages/Problems'
import ProblemSolve from './pages/ProblemSolve'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// inside your routes:


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#252526',
              color: '#d4d4d4',
              border: '1px solid #3c3c3c',
              fontFamily: 'monospace',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#4ec9b0', secondary: '#252526' } },
            error: { iconTheme: { primary: '#f44747', secondary: '#252526' } },
          }}
        />

        {/* Navbar hidden on login/register pages */}
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/problems/:id" element={<ProblemSolve />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </>
              }
            />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}