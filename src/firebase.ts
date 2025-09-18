// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUOtE5LsjzM-GnL9Xen-ZYvNoSPX_cOaI",
  authDomain: "smartih-1bbda.firebaseapp.com",
  projectId: "smartih-1bbda",
  storageBucket: "smartih-1bbda.firebasestorage.app",
  messagingSenderId: "477062225225",
  appId: "1:477062225225:web:af9f4b81b83bcb62964e98",
  measurementId: "G-H1SBXE4RC6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);