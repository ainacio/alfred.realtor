// src/components/LogoutSuccessPage/LogoutSuccessPage.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./LogoutSuccessPage.module.css";

const LogoutSuccessPage = () => {
  return (
    <div className={styles.logoutContainer}>
      <h1 className={styles.logoutTitle}>You’ve been logged out</h1>
      <p className={styles.logoutMessage}>Thank you for visiting! Come back soon.</p>
      <Link to="/login">
        <button className={styles.logoutButton}>Log In Again</button>
      </Link>
    </div>
  );
};

export default LogoutSuccessPage;
