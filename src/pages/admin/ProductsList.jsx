import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import DeleteProduct from './DeleteProduct';
import SearchInput from '../../components/search/SearchInput';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(lowercaseQuery) || 
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(firestore, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(firestore, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
      setDeleteModal({ show: false, product: null });
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">All Products</h2>
        <div className="w-full md:w-64 mb-4 md:mb-0">
          <SearchInput onSearch={handleSearch} />
        </div>
        <Link to="/add-product" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.imageURL} 
                      alt={product.title} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400?text=Image+Error";
                      }}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/edit-product/${product.id}`} 
                        className="btn btn-sm btn-outline"
                      >
                        Edit
                      </Link>
                      <button 
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => setDeleteModal({ 
                          show: true, 
                          product: product 
                        })}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    {searchQuery 
                      ? `No products found matching "${searchQuery}"`
                      : 'No products found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {deleteModal.show && (
        <DeleteProduct 
          productId={deleteModal.product.id}
          productTitle={deleteModal.product.title}
          onClose={() => setDeleteModal({ show: false, product: null })}
          onDeleted={() => handleDelete(deleteModal.product.id)}
        />
      )}
    </div>
  );
};

export default ProductsList;