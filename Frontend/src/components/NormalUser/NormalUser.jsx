import  { useState} from "react";
import ChangePassword from "./ChangePassword";
import StoreList from "./StoreList";


export default function NormalUser({ user, token, onLogout }) {
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