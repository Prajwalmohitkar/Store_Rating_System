import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ token }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    {
      title: "Users",
      icon: "bi-people-fill",
      count: stats.totalUsers,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Stores",
      icon: "bi-shop-window",
      count: stats.totalStores,
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "Submitted Ratings",
      icon: "bi-star-fill",
      count: stats.totalRatings,
      gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "85vh" }}
    >
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
