import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDx_92dcN3wyvcdKu3GJZ7CsTNMzJBVbbY",
  authDomain: "testupdload.firebaseapp.com",
  databaseURL: "https://testupdload-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testupdload",
  storageBucket: "testupdload.appspot.com",
  messagingSenderId: "308588130012",
  appId: "1:308588130012:web:40f705bb1c63c2d3fcce19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { storage }