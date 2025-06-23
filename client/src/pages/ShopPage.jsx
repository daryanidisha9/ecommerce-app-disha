import React from "react";

const products = [
  {
    id: 1,
    name: "Elegant Red Dress",
    price: 259.99,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Casual Blue Shirt",
    price: 339.99,
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67ddbc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Classic Leather Jacket",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Stylish Sneakers",
    price: 4000.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
  },
];

const ShopPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Disha's Fashion Store</h1>
      <p style={styles.subheading}>Find your perfect outfit below!</p>
      <div style={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.image} />
            <h2 style={styles.productName}>{product.name}</h2>
            <p style={styles.price}>${product.price.toFixed(2)}</p>
            <button
              style={styles.buyButton}
              onClick={() => alert(`Added ${product.name} to cart!`)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fefefe",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "3rem",
    color: "#d6336c",
    marginBottom: "5px",
  },
  subheading: {
    fontSize: "1.3rem",
    color: "#555",
    marginBottom: "40px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(214, 51, 108, 0.2)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
  },
  productName: {
    fontSize: "1.25rem",
    color: "#333",
    marginBottom: "8px",
  },
  price: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#d6336c",
    marginBottom: "15px",
  },
  buyButton: {
    padding: "10px 25px",
    backgroundColor: "#d6336c",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default ShopPage;
