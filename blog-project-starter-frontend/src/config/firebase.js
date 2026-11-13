// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG2E4oCMkAQ54BHKLVM1wOPxvXJeMvVoI",
  authDomain: "blog-app-demo1.firebaseapp.com",
  projectId: "blog-app-demo1",
  storageBucket: "blog-app-demo1.firebasestorage.app",
  messagingSenderId: "569443738175",
  appId: "1:569443738175:web:c3b2521b59afbd19254e8a",
  measurementId: "G-H774Q9ME9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 