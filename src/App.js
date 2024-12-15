import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Home from "./Home";
import About from "./About";
import ChatPage from "./ChatPage";
import Login from "./Login";
import SuccessPage from "./SuccessPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [showChatError, setShowChatError] = useState(false);
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
        console.log("Logged out successfully");
        setUser(null);
        navigate("/");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  const handleChatClick = () => {
    if (!user) {
      setShowChatError(true);
      setTimeout(() => setShowChatError(false), 3000); // Clear error after 3 seconds
    } else {
      navigate("/chat");
    }
  };

  return (
    <div>
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
    <Link
      to={user ? "/chat" : "#"}
      onClick={(e) => {
        if (!user) {
          e.preventDefault(); // Prevent navigation if user is not logged in
          setShowChatError(true);
          setTimeout(() => setShowChatError(false), 3000); // Clear error after 3 seconds
        }
      }}
      style={{ color: "#fff", textDecoration: "none" }}
    >
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

      {showChatError && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          Please log in to start chatting.
        </p>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;
