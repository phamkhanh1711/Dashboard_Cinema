// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYygWNY-mBkxpWiablEG_JThbkbq0T0T4",
  authDomain: "imageupload-e544c.firebaseapp.com",
  projectId: "imageupload-e544c",
  storageBucket: "imageupload-e544c.appspot.com",
  messagingSenderId: "154427962961",
  appId: "1:154427962961:web:4c8ae65d4a510a60066a70"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase storage reference
const storage = getStorage(app);
export default storage;
