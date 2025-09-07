import  { useState } from "react";


export default function Signup({ onSignup, setView }) {
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