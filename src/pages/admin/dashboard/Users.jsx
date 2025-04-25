import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(firestore, 'users');
        const snapshot = await getDocs(usersRef);
        
        const usersData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString()
        }));
        
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.uid}>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-info">
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{user.createdAt}</td>
                <td>
                  <button className="btn btn-ghost btn-xs">Edit</button>
                  <button className="btn btn-ghost btn-xs text-error">Delete</button>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;