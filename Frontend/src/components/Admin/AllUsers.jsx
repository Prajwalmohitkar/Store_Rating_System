import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper function to render star rating
const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating);

  if (isNaN(numericRating)) {
    return "-"; // Return a dash for non-numeric ratings
  }

  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i key={`full-${i}`} className="bi bi-star-fill text-warning me-1"></i>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <i key="half" className="bi bi-star-half text-warning me-1"></i>
    );
  }

  while (stars.length < 5) {
    stars.push(
      <i
        key={`empty-${stars.length}`}
        className="bi bi-star text-warning me-1"
      ></i>
    );
  }
  return stars;
};

export default function AllUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/users?search=${search}`, {
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
              <th>Ratings</th>
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
                  <td>
                    {user.role === "Store Owner" ? (
                      <span className="badge bg-warning text-dark">
                        {user.ratings ? parseFloat(user.ratings).toFixed(1) : "N/A"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
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
