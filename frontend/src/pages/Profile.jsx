import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusColor = {
  accepted: 'text-[#4ec9b0]',
  wrong_answer: 'text-[#f44747]',
  time_limit_exceeded: 'text-[#e8c57a]',
  runtime_error: 'text-[#f44747]',
  pending: 'text-[#969696]',
}

const statusIcon = {
  accepted: '✅',
  wrong_answer: '❌',
  time_limit_exceeded: '⏱️',
  runtime_error: '💥',
  pending: '⏳',
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    Promise.all([
      api.get('/profile/stats'),
      api.get('/profile/submissions'),
    ])
      .then(([statsRes, subsRes]) => {
        setStats(statsRes.data)
        setSubmissions(subsRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-[#555] font-mono">
        // loading profile...
      </div>
    )
  }

  const acceptanceRate = stats?.total_submissions > 0
    ? Math.round((stats.accepted / stats.total_submissions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#3c3c3c] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-[#0e639c] flex items-center justify-center text-white font-mono font-bold text-xl">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-white font-mono font-bold text-xl">@{user?.username}</h1>
            <p className="text-[#6a9955] font-mono text-sm">{user?.email}</p>
          </div>
          {user?.is_admin && (
            <span className="ml-auto px-3 py-1 bg-[#e8c57a]/10 border border-[#e8c57a]/30 text-[#e8c57a] font-mono text-xs rounded">
              admin
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Grid */}
        <div>
          <p className="text-[#6a9955] font-mono text-sm mb-4"># statistics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'problems_solved', value: stats?.problems_solved ?? 0, color: 'text-[#4ec9b0]' },
              { label: 'total_submissions', value: stats?.total_submissions ?? 0, color: 'text-[#569cd6]' },
              { label: 'acceptance_rate', value: `${acceptanceRate}%`, color: 'text-[#e8c57a]' },
              { label: 'accepted', value: stats?.accepted ?? 0, color: 'text-[#4ec9b0]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4">
                <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
                <div className="text-[#555] font-mono text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict breakdown */}
        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-5">
          <p className="text-[#6a9955] font-mono text-sm mb-4"># verdict breakdown</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'accepted', value: stats?.accepted ?? 0, color: 'text-[#4ec9b0]' },
              { label: 'wrong_answer', value: stats?.wrong_answer ?? 0, color: 'text-[#f44747]' },
              { label: 'time_limit', value: stats?.time_limit_exceeded ?? 0, color: 'text-[#e8c57a]' },
              { label: 'runtime_error', value: stats?.runtime_error ?? 0, color: 'text-[#f44747]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
                <div className="text-[#555] font-mono text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission History */}
        <div>
          <p className="text-[#6a9955] font-mono text-sm mb-4"># submission history</p>
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] bg-[#2d2d2d]">
              <div className="col-span-2 text-[#555] font-mono text-xs">id</div>
              <div className="col-span-3 text-[#555] font-mono text-xs">problem</div>
              <div className="col-span-3 text-[#555] font-mono text-xs">status</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">runtime</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">date</div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-[#555] font-mono text-sm">
                // no submissions yet — go solve something!
              </div>
            ) : (
              submissions.slice(0, 20).map(sub => (
                <div
                  key={sub.id}
                  className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] last:border-0 hover:bg-[#2d2d2d] transition-colors"
                >
                  <div className="col-span-2 text-[#555] font-mono text-xs self-center">#{sub.id}</div>
                  <div className="col-span-3 text-[#d4d4d4] font-mono text-xs self-center">
                    problem #{sub.problem_id}
                  </div>
                  <div className={`col-span-3 font-mono text-xs self-center ${statusColor[sub.status]}`}>
                    {statusIcon[sub.status]} {sub.status?.replace(/_/g, ' ')}
                  </div>
                  <div className="col-span-2 text-[#555] font-mono text-xs self-center">
                    {sub.runtime ? `${sub.runtime}s` : '—'}
                  </div>
                  <div className="col-span-2 text-[#555] font-mono text-xs self-center">
                    {new Date(sub.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}