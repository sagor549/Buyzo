// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

// Helper function to convert Firestore document data to serializable format
const convertTimestampsToMillis = (data) => {
  // Create a new object to avoid mutating the original
  const serializable = { ...data };
  
  // Convert all potential Timestamp fields
  ['createdAt', 'updatedAt', 'publishedAt', 'expiresAt', 'lastModified'].forEach(field => {
    if (serializable[field] && typeof serializable[field].toMillis === 'function') {
      serializable[field] = serializable[field].toMillis();
    }
  });
  
  return serializable;
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const productsRef = collection(firestore, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const products = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...convertTimestampsToMillis(data)
        });
      });
      
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const productsRef = collection(firestore, 'products');
      const q = query(
        productsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const products = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...convertTimestampsToMillis(data)
        });
      });
      
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const productsRef = collection(firestore, 'products');
      const q = query(
        productsRef,
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const products = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...convertTimestampsToMillis(data)
        });
      });
      
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    featuredProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchProductsByCategory (updates the products array)
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;