//userService.js
////////////////////////////////
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebase-config";

// Create User Profile
export const createUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  const userData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, userData);
};

// Update User Profile
export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, "users", userId);
  const updatedData = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(userRef, updatedData);
};

// Fetch User Data
export const fetchUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) return userDoc.data();
    console.error("User not found");
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Upload Avatar
export const uploadAvatar = async (userId, file) => {
  try {
    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(avatarRef, file);
    return await getDownloadURL(avatarRef);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
