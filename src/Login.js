import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/success"); // Redirect to SuccessPage after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>{isRegistering ? "Register" : "Sign In"}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" }}
      />
      <button
        onClick={handleAuth}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "rgb(30, 141, 176)",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRegistering ? "Register" : "Sign In"}
      </button>
      <p
        style={{ cursor: "pointer", marginTop: "1rem", color: "rgb(30, 141, 176)" }}
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
