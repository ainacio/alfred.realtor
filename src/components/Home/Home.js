import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => (
  <div className={styles.homeContainer}>
    <h1 className={styles.homeTitle}>Welcome to Alfred.Realtor</h1>
    <Link to="/chat">
      <button className={styles.homeButton}>Chat</button>
    </Link>
  </div>
);

export default Home;
