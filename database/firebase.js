// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBouMAauuwRaLPTmx_ywEkaSt8cgB0DZa0",
  authDomain: "proyectodesarrolloweb-a1a36.firebaseapp.com",
  projectId: "proyectodesarrolloweb-a1a36",
  storageBucket: "proyectodesarrolloweb-a1a36.firebasestorage.app",
  messagingSenderId: "774980571790",
  appId: "1:774980571790:web:b980c31980cd7c1ab2efdf",
  measurementId: "G-VNV4R5R38T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);