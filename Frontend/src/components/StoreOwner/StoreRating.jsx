import { useState, useEffect } from "react";
import axios from "axios";

export default function StoreRating({ token, user }) {
  const [storeData, setStoreData] = useState(null);
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
    const fetchStoreRatings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/stores/owner-dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
                      <span className="badge bg-success ms-2">
                        {rating.rating}
                      </span>
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
