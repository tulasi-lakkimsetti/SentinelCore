import React, { useState } from "react";
import {
  updateProfile,
  changePassword
} from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";
import "../styles/Profile.css";

const Profile = () => {
  const { isAdmin } = useAuth();

  const storedUsername =
    localStorage.getItem("username") || "Administrator";

  const storedEmail =
    localStorage.getItem("email") || "";

  const [profile, setProfile] = useState({
    username: storedUsername,
    email: storedEmail
  });

  const [editData, setEditData] = useState({
    username: storedUsername,
    email: storedEmail
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [editing, setEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const role = isAdmin
    ? "Administrator"
    : "User";

  /* =========================
     PROFILE INPUT
  ========================= */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editData.username.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!editData.email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateProfile({
        username: editData.username.trim(),
        email: editData.email.trim()
      });

      const updatedUsername =
        response.data.username ||
        editData.username.trim();

      const updatedEmail =
        response.data.email ||
        editData.email.trim();

      setProfile({
        username: updatedUsername,
        email: updatedEmail
      });

      setEditData({
        username: updatedUsername,
        email: updatedEmail
      });

      localStorage.setItem(
        "username",
        updatedUsername
      );

      localStorage.setItem(
        "email",
        updatedEmail
      );

      if (response.data.accessToken) {
        localStorage.setItem(
          "token",
          response.data.accessToken
        );
      }

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );

    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.status,
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     CANCEL PROFILE EDIT
  ========================= */

  const handleCancelEdit = () => {
    setEditData({
      username: profile.username,
      email: profile.email
    });

    setEditing(false);
    setError("");
  };

  /* =========================
     PASSWORD INPUT
  ========================= */

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (!passwordData.newPassword) {
      setError(
        "Please enter your new password."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setPasswordSaving(true);
      setError("");
      setMessage("");

      await changePassword({
        currentPassword:
          passwordData.currentPassword,

        newPassword:
          passwordData.newPassword
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setPasswordEditing(false);

      setMessage(
        "Password changed successfully."
      );

    } catch (err) {
      console.error(
        "Error changing password:",
        err.response?.status,
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <DashboardLayout
      search=""
      setSearch={() => {}}
      username={profile.username}
      isAdmin={isAdmin}
      onAddAsset={() => {}}
    >

      {/* PAGE HEADING */}

      <section className="page-heading">

        <div>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your SentinelCore account information.
          </p>

        </div>

      </section>

      {/* MESSAGES */}

      {message && (
        <div className="profile-success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="profile-error-message">
          ! {error}
        </div>
      )}

      {/* PROFILE */}

      <section className="profile-page">

        <div className="dashboard-card profile-card">

          <div className="profile-card-header">

            <div className="profile-avatar-large">
              {profile.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-header-info">

              {editing ? (

                <input
                  className="profile-name-input"
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={
                    handleProfileChange
                  }
                />

              ) : (

                <h2>
                  {profile.username}
                </h2>

              )}

              <p>
                {role}
              </p>

            </div>

            {!editing && (

              <button
                className="profile-edit-button"
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
                type="button"
              >
                ✎ Edit Profile
              </button>

            )}

          </div>

          <div className="profile-divider"></div>

          {editing ? (

            <form
              className="profile-edit-form"
              onSubmit={handleSaveProfile}
            >

              <div className="profile-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={
                    handleProfileChange
                  }
                  required
                />

              </div>

              <div className="profile-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={
                    handleProfileChange
                  }
                  required
                />

              </div>

              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          ) : (

            <div className="profile-details">

              <div className="profile-detail">

                <span>
                  Full Name
                </span>

                <strong>
                  {profile.username}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Email Address
                </span>

                <strong>
                  {profile.email ||
                    "Not available"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Account Role
                </span>

                <strong>
                  {role}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Account Status
                </span>

                <strong className="profile-status">

                  <i></i>
                  Active

                </strong>

              </div>

            </div>

          )}

        </div>

        {/* SECURITY */}

        <div className="dashboard-card profile-security-card">

          <div className="card-header">

            <div>

              <h2>
                Account Security
              </h2>

              <p>
                Keep your account secure.
              </p>

            </div>

          </div>

          {!passwordEditing ? (

            <>

              <div className="security-item">

                <div className="security-icon">
                  🔐
                </div>

                <div className="security-item-content">

                  <strong>
                    Password
                  </strong>

                  <span>
                    Your password is securely protected.
                  </span>

                </div>

                <button
                  className="security-action-button"
                  onClick={() => {
                    setPasswordEditing(true);
                    setMessage("");
                    setError("");
                  }}
                  type="button"
                >
                  Change
                </button>

              </div>

              <div className="security-item">

                <div className="security-icon">
                  🛡
                </div>

                <div>

                  <strong>
                    Account Protection
                  </strong>

                  <span>
                    SentinelCore security controls are active.
                  </span>

                </div>

              </div>

            </>

          ) : (

            <form
              className="password-form"
              onSubmit={
                handleChangePassword
              }
            >

              <div className="profile-form-group">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                  required
                />

              </div>

              <div className="profile-form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                  required
                />

              </div>

              <div className="profile-form-group">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                  required
                />

              </div>

              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => {
                    setPasswordEditing(false);

                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });

                    setError("");
                  }}
                  disabled={passwordSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={passwordSaving}
                >
                  {passwordSaving
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </div>

            </form>

          )}

        </div>

      </section>

    </DashboardLayout>
  );
};

export default Profile;