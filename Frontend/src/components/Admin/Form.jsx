//This is my Form.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Form({ token }) {
  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, password, address, role } = formData;
    if (name.length < 20) {
      setMessage("Name must be at least 20 characters.");
      setMessageType("danger");
      return false;
    }
    if (name.length > 60) {
      setMessage("Name must not exceed 60 characters.");
      setMessageType("danger");
      return false;
    }
    if (address.length > 400) {
      setMessage("Address must not exceed 400 characters.");
      setMessageType("danger");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("danger");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be 8–16 chars, include 1 uppercase & 1 special character."
      );
      setMessageType("danger");
      return false;
    }

    if (role === "Store Owner" && !formData.storeName) {
      setMessage("Store Name is required for Store Owners.");
      setMessageType("danger");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    try {
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        role: formData.role,
      };

      if (formData.role === "Store Owner") {
        await axios.post("http://localhost:5000/api/admin/users", userPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.post(
          "http://localhost:5000/api/admin/stores",
          {
            name: formData.storeName,
            address: formData.address,
            ownerEmail: formData.email,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/admin/users", userPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessage("User added successfully!");
      setMessageType("success");
      setFormData({
        name: "",
        storeName: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
      });
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Failed to add user.";
      setMessage(msg);
      setMessageType("danger");
    }
  };

  return (
    <div className="mt-5 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4">
          <h3 className="mb-0">➕ Add New User</h3>
        </div>
        <div className="card-body p-4">
          {message && (
            <div className={`alert alert-${messageType} text-center`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Enter full name (min 20 chars)"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select form-control-sm rounded-3"
                  required
                >
                  <option value="Normal User">Normal User</option>
                  <option value="Store Owner">Store Owner</option>
                  <option value="System Administrator">
                    System Administrator
                  </option>
                </select>
              </div>
            </div>
            {formData.role === "Store Owner" && (
              <div className="mt-3">
                <label className="form-label fw-semibold">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Enter store name"
                  required
                  autoComplete="off"
                />
              </div>
            )}
            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Enter email"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Enter password"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label fw-semibold">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="form-control form-control-sm rounded-3"
                placeholder="Enter address (max 400 chars)"
                required
              ></textarea>
            </div>
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg rounded-3 shadow-sm"
              >
                <i className="bi bi-person-plus-fill"></i> Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
