// File: Home.js
// =====================================
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = ({ user }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    console.log("Home user state:", user); // Debugging line

    if (!user) {
      alert("You must log in to access the chat.");
      navigate("/login");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>Welcome to Alfred.Realtor</h1>
      <p className={styles.homeText}>
        I’m passionate about helping people achieve their real estate goals. With over 20 years of
        experience managing rental properties, I’m here to provide the expertise you need.
      </p>
      <p className={styles.homeText}>
        <strong>Alfred Inacio - Registered Real Estate Salesperson</strong>
      </p>
      <p className={styles.homeText}>
        Log in and click the <strong>Chat</strong> button to connect with me. If I’m unavailable, feel
        free to chat with my AI Assistant, <strong>Beta</strong>, who’s ready to help guide you.
      </p>
      <button onClick={handleChatClick} className={styles.homeButton}>
        Chat
      </button>
    </div>
  );
};

export default Home;
