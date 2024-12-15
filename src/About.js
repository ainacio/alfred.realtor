import React from "react";
import profile from "./images/alfred4.avif";

const About = () => (
  <div style={{ textAlign: "center", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
    <h1 style={{ color: "rgb(27, 125, 158)", marginBottom: "1rem" }}>About Alfred</h1>
    <img
      src={profile}
      alt="Alfred Inacio - Real Estate Sales Representative"
      loading="lazy"
      style={{
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        objectFit: "cover",
        margin: "1rem",
        border: "4px solid rgb(27, 125, 158)",
      }}
    />
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left", lineHeight: "1.6" }}>
      <p style={{ fontSize: "1.1rem", color: "#333" }}>
        Alfred’s passion for real estate drives him to help people achieve their goals. For over 20 years, 
        he has successfully managed rental properties, optimizing tenant experiences, enhancing profitability, 
        and mitigating risks.
      </p>
      <p style={{ fontSize: "1.1rem", color: "#333" }}>
        With a strong foundation in engineering from U of T and an MBA from Schulich, Alfred brings 
        13 years of experience as a trusted advisor. He excels at leveraging technology and building 
        meaningful connections to drive productivity and reduce costs.
      </p>
      <p style={{ fontSize: "1.1rem", color: "#333" }}>
        Alfred also gives back to the community through his work with Engineers Canada, where he helps 
        accredit educational institutions and advance the profession. His combined expertise in engineering, 
        business, and real estate ensures exceptional results tailored to every client’s goals.
      </p>
    </div>
    <p style={{ marginTop: "1.5rem", fontWeight: "bold", fontSize: "1.2rem", color: "rgb(27, 125, 158)" }}>
      Contact Alfred: 647-801-9296
    </p>
  </div>
);

export default About;
