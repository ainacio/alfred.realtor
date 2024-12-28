import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { fetchUserData, updateUserProfile, uploadAvatar } from "../../services/userService";
import styles from "./Settings.module.css";

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      region: "",
      country: "",
      postalOrZip: "",
    },
    dob: "",
    email: "",
    primaryNeeds: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          if (userData) {
            setProfile({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              middleName: userData.middleName || "",
              phoneNumber: userData.phoneNumber || "",
              address: userData.address || {
                street: "",
                city: "",
                region: "",
                country: "",
                postalOrZip: "",
              },
              dob: userData.dob || "",
              email: userData.email || user.email || "",
              primaryNeeds: userData.primaryNeeds || "",
              avatarUrl: userData.avatarUrl || "",
            });
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address")) {
      const addressField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = profile.avatarUrl;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.uid, avatarFile);
      }

      const updates = {
        ...profile,
        avatarUrl,
      };

      await updateUserProfile(user.uid, updates);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.settingsTitle}>Settings</h1>
      <form onSubmit={handleUpdate} className={styles.settingsForm}>
        <div className={styles.settingsAvatarContainer}>
          <img
            src={profile.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            className={styles.avatarPreview}
          />
          <label className={styles.avatarLabel}>
            Upload New Avatar:
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.avatarInput}
            />
          </label>
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            className={styles.settingsInput}
          />
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>Middle Name:</label>
          <input
            type="text"
            name="middleName"
            value={profile.middleName}
            onChange={handleInputChange}
            className={styles.settingsInput}
          />
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            className={styles.settingsInput}
          />
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleInputChange}
            className={styles.settingsInput}
          />
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleInputChange}
            className={styles.settingsInput}
          />
        </div>
        <div className={styles.settingsRow}>
          <label className={styles.settingsLabel}>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            className={`${styles.settingsInput} ${styles.readOnly}`}
          />
        </div>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Address</legend>
          <div className={styles.settingsRow}>
            <label className={styles.settingsLabel}>Street:</label>
            <input
              type="text"
              name="address.street"
              value={profile.address.street}
              onChange={handleInputChange}
              className={styles.settingsInput}
            />
          </div>
          <div className={styles.settingsRow}>
            <label className={styles.settingsLabel}>City:</label>
            <input
              type="text"
              name="address.city"
              value={profile.address.city}
              onChange={handleInputChange}
              className={styles.settingsInput}
            />
          </div>
          <div className={styles.settingsRow}>
            <label className={styles.settingsLabel}>Province/State:</label>
            <input
              type="text"
              name="address.region"
              value={profile.address.region}
              onChange={handleInputChange}
              className={styles.settingsInput}
            />
          </div>
          <div className={styles.settingsRow}>
            <label className={styles.settingsLabel}>Country:</label>
            <input
              type="text"
              name="address.country"
              value={profile.address.country}
              onChange={handleInputChange}
              className={styles.settingsInput}
            />
          </div>
          <div className={styles.settingsRow}>
            <label className={styles.settingsLabel}>Postal/ZIP Code:</label>
            <input
              type="text"
              name="address.postalOrZip"
              value={profile.address.postalOrZip}
              onChange={handleInputChange}
              className={styles.settingsInput}
            />
          </div>
        </fieldset>
        <div className={styles.settingsRow} style={{ gridColumn: "span 2" }}>
          <label className={styles.settingsLabel}>Primary Needs:</label>
          <textarea
            name="primaryNeeds"
            value={profile.primaryNeeds}
            onChange={handleInputChange}
            className={styles.settingsTextarea}
          />
        </div>
        <button type="submit" className={styles.settingsButton}>
          Update Profile
        </button>
      </form>
      {message && (
        <p
          className={
            message.includes("successfully")
              ? styles.settingsSuccessMessage
              : styles.settingsErrorMessage
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Settings;
