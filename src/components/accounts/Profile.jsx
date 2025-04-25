import { useState, useEffect } from 'react';
import { useAuth } from '../../context/data/MyState';
import { Link, useNavigate } from 'react-router-dom';
import { doc, updateDoc,getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const Profile = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  // User profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Fetch user data if available
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setEmail(currentUser.email || '');
        
        try {
          // Get additional user data from Firestore
          const userDoc = doc(firestore, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setName(userData.name || '');
            setPhone(userData.phone || '');
            setAddress(userData.address || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Since updateUserProfile is not defined in your context,
      // we'll implement profile updates directly here
      const userRef = doc(firestore, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        name: name,
        phone: phone,
        address: address,
        updatedAt: new Date()
      });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      setError('Failed to update profile: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to log out: ' + (error.message || 'Unknown error'));
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-200 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)} 
                className="btn btn-primary btn-sm"
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(false)} 
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
            )}
          </div>

          {error && <div className="alert alert-error mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          {editMode ? (
            // Edit form
            <form onSubmit={handleUpdateProfile}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  className="input input-bordered"
                  disabled
                  title="Email cannot be changed"
                />
                <label className="label">
                  <span className="label-text-alt text-neutral-500">Email cannot be changed</span>
                </label>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="textarea textarea-bordered h-24"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
              </button>
            </form>
          ) : (
            // Profile details view
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg">{name || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-lg">{phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-lg">{address || 'Not provided'}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-4">
                  <div className="badge badge-primary mb-4">Admin User</div>
                  <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                      <h2 className="card-title">Administrative Actions</h2>
                      <p>Access the admin dashboard to manage products, orders, and users.</p>
                      <div className="card-actions justify-end mt-4">
                        <Link to="/admin/dashboard" className="btn btn-primary">
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title">Account Actions</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button 
                        onClick={handleLogout}
                        className="btn btn-outline"
                      >
                        Log Out
                      </button>
                      <Link to="/change-password" className="btn btn-ghost">
                        Change Password
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
