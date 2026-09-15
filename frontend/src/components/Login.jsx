import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("ROLE_VIEWER");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // Role-based dashboard navigation
      const decoded = jwtDecode(accessToken);
      const userRoles = decoded.roles || [];

      if (userRoles.includes("ROLE_ADMIN")) {
        navigate("/dashboard");
      } else if (userRoles.includes("ROLE_VIEWER")) {
        navigate("/viewer-dashboard");
      } else {
        setError(
          "You do not have permission to access the dashboard."
        );
      }

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      alert("Registration successful! Please login.");

      // Clear signup fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("ROLE_VIEWER");

      // Return to login
      setIsSignup(false);

    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
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
                  <div className="preview-number">
                    2,847
                  </div>

                  <div className="preview-label">
                    Assets Monitored
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">
                    99.99%
                  </div>

                  <div className="preview-label">
                    Uptime
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">
                    76%
                  </div>

                  <div className="preview-label">
                    Avg. CPU Usage
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-number">
                    62%
                  </div>

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
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            <p className="login-subtitle">
              {isSignup
                ? "Create your SentinelCore SecureOps account"
                : "Login to your SentinelCore SecureOps account"}
            </p>

            {/* ================= SIGNUP FORM ================= */}
            {isSignup ? (

              <form onSubmit={handleSignup}>

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

                {/* EMAIL */}
                <div className="form-group">

                  <label className="form-label">
                    Email
                  </label>

                  <div className="input-wrapper">

                    <Mail
                      size={19}
                      className="input-icon"
                    />

                    <input
                      className="form-input"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
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

                {/* CONFIRM PASSWORD */}
                <div className="form-group">

                  <label className="form-label">
                    Confirm Password
                  </label>

                  <div className="input-wrapper">

                    <Lock
                      size={19}
                      className="input-icon"
                    />

                    <input
                      className="form-input"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      className="password-button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>
                </div>

                {/* ROLE */}
                <div className="form-group">

                  <label className="form-label">
                    Role
                  </label>

                  <select
                    className="form-input"
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                  >
                    <option value="ROLE_VIEWER">
                      User
                    </option>

                    <option value="ROLE_ADMIN">
                      Admin
                    </option>
                  </select>

                </div>

                {/* ERROR */}
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* SIGN UP */}
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

              </form>

            ) : (

              /* ================= LOGIN FORM ================= */
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
                        setRememberMe(
                          e.target.checked
                        )
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
            )}

            {/* LOGIN/SIGNUP SWITCH */}
            <div className="bottom-text">

              {isSignup ? (
                <>
                  Already have an account?{" "}

                  <span
                    onClick={() => {
                      setIsSignup(false);
                      setError("");
                      setUsername("");
                      setEmail("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Sign In
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}

                  <span
                    onClick={() => {
                      setIsSignup(true);
                      setError("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Sign Up
                  </span>
                </>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;