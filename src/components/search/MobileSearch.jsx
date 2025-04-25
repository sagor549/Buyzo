import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileSearch = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div className="w-full px-4 py-2 bg-base-100">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input input-bordered flex-grow"
        />
        <button 
          type="submit" 
          className="btn btn-primary ml-2"
          disabled={!query.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MobileSearch;