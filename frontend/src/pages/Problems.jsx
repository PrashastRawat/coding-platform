import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const difficultyColor = {
  easy: 'text-[#4ec9b0]',
  medium: 'text-[#e8c57a]',
  hard: 'text-[#f44747]',
}

const difficultyBg = {
  easy: 'bg-[#4ec9b0]/10 border-[#4ec9b0]/30',
  medium: 'bg-[#e8c57a]/10 border-[#e8c57a]/30',
  hard: 'bg-[#f44747]/10 border-[#f44747]/30',
}

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/problems/')
      .then(res => setProblems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = problems.filter(p => {
    const matchDiff = filter === 'all' || p.difficulty === filter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchDiff && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#3c3c3c] px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#6a9955] font-mono text-sm mb-1"># problem bank</p>
          <h1 className="text-2xl font-mono font-bold text-white">
            problems<span className="text-[#569cd6]">.all()</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#252526] border border-[#3c3c3c] rounded px-4 py-2 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#569cd6] transition-colors w-64"
          />

          {/* Difficulty filter */}
          <div className="flex items-center gap-1">
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 font-mono text-xs rounded border transition-colors cursor-pointer ${
                  filter === d
                    ? 'bg-[#0e639c] border-[#0e639c] text-white'
                    : 'bg-transparent border-[#3c3c3c] text-[#969696] hover:text-white hover:border-[#569cd6]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <span className="text-[#555] font-mono text-xs ml-auto">
            {filtered.length} problems
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-[#555] font-mono">
            // loading problems...
          </div>
        ) : (
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#3c3c3c] bg-[#2d2d2d]">
              <div className="col-span-1 text-[#555] font-mono text-xs">#</div>
              <div className="col-span-7 text-[#555] font-mono text-xs">title</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">difficulty</div>
              <div className="col-span-2 text-[#555] font-mono text-xs">action</div>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[#555] font-mono text-sm">
                // no problems found
              </div>
            ) : (
              filtered.map((problem, index) => (
                <div
                  key={problem.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#3c3c3c] last:border-0 hover:bg-[#2d2d2d] transition-colors group"
                >
                  {/* Number */}
                  <div className="col-span-1 text-[#555] font-mono text-sm self-center">
                    {index + 1}
                  </div>

                  {/* Title */}
                  <div className="col-span-7 self-center">
                    <Link
                      to={`/problems/${problem.id}`}
                      className="text-[#d4d4d4] group-hover:text-white font-mono text-sm no-underline hover:text-[#569cd6] transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-2 self-center">
                    <span className={`px-2 py-0.5 rounded border font-mono text-xs ${difficultyBg[problem.difficulty]} ${difficultyColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 self-center">
                    <Link
                      to={`/problems/${problem.id}`}
                      className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-xs rounded transition-colors no-underline"
                    >
                      solve()
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}