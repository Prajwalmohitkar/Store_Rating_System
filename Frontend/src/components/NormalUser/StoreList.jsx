import  { useState, useEffect } from "react";
import axios from "axios";


export default function StoreList({ user, token }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stores?search=${search}`, {
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
      const response = await axios.get(`http://localhost:5000/api/stores?search=${search}`, {
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
