///AuthContext.js
//////////////////////////
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { fetchUserData } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          console.log("User logged in:", authUser);
          const userData = await fetchUserData(authUser.uid);
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName || "User",
            firstName: userData?.firstName || "User",
            photoURL: authUser.photoURL || null,
            ...userData,
          });
        } catch (error) {
          console.error("Failed to fetch user data, using auth data as fallback:", error);
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName || "User",
            firstName: "User",
          });
        }
      } else {
        console.log("User logged out");
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogout }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
