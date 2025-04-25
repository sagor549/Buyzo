import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      quantity: 1
    }));
  };
  
  // Format category name for display (capitalize first letter)
  const formatCategoryName = (category) => {
    return category && typeof category === 'string'
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : '';
  };
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <figure className="h-64 relative overflow-hidden">
        <img
          src={product.imageURL}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400?text=Image+Not+Found";
          }}
        />
        {product.featured && (
          <div className="badge badge-secondary absolute top-2 right-2">
            Featured
          </div>
        )}
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg truncate">{product.title}</h2>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
          <span className="badge badge-outline">{formatCategoryName(product.category)}</span>
        </div>
        <div className="card-actions mt-4 flex justify-between">
          <Link 
            to={`/product/${product.id}`}
            className="btn btn-outline btn-sm hover:btn-primary"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;