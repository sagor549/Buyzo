import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchProductsByCategory } from '../../redux/slices/productSlice';
import SearchInput from '../../components/search/SearchInput';
import ProductCard from '../../pages/products/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Get category from URL params
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Make sure categories match the same format as in Home.js (lowercase)
  const categories = ['All', 'electronics', 'clothing', 'home', 'books'];

  // Format category name for display (capitalize first letter)
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Initial data fetch
  useEffect(() => {
    // First fetch all products
    dispatch(fetchProducts());
    
    // Then fetch by category if a specific category is selected
    if (selectedCategory !== 'All') {
      dispatch(fetchProductsByCategory(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = [...products];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
    updateUrlParams();
  };

  const updateUrlParams = () => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="w-full md:w-1/2">
          <SearchInput 
            onSearch={handleSearch}
            placeholder="Search products..."
            initialQuery={searchQuery}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category === 'All' ? category : formatCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500">No products found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;