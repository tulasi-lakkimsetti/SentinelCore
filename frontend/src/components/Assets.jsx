import { useEffect, useState } from "react";
import { getAllAssets, searchAssets } from "../api/assetApi";
import AddAsset from "./AddAsset";
import "../styles/Dashboard.css";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();

      setAssets(response.data || []);
    } catch (error) {
      console.error(
        "Assets Error:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      setLoading(true);

      const response = await searchAssets(
        value,
        statusFilter
      );

      setAssets(response.data || []);
    } catch (error) {
      console.error(
        "Search Assets Error:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (value) => {
    setStatusFilter(value);

    try {
      setLoading(true);

      const response = await searchAssets(
        search,
        value
      );

      setAssets(response.data || []);
    } catch (error) {
      console.error(
        "Filter Assets Error:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

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

          <button className="sidebar-item">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="sidebar-item active">
            <span>▤</span>
            Assets
          </button>

          <button className="sidebar-item">
            <span>♧</span>
            Alerts
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

            <strong>
              System Status
            </strong>

            <span>
              All Systems Operational
            </span>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        <header className="top-header">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

          </div>

        </header>

        {/* PAGE HEADING */}

        <section className="page-heading">

          <div>

            <h1>
              Assets
            </h1>

            <p>
              Manage and monitor your infrastructure assets.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilter(e.target.value)
              }
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              <option value="">
                All Status
              </option>

              <option value="ONLINE">
                Online
              </option>

              <option value="WARNING">
                Warning
              </option>

              <option value="CRITICAL">
                Critical
              </option>

            </select>

            <button
              className="create-button"
              onClick={() => setOpen(true)}
            >
              + Add Asset
            </button>

          </div>

        </section>

        {/* ASSET TABLE */}

        <section className="bottom-grid">

          <div
            className="dashboard-card table-card"
            style={{ gridColumn: "span 2" }}
          >

            <div className="card-header">

              <div>

                <h2>
                  All Assets
                </h2>

                <p>
                  Infrastructure assets currently being monitored
                </p>

              </div>

            </div>

            <div className="table-container">

              {loading ? (

                <div className="empty-table">
                  Loading assets...
                </div>

              ) : (

                <table>

                  <thead>

                    <tr>

                      <th>
                        Asset Name
                      </th>

                      <th>
                        Type
                      </th>

                      <th>
                        IP Address
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
                        Network
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {assets.length > 0 ? (

                      assets.map((asset) => {

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
                              {asset.assetType}
                            </td>

                            <td>
                              {asset.ipAddress}
                            </td>

                            <td>
                              {asset.cpuUsage}%
                            </td>

                            <td>
                              {asset.memoryUsage}%
                            </td>

                            <td>
                              {asset.diskUsage}%
                            </td>

                            <td>
                              {asset.networkUsage}%
                            </td>

                            <td>

                              <span className="status-text">

                                <i
                                  className={`dot ${
                                    status === "CRITICAL"
                                      ? "critical"
                                      : status === "WARNING"
                                      ? "warning"
                                      : "online"
                                  }`}
                                ></i>

                                {status}

                              </span>

                            </td>

                          </tr>

                        );

                      })

                    ) : (

                      <tr>

                        <td
                          colSpan="8"
                          className="empty-table"
                        >
                          No assets available.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </section>

        <footer className="dashboard-footer">

          © 2026 SentinelCore SecureOps.
          All rights reserved.

        </footer>

      </main>

      {/* ADD ASSET MODAL */}

      {open && (
        <AddAsset
          onClose={() => setOpen(false)}
          onAssetCreated={loadAssets}
        />
      )}

    </div>
  );
}

export default Assets;