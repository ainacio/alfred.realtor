import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to the desired page after login
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginContainer}>
      <h1>Login</h1>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.loginInput}
          autoComplete="username"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginInput}
          autoComplete="current-password"
        />
      </div>

      {error && <p className={styles.loginError}>{error}</p>}

      <div className={styles.dynamicSpacing}>
        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>

      <div className={styles.dynamicSpacing}>
        <p>
          Don't have an account?{" "}
          <a href="/register" className={styles.registerLink}>
            Register
          </a>
        </p>
      </div>
    </form>
  );
};

export default Login;
