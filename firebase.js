// Import the functions you need from the SDKs you need

import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  authDomain: "pantry-project-44f29.firebaseapp.com",
  projectId: "pantry-project-44f29",
  storageBucket: "pantry-project-44f29.appspot.com",
  messagingSenderId: "866300486778",
  appId: "1:866300486778:web:8919a9b423de2b23e987c3",
  measurementId: "G-60KL0F543Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {firestore};