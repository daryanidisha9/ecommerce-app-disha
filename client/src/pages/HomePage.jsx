import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={styles.page}>
      {/* ✅ Navbar */}
      <div style={styles.navbar}>
        <span style={styles.logo} onClick={() => navigate("/")}>
          Disha's Fashion Brand
        </span>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.searchInput}
        />
        <button style={styles.searchBtn} onClick={handleSearch}>
          🔍
        </button>
        <button style={styles.navLink} onClick={() => navigate("/cart")}>
          🛒 Cart
        </button>
        <button style={styles.navLink} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      {/* ✅ Hero Section */}
      <header style={styles.header}>
        <h1 style={styles.brandName}>Disha's Fashion Brand</h1>
        <p style={styles.tagline}>Your Style, Your Statement</p>
      </header>

      {/* ✅ Features */}
      <section style={styles.section}>
        <h2 style={styles.title}>Trending Products</h2>
        <p style={styles.description}>
          Discover the latest fashion trends handpicked for you.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.title}>Best Offers</h2>
        <p style={styles.description}>
          Grab exciting discounts on your favorite styles.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.title}>Easy Returns</h2>
        <p style={styles.description}>
          Shop confidently with our easy return policy.
        </p>
      </section>

      <button style={styles.shopButton} onClick={() => navigate("/shop")}>
        Start Shopping
      </button>
    </div>
  );
};

// ✅ Inline Styles
const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "sans-serif",
    background: "linear-gradient(to right, #fce3ec, #ffe8f0)",
    color: "#333",
    paddingTop: "80px",
    textAlign: "center",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "#fff0f5",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: "10px",
    zIndex: 1000,
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#d6336c",
    cursor: "pointer",
    marginRight: "20px",
  },
  searchInput: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    flex: "1",
    maxWidth: "200px",
  },
  searchBtn: {
    background: "#d6336c",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
  },
  navLink: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#d6336c",
  },
  header: {
    backgroundColor: "#ffdee9",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "700px",
    margin: "0 auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  brandName: {
    fontSize: "2.5rem",
    color: "#d6336c",
    marginBottom: "10px",
  },
  tagline: {
    fontSize: "1.2rem",
    color: "#444",
  },
  section: {
    marginTop: "40px",
  },
  title: {
    fontSize: "1.8rem",
    color: "#d6336c",
  },
  description: {
    fontSize: "1.1rem",
    color: "#555",
    marginTop: "10px",
  },
  shopButton: {
    marginTop: "30px",
    padding: "12px 30px",
    fontSize: "1.1rem",
    backgroundColor: "#d6336c",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
  },
};

export default HomePage;
