import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(firestore, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString()
        }));
        
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>{order.userEmail}</td>
                <td>{order.createdAt}</td>
                <td>${order.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-xs">Details</button>
                </td>
              </tr>
            ))}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;