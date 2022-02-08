"use strict";
exports.__esModule = true;
// Import the functions you need from the SDKs you need
var app_1 = require("firebase/compat/app");
// eslint-disable-next-line no-unused-vars
// import { FirebaseAuth } from "./FirebaseAuth.js";
require("firebase/compat/auth");
require("firebase/compat/database");
var FirebaseRTDb = /** @class */ (function () {
  function FirebaseRTDb() {
    this._initialized = false;
    this._uid = null;
    this.database = null;
    this._squirrelListRef = null;
    this._squirrelListConfigRef = null;
    // this.squirrelListListenerSync = [];
  }
  FirebaseRTDb.prototype.init = function (firebaseApp) {
    this._initialized = true;
    this._firebaseApp = firebaseApp;
    this.database = app_1["default"].database(this._firebaseApp);
  };
  FirebaseRTDb.prototype.setUID = function (
    newUID,
    listListenerCallback,
    listConfigListenerCallback
  ) {
    // Remove onValue listener and set squirrelListRef to null if newUID is null
    if (newUID == null) {
      if (this._squirrelListRef != null) {
        this._squirrelListRef.off();
      }
      this._squirrelListRef = null;
    }
    // ensure squirrelListRef isn't null before calling its off() method.
    if (this._squirrelListRef != null) {
      this._squirrelListRef.off();
      this._squirrelListRef = null;
    }
    // Remove onValue listener and set squirrelListRef to null if newUID is null
    if (newUID == null) {
      if (this._squirrelListConfigRef != null) {
        this._squirrelListConfigRef.off();
      }
      this._squirrelListConfigRef = null;
    }
    // ensure squirrelListRef isn't null before calling its off() method.
    if (this._squirrelListConfigRef != null) {
      this._squirrelListConfigRef.off();
      this._squirrelListConfigRef = null;
    }
    // set _uid to newUID and change the reference to the new uid node.
    this._uid = newUID;
    this._squirrelListRef = app_1["default"]
      .database(this._firebaseApp)
      .ref("users/" + this._uid + "/squirrelList");
    this._squirrelListConfigRef = app_1["default"]
      .database(this._firebaseApp)
      .ref("users/" + this._uid + "/squirrelConfig");
    // set callbacks when values change
    this._squirrelListRef.on("value", function (snapshot) {
      // capture the snapshot value
      var data = snapshot.val();
      console.log(data);
      // make sure listListenerCallback is a function before attempting to call it.
      if (typeof listListenerCallback == "function") {
        listListenerCallback(data);
      }
      // console.dir(data.list); // debug
      // type checking.
      // if (typeof data.list == "string")
      // this.squirrelListListenerSync = data.list.split(",");
    });
    this._squirrelListConfigRef.on("value", function (snapshot) {
      // capture the snapshot value
      var data = snapshot.val();
      // console.log(data);
      // make sure listConfigListenerCallback is a function before attempting to call it
      if (typeof listConfigListenerCallback == "function") {
        listConfigListenerCallback(data);
      }
    });
  };
  FirebaseRTDb.prototype.oneShotListConfigSync = function () {
    var dbRef = app_1["default"].database(this._firebaseApp).ref();
    dbRef
      .child("users")
      .child(this._uid)
      .child("squirrelConfig")
      .get()
      .then(function (snapshot) {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.log("No data available in '/users/[HIDDEN]/squirrelConfig");
        }
        return null;
      })
      ["catch"](function (error) {
        console.error(error);
        return null;
      });
  };
  FirebaseRTDb.prototype.oneShotListSync = function () {
    var dbRef = app_1["default"].database(this._firebaseApp).ref();
    var savedSquirrelVal = null;
    dbRef
      .child("users")
      .child(this._uid)
      .child("squirrelList")
      .get()
      .then(function (snapshot) {
        if (snapshot.exists()) {
          // savedSquirrelVal = snapshot.val
          return snapshot.val();
          // savedSquirrelVal = snapshot.val();
        } else {
          console.log("No data available");
        }
        return {
          squirrelList: savedSquirrelVal,
          listConfig: null,
        };
      })
      ["catch"](function (error) {
        console.error(error);
        return null;
      });
    // throw new NotYetImplementedError();
  };
  FirebaseRTDb.prototype.writeListConfigs = function (listConfig) {
    app_1["default"]
      .database()
      .ref("users/" + this._uid + "/squirrelConfig")
      .set(listConfig, function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log(
            "%c IT WORKED!!!!!!!!!",
            "background: #222; color: #bada55"
          );
        }
      });
  };
  FirebaseRTDb.prototype.writeSquirrelList = function (squirrelList) {
    app_1["default"]
      .database()
      .ref("users/" + this._uid + "/squirrelList")
      .set(
        {
          list: squirrelList,
        },
        function (error) {
          if (error) {
            console.error(error);
          } else {
            console.log(
              "%c IT WORKED!!!!!!!!!",
              "background: #222; color: #bada55"
            );
          }
        }
      );
  };
  return FirebaseRTDb;
})();
exports["default"] = FirebaseRTDb;
//# sourceMappingURL=FirebaseRTDb.js.map
