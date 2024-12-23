import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import ChatPage from "./components/Chat/ChatPage";
import Chat from "./components/Chat/Chat";
import SuccessPage from "./components/Success/SuccessPage";
import LogoutSuccessPage from "./components/LogoutSuccessPage/LogoutSuccessPage";
import Settings from "./components/Settings/Settings";

import "./index.css";
import app from "./firebase/firebase-config";

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/logout-success"); // Redirect to LogoutSuccessPage
      })
      .catch((error) => console.error("Logout error:", error));
  };

  const handleProtectedRoute = () => {
    if (!user) {
      setError("You must log in to start chatting.");
      setTimeout(() => setError(""), 3000);
    } else {
      navigate("/chat");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleProtectedRoute();
            }}
            className="nav-link"
          >
            Chat
          </Link>
        </div>
        <div>
          {user && (
            <Link to="/settings" className="nav-link">
              Settings
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/logout-success" element={<LogoutSuccessPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
