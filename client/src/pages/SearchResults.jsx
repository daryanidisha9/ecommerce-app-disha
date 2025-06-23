import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/CartSlice";

const SearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
  `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}&limit=100`
);
        console.log("📦 Fetched products:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image_url,
        qty: 1,
      })
    );
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return <p className="text-center mt-6">Loading products...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-center mt-6 text-gray-600">
        No products found for "<strong>{searchQuery}</strong>"
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-4 text-center">
        Search Results for "{searchQuery}"
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {products.map((prod, index) => (
          <div
            key={prod.id || `${prod.name}-${index}`}
            className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-xl transition duration-300"
          >
            <img
              src={prod.image_url?.trim()}
              alt={prod.name}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder.jpg"; // Optional fallback if image fails
              }}
            />
            <h3 className="mt-2 font-semibold">{prod.name}</h3>
            <p className="text-pink-600 font-bold">₹{prod.price}</p>
            <button
              className="mt-2 bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600"
              onClick={() => handleAddToCart(prod)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
