import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { useAuth } from '../../context/data/myState';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [product, setProduct] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    imageURL: '',
    featured: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(firestore, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct({
            title: productData.title,
            price: productData.price.toString(),
            category: productData.category,
            description: productData.description,
            imageURL: productData.imageURL,
            featured: productData.featured || false
          });
        } else {
          setError('Product not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product. Please try again.');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('Only admin can edit products');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const productRef = doc(firestore, 'products', productId);
      await updateDoc(productRef, {
        ...product,
        price: parseFloat(product.price),
        updatedAt: new Date()
      });
      
      setSuccess('Product updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error updating product. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Product Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="input input-bordered"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="select select-bordered"
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
            <option value="books">Books</option>
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="textarea textarea-bordered h-24"
            required
          ></textarea>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="url"
            name="imageURL"
            value={product.imageURL}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        {product.imageURL && (
          <div className="mt-2">
            <p className="text-sm mb-1">Image Preview:</p>
            <img
              src={product.imageURL}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
        
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Featured Product</span>
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Update Product'}
          </button>
          
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;