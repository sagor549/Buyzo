// src/redux/slices/authSlice.js
import { createSlice, createAction } from '@reduxjs/toolkit';

// Helper function to extract serializable user properties
const extractSerializableUser = (firebaseUser) => {
  if (!firebaseUser) return null;
  
  // Extract only serializable properties
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      creationTime: firebaseUser.metadata?.creationTime,
      lastSignInTime: firebaseUser.metadata?.lastSignInTime
    }
  };
};

// Create a separate action creator for Firebase user that will preprocess the payload
export const setFirebaseUser = createAction('auth/setFirebaseUser', (firebaseUser) => {
  return {
    payload: extractSerializableUser(firebaseUser)
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    userRole: 'user',
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      // The payload is already serializable at this point
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.userRole = 'user';
      state.loading = false;
      state.error = null;
    },
  },
  // Handle the external action
  extraReducers: (builder) => {
    builder.addCase(setFirebaseUser, (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    });
  }
});

export const { setUser, setUserRole, setLoading, setError, clearUser } = authSlice.actions;
export default authSlice.reducer;