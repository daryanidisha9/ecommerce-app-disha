import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  PackageCheck,
  LogOut,
  ListOrdered,
} from "lucide-react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-pink-600">
        Disha's Fashion Brand
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center border rounded-md overflow-hidden w-1/2 max-w-xl"
      >
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 hover:bg-pink-600"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/cart"
          className="text-gray-700 hover:text-pink-500 flex items-center"
        >
          <ShoppingCart className="mr-1" /> Cart
        </Link>

        <Link
          to="/track-order"
          className="text-gray-700 hover:text-pink-500 flex items-center"
        >
          <PackageCheck className="mr-1" /> Track
        </Link>

        {user && (
          <>
            <Link
              to="/order-history"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ListOrdered className="mr-1" /> My Orders
            </Link>

            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <LogOut className="mr-1" /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
