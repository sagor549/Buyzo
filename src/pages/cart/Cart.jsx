// src/pages/cart/Cart.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  removeFromCart, 
  updateQuantity,
  clearCart 
} from '../../redux/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-16 h-16 mask mask-squircle">
                            <img src={item.imageURL} alt={item.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          className="btn btn-sm btn-circle"
                          onClick={() => 
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-circle"
                          onClick={() => 
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start mt-8">
            <button
              className="btn btn-error btn-outline mb-4 md:mb-0"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            
            <div className="card bg-base-200 w-full md:w-80 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Order Summary</h2>
                <div className="flex justify-between py-2">
                  <span>Items ({totalItems}):</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="divider my-1"></div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn btn-primary mt-4">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;