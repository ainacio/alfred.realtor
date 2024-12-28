import React from "react";
import styles from "./AddressForm.module.css";

const AddressForm = ({ address, onAddressChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onAddressChange({ ...address, [name]: value });
  };

  return (
    <div className={styles.addressForm}>
      <div className={styles.formGroup}>
        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Region/Province:</label>
        <input
          type="text"
          name="region"
          value={address.region}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Postal/ZIP Code:</label>
        <input
          type="text"
          name="postalOrZip"
          value={address.postalOrZip}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default AddressForm;
