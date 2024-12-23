import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import styles from "./Settings.module.css";

const Settings = () => {
  const auth = getAuth();
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
      setMessage("Display name updated successfully!");
    } catch (error) {
      console.error("Error updating display name:", error);
      setMessage("Failed to update display name.");
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h1>Settings</h1>
      <form onSubmit={handleUpdate} className={styles.settingsForm}>
        <label>
          Full Name:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.settingsInput}
          />
        </label>
        <button type="submit" className={styles.settingsButton}>Update Name</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Settings;
