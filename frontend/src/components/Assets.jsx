import { useEffect, useState } from "react";
import { getAllAssets, searchAssets } from "../api/assetApi";
import AddAsset from "./AddAsset";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 10;

  const { isAdmin, logout } = useAuth();

  const username =
    localStorage.getItem("username") || "Admin";

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();

      setAssets(response.data || []);
      setCurrentPage(1);
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
    setCurrentPage(1);

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
    setCurrentPage(1);

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

  // Pagination calculations
  const totalPages = Math.ceil(
    assets.length / assetsPerPage
  );

  const startIndex =
    (currentPage - 1) * assetsPerPage;

  const endIndex = startIndex + assetsPerPage;

  const currentAssets = assets.slice(
    startIndex,
    endIndex
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DashboardLayout
      search={search}
      setSearch={handleSearch}
      username={username}
      isAdmin={isAdmin}
      logout={logout}
      onAddAsset={() => setOpen(true)}
    >

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

          {isAdmin && (
  <button
    className="create-button"
    onClick={() => setOpen(true)}
  >
    + Add Asset
  </button>
)}
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

              <>

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

                      currentAssets.map((asset) => {

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

                {/* Pagination */}

                {totalPages > 1 && (

                  <div className="alert-pagination">

                    <div className="alert-pagination-info">

                      Showing {startIndex + 1}-
                      {Math.min(
                        endIndex,
                        assets.length
                      )}{" "}
                      of {assets.length} assets

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
                            currentPage === page
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

      </section>

      <footer className="dashboard-footer">

        © 2026 SentinelCore SecureOps.
        All rights reserved.

      </footer>

      {/* ADD ASSET MODAL */}

      {open && (

        <AddAsset
          onClose={() => setOpen(false)}
          onAssetCreated={loadAssets}
        />

      )}

    </DashboardLayout>
  );
}

export default Assets;