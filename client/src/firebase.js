// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4hXrVvoA-Mf00U5K08xMmnh14VRDSnt0",
  authDomain: "sharefun-dc053.firebaseapp.com",
  projectId: "sharefun-dc053",
  storageBucket: "sharefun-dc053.appspot.com",
  messagingSenderId: "6052304980",
  appId: "1:6052304980:web:a7d924bf9591139a92f5c1",
  measurementId: "G-LB788S6GFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized app and storage
const storage = getStorage(app); // This ensures storage is tied to the initialized app

export { app, storage };
