import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const DashboardLayout = ({
  children,
  search,
  setSearch,
  username,
  isAdmin,
  logout,
  onAddAsset
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        <div className="sidebar-logo-area">

          <div className="sidebar-shield">
            S
          </div>

          <div>
            <div className="sidebar-title">
              Sentinel<span>Core</span>
            </div>

            <div className="sidebar-subtitle">
              SecureOps
            </div>
          </div>

        </div>

        <div className="sidebar-menu">

          {/* DASHBOARD */}

          <button
            className={`sidebar-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          {/* ADD ASSET */}

          {isAdmin && (
            <button
              className="sidebar-item"
              onClick={() => {
                onAddAsset();
                setSidebarOpen(false);
              }}
            >
              <span>⊕</span>
              Add Asset
            </button>
          )}

          {/* ASSETS */}

          <button
            className={`sidebar-item ${
              isActive("/assets") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/assets")}
          >
            <span>▤</span>
            Assets
          </button>

          {/* ALERTS */}

          <button
            className={`sidebar-item ${
              isActive("/alerts") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/alerts")}
          >
            <span>♧</span>
            Alerts
          </button>

          {/* ALERT HISTORY */}

          <button
            className={`sidebar-item ${
              isActive("/alert-history") ? "active" : ""
            }`}
            onClick={() =>
              handleNavigation("/alert-history")
            }
          >
            <span>...</span>
            Alert History
          </button>

        </div>

        <div className="sidebar-section">
          PROFILE
        </div>

        <div className="sidebar-menu">

          {/* PROFILE */}

          <button
            className={`sidebar-item ${
              isActive("/profile") ? "active" : ""
            }`}
            onClick={handleProfileClick}
          >
            <span>◯</span>
            Profile
          </button>

          {/* LOGOUT */}

          <button
            className="sidebar-item"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

        {/* SYSTEM STATUS */}

        <div className="system-status">

          <div className="system-status-icon">
            ✓
          </div>

          <div>
            <strong>
              System Status
            </strong>

            <span>
              All Systems Operational
            </span>
          </div>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">

        {/* =========================
            COMMON TOP HEADER
        ========================= */}

        <header className="top-header">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </button>

          {/* SEARCH */}

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search assets, status, type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="header-right">

            {/* NOTIFICATION */}

            <NotificationBell />

            {/* PROFILE */}

            <div
              className="header-user"
              onClick={handleProfileClick}
            >

              <div className="avatar">
                {username.charAt(0).toUpperCase()}
              </div>

              <div>

                <strong>
                  {username}
                </strong>

                <small>
                  {isAdmin
                    ? "Administrator"
                    : "User"}
                </small>

              </div>

              <span className="user-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;