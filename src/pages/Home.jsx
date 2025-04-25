import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchProducts, fetchProductsByCategory } from '../redux/slices/productSlice';
import MobileSearch from "../components/search/MobileSearch";
import ImageAuto from "../components/slider/ImageAuto";
import ProductCard from './products/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, products, loading, error } = useSelector((state) => state.product);
  
  // Lowercase category names to match what's likely in the database
  const categories = ['electronics', 'clothing', 'home', 'books'];
  const [selectedCategory, setSelectedCategory] = useState('electronics'); // Default category

  // Initial data fetch
  useEffect(() => {
    // Fetch featured products on initial load
    dispatch(fetchFeaturedProducts());
    
    // Load all products first
    dispatch(fetchProducts());
    
    // Then load the default category
    dispatch(fetchProductsByCategory(selectedCategory));
  }, [dispatch]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchProductsByCategory(category));
  };

  // Format category name for display (capitalize first letter)
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen pt-16"> {/* Padding top for fixed navbar */}
      <div className="container mx-auto px-4">
        {/* Hero Section - Moved to top for all devices */}
        <div className="mb-8">
          <ImageAuto />
        </div>
        
        {/* Mobile Search Component - Only appears on mobile after the slider */}
        <div className="lg:hidden mb-6">
          <MobileSearch />
        </div>
        
        {/* Categories Banner */}
        <div className="mb-10 bg-base-200 p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Shop by Category</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline btn-primary'}`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Products */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-center">{formatCategoryName(selectedCategory)} Products</h2>
          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6">
              <p>No products found in this category.</p>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="text-center mt-6">
              <Link 
                to={`/products?category=${selectedCategory}`} 
                className="btn btn-outline btn-primary"
              >
                View All {formatCategoryName(selectedCategory)} Products →
              </Link>
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
          {loading && featuredProducts.length === 0 ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6">
              <p>No featured products available.</p>
            </div>
          )}
          
          {featuredProducts.length > 4 && (
            <div className="text-center mt-6">
              <Link to="/products?featured=true" className="btn btn-outline btn-primary">
                View All Featured Products →
              </Link>
            </div>
          )}
        </section>

        {/* Latest Products Section */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link to="/products" className="btn btn-outline btn-primary">
              View All Products →
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;