import React, { useEffect, useState } from "react";
import { getOpenAlerts } from "../api/assetApi";

const NotificationBell = () => {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await getOpenAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error(
        "Error loading notifications:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    setOpen((prev) => !prev);
  };

  const handleViewAlerts = () => {
    window.location.href = "/alerts";
  };

  const getSeverityClass = (severity) => {
    switch (String(severity || "").toUpperCase()) {
      case "CRITICAL":
        return "critical";

      case "HIGH":
        return "high";

      case "MEDIUM":
        return "medium";

      default:
        return "low";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (String(severity || "").toUpperCase()) {
      case "CRITICAL":
        return "!";
      case "HIGH":
        return "!";
      case "MEDIUM":
        return "!";
      default:
        return "i";
    }
  };

  return (
    <div className="notification-wrapper">

      {/* =========================
          NOTIFICATION BUTTON
      ========================= */}

      <button
        className={`notification ${
          open ? "notification-active" : ""
        }`}
        onClick={handleNotificationClick}
        type="button"
        aria-label="Notifications"
      >

        {/* Bell Icon */}

        <svg
          className="notification-bell-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 13 4 14.5 4 17H20C20 14.5 18 13 18 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M10 21H14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

        </svg>

        {/* Alert Count */}

        {alerts.length > 0 && (
          <span className="notification-badge">
            {alerts.length > 99
              ? "99+"
              : alerts.length}
          </span>
        )}

      </button>

      {/* =========================
          DROPDOWN
      ========================= */}

      {open && (
        <div className="notification-dropdown">

          {/* Header */}

          <div className="notification-dropdown-header">

            <div>

              <h3>
                Notifications
              </h3>

              <p>
                {alerts.length === 0
                  ? "You're all caught up"
                  : `${alerts.length} active alert${
                      alerts.length !== 1
                        ? "s"
                        : ""
                    }`}
              </p>

            </div>

            {alerts.length > 0 && (
              <span className="notification-header-count">
                {alerts.length}
              </span>
            )}

          </div>

          {/* Notification List */}

          <div className="notification-list">

            {alerts.length === 0 ? (

              <div className="notification-empty">

                <div className="notification-empty-icon">
                  ✓
                </div>

                <strong>
                  No active alerts
                </strong>

                <span>
                  All monitored systems are operating normally.
                </span>

              </div>

            ) : (

              alerts.slice(0, 5).map((alert) => {

                const severity =
                  String(
                    alert.severity || "LOW"
                  ).toUpperCase();

                const severityClass =
                  getSeverityClass(severity);

                return (

                  <button
                    className="notification-item"
                    key={alert.id}
                    onClick={handleViewAlerts}
                    type="button"
                  >

                    {/* Severity Icon */}

                    <div
                      className={`notification-item-icon ${severityClass}`}
                    >
                      {getSeverityIcon(severity)}
                    </div>

                    {/* Content */}

                    <div className="notification-item-content">

                      <div className="notification-item-top">

                        <strong>
                          {severity} Alert
                        </strong>

                        <span>
                          #{alert.id}
                        </span>

                      </div>

                      <div className="notification-item-asset">
                        Asset #{alert.assetId}
                      </div>

                      <p>
                        {alert.message ||
                          "No message available"}
                      </p>

                    </div>

                    {/* Arrow */}

                    <span className="notification-item-arrow">
                      ›
                    </span>

                  </button>

                );
              })

            )}

          </div>

          {/* Footer */}

          {alerts.length > 0 && (

            <button
              className="notification-view-all"
              onClick={handleViewAlerts}
              type="button"
            >
              <span>
                View all alerts
              </span>

              <span>
                →
              </span>

            </button>

          )}

        </div>
      )}

    </div>
  );
};

export default NotificationBell;