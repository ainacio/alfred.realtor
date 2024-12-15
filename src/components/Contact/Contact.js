import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    setSubmitted(true); // For now, just show a confirmation message
    setFormData({ name: "", email: "", message: "" }); // Clear the form
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "2rem" }}>
      <h1>Contact Alfred</h1>
      {submitted ? (
        <p style={{ color: "green" }}>Thank you for your message! I will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  height: "100px",
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
