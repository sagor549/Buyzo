// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/data/myState';

export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Special check for your admin email
  if (currentUser.email === "sagorghosh9899@gmail.com") {
    return children;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};