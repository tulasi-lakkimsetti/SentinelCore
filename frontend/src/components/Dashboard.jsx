import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import {
  getAllAssets,
  getDashboardSummary
} from "../api/assetApi";

import { useAuth } from "../context/AuthContext";
import AddAsset from "./AddAsset";
import "../styles/Dashboard.css";

function Dashboard() {
  const [assets, setAssets] = useState([]);

  const [summary, setSummary] = useState({
    totalAssets: 0,
    uptimePercentage: 0,
    avgCpuUsage: 0,
    criticalAlerts: 0
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAdmin, logout } = useAuth();

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  const loadData = async () => {
    try {
      const [assetResponse, summaryResponse] =
        await Promise.all([
          getAllAssets(),
          getDashboardSummary()
        ]);

      setAssets(assetResponse.data || []);
      setSummary(summaryResponse.data || {});
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     OVERALL COUNTS
  ========================= */

  const totalAssets = assets.length;

  const onlineAssets = assets.filter(
    (asset) =>
      String(asset.status || "").toUpperCase() ===
      "ONLINE"
  ).length;

  const warningAssets = assets.filter(
    (asset) =>
      String(asset.status || "").toUpperCase() ===
      "WARNING"
  ).length;

  const criticalAssets = assets.filter(
    (asset) =>
      String(asset.status || "").toUpperCase() ===
      "CRITICAL"
  ).length;

  const activeAlerts =
    warningAssets + criticalAssets;

  /* =========================
     SEARCH / FILTER
  ========================= */

  const filteredAssets = useMemo(() => {
    const value = search.trim().toLowerCase();

    /*
      Empty search or "all"
      = show all assets
    */

    if (!value || value === "all") {
      return assets;
    }

    return assets.filter((asset) => {
      const assetName = String(
        asset.assetName || ""
      ).toLowerCase();

      const assetType = String(
        asset.assetType || ""
      ).toLowerCase();

      const ipAddress = String(
        asset.ipAddress || ""
      ).toLowerCase();

      const status = String(
        asset.status || ""
      ).toLowerCase();

      return (
        assetName.includes(value) ||
        assetType.includes(value) ||
        ipAddress.includes(value) ||
        status.includes(value)
      );
    });
  }, [assets, search]);

  /* =========================
     FILTERED COUNTS
  ========================= */

  const filteredTotalAssets =
    filteredAssets.length;

  const filteredOnlineAssets =
    filteredAssets.filter(
      (asset) =>
        String(asset.status || "").toUpperCase() ===
        "ONLINE"
    ).length;

  const filteredWarningAssets =
    filteredAssets.filter(
      (asset) =>
        String(asset.status || "").toUpperCase() ===
        "WARNING"
    ).length;

  const filteredCriticalAssets =
    filteredAssets.filter(
      (asset) =>
        String(asset.status || "").toUpperCase() ===
        "CRITICAL"
    ).length;

  /* =========================
     CPU DATA
  ========================= */

  const cpuData = filteredAssets.map((asset) => ({
    name: asset.assetName,
    value: Number(asset.cpuUsage || 0)
  }));

  /* =========================
     MEMORY DATA
  ========================= */

  const memoryData = filteredAssets.map((asset) => ({
    name: asset.assetName,
    value: Number(asset.memoryUsage || 0)
  }));

  /* =========================
     STATUS DATA
  ========================= */

  const statusData = [
    {
      name: "Online",
      value: filteredOnlineAssets
    },
    {
      name: "Warning",
      value: filteredWarningAssets
    },
    {
      name: "Critical",
      value: filteredCriticalAssets
    }
  ].filter((item) => item.value > 0);

  const STATUS_COLORS = [
    "#22c55e",
    "#f59e0b",
    "#ef4444"
  ];

  /* =========================
     TOP UTILIZATION
  ========================= */

  const topUtilization = [...filteredAssets]
    .sort(
      (a, b) =>
        Number(b.cpuUsage || 0) -
        Number(a.cpuUsage || 0)
    )
    .slice(0, 5);

  /* =========================
     RECENT ALERTS
  ========================= */

  const recentAlerts = filteredAssets
    .filter(
      (asset) => {
        const status = String(
          asset.status || ""
        ).toUpperCase();

        return (
          status === "WARNING" ||
          status === "CRITICAL"
        );
      }
    )
    .slice(0, 5);

  /* =========================
     USER
  ========================= */

  const username =
    localStorage.getItem("username") || "Admin";

  const currentDate = new Date().toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    logout();
    window.location.href = "/";
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

          <button className="sidebar-item active">
            <span>⌂</span>
            Dashboard
          </button>

          {isAdmin && (
            <button
              className="sidebar-item"
              onClick={() => setOpen(true)}
            >
              <span>⊕</span>
              Add Asset
            </button>
          )}

          

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

            {activeAlerts > 0 && (
              <b className="sidebar-alert-count">
                {activeAlerts}
              </b>
            )}

          </button>

          <button className="sidebar-item">
            <span>◷</span>
            Alert History
          </button>

        </div>

        <div className="sidebar-section">
          PROFILE
        </div>

        <div className="sidebar-menu">

          <button className="sidebar-item">
            <span>◯</span>
            Profile
          </button>

          <button
            className="sidebar-item"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

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
            HEADER
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

          {/* SEARCH BAR ONLY */}

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

            <button className="notification">

              ♧

              {activeAlerts > 0 && (
                <span>
                  {activeAlerts}
                </span>
              )}

            </button>

            <div className="header-user">

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

        {/* =========================
            PAGE TITLE
        ========================= */}

        <section className="page-heading">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {username}!
            </p>

          </div>

          <div className="date-card">

            <span>▣</span>

            {currentDate}

          </div>

        </section>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <section className="summary-cards">

          <div className="summary-card blue">

            <div className="summary-card-icon">
              ▣
            </div>

            <div>

              <span>
                Total Assets
              </span>

              <strong>
                {totalAssets}
              </strong>

              <small>
                Monitored assets
              </small>

            </div>

          </div>

          <div className="summary-card green">

            <div className="summary-card-icon">
              ✓
            </div>

            <div>

              <span>
                Online Assets
              </span>

              <strong>
                {onlineAssets}
              </strong>

              <small>

                {totalAssets
                  ? Math.round(
                      (onlineAssets /
                        totalAssets) *
                        100
                    )
                  : 0}

                % of total assets

              </small>

            </div>

          </div>

          <div className="summary-card orange">

            <div className="summary-card-icon">
              !
            </div>

            <div>

              <span>
                Active Alerts
              </span>

              <strong>
                {activeAlerts}
              </strong>

              <small>
                Requires attention
              </small>

            </div>

          </div>

          <div className="summary-card red">

            <div className="summary-card-icon">
              ⚠
            </div>

            <div>

              <span>
                Critical Alerts
              </span>

              <strong>
                {summary.criticalAlerts ??
                  criticalAssets}
              </strong>

              <small>
                Immediate attention
              </small>

            </div>

          </div>

        </section>

        {/* =========================
            CHARTS
        ========================= */}

        <section className="chart-grid">

          {/* CPU */}

          <div className="dashboard-card chart-card">

            <div className="card-header">

              <div>

                <h2>
                  CPU Usage Overview
                </h2>

                <p>
                  Current CPU utilization
                </p>

              </div>

              <span className="chart-filter">
                Live
              </span>

            </div>

            {cpuData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={225}
              >

                <LineChart
                  data={cpuData}
                >

                  <CartesianGrid
                    stroke="#203149"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#8799ad",
                      fontSize: 10
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "#8799ad",
                      fontSize: 10
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#178cff"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="CPU %"
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">
                No CPU data available.
              </div>

            )}

          </div>

          {/* MEMORY */}

          <div className="dashboard-card chart-card">

            <div className="card-header">

              <div>

                <h2>
                  Memory Usage Overview
                </h2>

                <p>
                  Current memory utilization
                </p>

              </div>

              <span className="chart-filter">
                Live
              </span>

            </div>

            {memoryData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={225}
              >

                <LineChart
                  data={memoryData}
                >

                  <CartesianGrid
                    stroke="#203149"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#8799ad",
                      fontSize: 10
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "#8799ad",
                      fontSize: 10
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b4dff"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="Memory %"
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">
                No memory data available.
              </div>

            )}

          </div>

          {/* STATUS PIE CHART */}

          <div className="dashboard-card chart-card status-card">

            <div className="card-header">

              <div>

                <h2>
                  Asset Status Distribution
                </h2>

                <p>
                  Current infrastructure state
                </p>

              </div>

            </div>

            <div className="status-chart">

              {filteredTotalAssets > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={190}
                >

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={2}
                    >

                      {statusData.map(
                        (entry, index) => (

                          <Cell
                            key={entry.name}
                            fill={
                              STATUS_COLORS[index]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="chart-empty">
                  No status data available.
                </div>

              )}

              <div className="status-center">

                <strong>
                  {filteredTotalAssets}
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>

            <div className="status-legend">

              <div>

                <span>

                  <i className="dot online"></i>

                  Online

                </span>

                <b>
                  {filteredOnlineAssets}
                </b>

              </div>

              <div>

                <span>

                  <i className="dot warning"></i>

                  Warning

                </span>

                <b>
                  {filteredWarningAssets}
                </b>

              </div>

              <div>

                <span>

                  <i className="dot critical"></i>

                  Critical

                </span>

                <b>
                  {filteredCriticalAssets}
                </b>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            BOTTOM TABLES
        ========================= */}

        <section className="bottom-grid">

          {/* RECENT ALERTS */}

          <div className="dashboard-card table-card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Alerts
                </h2>

                <p>
                  Assets requiring attention
                </p>

              </div>

              <button className="view-all">
                View All
              </button>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Asset
                    </th>

                    <th>
                      Severity
                    </th>

                    <th>
                      Message
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentAlerts.length > 0 ? (

                    recentAlerts.map(
                      (asset) => {

                        const status =
                          String(
                            asset.status || ""
                          ).toUpperCase();

                        return (

                          <tr key={asset.id}>

                            <td>

                              <strong>
                                {asset.assetName}
                              </strong>

                            </td>

                            <td>

                              <span
                                className={`severity ${
                                  status.toLowerCase()
                                }`}
                              >
                                {status}
                              </span>

                            </td>

                            <td>

                              {status ===
                              "CRITICAL"
                                ? "Critical asset status detected"
                                : "Warning asset status detected"}

                            </td>

                            <td>

                              <span
                                className={`alert-status ${
                                  status.toLowerCase()
                                }`}
                              >
                                OPEN
                              </span>

                            </td>

                          </tr>

                        );
                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="empty-table"
                      >
                        No active alerts.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* TOP UTILIZATION */}

          <div className="dashboard-card table-card">

            <div className="card-header">

              <div>

                <h2>
                  Top Asset Utilization
                </h2>

                <p>
                  Highest CPU utilization
                </p>

              </div>

              <button className="view-all">
                View All
              </button>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Asset Name
                    </th>

                    <th>
                      CPU
                    </th>

                    <th>
                      Memory
                    </th>

                    <th>
                      Disk
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {topUtilization.length > 0 ? (

                    topUtilization.map(
                      (asset) => {

                        const status =
                          String(
                            asset.status || ""
                          ).toUpperCase();

                        return (

                          <tr key={asset.id}>

                            <td>

                              <strong>
                                {asset.assetName}
                              </strong>

                            </td>

                            <td>

                              <span
                                className={
                                  Number(
                                    asset.cpuUsage
                                  ) >= 90
                                    ? "metric-critical"
                                    : Number(
                                        asset.cpuUsage
                                      ) >= 70
                                    ? "metric-warning"
                                    : "metric-good"
                                }
                              >

                                {asset.cpuUsage}%

                              </span>

                            </td>

                            <td>
                              {asset.memoryUsage}%
                            </td>

                            <td>
                              {asset.diskUsage}%
                            </td>

                            <td>

                              <span className="status-text">

                                <i
                                  className={`dot ${
                                    status ===
                                    "CRITICAL"
                                      ? "critical"
                                      : status ===
                                        "WARNING"
                                      ? "warning"
                                      : "online"
                                  }`}
                                ></i>

                                {status}

                              </span>

                            </td>

                          </tr>

                        );
                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="empty-table"
                      >
                        No assets available.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="dashboard-footer">

          © 2026 SentinelCore SecureOps.
          All rights reserved.

        </footer>

      </main>

      {/* =========================
          ADD ASSET
      ========================= */}

      {open && isAdmin && (
        <AddAsset
          onClose={() => setOpen(false)}
          onAssetCreated={loadData}
        />
      )}

    </div>
  );
}

export default Dashboard;