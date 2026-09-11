import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Activity,
  Bell,
  BarChart3,
  Shield,
} from "lucide-react";

import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);

      const { accessToken, refreshToken } = response.data;

      // Milestone 4 - JWT authentication
      loginUser(accessToken, refreshToken);

      localStorage.setItem(
        "username",
        response.data.username || username
      );

      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth backend endpoint
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* ================= LEFT SIDE ================= */}
        <div className="branding-panel">
          <div className="brand-content">

            {/* LOGO */}
            <div className="brand-logo">

              <div className="brand-shield">
                S
              </div>

              <div>
                <div className="brand-name">
                  SENTINEL<span>CORE</span>
                </div>

                <div className="brand-subtitle">
                  SECUREOPS
                </div>
              </div>

            </div>

            {/* HEADING */}
            <h1 className="brand-heading">
              Monitor. Protect. <span>Optimize.</span>
            </h1>

            <p className="brand-description">
              Real-time monitoring and intelligent insights
              to keep your infrastructure secure, available
              and performing at its best.
            </p>

            {/* DASHBOARD PREVIEW */}
            <div className="dashboard-preview">

              <div className="preview-top">

                <span className="preview-title">
                  System Overview
                </span>

                <span className="online-pill">
                  ● Online
                </span>

              </div>

              <div className="preview-cards">

                <div className="preview-card">
                  <div className="preview-number">2,847</div>
                  <div className="preview-label">
                    Assets Monitored
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">99.99%</div>
                  <div className="preview-label">
                    Uptime
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">76%</div>
                  <div className="preview-label">
                    Avg. CPU Usage
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">62%</div>
                  <div className="preview-label">
                    Memory Usage
                  </div>
                </div>

              </div>

              {/* NETWORK CHART */}
              <div className="chart-box">

                <div className="chart-title">
                  Network Traffic
                </div>

                <div className="chart-lines">
                  <div className="line-one"></div>
                  <div className="line-two"></div>
                </div>

              </div>

            </div>

            {/* FEATURES */}
            <div className="feature-row">

              <div className="feature">
                <div className="feature-icon">
                  <Activity size={22} />
                </div>

                <div className="feature-title">
                  Real-time
                  <br />
                  Monitoring
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <Bell size={22} />
                </div>

                <div className="feature-title">
                  Smart
                  <br />
                  Alerts
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <BarChart3 size={22} />
                </div>

                <div className="feature-title">
                  Performance
                  <br />
                  Insights
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <Shield size={22} />
                </div>

                <div className="feature-title">
                  Secure
                  <br />
                  Access
                </div>
              </div>

            </div>

          </div>
        </div>


        {/* ================= RIGHT SIDE ================= */}
        <div className="login-panel">

          <div className="login-card">

            {/* LOGIN ICON */}
            <div className="login-icon">
              <ShieldCheck size={52} />
            </div>

            <h2 className="login-title">
              Welcome Back
            </h2>

            <p className="login-subtitle">
              Login to your SentinelCore SecureOps account
            </p>


            {/* ================= LOGIN FORM ================= */}
            <form onSubmit={handleLogin}>

              {/* USERNAME */}
              <div className="form-group">

                <label className="form-label">
                  Username
                </label>

                <div className="input-wrapper">

                  <Mail
                    size={19}
                    className="input-icon"
                  />

                  <input
                    className="form-input"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}
              <div className="form-group">

                <label className="form-label">
                  Password
                </label>

                <div className="input-wrapper">

                  <Lock
                    size={19}
                    className="input-icon"
                  />

                  <input
                    className="form-input"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* OPTIONS */}
              <div className="form-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  Remember me

                </label>


                <button
                  type="button"
                  className="forgot-link"
                >
                  Forgot password?
                </button>

              </div>


              {/* ERROR */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}


              {/* SIGN IN */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    <LogIn size={19} />
                    Sign In
                  </>
                )}

              </button>

            </form>


            {/* DIVIDER */}
            <div className="divider">

              <div className="divider-line"></div>

              <span>or</span>

              <div className="divider-line"></div>

            </div>


            {/* GOOGLE LOGIN */}
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
            >

              <span className="google-logo">
                G
              </span>

              Sign in with Google

            </button>


            {/* BOTTOM TEXT */}
            <div className="bottom-text">

              Don't have an account?{" "}

              <span>
                Contact your administrator
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;