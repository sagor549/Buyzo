// SearchInput.jsx
import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const SearchInput = ({ onSearch, initialQuery = "", placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Debounce the search function
  const debouncedSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.cancel(); // Cancel any pending debounced calls
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full pr-12"
          value={searchQuery}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="absolute top-0 right-0 rounded-l-none btn btn-ghost btn-square"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchInput;