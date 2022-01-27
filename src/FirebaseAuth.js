// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
require("firebase/compat/auth");
require("firebase/compat/database");
var firebaseui = require("firebaseui");

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

// Get a reference to the database service
// var database = firebase.database();
// const analytics = getAnalytics(app);

export class FirebaseAuth {
  _initialized;
  _app;
  userId;
  signedIn;
  constructor() {
    this._initialized = false;
    this._app = null;
    this.ui = null;
    this.userId = null;
    this.signedIn = false;
  }

  init() {
    // eslint-disable-next-line no-unused-vars
    this._app = firebase.initializeApp(firebaseConfig);
    this._initialized = true;
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.token = null;
    this.user = null;
  }

  setupUI(elementId) {
    this.ui.start(elementId, {
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      // Other config options...
      popupMode: true,
      siteName: "Squirrel School Days",
    });
  }

  popupSignin(callback) {
    firebase
      .auth()
      .signInWithPopup(this.provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        this.token = credential.accessToken;
        // The signed-in user info.
        this.user = result.user;
        this.userId = this.user.uid;
        this.signedIn = true;
        // ...
        // eslint-disable-next-line prettier/prettier
        if (typeof callback == 'function') {
          callback();
        } else {
          console.warn("callback must be of a function type. Ignoring.");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
        alert(`Error ${errorCode}: ${errorMessage}.`);
      });
  }

  signOut() {
    console.debug(this.signedIn);
    if (this.signedIn) {
      firebase
        .auth(this._app)
        .signOut()
        .then(() => {
          this.signedIn = false;
          console.debug("Signed out");
          this.token = null;
          this.user = null;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  getBasicUserInfo() {
    if (this.signedIn && this.user != null) {
      let basicUserInfo = {
        displayName: this.user.displayName,
        name: this.user.name,
        email: this.user.email,
      };
      return basicUserInfo;
    }
  }
}
