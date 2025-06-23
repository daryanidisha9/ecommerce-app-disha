import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from "../features/CartSlice"; // ✅ Only one import

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    console.log("🛒 Add to Cart clicked for:", product.name);
    dispatch(addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image_url,
      qty: 1,
    }));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <img src={product.image_url} alt={product.name} style={{ width: '200px' }} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button
        onClick={handleAddToCart}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
