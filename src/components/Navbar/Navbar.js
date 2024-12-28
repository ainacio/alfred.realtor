import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu"; // Import the UserMenu component
import styles from "./Navbar.module.css"; // Import the CSS file for styles
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, handleLogout } = useAuth(); // Get user and handleLogout from AuthContext

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.logo}>
          Alfred.Realtor
        </Link>
      </div>
      <div className={styles.navRight}>
        <Link to="/about" className={styles.navLink}>
          About
        </Link>
        <Link to="/chat" className={styles.navLink}>
          Chat
        </Link>
        {user ? (
          <UserMenu user={user} onLogout={handleLogout} /> // Pass handleLogout as onLogout
        ) : (
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
