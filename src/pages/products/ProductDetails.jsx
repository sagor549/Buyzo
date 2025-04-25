import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { fetchProducts } from '../../redux/slices/productSlice';

const ProductDetails = () => {
  const { productId } = useParams();
  const { products, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = products.find(p => p.id === productId);

  // Format category name for display (capitalize first letter)
  const formatCategoryName = (category) => {
    return category && typeof category === 'string'
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!product) return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <Link to="/products" className="btn btn-primary">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/products" className="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-base-100 rounded-lg shadow-lg p-6">
        {/* Product Image Section - Fixed to display better */}
        <div className="flex justify-center items-center bg-white rounded-lg p-4">
          <div className="w-full h-80 md:h-96 flex items-center justify-center">
            <img
              src={product.imageURL}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400?text=Image+Not+Found";
              }}
            />
          </div>
        </div>
        
        {/* Product Info Section */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="badge badge-outline">{formatCategoryName(product.category)}</span>
              {product.featured && <span className="badge badge-secondary">Featured</span>}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
            <p className="text-3xl text-primary font-bold mt-4">${product.price.toFixed(2)}</p>
            
            <div className="divider"></div>
            
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => dispatch(addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                imageURL: product.imageURL,
                quantity: 1
              }))}
              className="btn btn-primary w-full"
            >
              Add to Cart
            </button>
            
            <Link to="/products" className="btn btn-outline w-full">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;