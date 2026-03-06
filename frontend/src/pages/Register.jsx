import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      await login(res.data.access_token)
      toast.success('Account created! Welcome 🎉')
      navigate('/problems')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.97)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.97)_1px,transparent_1px)] bg-[size:40px_40px] [background-color:#1e1e1e] opacity-60" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#569cd6] text-3xl font-mono font-bold">&lt;</span>
            <span className="text-white text-2xl font-mono font-bold">CodePrep</span>
            <span className="text-[#569cd6] text-3xl font-mono font-bold">/&gt;</span>
          </div>
          <p className="text-[#6a9955] font-mono text-sm">// create your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden shadow-2xl">
          {/* Tab bar */}
          <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c]">
            <div className="px-4 py-2 bg-[#1e1e1e] border-r border-[#3c3c3c] text-[#d4d4d4] text-sm font-mono flex items-center gap-2">
              <span className="text-[#4ec9b0]">👤</span> register.py
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                username <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="coolcoder123"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#4ec9b0] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                email <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#4ec9b0] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                password <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#4ec9b0] transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e639c] hover:bg-[#1177bb] disabled:opacity-50 text-white font-mono text-sm py-2.5 rounded transition-colors cursor-pointer"
            >
              {loading ? '// creating account...' : '▶ run register()'}
            </button>

            {/* Login link */}
            <p className="text-center text-[#6a9955] font-mono text-sm">
              {/* have account? */}{' '}
              <Link to="/login" className="text-[#569cd6] hover:underline">
                login()
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}