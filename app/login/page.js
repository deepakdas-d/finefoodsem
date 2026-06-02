"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.replace("/dashboard");
    }
  }, [mounted, user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="login-wrapper">
        <div className="text-primary animate-pulse">Verifying Access...</div>
      </div>
    );
  }

  if (user) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-dark animate-fade-in">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <Image src="/logo.png" alt="FineFoods Logo" width={60} height={60} className="logo-img" />
          </div>
          <h1>FineFoods <span className="text-primary">EM</span></h1>
          <p className="subtitle">Employee Hours Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label><FiMail /> Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label><FiLock /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="login-error-msg">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Authenticating..." : (
              <>
                Continue to Dashboard <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p><FiShield /> Secure Administrator Access Only</p>
        </div>
      </div>

      <style jsx global>{`
        .login-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                      radial-gradient(circle at bottom left, rgba(244, 63, 94, 0.1), transparent),
                      var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem;
          border-radius: 24px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-logo-wrapper {
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 0.5rem;
        }

        .text-primary { color: var(--primary); }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-group input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 0.85rem 1rem;
          border-radius: 12px;
          color: var(--foreground);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-group input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .login-btn {
          margin-top: 1rem;
          background: var(--primary);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .login-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-error-msg {
          color: var(--error);
          font-size: 0.85rem;
          text-align: center;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .login-footer {
          margin-top: 2.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .login-footer p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
