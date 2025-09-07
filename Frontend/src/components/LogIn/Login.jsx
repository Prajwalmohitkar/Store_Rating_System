//This is login.jsx
import { useState } from "react";

export default function Login({ onLogin, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-16 chars, include 1 uppercase & 1 special character";
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
        <form
          onSubmit={handleLogin}
          className="flex-grow-1 d-flex flex-column justify-content-center"
        >
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Email</label>
            <input
              type="email"
              className={`form-control form-control-lg rounded-pill ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold fs-5">Password</label>
            <input
              type="password"
              className={`form-control form-control-lg rounded-pill ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
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
          Don't have an account?{" "}
          <a href="#" onClick={() => setView("signup")}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
