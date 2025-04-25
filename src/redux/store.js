// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // You can choose to disable serializable check completely
        // serializableCheck: false,
        
        // Or just ignore specific paths where timestamps might appear
        ignoredPaths: ['product.products.createdAt', 'product.featuredProducts.createdAt'],
      },
    }),
});