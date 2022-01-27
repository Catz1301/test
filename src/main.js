import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// eslint-disable-next-line no-unused-vars
const firebaseConfig = {
  apiKey: "AIzaSyAAuUCSnKeoVDBSZXklIQZ8zq71bZO3Zrk",
  authDomain: "squirrel-school-days.firebaseapp.com",
  projectId: "squirrel-school-days",
  storageBucket: "squirrel-school-days.appspot.com",
  messagingSenderId: "798874434026",
  appId: "1:798874434026:web:0ab9df9a3c16c711afda93",
  measurementId: "G-8LXTFGTK7D",
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
// var database = firebase.database();
// const analytics = getAnalytics(app);

createApp(App).mount("#app");
