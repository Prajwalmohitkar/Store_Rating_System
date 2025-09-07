import  { useState  } from "react";
import Dashboard from "./Dashboard";
import Form from "./Form";
import Stores from "./Stores";
import AllUsers from "./AllUsers";

export default function Administrator({ user, token, onLogout }) {
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
