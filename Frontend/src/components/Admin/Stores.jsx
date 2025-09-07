import { useState, useEffect } from "react";
import axios from "axios";

export default function Stores({ token }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/stores",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
                      <strong>Overall Rating:</strong>{" "}
                      {renderStars(store.overall_rating)}
                      <span className="badge bg-success ms-2">
                        {store.overall_rating
                          ? parseFloat(store.overall_rating).toFixed(1)
                          : "N/A"}
                      </span>
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
