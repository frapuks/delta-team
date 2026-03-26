import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjY7c1SykLyKo4PxCRHCSofikUvSBaqEs",
  authDomain: "delta-team-fdfb7.firebaseapp.com",
  projectId: "delta-team-fdfb7",
  storageBucket: "delta-team-fdfb7.firebasestorage.app",
  messagingSenderId: "453744895990",
  appId: "1:453744895990:web:092139ea329d9a7dcd89d7",
  measurementId: "G-2XR9G0GPMF",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
