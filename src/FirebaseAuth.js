// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
require("firebase/compat/auth");
require("firebase/compat/database");
var firebaseui = require("firebaseui");

/** @private */
const firebaseConfig = {
  apiKey: "AIzaSyAAuUCSnKeoVDBSZXklIQZ8zq71bZO3Zrk",
  authDomain: "squirrel-school-days.firebaseapp.com",
  projectId: "squirrel-school-days",
  storageBucket: "squirrel-school-days.appspot.com",
  messagingSenderId: "798874434026",
  appId: "1:798874434026:web:0ab9df9a3c16c711afda93",
  measurementId: "G-8LXTFGTK7D",
};

/** @typedef {Object} BasicUserInfo
 *  @property {string} displayName
 *  @property {string} name
 *  @property {string} email
 *  @property {string | null} photoURL
 */

/** @callback signInCallback Executed when signin is successful.
 *  @returns void
 */

/** @callback signOutCallback Executed when signout is successful
 *  @returns void
 */
// Initialize Firebase
// eslint-disable-next-line no-unused-vars

// Get a reference to the database service
// var database = firebase.database();
// const analytics = getAnalytics(app);

// /** @namespace */
export class FirebaseAuth {
  /** Flag indicating if the instance has been inititialized
   *  @type {boolean}
   */
  _initialized;
  /** Variable holding the firebase application instance
   *  @type {firebase.app.App}
   */
  _app;
  /** The user's unique ID
   *  @type {firebase.User.userId}
   *  @memberof
   *  @instance
   */
  userId;
  /** Flag indicating if the user is signed in
   *  @type {boolean}
   */
  signedIn;
  constructor() {
    this._initialized = false;
    this._app = null;
    this.ui = null;
    this.userId = null;
    this.signedIn = false;
  }
  /** @param {function} authStateChangedCallback - The callback executed when authstate changes */
  init(authStateChangedCallback) {
    // eslint-disable-next-line no-unused-vars
    this._app = firebase.initializeApp(firebaseConfig);
    this._initialized = true;
    this.ui = new firebaseui.auth.AuthUI(firebase.auth(this._app));
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.token = null;
    this.user = null;
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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

  /** @deprecated in favor of popupSignin. This method will be removed in the future. */
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

  /** @method
   *  Creates a popup prompting the user to sign in using their google account. Executes callback if successful.
   *  @param {signInCallback} signInCallback - Executed if signin is successful.
   */
  popupSignin(signInCallback) {
    // firebase
    //   .auth(this._app)
    //   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    //   .then(() => {
    // return firebase
    firebase
      .auth(this._app)
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
        if (typeof signInCallback == 'function') {
          signInCallback();
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
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.error(`${errorCode}: ${errorMessage}`);
    //   alert(errorMessage);
    // });
  }
  /** @method
   *  Signs the user's google account aut of this application. The user will remain logged into their google account.
   *  @param {signOutCallback} signOutCallback - Executed if operation was successful.
   */
  signOut(signOutCallback) {
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
  /** @method
   *  Returns limited information about the user, contained in a {@link BasicUserInfo} object.
   *  @returns BasicUserInfo */
  getBasicUserInfo() {
    if (this.signedIn && this.user != null) {
      let basicUserInfo = {
        displayName: this.user.displayName,
        name: this.user.name,
        email: this.user.email,
        photoURL: this.user.photoURL,
      };
      return basicUserInfo;
    }
  }
}
