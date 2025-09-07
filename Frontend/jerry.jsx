import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';

export default function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_URL = "http://localhost:5000/api";

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, id, name, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id, name, role }));
      setToken(token);
      setUser({ id, name, role });
      showMessage("Login successful!", "success");

      if (role === "System Administrator") {
        setView("admin");
      } else if (role === "Normal User") {
        setView("normal");
      } else if (role === "Store Owner") {
        setView("owner");
      }
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || "Invalid credentials", "danger");
    }
  };

  const handleSignup = async (name, email, password, address) => {
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, address });
      showMessage("Signup successful! You can now log in.", "success");
      setView("login");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Signup failed.";
      showMessage(msg, "danger");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setView("login");
    showMessage("You have been logged out.", "info");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setToken(storedToken);
          setUser(storedUser);
          if (storedUser.role === "System Administrator") {
            setView("admin");
          } else if (storedUser.role === "Normal User") {
            setView("normal");
          } else if (storedUser.role === "Store Owner") {
            setView("owner");
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, []);

  const renderContent = () => {
    if (message) {
      return (
        <div className="container mt-4">
          <div className={`alert alert-${messageType} text-center`} role="alert">
            {message}
          </div>
        </div>
      );
    }
    
    switch (view) {
      case "login":
        return <Login onLogin={handleLogin} setView={setView} />;
      case "signup":
        return <Signup onSignup={handleSignup} setView={setView} />;
      case "admin":
        return <Administrator user={user} token={token} onLogout={handleLogout} />;
      case "normal":
        return <NormalUser user={user} token={token} onLogout={handleLogout} />;
      case "owner":
        return <StoreOwner user={user} token={token} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} setView={setView} />;
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>
      {renderContent()}
    </>
  );
}

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning me-1"></i>);
  }

  if (hasHalfStar) {
    stars.push(<i key="half" className="bi bi-star-half text-warning me-1"></i>);
  }

  while (stars.length < 5) {
    stars.push(<i key={`empty-${stars.length}`} className="bi bi-star text-warning me-1"></i>);
  }

  return stars;
};

function Login({ onLogin, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8–16 chars, include 1 uppercase & 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-5 d-flex flex-column justify-content-center"
        style={{ width: "600px", height: "500px", borderRadius: "20px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>
        <form onSubmit={handleLogin} className="flex-grow-1 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Email</label>
            <input
              type="email"
              className={`form-control form-control-lg rounded-pill ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Password</label>
            <input
              type="password"
              className={`form-control form-control-lg rounded-pill ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill fw-bold"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center mt-3 mb-0">
          Don't have an account? <a href="#" onClick={() => setView("signup")}>Sign up here</a>
        </p>
      </div>
    </div>
  );
}

function Signup({ onSignup, setView }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    
    if (!name) newErrors.name = "Name is required";
    else if (name.length < 20 || name.length > 60) newErrors.name = "Name must be between 20 and 60 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(password)) newErrors.password = "Password must be 8–16 chars, include 1 uppercase & 1 special character";

    if (!address) newErrors.address = "Address is required";
    else if (address.length > 400) newErrors.address = "Address must not exceed 400 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSignup(name, email, password, address);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-5"
        style={{ width: "650px", minHeight: "600px", borderRadius: "20px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Name</label>
            <input
              type="text"
              className={`form-control form-control-lg rounded-pill ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Email</label>
            <input
              type="email"
              className={`form-control form-control-lg rounded-pill ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Password</label>
            <input
              type="password"
              className={`form-control form-control-lg rounded-pill ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Address</label>
            <textarea
              className={`form-control form-control-lg rounded ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter your address"
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill fw-bold"
            >
              Signup
            </button>
          </div>
        </form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="#" onClick={() => setView("login")}>Login here</a>
        </p>
      </div>
    </div>
  );
}

function Administrator({ user, token, onLogout }) {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard token={token} />;
      case "Form":
        return <Form token={token} />;
      case "Stores":
        return <Stores token={token} />;
      case "AllUsers":
        return <AllUsers token={token} />;
      default:
        return <Dashboard token={token} />;
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm rounded m-4 px-3">
        <span className="navbar-brand fw-bold fs-4">Admin Panel</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {["Dashboard", "Form", "Stores", "AllUsers"].map((item) => (
              <li className="nav-item" key={item}>
                <button
                  className={`btn nav-link px-3 mx-1 ${
                    activeComponent === item ? "active fw-bold bg-white text-primary rounded-pill shadow-sm" : "text-white"
                  }`}
                  onClick={() => setActiveComponent(item)}
                >
                  {item === "AllUsers" ? "All Users" : item}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="ms-3 text-white fw-bold d-flex align-items-center">
            <i className="bi bi-person-circle me-2"></i> {user.name}
            <button onClick={onLogout} className="btn btn-danger rounded-pill px-3 ms-3">
              Logout
            </button>
          </div>
      </nav>
      <div>{renderComponent()}</div>
    </>
  );
}

function Dashboard({ token }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        setLoading(false);
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  const details = [
    { title: "Users", icon: "bi-people-fill", count: stats.totalUsers, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { title: "Stores", icon: "bi-shop-window", count: stats.totalStores, gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { title: "Submitted Ratings", icon: "bi-star-fill", count: stats.totalRatings, gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  ];

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "85vh" }}>
      <div className="d-flex justify-content-evenly flex-wrap w-100 gap-4 px-4">
        {details.map((item, i) => (
          <Card key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

function Card({ title, icon, count, gradient }) {
  return (
    <div
      className="card border-0 text-center text-white p-4 rounded-4 shadow-lg flex-fill"
      style={{
        maxWidth: "20rem",
        background: gradient,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
      }}
    >
      <div className="card-body">
        <i className={`bi ${icon} fs-1 mb-3`}></i>
        <h5 className="card-title fs-4 fw-bold">{title}</h5>
        <p className="display-5 fw-bold mb-0">{count}</p>
      </div>
    </div>
  );
}

function Form({ token }) {
  const [formData, setFormData] = useState({
    name: "",
    storeName: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User"
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.role === "Store Owner") {
        await axios.post("http://localhost:5000/api/admin/users", { ...formData, role: "Store Owner" }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await axios.post("http://localhost:5000/api/admin/stores", { name: formData.storeName, address: formData.address, ownerEmail: formData.email }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/admin/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessage("User added successfully!");
      setMessageType("success");
      setFormData({ name: "", storeName: "", email: "", password: "", address: "", role: "Normal User" });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Failed to add user.";
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
                  placeholder="Enter full name"
                  required
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
                placeholder="Enter address"
                required
              ></textarea>
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-success btn-lg rounded-3 shadow-sm">
                <i className="bi bi-person-plus-fill"></i> Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stores({ token }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch stores data.");
        setLoading(false);
        console.error("Stores fetch error:", err);
      }
    };
    fetchStores();
  }, [token]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">Store Profiles</h2>
      <div className="row">
        {stores.length > 0 ? (
          stores.map((store, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-lg border-0 rounded-4 h-100">
                <div className="card-header bg-primary text-white text-center rounded-top-4">
                  <h5 className="mb-0">{store.name}</h5>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      <strong>Owner:</strong> {store.owner_name}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      <strong>Address:</strong> {store.address}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      <strong>Overall Rating:</strong> {renderStars(store.overall_rating)}
                      <span className="badge bg-success ms-2">{store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'N/A'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No stores found.</p>
        )}
      </div>
    </div>
  );
}

function AllUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/users?name=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users data.");
        setLoading(false);
        console.error("Users fetch error:", err);
      }
    };
    fetchUsers();
  }, [token, search]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">User Management</h2>
      <div className="row mb-3">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name, Email, Address, or Role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm rounded">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "Store Owner"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NormalUser({ user, token, onLogout }) {
  const [activeComponent, setActiveComponent] = useState("Stores");

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm rounded m-4 px-3">
        <span className="navbar-brand fw-bold fs-4">User Panel</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-2">
              <button
                className={`btn rounded-pill px-3 ${
                  activeComponent === "Stores" ? "btn-light text-primary fw-bold shadow-sm" : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("Stores")}
              >
                Stores
              </button>
            </li>
            <li className="nav-item me-2">
              <button
                className={`btn rounded-pill px-3 ${
                  activeComponent === "ChangePassword" ? "btn-light text-primary fw-bold shadow-sm" : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("ChangePassword")}
              >
                Change Password
              </button>
            </li>
            <li className="nav-item me-3 text-white fw-bold">
              👤 {user.name}
            </li>
            <li className="nav-item">
              <button className="btn btn-danger rounded-pill px-3" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        {activeComponent === "Stores" && <StoreList user={user} token={token} />}
        {activeComponent === "ChangePassword" && <ChangePassword token={token} />}
      </div>
    </div>
  );
}

function StoreList({ user, token }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stores?name=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch stores data.");
        setLoading(false);
        console.error("Store list fetch error:", err);
      }
    };
    fetchStores();
  }, [token, search]);

  const handleRatingChange = async (storeId, newRating) => {
    try {
      await axios.put(
        `http://localhost:5000/api/stores/${storeId}/rate`,
        { rating: parseInt(newRating) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await axios.get(`http://localhost:5000/api/stores?name=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(response.data);
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">Available Stores</h2>
      <div className="row mb-3">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Store Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm rounded">
          <thead className="table-primary">
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Submit / Modify</th>
            </tr>
          </thead>
          <tbody>
            {stores.length > 0 ? (
              stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      ⭐ {store.overall_rating ? parseFloat(store.overall_rating).toFixed(1) : 'N/A'}
                    </span>
                  </td>
                  <td>
                    {store.submitted_rating ? (
                      <span className="badge bg-info text-dark">
                        ⭐ {store.submitted_rating}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={store.submitted_rating || ""}
                      onChange={(e) => handleRatingChange(store.id, e.target.value)}
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoreOwner({ user, token, onLogout }) {
  const [activeComponent, setActiveComponent] = useState("StoreRating");

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm rounded m-4 px-3">
        <span className="navbar-brand fw-bold fs-4">Store Panel</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-2">
              <button
                className={`btn rounded-pill px-3 ${
                  activeComponent === "StoreRating" ? "btn-light text-primary fw-bold shadow-sm" : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("StoreRating")}
              >
                Store Rating
              </button>
            </li>
            <li className="nav-item me-2">
              <button
                className={`btn rounded-pill px-3 ${
                  activeComponent === "ChangePassword" ? "btn-light text-primary fw-bold shadow-sm" : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("ChangePassword")}
              >
                Change Password
              </button>
            </li>
            <li className="nav-item me-3 text-white fw-bold">
              👤 {user.name}
            </li>
            <li className="nav-item">
              <button
                className="btn btn-danger rounded-pill px-3"
                onClick={onLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {activeComponent === "StoreRating" && <StoreRating token={token} user={user} />}
      {activeComponent === "ChangePassword" && <ChangePassword token={token} />}
    </>
  );
}

function StoreRating({ token, user }) {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreRatings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stores/owner-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch store ratings.");
        setLoading(false);
        console.error("Store ratings fetch error:", err);
      }
    };
    fetchStoreRatings();
  }, [token, user]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-3 mb-4">
        <h3 className="fw-bold text-center">Store Rating Dashboard</h3>
        <p className="text-center text-muted">Welcome, {user.name}</p>
        <h5 className="text-center">
          ⭐ Average Rating: {renderStars(storeData.averageRating)}{" "}
          <span className="badge bg-success">{storeData.averageRating}</span>
        </h5>
      </div>
      <h4 className="mb-4 fw-bold text-center">
        Users Who Rated Your Store ({storeData.ratings.length})
      </h4>
      <div className="row">
        {storeData.ratings.length > 0 ? (
          storeData.ratings.map((rating, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-lg border-0 rounded-4 h-100">
                <div className="card-header bg-primary text-white text-center rounded-top-4">
                  <h5 className="mb-0">{rating.name}</h5>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      <strong>Email:</strong> {rating.email}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      <strong>Address:</strong> {rating.address}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      <strong>Rating:</strong> {renderStars(rating.rating)}
                      <span className="badge bg-success ms-2">{rating.rating}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No ratings yet.</p>
        )}
      </div>
    </div>
  );
}

function ChangePassword({ token }) {
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
