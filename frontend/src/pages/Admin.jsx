import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [problems, setProblems] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (!user.is_admin) { navigate('/problems'); return }

    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/problems'),
    ])
      .then(([statsRes, usersRes, problemsRes]) => {
        setStats(statsRes.data)
        setUsers(usersRes.data)
        setProblems(problemsRes.data)
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [user])

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete user')
    }
  }

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Delete this problem and all its test cases?')) return
    try {
      await api.delete(`/admin/problems/${problemId}`)
      setProblems(problems.filter(p => p.id !== problemId))
      toast.success('Problem deleted')
    } catch {
      toast.error('Failed to delete problem')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-[#555] font-mono">
        // loading admin panel...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#3c3c3c] px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#e8c57a] font-mono text-sm mb-1"># admin panel</p>
          <h1 className="text-2xl font-mono font-bold text-white">
            admin<span className="text-[#e8c57a]">.dashboard()</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#252526] border border-[#3c3c3c] rounded-lg p-1 w-fit">
          {['stats', 'users', 'problems'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-mono text-sm rounded transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0e639c] text-white'
                  : 'text-[#969696] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'total_users', value: stats.total_users, color: 'text-[#569cd6]' },
              { label: 'total_problems', value: stats.total_problems, color: 'text-[#4ec9b0]' },
              { label: 'total_submissions', value: stats.total_submissions, color: 'text-[#e8c57a]' },
              { label: 'accepted', value: stats.accepted_submissions, color: 'text-[#4ec9b0]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-6 text-center">
                <div className={`text-4xl font-mono font-bold ${color}`}>{value}</div>
                <div className="text-[#555] font-mono text-xs mt-2">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] bg-[#2d2d2d]">
              <div className="col-span-1 text-[#555] font-mono text-xs">id</div>
              <div className="col-span-3 text-[#555] font-mono text-xs">username</div>
              <div className="col-span-4 text-[#555] font-mono text-xs">email</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">role</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">action</div>
            </div>
            {users.map(u => (
              <div key={u.id} className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] last:border-0 hover:bg-[#2d2d2d] transition-colors">
                <div className="col-span-1 text-[#555] font-mono text-xs self-center">#{u.id}</div>
                <div className="col-span-3 text-[#d4d4d4] font-mono text-xs self-center">@{u.username}</div>
                <div className="col-span-4 text-[#969696] font-mono text-xs self-center">{u.email}</div>
                <div className="col-span-2 self-center">
                  {u.is_admin ? (
                    <span className="text-[#e8c57a] font-mono text-xs">admin</span>
                  ) : (
                    <span className="text-[#555] font-mono text-xs">user</span>
                  )}
                </div>
                <div className="col-span-2 self-center">
                  {u.id !== user.id && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-2 py-1 bg-[#f44747]/10 border border-[#f44747]/30 text-[#f44747] font-mono text-xs rounded hover:bg-[#f44747]/20 transition-colors cursor-pointer"
                    >
                      delete()
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Problems Tab */}
        {activeTab === 'problems' && (
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] bg-[#2d2d2d]">
              <div className="col-span-1 text-[#555] font-mono text-xs">id</div>
              <div className="col-span-6 text-[#555] font-mono text-xs">title</div>
              <div className="col-span-3 text-[#555] font-mono text-xs">difficulty</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">action</div>
            </div>
            {problems.map(p => (
              <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] last:border-0 hover:bg-[#2d2d2d] transition-colors">
                <div className="col-span-1 text-[#555] font-mono text-xs self-center">#{p.id}</div>
                <div className="col-span-6 text-[#d4d4d4] font-mono text-xs self-center">{p.title}</div>
                <div className="col-span-3 self-center">
                  <span className={`font-mono text-xs ${
                    p.difficulty === 'easy' ? 'text-[#4ec9b0]' :
                    p.difficulty === 'medium' ? 'text-[#e8c57a]' :
                    'text-[#f44747]'
                  }`}>
                    {p.difficulty}
                  </span>
                </div>
                <div className="col-span-2 self-center">
                  <button
                    onClick={() => handleDeleteProblem(p.id)}
                    className="px-2 py-1 bg-[#f44747]/10 border border-[#f44747]/30 text-[#f44747] font-mono text-xs rounded hover:bg-[#f44747]/20 transition-colors cursor-pointer"
                  >
                    delete()
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}