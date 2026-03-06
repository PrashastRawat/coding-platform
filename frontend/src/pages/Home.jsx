import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4]">

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0e639c] opacity-10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#252526] border border-[#3c3c3c] rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-[#4ec9b0] rounded-full animate-pulse"></span>
            <span className="text-[#4ec9b0] font-mono text-xs">v1.0.0 — now live</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-mono font-bold text-white mb-4 leading-tight">
            <span className="text-[#569cd6]">code</span>
            <span className="text-white">.</span>
            <span className="text-[#4ec9b0]">practice</span>
            <span className="text-white">()</span>
          </h1>

          <p className="text-[#969696] font-mono text-lg mb-4 max-w-xl">
            <span className="text-[#6a9955]">// </span>
            A mini LeetCode-style platform to sharpen your skills
          </p>
          <p className="text-[#969696] font-mono text-sm mb-10 max-w-xl">
            Solve problems. Get AI hints. Track your progress. Build your portfolio.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/problems"
              className="px-6 py-3 bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-sm rounded transition-colors no-underline"
            >
              ▶ start_coding()
            </Link>
            {!user && (
              <Link
                to="/register"
                className="px-6 py-3 bg-transparent border border-[#3c3c3c] hover:border-[#569cd6] text-[#d4d4d4] font-mono text-sm rounded transition-colors no-underline"
              >
                create_account()
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="border-t border-b border-[#3c3c3c] bg-[#252526]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-[#3c3c3c]">
          {[
            { label: 'problems', value: '20+', color: 'text-[#569cd6]' },
            { label: 'topics', value: '7', color: 'text-[#4ec9b0]' },
            { label: 'ai_powered', value: 'true', color: 'text-[#6a9955]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center py-8">
              <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
              <div className="text-[#969696] font-mono text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-[#6a9955] font-mono text-sm mb-2 text-center"># features</p>
        <h2 className="text-2xl font-mono font-bold text-white text-center mb-12">
          everything you need to <span className="text-[#569cd6]">level_up()</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '⚡',
              title: 'code_editor()',
              desc: 'VS Code-style Monaco editor with syntax highlighting and auto-complete.',
              color: 'border-[#569cd6]',
              tag: 'text-[#569cd6]',
            },
            {
              icon: '🤖',
              title: 'ai_hints()',
              desc: 'Stuck? Get smart AI-powered hints that guide you without spoiling the answer.',
              color: 'border-[#4ec9b0]',
              tag: 'text-[#4ec9b0]',
            },
            {
              icon: '✅',
              title: 'auto_judge()',
              desc: 'Submit your code and get instant results — accepted, wrong answer, or TLE.',
              color: 'border-[#e8c57a]',
              tag: 'text-[#e8c57a]',
            },
            {
              icon: '📊',
              title: 'track_progress()',
              desc: 'See your stats — problems solved, acceptance rate, submission history.',
              color: 'border-[#c586c0]',
              tag: 'text-[#c586c0]',
            },
            {
              icon: '🎯',
              title: 'difficulty_levels()',
              desc: 'Problems tagged Easy, Medium, and Hard — start simple, go advanced.',
              color: 'border-[#569cd6]',
              tag: 'text-[#569cd6]',
            },
            {
              icon: '🗂️',
              title: 'portfolio_view()',
              desc: 'Share your profile showing solved problems and skills to recruiters.',
              color: 'border-[#4ec9b0]',
              tag: 'text-[#4ec9b0]',
            },
          ].map(({ icon, title, desc, color, tag }) => (
            <div
              key={title}
              className={`bg-[#252526] border border-[#3c3c3c] border-l-2 ${color} rounded-lg p-5 hover:bg-[#2d2d2d] transition-colors`}
            >
              <div className="text-2xl mb-3">{icon}</div>
              <div className={`font-mono text-sm font-bold ${tag} mb-2`}>{title}</div>
              <p className="text-[#969696] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="border-t border-[#3c3c3c] bg-[#252526] text-center py-16 px-6">
        <p className="text-[#6a9955] font-mono text-sm mb-3">// ready to start?</p>
        <h3 className="text-2xl font-mono font-bold text-white mb-6">
          Pick a problem and <span className="text-[#4ec9b0]">start coding</span>
        </h3>
        <Link
          to="/problems"
          className="inline-block px-8 py-3 bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-sm rounded transition-colors no-underline"
        >
          ▶ view_problems()
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[#3c3c3c] text-center py-4">
        <p className="text-[#555] font-mono text-xs">
          built with FastAPI + React + ❤️
        </p>
      </div>
    </div>
  )
}