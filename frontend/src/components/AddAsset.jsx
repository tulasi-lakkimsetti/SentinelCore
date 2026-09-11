import React, { useState } from "react";
import { createAsset } from "../api/assetApi";

const AddAsset = ({ onClose, onAssetCreated }) => {
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "Server",
    ipAddress: "",
    status: "ONLINE",
    cpuUsage: "",
    memoryUsage: "",
    diskUsage: "",
    networkUsage: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const assetData = {
        assetName: formData.assetName,
        assetType: formData.assetType,
        ipAddress: formData.ipAddress,
        status: formData.status,
        cpuUsage: Number(formData.cpuUsage),
        memoryUsage: Number(formData.memoryUsage),
        diskUsage: Number(formData.diskUsage),
        networkUsage: Number(formData.networkUsage)
      };

      await createAsset(assetData);

      alert("Asset created successfully!");

      if (onAssetCreated) {
        onAssetCreated();
      }

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Failed to create asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="asset-modal">

        <div className="modal-header">
          <h2>Add Asset</h2>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="modal-body">

            {/* Asset Name */}
            <label>Asset Name</label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              placeholder="Enter asset name"
              required
            />

            {/* Asset Type */}
            <label>Asset Type</label>
            <select
              name="assetType"
              value={formData.assetType}
              onChange={handleChange}
            >
              <option value="Server">Server</option>
              <option value="Database">Database</option>
              <option value="Network">Network</option>
              <option value="Security">Security</option>
            </select>

            {/* IP Address */}
            <label>IP Address</label>
            <input
              type="text"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder="Enter IP address"
              required
            />

            {/* Status */}
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ONLINE">Online</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {/* CPU Usage */}
            <label>CPU Usage (%)</label>
            <input
              type="number"
              name="cpuUsage"
              value={formData.cpuUsage}
              onChange={handleChange}
              placeholder="Enter CPU usage"
              min="0"
              max="100"
              required
            />

            {/* Memory Usage */}
            <label>Memory Usage (%)</label>
            <input
              type="number"
              name="memoryUsage"
              value={formData.memoryUsage}
              onChange={handleChange}
              placeholder="Enter memory usage"
              min="0"
              max="100"
              required
            />

            {/* Disk Usage */}
            <label>Disk Usage (%)</label>
            <input
              type="number"
              name="diskUsage"
              value={formData.diskUsage}
              onChange={handleChange}
              placeholder="Enter disk usage"
              min="0"
              max="100"
              required
            />

            {/* Network Usage */}
            <label>Network Usage (%)</label>
            <input
              type="number"
              name="networkUsage"
              value={formData.networkUsage}
              onChange={handleChange}
              placeholder="Enter network usage"
              min="0"
              max="100"
              required
            />

          </div>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Asset"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddAsset;