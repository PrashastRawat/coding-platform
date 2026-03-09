import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Reset failed");
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
          <p className="text-[#6a9955] font-mono text-sm">// enter your OTP and new password</p>
        </div>

        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden shadow-2xl">
          <div className="flex bg-[#2d2d2d] border-b border-[#3c3c3c]">
            <div className="px-4 py-2 bg-[#1e1e1e] border-r border-[#3c3c3c] text-[#d4d4d4] text-sm font-mono flex items-center gap-2">
              <span className="text-[#e8c57a]">🔒</span> reset_password.py
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Email */}
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

            {/* OTP */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                otp <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="123456"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#4ec9b0] font-mono text-lg tracking-[0.5em] placeholder-[#555] focus:outline-none focus:border-[#4ec9b0] transition-colors"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                new_password <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none focus:border-[#569cd6] transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#9cdcfe] font-mono text-sm mb-2">
                confirm_password <span className="text-[#569cd6]">: str</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full bg-[#1e1e1e] border rounded px-4 py-2.5 text-[#d4d4d4] font-mono text-sm placeholder-[#555] focus:outline-none transition-colors ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-[#f44747] focus:border-[#f44747]'
                    : 'border-[#3c3c3c] focus:border-[#569cd6]'
                }`}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[#f44747] font-mono text-xs mt-1">// passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e639c] hover:bg-[#1177bb] disabled:opacity-50 text-white font-mono text-sm py-2.5 rounded transition-colors cursor-pointer"
            >
              {loading ? '// resetting...' : '▶ reset_password()'}
            </button>

            <p className="text-center font-mono text-sm">
              <Link to="/login" className="text-[#569cd6] hover:underline">
                ← back_to_login()
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}