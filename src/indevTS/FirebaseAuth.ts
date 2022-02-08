// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// import { BasicUserInfo } from "../firebaseAuth";
import type BasicUserInfo from "../types/BasicUserInfo";
require("firebase/compat/auth");
require("firebase/compat/database");
var firebaseui = require("firebaseui");

// Used to configure firebase application.
const firebaseConfig = {
  apiKey: "AIzaSyAAuUCSnKeoVDBSZXklIQZ8zq71bZO3Zrk",
  authDomain: "squirrel-school-days.firebaseapp.com",
  projectId: "squirrel-school-days",
  storageBucket: "squirrel-school-days.appspot.com",
  messagingSenderId: "798874434026",
  appId: "1:798874434026:web:0ab9df9a3c16c711afda93",
  measurementId: "G-8LXTFGTK7D",
};

  /** @callback signInCallback Executed when signin is successful.
 *  @returns void
 */

/** @callback signOutCallback Executed when signout is successful
 *  @returns void
 */

class FirebaseAuth {
  _initialized: boolean;
  
  userId: string;
  signedIn: boolean;
    
  private provider: firebase.auth.FacebookAuthProvider;
  private token: firebase.auth.OAuthCredential;
  private user: firebase.User;
  _app: firebase.app.App;
  constructor() {
    this._initialized = false;
    this._app = null;
    // this.ui = null;
    this.userId = null;
    this.signedIn = false;
  }

  init(authStateChangedCallback: Function): void {
    this._app = firebase.initializeApp(firebaseConfig);
    this._initialized = true;
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth(this._app));
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.token = null;
    this.user = null;

    firebase.auth(this._app).onAuthStateChanged((user) => {
      if (user) {
        this.signedIn = true;
        this.user = user;
        this.userId = user.uid;
        console.log("USER!!!!");
        console.log(user);
        authStateChangedCallback();
      }
    });
  }

  popupSignin(signInCallback: Function): void {
    firebase
      .auth(this._app)
      .signInWithPopup(this.provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential: any = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.token = credential.accessToken;
        // The signed-in user info.
        this.user = result.user;
        this.userId = this.user.uid;
        this.signedIn = true;
        //if (typeof signInCallback == 'function') {

        signInCallback();
        // } else {
        //   console.warn("callback must be of a function type. Ignoring.");
        // }
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
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.error(`${errorCode}: ${errorMessage}`);
    //   alert(errorMessage);
    // });
  }

  signOut(signOutCallback: Function): void {
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
          signOutCallback();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  getBasicUserInfo(): BasicUserInfo {
    if (this.signedIn && this.user != null) {
      let basicUserInfo = {
        displayName: this.user.displayName,
        // name: this.user.name,
        email: this.user.email,
        photoURL: this.user.photoURL,
      };
      return basicUserInfo;
    }
  }
}

export default FirebaseAuth;