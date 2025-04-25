import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const DeleteProduct = ({ productId, productTitle, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Delete the product document from Firestore
      await deleteDoc(doc(firestore, 'products', productId));
      
      setLoading(false);
      if (onDeleted) {
        onDeleted();
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Delete Product</h3>
        
        <p className="mb-6">
          Are you sure you want to delete <span className="font-semibold">{productTitle}</span>? 
          This action cannot be undone.
        </p>
        
        {error && <div className="alert alert-error mb-4">{error}</div>}
        
        <div className="flex justify-end gap-2">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button 
            className="btn btn-error" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;