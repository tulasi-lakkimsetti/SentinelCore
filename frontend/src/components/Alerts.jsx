import React, { useEffect, useState } from "react";
import { getOpenAlerts, resolveAlert } from "../api/assetApi";
import AddAlert from "./AddAlert";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [showAddAlert, setShowAddAlert] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  const loadAlerts = async () => {
    try {
      setLoading(true);

      const response = await getOpenAlerts();

      setAlerts(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error(
        "Error loading alerts:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      setResolvingId(id);

      await resolveAlert(id);

      alert("Alert resolved successfully.");

      await loadAlerts();
    } catch (error) {
      console.error(
        "Error resolving alert:",
        error.response?.status,
        error.response?.data
      );

      alert("Failed to resolve alert.");
    } finally {
      setResolvingId(null);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "CRITICAL":
      case "HIGH":
        return "alert-history-severity critical";

      case "WARNING":
      case "MEDIUM":
        return "alert-history-severity warning";

      case "LOW":
        return "alert-history-severity low";

      default:
        return "alert-history-severity";
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  const startIndex = (currentPage - 1) * alertsPerPage;
  const endIndex = startIndex + alertsPerPage;

  const currentAlerts = alerts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="dashboard">
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

          <button className="sidebar-item active">
            <span>♧</span>
            Alerts
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              window.location.href = "/alert-history";
            }}
          >
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
          <div className="system-status-icon">
            ✓
          </div>

          <div>
            <strong>All Systems Operational</strong>
            <span>Monitoring active</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
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
                <strong>Student</strong>
                <small>Administrator</small>
              </div>

              <span className="user-arrow">⌄</span>
            </div>
          </div>
        </header>

        <div className="page-heading">
          <div>
            <h1>Alerts</h1>
            <p>Monitor active system alerts</p>
          </div>

          <div>
            <button
              className="view-all"
              onClick={() => setShowAddAlert(true)}
            >
              + Add Alert
            </button>

            <button
              className="view-all"
              onClick={loadAlerts}
              disabled={loading}
              style={{ marginLeft: "10px" }}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {showAddAlert && (
          <AddAlert
            onClose={() => setShowAddAlert(false)}
            onAlertCreated={loadAlerts}
          />
        )}

        <div className="alert-history-wrapper">
          <div className="dashboard-card alert-history-card">
            <div className="alert-history-header">
              <div>
                <h2>Active Alerts</h2>

                <p>
                  {alerts.length} active alert
                  {alerts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="alert-history-count">
                {alerts.length} Active
              </div>
            </div>

            {loading ? (
              <div className="alert-history-empty">
                <div className="alert-history-loading">
                  Loading alerts...
                </div>
              </div>
            ) : alerts.length === 0 ? (
              <div className="alert-history-empty">
                <div className="alert-history-empty-icon">
                  ✓
                </div>

                <h3>No active alerts</h3>

                <p>
                  All monitored systems are currently clear.
                </p>
              </div>
            ) : (
              <>
                <div className="table-container alert-history-table-container">
                  <table className="alert-history-table">
                    <thead>
                      <tr>
                        <th>Alert</th>
                        <th>Asset</th>
                        <th>Severity</th>
                        <th>Message</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentAlerts.map((alert) => (
                        <tr key={alert.id}>
                          <td>
                            <div className="alert-history-id">
                              #{alert.id}
                            </div>
                          </td>

                          <td>
                            <div className="alert-history-asset">
                              Asset #{alert.assetId}
                            </div>
                          </td>

                          <td>
                            <span
                              className={getSeverityClass(
                                alert.severity
                              )}
                            >
                              {alert.severity}
                            </span>
                          </td>

                          <td>
                            <div className="alert-history-message">
                              {alert.message || "-"}
                            </div>
                          </td>

                          <td>
                            <span className="alert-history-date">
                              {formatDate(alert.createdAt)}
                            </span>
                          </td>

                          <td>
                            <span className="alert-history-status open-status">
                              <span className="alert-history-status-dot" />
                              Open
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="alert-resolve-button"
                              onClick={() =>
                                handleResolve(alert.id)
                              }
                              disabled={
                                resolvingId === alert.id
                              }
                            >
                              {resolvingId === alert.id
                                ? "Resolving..."
                                : "Resolve"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="alert-pagination">
                    <div className="alert-pagination-info">
                      Showing {startIndex + 1}-
                      {Math.min(endIndex, alerts.length)} of{" "}
                      {alerts.length} alerts
                    </div>

                    <div className="alert-pagination-controls">
                      <button
                        className="pagination-button"
                        onClick={() =>
                          goToPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`pagination-number ${
                            currentPage === page ? "active" : ""
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        className="pagination-button"
                        onClick={() =>
                          goToPage(currentPage + 1)
                        }
                        disabled={
                          currentPage === totalPages
                        }
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="dashboard-footer">
          SentinelCore SecureOps • Alerts
        </div>
      </div>
    </div>
  );
};

export default Alerts;
