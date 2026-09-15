import React, { useEffect, useMemo, useState } from "react";
import { getAlertHistory } from "../api/assetApi";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";

const AlertHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  const { isAdmin } = useAuth();

  const username =
    localStorage.getItem("username") || "Admin";

  const loadAlertHistory = async () => {
    try {
      setLoading(true);

      const response = await getAlertHistory();
      setAlerts(response.data || []);
      setCurrentPage(1);
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

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        !search ||
        String(alert.id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(alert.assetId)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(alert.message || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" ||
        alert.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, search, severityFilter]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, severityFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAlerts.length / alertsPerPage
  );

  const startIndex =
    (currentPage - 1) * alertsPerPage;

  const endIndex =
    startIndex + alertsPerPage;

  const currentAlerts = filteredAlerts.slice(
    startIndex,
    endIndex
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  return (
    <DashboardLayout
      search=""
      setSearch={() => {}}
      username={username}
      isAdmin={isAdmin}
      onAddAsset={() => {}}
    >

      {/* Page Header */}

      <div className="page-heading">

        <div>

          <h1>
            Alert History
          </h1>

          <p>
            Review and monitor previously resolved alerts
          </p>

        </div>

        <button
          className="view-all"
          onClick={loadAlertHistory}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "↻ Refresh"}
        </button>

      </div>

      {/* History Card */}

      <div className="alert-history-wrapper">

        <div className="dashboard-card alert-history-card">

          {/* Card Header */}

          <div className="alert-history-header">

            <div>

              <h2>
                Resolved Alerts
              </h2>

              <p>
                {filteredAlerts.length} alert
                {filteredAlerts.length !== 1
                  ? "s"
                  : ""}{" "}
                shown
              </p>

            </div>

            <div className="alert-history-count">
              {alerts.length} Total
            </div>

          </div>

          {/* Filters */}

          <div className="alert-history-toolbar">

            <div className="alert-history-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search alert ID, asset ID or message..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value)
              }
              className="alert-history-filter"
            >

              <option value="ALL">
                All Severities
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="WARNING">
                Warning
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>

            </select>

          </div>

          {/* Table */}

          {loading ? (

            <div className="alert-history-empty">

              <div className="alert-history-loading">
                Loading alert history...
              </div>

            </div>

          ) : filteredAlerts.length === 0 ? (

            <div className="alert-history-empty">

              <div className="alert-history-empty-icon">
                ✓
              </div>

              <h3>
                No resolved alerts found
              </h3>

              <p>
                Try changing your search or filter.
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
                      <th>Resolved</th>
                      <th>Status</th>
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
                            {formatDate(
                              alert.createdAt
                            )}
                          </span>

                        </td>

                        <td>

                          <span className="alert-history-date">
                            {formatDate(
                              alert.resolvedAt
                            )}
                          </span>

                        </td>

                        <td>

                          <span className="alert-history-status">

                            <span className="alert-history-status-dot" />

                            Resolved

                          </span>

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
                    {Math.min(
                      endIndex,
                      filteredAlerts.length
                    )}{" "}
                    of {filteredAlerts.length} alerts

                  </div>

                  <div className="alert-pagination-controls">

                    <button
                      className="pagination-button"
                      onClick={() =>
                        goToPage(
                          currentPage - 1
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                    >
                      ← Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) =>
                        index + 1
                    ).map((page) => (

                      <button
                        key={page}
                        className={`pagination-number ${
                          currentPage ===
                          page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </button>

                    ))}

                    <button
                      className="pagination-button"
                      onClick={() =>
                        goToPage(
                          currentPage + 1
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
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
        SentinelCore SecureOps • Alert History
      </div>

    </DashboardLayout>
  );
};

export default AlertHistory;