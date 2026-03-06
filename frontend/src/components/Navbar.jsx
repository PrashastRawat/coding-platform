import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-[#323233] border-b border-[#3c3c3c] px-6 py-0 flex items-center justify-between h-12 sticky top-0 z-50">
      {/* Left — Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <span className="text-[#569cd6] font-mono font-bold text-lg">&lt;</span>
        <span className="text-white font-mono font-bold text-base">CodePrep</span>
        <span className="text-[#569cd6] font-mono font-bold text-lg">/&gt;</span>
      </Link>

      {/* Center — Nav links */}
      <div className="flex items-center gap-1">
        <Link
          to="/problems"
          className={`px-4 py-3 font-mono text-sm transition-colors no-underline border-t-2 ${
            isActive('/problems')
              ? 'text-white border-[#569cd6] bg-[#1e1e1e]'
              : 'text-[#969696] border-transparent hover:text-white'
          }`}
        >
          Problems
        </Link>

        {user && (
          <Link
            to="/profile"
            className={`px-4 py-3 font-mono text-sm transition-colors no-underline border-t-2 ${
              isActive('/profile')
                ? 'text-white border-[#569cd6] bg-[#1e1e1e]'
                : 'text-[#969696] border-transparent hover:text-white'
            }`}
          >
            Profile
          </Link>
        )}

        {user?.is_admin && (
          <Link
            to="/admin"
            className={`px-4 py-3 font-mono text-sm transition-colors no-underline border-t-2 ${
              isActive('/admin')
                ? 'text-white border-[#e8c57a] bg-[#1e1e1e]'
                : 'text-[#e8c57a] border-transparent hover:text-white'
            }`}
          >
            Admin
          </Link>
        )}
      </div>

      {/* Right — Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-[#4ec9b0] font-mono text-sm">
              @{user.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-transparent border border-[#3c3c3c] text-[#969696] hover:text-white hover:border-[#569cd6] font-mono text-sm rounded transition-colors cursor-pointer"
            >
              logout()
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1 text-[#969696] hover:text-white font-mono text-sm transition-colors no-underline"
            >
              login()
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-sm rounded transition-colors no-underline"
            >
              register()
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}