import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/CartSlice";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err.response?.data || err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      alert("Product not loaded!");
      return;
    }

    dispatch(
      addToCart({
        id: product.id,         // ✅ for frontend
        productId: product.id,  // ✅ for backend
        title: product.name,
        price: product.price,
        image: product.image_url || product.image,
        qty: 1,
      })
    );

    alert("✅ Added to cart!");
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <img src={product.image_url || product.image} alt={product.name} className="w-60 my-4" />
      <p className="text-lg">₹{product.price}</p>
      <p className="text-sm mt-2">{product.description}</p>

      <button
        className="mt-2 bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
