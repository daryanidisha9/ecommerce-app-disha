import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`)
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search for clothes, accessories, etc..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded-l-lg border border-pink-400 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-pink-500 text-white px-4 rounded-r-lg hover:bg-pink-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
