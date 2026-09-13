import React, { useEffect, useState } from "react";
import {
  createAlert,
  getAllAssets
} from "../api/assetApi";

const AddAlert = ({ onClose, onAlertCreated }) => {
  const [assets, setAssets] = useState([]);

  const [formData, setFormData] = useState({
    assetId: "",
    severity: "LOW",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [assetsLoading, setAssetsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await getAllAssets();

        setAssets(response.data || []);
      } catch (error) {
        console.error(
          "Error loading assets:",
          error.response?.status,
          error.response?.data
        );
      } finally {
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assetId) {
      alert("Please select an asset.");
      return;
    }

    if (!formData.message.trim()) {
      alert("Please enter an alert message.");
      return;
    }

    try {
      setLoading(true);

      const alertData = {
        assetId: Number(formData.assetId),
        severity: formData.severity,
        message: formData.message.trim()
      };

      await createAlert(alertData);

      alert("Alert created successfully!");

      setFormData({
        assetId: "",
        severity: "LOW",
        message: ""
      });

      if (onAlertCreated) {
        onAlertCreated();
      }

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error(
        "Error creating alert:",
        error.response?.status,
        error.response?.data
      );

      alert("Failed to create alert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="asset-modal">

        <div className="modal-header">

          <h2>Add Alert</h2>

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

            {/* Asset */}
            <label>Asset</label>

            <select
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              required
              disabled={assetsLoading}
            >
              <option value="">
                {assetsLoading
                  ? "Loading assets..."
                  : "Select Asset"}
              </option>

              {assets.map((asset) => (
                <option
                  key={asset.id}
                  value={asset.id}
                >
                  #{asset.id} - {asset.assetName}
                </option>
              ))}
            </select>

            {/* Severity */}
            <label>Severity</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {/* Message */}
            <label>Alert Message</label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter alert message"
              rows="5"
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
              {loading ? "Creating..." : "Create Alert"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddAlert;