import React, { useEffect, useState } from "react";
import { getAllAssets, getOpenAlerts } from "../api/assetApi";
import DashboardLayout from "./DashboardLayout";
import "../styles/Dashboard.css";

const ViewerDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const [assetResponse, alertResponse] = await Promise.all([
        getAllAssets(),
        getOpenAlerts()
      ]);

      setAssets(assetResponse.data || []);
      setAlerts(alertResponse.data || []);
    } catch (error) {
      console.error("Error loading viewer dashboard:", error);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      String(asset.assetName || "").toLowerCase().includes(value) ||
      String(asset.assetType || "").toLowerCase().includes(value) ||
      String(asset.ipAddress || "").toLowerCase().includes(value) ||
      String(asset.status || "").toLowerCase().includes(value)
    );
  });

  const onlineAssets = filteredAssets.filter(
    (asset) => String(asset.status).toUpperCase() === "ONLINE"
  ).length;

  const warningAssets = filteredAssets.filter(
    (asset) => String(asset.status).toUpperCase() === "WARNING"
  ).length;

  const criticalAssets = filteredAssets.filter(
    (asset) => String(asset.status).toUpperCase() === "CRITICAL"
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      String(alert.severity || "").toLowerCase().includes(value) ||
      String(alert.message || "").toLowerCase().includes(value) ||
      String(alert.assetId || "").toLowerCase().includes(value)
    );
  });

  return (
    <DashboardLayout
      search={search}
      setSearch={setSearch}
      username={localStorage.getItem("username") || "Viewer"}
      isAdmin={false}
      onAddAsset={() => {}}
    >
      {/* PAGE HEADING */}

      <div className="page-heading">
        <div>
          <h1>Viewer Dashboard</h1>
          <p>Monitor infrastructure and security status.</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="summary-cards">

        <div className="summary-card blue">
          <div className="summary-card-icon">▤</div>

          <div>
            <span>Total Assets</span>
            <strong>{filteredAssets.length}</strong>
            <small>Monitored assets</small>
          </div>
        </div>

        <div className="summary-card green">
          <div className="summary-card-icon">✓</div>

          <div>
            <span>Online Assets</span>
            <strong>{onlineAssets}</strong>
            <small>Currently operational</small>
          </div>
        </div>

        <div className="summary-card orange">
          <div className="summary-card-icon">⚠</div>

          <div>
            <span>Warning Assets</span>
            <strong>{warningAssets}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="summary-card red">
          <div className="summary-card-icon">!</div>

          <div>
            <span>Critical Assets</span>
            <strong>{criticalAssets}</strong>
            <small>Immediate attention</small>
          </div>
        </div>

      </div>

      {/* ASSET TABLE */}

      <div className="bottom-grid">

        <div className="dashboard-card table-card">

          <div className="table-card-header">
            <div>
              <h2>Asset Overview</h2>
              <p>Current status of monitored assets</p>
            </div>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>IP Address</th>
                  <th>Status</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>

              <tbody>

                {filteredAssets.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="empty-table">
                      No assets found.
                    </td>
                  </tr>

                ) : (

                  filteredAssets.map((asset) => {

                    const status = String(
                      asset.status || ""
                    ).toUpperCase();

                    return (
                      <tr key={asset.id}>

                        <td>
                          <strong>{asset.assetName}</strong>
                        </td>

                        <td>{asset.assetType}</td>

                        <td>{asset.ipAddress}</td>

                        <td>
                          <span className="status-text">

                            <span
                              className={`dot ${status.toLowerCase()}`}
                            ></span>

                            {status}

                          </span>
                        </td>

                        <td>
                          {asset.cpuUsage}%
                        </td>

                        <td>
                          {asset.memoryUsage}%
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ACTIVE ALERTS */}

        <div className="dashboard-card table-card">

          <div className="table-card-header">
            <div>
              <h2>Active Alerts</h2>
              <p>Current security alerts</p>
            </div>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Severity</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredAlerts.length === 0 ? (

                  <tr>
                    <td colSpan="4" className="empty-table">
                      No active alerts.
                    </td>
                  </tr>

                ) : (

                  filteredAlerts.slice(0, 5).map((alert) => {

                    const severity = String(
                      alert.severity || ""
                    ).toLowerCase();

                    return (
                      <tr key={alert.id}>

                        <td>
                          Asset #{alert.assetId}
                        </td>

                        <td>
                          <span className={`severity ${severity}`}>
                            {String(
                              alert.severity || ""
                            ).toUpperCase()}
                          </span>
                        </td>

                        <td>
                          {alert.message || "No message available"}
                        </td>

                        <td>
                          <span className="alert-status open-status">
                            {alert.status || "OPEN"}
                          </span>
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* VIEWER INFORMATION */}

      <div className="bottom-grid">

        <div className="dashboard-card table-card">

          <div className="table-card-header">
            <div>
              <h2>Viewer Access</h2>
              <p>Read-only monitoring access</p>
            </div>
          </div>

          <div style={{ padding: "0 20px 20px" }}>

            <p
              style={{
                margin: 0,
                color: "#718096",
                fontSize: "12px",
                lineHeight: "1.6"
              }}
            >
              You can monitor assets, system status and active alerts.
              Administrative actions such as adding assets are not
              available for Viewer accounts.
            </p>

          </div>

        </div>

      </div>

      <div className="dashboard-footer">
        SentinelCore SecureOps • Viewer Monitoring Dashboard
      </div>

    </DashboardLayout>
  );
};

export default ViewerDashboard;