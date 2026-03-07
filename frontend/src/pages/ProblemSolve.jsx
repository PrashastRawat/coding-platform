import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

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

function getTemplate(title) {
  if (!title) return `# Write your solution here\ndef solution():\n    pass\n`
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  const templates = {
    'two_sum': `def twoSum(nums: list, target: int) -> list:
    # Given an array of integers and a target,
    # return indices of the two numbers that add up to target
    pass

nums = list(map(int, input().split()))
target = int(input())
result = twoSum(nums, target)
print(' '.join(map(str, result)))`,
    'maximum_subarray': `def maxSubArray(nums: list) -> int:
    # Find the contiguous subarray with the largest sum
    pass

nums = list(map(int, input().split()))
print(maxSubArray(nums))`,
    'reverse_a_string': `def reverseString(s: str) -> str:
    pass

print(reverseString(input()))`,
    'valid_palindrome': `def isPalindrome(s: str) -> bool:
    pass

print(isPalindrome(input()))`,
    'fizzbuzz': `def fizzBuzz(n: int) -> None:
    pass

fizzBuzz(int(input()))`,
    'fibonacci_number': `def fib(n: int) -> int:
    pass

print(fib(int(input())))`,
    'climbing_stairs': `def climbStairs(n: int) -> int:
    pass

print(climbStairs(int(input())))`,
    'binary_search': `def search(nums: list, target: int) -> int:
    pass

nums = list(map(int, input().split()))
target = int(input())
print(search(nums, target))`,
    'factorial': `def factorial(n: int) -> int:
    pass

print(factorial(int(input())))`,
    'reverse_a_linked_list': `def reverseList(nodes: list) -> list:
    pass

nodes = list(map(int, input().split()))
print(' '.join(map(str, reverseList(nodes))))`,
  }
  return templates[slug] || `def solution():\n    # Write your solution here\n    pass\n\nprint(solution())`
}

export default function ProblemSolve() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [problem, setProblem] = useState(null)
  const [testcases, setTestcases] = useState([])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [runOutput, setRunOutput] = useState(null)
  const [hint, setHint] = useState(null)
  const [hintLoading, setHintLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [activeResultTab, setActiveResultTab] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get(`/problems/${id}`),
      api.get(`/testcases/problem/${id}`),
    ]).then(([problemRes, tcRes]) => {
      setProblem(problemRes.data)
      setTestcases(tcRes.data.slice(0, 3))
      setCode(getTemplate(problemRes.data.title))
    }).catch(() => toast.error('Problem not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRun = async () => {
    setRunning(true)
    setActiveTab('result')
    setActiveResultTab(0)
    try {
      const res = await api.post('/run/', { code, input_data: testcases[0]?.input_data || '' })
      setRunOutput(res.data)
    } catch {
      toast.error('Failed to run code')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) { toast.error('Please login to submit'); navigate('/login'); return }
    setSubmitting(true)
    setActiveTab('result')
    try {
      const res = await api.post('/submissions/', { problem_id: parseInt(id), code, language: 'python' })
      setResult(res.data)
      if (res.data.status === 'accepted') toast.success('Accepted! 🎉')
      else toast.error(res.data.status.replace(/_/g, ' '))
    } catch {
      toast.error('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHint = async () => {
    if (!user) { toast.error('Please login to use AI hints'); navigate('/login'); return }
    setHintLoading(true)
    setActiveTab('hint')
    try {
      const res = await api.post('/ai/hint', { problem_id: parseInt(id), code })
      setHint(res.data.response)
    } catch {
      toast.error('Failed to get hint')
    } finally {
      setHintLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-[#555] font-mono">
      // loading problem...
    </div>
  )

  if (!problem) return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-[#f44747] font-mono">
      // problem not found
    </div>
  )

  return (
    <div className="h-[calc(100vh-48px)] bg-[#1e1e1e] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#2d2d2d] border-b border-[#3c3c3c] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#969696] font-mono text-sm">#{problem.id}</span>
          <span className="text-white font-mono text-sm font-bold">{problem.title}</span>
          <span className={`px-2 py-0.5 rounded border font-mono text-xs ${
            problem.difficulty === 'easy' ? 'text-[#4ec9b0] bg-[#4ec9b0]/10 border-[#4ec9b0]/30' :
            problem.difficulty === 'medium' ? 'text-[#e8c57a] bg-[#e8c57a]/10 border-[#e8c57a]/30' :
            'text-[#f44747] bg-[#f44747]/10 border-[#f44747]/30'
          }`}>{problem.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleHint} disabled={hintLoading}
            className="px-3 py-1.5 bg-[#252526] border border-[#3c3c3c] hover:border-[#4ec9b0] text-[#4ec9b0] font-mono text-xs rounded transition-colors cursor-pointer disabled:opacity-50">
            {hintLoading ? '...' : '🤖 ai_hint()'}
          </button>
          <button onClick={handleRun} disabled={running}
            className="px-3 py-1.5 bg-[#252526] border border-[#3c3c3c] hover:border-[#569cd6] text-[#569cd6] font-mono text-xs rounded transition-colors cursor-pointer disabled:opacity-50">
            {running ? '// running...' : '▷ run()'}
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-4 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-xs rounded transition-colors cursor-pointer disabled:opacity-50">
            {submitting ? '// judging...' : '▶ submit()'}
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[40%] flex flex-col border-r border-[#3c3c3c]">
          <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c]">
            {['description', 'result', 'hint'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-mono text-xs transition-colors cursor-pointer border-t-2 ${
                  activeTab === tab ? 'text-white border-[#569cd6] bg-[#1e1e1e]' : 'text-[#969696] border-transparent hover:text-white'
                }`}>{tab}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Description */}
            {activeTab === 'description' && (
              <div>
                <h2 className="text-white font-mono font-bold text-base mb-4">{problem.title}</h2>
                <pre className="text-[#d4d4d4] font-mono text-sm whitespace-pre-wrap leading-relaxed mb-6">
                  {problem.description}
                </pre>
                {testcases.length > 0 && (
                  <div>
                    <p className="text-[#6a9955] font-mono text-xs mb-3"># examples</p>
                    {testcases.map((tc, i) => (
                      <div key={tc.id} className="mb-4">
                        <p className="text-[#969696] font-mono text-xs mb-2">Example {i + 1}:</p>
                        <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-3 space-y-2">
                          <div>
                            <span className="text-[#569cd6] font-mono text-xs">Input: </span>
                            <span className="text-[#d4d4d4] font-mono text-xs">{tc.input_data}</span>
                          </div>
                          <div>
                            <span className="text-[#4ec9b0] font-mono text-xs">Expected: </span>
                            <span className="text-[#d4d4d4] font-mono text-xs">{tc.expected_output}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Result */}
            {activeTab === 'result' && (
              <div className="font-mono text-sm">
                {result && (
                  <div className="mb-6">
                    <div className={`text-lg font-bold mb-2 ${statusColor[result.status]}`}>
                      {statusIcon[result.status]} {result.status.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    {result.runtime && <p className="text-[#969696] text-xs mb-4">runtime: {result.runtime}s</p>}
                  </div>
                )}

                {runOutput && (
                  <div>
                    <p className="text-[#6a9955] text-xs mb-3"># test case results</p>
                    {testcases.length > 0 && (
                      <div className="flex gap-1 mb-3">
                        {testcases.map((_, i) => (
                          <button key={i} onClick={() => setActiveResultTab(i)}
                            className={`px-3 py-1 font-mono text-xs rounded cursor-pointer transition-colors ${
                              activeResultTab === i ? 'bg-[#0e639c] text-white' : 'bg-[#2d2d2d] text-[#969696] hover:text-white'
                            }`}>
                            Case {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                    {testcases[activeResultTab] && (
                      <div className="space-y-3">
                        <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-3">
                          <p className="text-[#569cd6] text-xs mb-1">Input:</p>
                          <pre className="text-[#d4d4d4] text-xs">{testcases[activeResultTab].input_data}</pre>
                        </div>
                        <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-3">
                          <p className="text-[#e8c57a] text-xs mb-1">Your Output:</p>
                          <pre className="text-[#d4d4d4] text-xs">{runOutput.output || runOutput.error || '(no output)'}</pre>
                        </div>
                        <div className="bg-[#1e1e1e] border border-[#4ec9b0]/30 rounded p-3">
                          <p className="text-[#4ec9b0] text-xs mb-1">Expected Output:</p>
                          <pre className="text-[#d4d4d4] text-xs">{testcases[activeResultTab].expected_output}</pre>
                        </div>
                        {runOutput.output && (
                          <div className={`text-xs font-mono font-bold ${
                            runOutput.output.trim() === testcases[activeResultTab].expected_output.trim()
                              ? 'text-[#4ec9b0]' : 'text-[#f44747]'
                          }`}>
                            {runOutput.output.trim() === testcases[activeResultTab].expected_output.trim()
                              ? '✅ Matched!' : '❌ Not matched'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!result && !runOutput && <p className="text-[#555]">// run or submit your code to see results</p>}
              </div>
            )}

            {/* Hint */}
            {activeTab === 'hint' && (
              <div className="font-mono text-sm">
                <p className="text-[#6a9955] text-xs mb-3">// ai hint</p>
                {hintLoading ? <p className="text-[#555]">// thinking...</p>
                  : hint ? (
                    <div className="bg-[#1e1e1e] border border-[#4ec9b0]/30 rounded p-4">
                      <p className="text-[#d4d4d4] leading-relaxed">{hint}</p>
                    </div>
                  ) : <p className="text-[#555]">// click ai_hint() to get a hint</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c]">
            <div className="px-4 py-2 bg-[#1e1e1e] border-r border-[#3c3c3c] text-[#d4d4d4] font-mono text-xs flex items-center gap-2">
              <span className="text-[#e8c57a]">🐍</span> solution.py
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language="python"
              value={code}
              onChange={val => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'Fira Code, Consolas, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}