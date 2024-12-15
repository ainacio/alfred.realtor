import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Welcome!</h1>
      <p>You have successfully logged in.</p>
      <Link to="/chat">
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "rgb(30, 141, 176)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Start Chatting
        </button>
      </Link>
    </div>
  );
};

export default SuccessPage;
