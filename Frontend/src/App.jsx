import  { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import Login from "./components/LogIn/Login";
import Signup from "./components/LogIn/SignUp";
import Administrator from "./components/Admin/Administrator";
import NormalUser from "./components/NormalUser/NormalUser";
import StoreOwner from "./components/StoreOwner/StoreOwner";

export default function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const API_URL = "http://localhost:5000/api";

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, id, name, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id, name, role }));
      setToken(token);
      setUser({ id, name, role });
      showMessage("Login successful!", "success");

      if (role === "System Administrator") {
        setView("admin");
      } else if (role === "Normal User") {
        setView("normal");
      } else if (role === "Store Owner") {
        setView("owner");
      }
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || "Invalid credentials", "danger");
    }
  };

  const handleSignup = async (name, email, password, address) => {
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, address });
      showMessage("Signup successful! You can now log in.", "success");
      setView("login");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Signup failed.";
      showMessage(msg, "danger");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setView("login");
    showMessage("You have been logged out.", "info");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setToken(storedToken);
          setUser(storedUser);
          if (storedUser.role === "System Administrator") {
            setView("admin");
          } else if (storedUser.role === "Normal User") {
            setView("normal");
          } else if (storedUser.role === "Store Owner") {
            setView("owner");
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, []);

  const renderContent = () => {
    if (message) {
      return (
        <div className="container mt-4">
          <div className={`alert alert-${messageType} text-center`} role="alert">
            {message}
          </div>
        </div>
      );
    }
    
    switch (view) {
      case "login":
        return <Login onLogin={handleLogin} setView={setView} />;
      case "signup":
        return <Signup onSignup={handleSignup} setView={setView} />;
      case "admin":
        return <Administrator user={user} token={token} onLogout={handleLogout} />;
      case "normal":
        return <NormalUser user={user} token={token} onLogout={handleLogout} />;
      case "owner":
        return <StoreOwner user={user} token={token} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} setView={setView} />;
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>
      {renderContent()}
    </>
  );
}

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning me-1"></i>);
  }

  if (hasHalfStar) {
    stars.push(<i key="half" className="bi bi-star-half text-warning me-1"></i>);
  }

  while (stars.length < 5) {
    stars.push(<i key={`empty-${stars.length}`} className="bi bi-star text-warning me-1"></i>);
  }

  return stars;
};
























