import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../../../context/data/MyState';
import DeleteProduct from '../DeleteProduct';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent products
      const productsRef = collection(firestore, 'products');
      const productsQuery = query(productsRef, orderBy('createdAt', 'desc'), limit(5));
      const productsSnapshot = await getDocs(productsQuery);
      
      const productsData = [];
      productsSnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      // Get counts for stats
      const productsCount = (await getDocs(productsRef)).size;
      
      // Assuming you have collections for orders and users
      let ordersCount = 0;
      let usersCount = 0;
      
      try {
        const ordersRef = collection(firestore, 'orders');
        ordersCount = (await getDocs(ordersRef)).size;
      } catch (error) {
        console.log('Orders collection may not exist yet', error);
      }
      
      try {
        const usersRef = collection(firestore, 'users');
        usersCount = (await getDocs(usersRef)).size;
      } catch (error) {
        console.log('Users collection may not exist yet', error);
      }
      
      setProducts(productsData);
      setStats({
        productsCount,
        ordersCount,
        usersCount
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleProductDeleted = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
    setStats(prev => ({
      ...prev,
      productsCount: prev.productsCount - 1
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary text-primary-content p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <p className="text-4xl font-bold">{stats.productsCount}</p>
          <Link to="/add-product" className="mt-4 btn btn-sm">Add New</Link>
        </div>
        
        <div className="bg-secondary text-secondary-content p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          <p className="text-4xl font-bold">{stats.ordersCount}</p>
          <Link to="/orders" className="mt-4 btn btn-sm">View All</Link>
        </div>
        
        <div className="bg-accent text-accent-content p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-4xl font-bold">{stats.usersCount}</p>
          <Link to="/users" className="mt-4 btn btn-sm">Manage</Link>
        </div>
      </div>
      
      <div className="bg-base-200 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Products</h2>
          <Link to="/products-list" className="btn btn-sm">View All</Link>
        </div>
        
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
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
                    <td>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/edit-product/${product.id}`} 
                          className="btn btn-sm btn-ghost"
                        >
                          Edit
                        </Link>
                        <button 
                          className="btn btn-sm btn-error"
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
                
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No products found. <Link to="/add-product" className="text-primary">Add your first product</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {deleteModal.show && (
        <DeleteProduct 
          productId={deleteModal.product.id}
          productTitle={deleteModal.product.title}
          onClose={() => setDeleteModal({ show: false, product: null })}
          onDeleted={() => handleProductDeleted(deleteModal.product.id)}
        />
      )}
    </div>
  );
};

export default Dashboard;
