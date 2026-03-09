import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("OTP sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.97)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.97)_1px,transparent_1px)] bg-[size:40px_40px] [background-color:#1e1e1e] opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#569cd6] text-3xl font-mono font-bold">&lt;</span>
            <span className="text-white text-2xl font-mono font-bold">CodePrep</span>
            <span className="text-[#569cd6] text-3xl font-mono font-bold">/&gt;</span>
          </div>
          <p className="text-[#6a9955] font-mono text-sm">// reset your password</p>
        </div>

        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden shadow-2xl">
          <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c]">
            <div className="px-4 py-2 bg-[#1e1e1e] border-r border-[#3c3c3c] text-[#d4d4d4] text-sm font-mono flex items-center gap-2">
              <span className="text-[#e8c57a]">🔐</span> forgot_password.py
            </div>
          </div>

          <div className="p-6">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-4xl">📬</div>
                <p className="text-[#4ec9b0] font-mono text-sm">// OTP sent successfully</p>
                <p className="text-[#969696] font-mono text-xs">Check your email for a 6-digit code</p>
                <Link
                  to="/reset-password"
                  className="block w-full bg-[#0e639c] hover:bg-[#1177bb] text-white font-mono text-sm py-2.5 rounded transition-colors text-center mt-4"
                >
                  ▶ enter_otp()
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                    email <span className="text-[#569cd6]">: str</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#569cd6] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0e639c] hover:bg-[#1177bb] disabled:opacity-50 text-white font-mono text-sm py-2.5 rounded transition-colors cursor-pointer"
                >
                  {loading ? '// sending OTP...' : '▶ send_otp()'}
                </button>

                <p className="text-center text-[#6a9955] font-mono text-sm">
                  <Link to="/login" className="text-[#569cd6] hover:underline">
                    ← back_to_login()
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}