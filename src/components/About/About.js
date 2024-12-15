import React from "react";
import profile from "images/alfred4.avif";
import "./About.css"; // Ensure this import matches the actual path

const About = () => (
  <div className="about-container">
    <h1>About Alfred</h1>
    <img
      src={profile}
      alt="Alfred Inacio - Real Estate Sales Representative"
      loading="lazy"
      className="about-profile-image"
    />
    <p>
      Alfred’s passion for real estate drives him to help people achieve their goals. For over 20 years, he has successfully managed rental properties, optimizing tenant experiences, enhancing profitability, and mitigating risks.
    </p>
    <p>
      With a strong foundation in engineering from U of T and an MBA from Schulich, Alfred brings 13 years of experience as a trusted advisor. He excels at leveraging technology and building meaningful connections to drive productivity and reduce costs.
    </p>
    <p>
      Alfred also gives back to the community through his work with Engineers Canada, where he helps accredit educational institutions and advance the profession. His combined engineering, business, and real estate expertise ensures exceptional results tailored to every client’s goals.
    </p>
    <p>Contact Alfred: 647-801-9296</p>
  </div>
);

export default About;
