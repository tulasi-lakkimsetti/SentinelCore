import React, { useEffect, useState } from "react";
import { getAlertHistory } from "../api/assetApi";

const AlertHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlertHistory = async () => {
    try {
      setLoading(true);

      const response = await getAlertHistory();

      setAlerts(response.data || []);
    } catch (error) {
      console.error(
        "Error loading alert history:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertHistory();
  }, []);

  return (
    <div className="dashboard">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo-area">
          <div className="sidebar-shield">S</div>

          <div>
            <div className="sidebar-title">
              SENTINEL<span>CORE</span>
            </div>

            <div className="sidebar-subtitle">
              SECUREOPS
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          <button
            className="sidebar-item"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              window.location.href = "/assets";
            }}
          >
            <span>▤</span>
            Assets
          </button>

          <button className="sidebar-item">
            <span>♧</span>
            Alerts
          </button>

          <button className="sidebar-item active">
            <span>◷</span>
            Alert History
          </button>

          <div className="sidebar-section">
            PROFILE
          </div>

          <button className="sidebar-item">
            <span>◉</span>
            Profile
          </button>

          <button className="sidebar-item">
            <span>↪</span>
            Logout
          </button>
        </div>

        <div className="system-status">
          <div className="system-status-icon">✓</div>

          <div>
            <strong>All Systems Operational</strong>
            <span>Monitoring active</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">

        {/* Header */}
        <header className="top-header">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search..."
              readOnly
            />
          </div>

          <div className="header-right">
            <button className="notification">
              ♧
            </button>

            <div className="header-user">
              <div className="avatar">S</div>

              <div>
                <small>Administrator</small>
              </div>

              <span className="user-arrow">⌄</span>
            </div>
          </div>
        </header>

        {/* Page Heading */}
        <div className="page-heading">
          <div>
            <h1>Alert History</h1>
            <p>Previously resolved alerts</p>
          </div>

          <button
            className="view-all"
            onClick={loadAlertHistory}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Table Card */}
        <div className="bottom-grid">
          <div
            className="dashboard-card table-card"
            style={{ gridColumn: "1 / -1" }}
          >
            <div className="card-header">
              <div>
                <h2>Resolved Alerts</h2>
                <p>
                  History of previously resolved system alerts
                </p>
              </div>

              <span className="chart-filter">
                {alerts.length} Records
              </span>
            </div>

            {loading ? (
              <div className="empty-table">
                Loading alert history...
              </div>
            ) : alerts.length === 0 ? (
              <div className="empty-table">
                No resolved alerts found.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Alert ID</th>
                      <th>Asset ID</th>
                      <th>Severity</th>
                      <th>Message</th>
                      <th>Created At</th>
                      <th>Resolved At</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td>
                          <strong>#{alert.id}</strong>
                        </td>

                        <td>
                          {alert.assetId}
                        </td>

                        <td>
                          <span
                            className={
                              alert.severity === "CRITICAL" ||
                              alert.severity === "HIGH"
                                ? "severity critical"
                                : "severity warning"
                            }
                          >
                            {alert.severity}
                          </span>
                        </td>

                        <td>
                          {alert.message || "-"}
                        </td>

                        <td>
                          {alert.createdAt
                            ? new Date(
                                alert.createdAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td>
                          {alert.resolvedAt
                            ? new Date(
                                alert.resolvedAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td>
                          <span
                            className="alert-status"
                            style={{
                              background: "#eafbf0",
                              color: "#16a34a"
                            }}
                          >
                            RESOLVED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          SentinelCore SecureOps • Alert History
        </div>
      </div>
    </div>
  );
};

export default AlertHistory;