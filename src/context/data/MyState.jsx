// src/context/data/myState.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { 
  setFirebaseUser, // Use the new action creator
  setUserRole, 
  setLoading as setReduxLoading, 
  clearUser 
} from '../../redux/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const dispatch = useDispatch();

  // Function to check if user is admin
  const checkAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false);
      dispatch(setUserRole('user'));
      return false;
    }
    
    // Hardcoded admin check for your specific email
    if (user.email === "sagorghosh9899@gmail.com") {
      setIsAdmin(true);
      dispatch(setUserRole('admin'));
      return true;
    }
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setIsAdmin(true);
        dispatch(setUserRole('admin'));
        return true;
      } else {
        // If the user document exists but doesn't have admin role,
        // check if it's your specific email and update if needed
        if (user.email === "sagorghosh9899@gmail.com") {
          // Update the user document to set as admin
          await setDoc(userRef, { role: 'admin' }, { merge: true });
          setIsAdmin(true);
          dispatch(setUserRole('admin'));
          return true;
        }
        setIsAdmin(false);
        dispatch(setUserRole('user'));
        return false;
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      
      // As a fallback, if there's an error but it's your specific email
      if (user.email === "sagorghosh9899@gmail.com") {
        setIsAdmin(true);
        dispatch(setUserRole('admin'));
        return true;
      }
      
      setIsAdmin(false);
      dispatch(setUserRole('user'));
      return false;
    }
  };

  useEffect(() => {
    dispatch(setReduxLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Keep the Firebase user object in Context for auth operations
      setCurrentUser(user);
      
      // Use the new action creator that will extract serializable data
      if (user) {
        dispatch(setFirebaseUser(user));
        await checkAdminStatus(user);
      } else {
        dispatch(clearUser());
      }
      
      setLoading(false);
      dispatch(setReduxLoading(false));
    });

    return unsubscribe;
  }, [auth, dispatch]);

  // Register a new user
  const signup = async (email, password, name) => {
    try {
      dispatch(setReduxLoading(true));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set admin role if it's your email
      const isAdminUser = email === "sagorghosh9899@gmail.com";
      
      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        name,
        email,
        role: isAdminUser ? 'admin' : 'user',
        createdAt: new Date()
      });
      
      if (isAdminUser) {
        setIsAdmin(true);
        dispatch(setUserRole('admin'));
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  // Sign in an existing user
  const login = async (email, password) => {
    try {
      dispatch(setReduxLoading(true));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if this is the admin email and ensure they have admin privileges
      if (email === "sagorghosh9899@gmail.com") {
        const userRef = doc(firestore, 'users', userCredential.user.uid);
        await setDoc(userRef, { role: 'admin' }, { merge: true });
        setIsAdmin(true);
        dispatch(setUserRole('admin'));
      } else {
        await checkAdminStatus(userCredential.user);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  // Sign out the current user
  const logout = async () => {
    try {
      setIsAdmin(false);
      dispatch(setUserRole('user'));
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    try {
      dispatch(setReduxLoading(true));
      const userRef = doc(firestore, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};