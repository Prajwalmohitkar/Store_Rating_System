import  { useState } from "react";
import axios from "axios";


export default function ChangePassword({ token }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage("⚠️ Please fill in all fields.");
      setMessageType("danger");
      return;
    }
    if (!validatePassword(formData.newPassword)) {
      setMessage("❌ Password must be 8–16 characters, include at least one uppercase letter and one special character.");
      setMessageType("danger");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("❌ New passwords do not match.");
      setMessageType("danger");
      return;
    }
    try {
      await axios.put(
        "http://localhost:5000/api/auth/update-password",
        { oldPassword: formData.currentPassword, newPassword: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Password changed successfully!");
      setMessageType("success");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password.");
      setMessageType("danger");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">Change Password</h3>
        {message && (
          <div className={`alert alert-${messageType} text-center`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="form-control"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <small className="text-muted">
              Must be 8–16 characters, include 1 uppercase and 1 special character.
            </small>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4 rounded-pill">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}