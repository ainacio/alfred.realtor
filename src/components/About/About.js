import React from "react";
import profile from "../../images/alfred4.avif";
import styles from "./About.module.css";

const About = () => (
  <div className={styles.aboutContainer}>
    <h1>About Alfred</h1>
    <img
      src={profile}
      alt="Alfred Inacio - Real Estate Sales Representative"
      loading="lazy"
      className={styles.aboutProfileImage}
    />
    <p className={styles.aboutText}>
      Alfred’s passion for real estate drives him to help people achieve their goals...
    </p>
    <p className={styles.aboutContact}>Contact Alfred: 647-801-9296</p>
  </div>
);

export default About;
