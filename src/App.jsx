import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './App.css';

// Layout and Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/products/Products';
import Order from './pages/order/Order';
import Nopage from './pages/nopage/Nopage';
import Cart from './pages/cart/Cart';
import Profile from './components/accounts/Profile';

// Admin Pages
import Dashboard from './pages/admin/dashboard/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ProductsList from './pages/admin/ProductsList';

// Auth Components
import { AuthProvider } from './context/data/MyState';
import Admin from './components/accounts/Admin';
import Signup from './components/accounts/Signup';
import Login from './components/accounts/Login';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Users from './pages/admin/dashboard/Users';
import ProductDetails from './pages/products/ProductDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      {
        path: "order",
        element: <ProtectedRoute><Order /></ProtectedRoute>
      },
      { path: "nopage", element: <Nopage /> },
      {
        path: "cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile/></ProtectedRoute>
      },
      // Admin Routes
      {
        path: "admin/dashboard",
        element: <AdminRoute><Dashboard /></AdminRoute>
      },
      {
        path: "add-product",
        element: <AdminRoute><AddProduct /></AdminRoute>
      },
      {
        path: "edit-product/:productId",
        element: <AdminRoute><EditProduct /></AdminRoute>
      },
      {
        path: "products-list",
        element: <AdminRoute><ProductsList /></AdminRoute>
      },
      {
        path: "admin/order",
        element: <AdminRoute><Dashboard /></AdminRoute>
      },
      {
        path: "admin/users",
        element: <AdminRoute><Users /></AdminRoute>
      },
      {
        path: "product/:productId",
        element: <ProductDetails />
      },
      // Auth Routes
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "admin", element: <Admin /> },
    ]
  }
]);

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
};

export default App;
