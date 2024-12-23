import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // New state for display name
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password || (isRegistering && !displayName)) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors
    const auth = getAuth();

    try {
      if (isRegistering) {
        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Set display name after registration
        await updateProfile(userCredential.user, {
          displayName,
        });
        console.log("Display name set to:", displayName);
      } else {
        // Sign in user
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/success"); // Redirect to SuccessPage
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Incorrect email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>{isRegistering ? "Register" : "Sign In"}</h1>
      {isRegistering && (
        <input
          type="text"
          placeholder="Full Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={styles.loginInput}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.loginInput}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.loginInput}
      />
      <button
        onClick={handleAuth}
        className={styles.loginButton}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Please wait..." : isRegistering ? "Register" : "Sign In"}
      </button>
      <p className={styles.loginToggle} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
      </p>
      {error && <p className={styles.loginError}>{error}</p>}
    </div>
  );
};

export default Login;
