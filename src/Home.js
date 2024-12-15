import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [showChatError, setShowChatError] = useState(false);

  const handleChatClick = () => {
    if (user) {
      navigate("/chat");
    } else {
      setShowChatError(true);
      setTimeout(() => setShowChatError(false), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {showChatError && (
        <p style={{ color: "red" }}>You must log in to start chatting.</p>
      )}
      <h1>Welcome to Alfred.Realtor</h1>
      <p>Let me help you find your dream home or answer your real estate questions!</p>
      <button
        onClick={handleChatClick}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "rgb(27, 125, 158)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Chat
      </button>
    </div>
  );
};

export default Home;
