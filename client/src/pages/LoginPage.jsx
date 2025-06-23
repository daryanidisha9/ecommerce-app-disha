import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || "Unknown error"));
      console.error("Login error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        <div style={styles.socialContainer}>
          <p style={{ margin: "10px 0" }}>Or continue with</p>
          <button style={styles.googleBtn}>🔵 Sign in with Google</button>
          <button style={styles.fbBtn}>🔷 Sign in with Facebook</button>
        </div>

        <p style={styles.signupText}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #fcdff1, #e5d9f2)",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff0f5",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#d6336c",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  loginButton: {
    padding: "10px",
    backgroundColor: "#d6336c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  socialContainer: {
    marginTop: "20px",
  },
  googleBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    padding: "10px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  fbBtn: {
    backgroundColor: "#4267B2",
    color: "#fff",
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: "20px",
    fontSize: "0.95rem",
  },
  signupLink: {
    color: "#d6336c",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default LoginPage;
