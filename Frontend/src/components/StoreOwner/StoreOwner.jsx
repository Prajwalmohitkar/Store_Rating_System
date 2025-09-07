import { useState } from "react";
import StoreRating from "./StoreRating";
import ChangePassword from "./ChangePassword";


export default function StoreOwner({ user, token, onLogout }) {
  const [activeComponent, setActiveComponent] = useState("StoreRating");

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
                  activeComponent === "StoreRating"
                    ? "btn-light text-primary fw-bold shadow-sm"
                    : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("StoreRating")}
              >
                Store Rating
              </button>
            </li>
            <li className="nav-item me-2">
              <button
                className={`btn rounded-pill px-3 ${
                  activeComponent === "ChangePassword"
                    ? "btn-light text-primary fw-bold shadow-sm"
                    : "btn-outline-light"
                }`}
                onClick={() => setActiveComponent("ChangePassword")}
              >
                Change Password
              </button>
            </li>
            <li className="nav-item me-3 text-white fw-bold">👤 {user.name}</li>
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
      {activeComponent === "StoreRating" && (
        <StoreRating token={token} user={user} />
      )}
      {activeComponent === "ChangePassword" && <ChangePassword token={token} />}
    </>
  );
}
