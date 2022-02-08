"use strict";
exports.__esModule = true;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/database");
// eslint-disable-next-line no-unused-vars
var firebaseui = require("firebaseui");
// Used to configure firebase application.
var firebaseConfig = {
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
var FirebaseAuth = /** @class */ (function () {
  function FirebaseAuth() {
    this._initialized = false;
    this._app = null;
    // this.ui = null;
    this.userId = null;
    this.signedIn = false;
  }
  FirebaseAuth.prototype.init = function (authStateChangedCallback) {
    var _this = this;
    this._app = app_1["default"].initializeApp(firebaseConfig);
    this._initialized = true;
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth(this._app));
    this.provider = new app_1["default"].auth.GoogleAuthProvider();
    this.token = null;
    this.user = null;
    app_1["default"].auth(this._app).onAuthStateChanged(function (user) {
      if (user) {
        _this.signedIn = true;
        _this.user = user;
        _this.userId = user.uid;
        console.log("USER!!!!");
        console.log(user);
        authStateChangedCallback();
      }
    });
  };
  FirebaseAuth.prototype.popupSignin = function (signInCallback) {
    var _this = this;
    app_1["default"]
      .auth(this._app)
      .signInWithPopup(this.provider)
      .then(function (result) {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        _this.token = credential.accessToken;
        // The signed-in user info.
        _this.user = result.user;
        _this.userId = _this.user.uid;
        _this.signedIn = true;
        //if (typeof signInCallback == 'function') {
        signInCallback();
        // } else {
        //   console.warn("callback must be of a function type. Ignoring.");
        // }
      })
      ["catch"](function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
        alert("Error ".concat(errorCode, ": ").concat(errorMessage, "."));
      });
    // })
    // .catch((error) => {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.error(`${errorCode}: ${errorMessage}`);
    //   alert(errorMessage);
    // });
  };
  FirebaseAuth.prototype.signOut = function (signOutCallback) {
    var _this = this;
    console.debug(this.signedIn);
    if (this.signedIn) {
      app_1["default"]
        .auth(this._app)
        .signOut()
        .then(function () {
          _this.signedIn = false;
          console.debug("Signed out");
          _this.token = null;
          _this.user = null;
          signOutCallback();
        })
        ["catch"](function (err) {
          console.error(err);
        });
    }
  };
  FirebaseAuth.prototype.getBasicUserInfo = function () {
    if (this.signedIn && this.user != null) {
      var basicUserInfo = {
        displayName: this.user.displayName,
        // name: this.user.name,
        email: this.user.email,
        photoURL: this.user.photoURL,
      };
      return basicUserInfo;
    }
  };
  return FirebaseAuth;
})();
exports["default"] = FirebaseAuth;
//# sourceMappingURL=FirebaseAuth.js.map
