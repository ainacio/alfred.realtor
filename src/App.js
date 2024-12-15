import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Home from "components/Home/Home";
import About from "components/About/About";
import Login from "components/Login/Login";
import ChatPage from "components/Chat/ChatPage";
import SuccessPage from "components/Success/SuccessPage";

const App = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          backgroundColor: "rgb(30, 141, 176)",
        }}
      >
        <div>
          <Link to="/" style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/about" style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}>
            About
          </Link>
          <Link to="/chat" style={{ color: "#fff", textDecoration: "none" }}>
            Chat
          </Link>
        </div>
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "5px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Login
            </Link>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
