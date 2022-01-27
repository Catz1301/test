// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
require("firebase/compat/auth");
require("firebase/compat/database");

export class FirebaseRTDb {
  // public
  database;
  squirrelListListenerSync;
  // initialized;

  // private
  _initialized;
  _firebaseApp;
  _uid;
  _squirrelListRef;
  // methods
  constructor() {
    //TODO: Implement,
    this._initialized = false;
    this._uid = null;
    this.database = null;
    this._squirrelListRef = null;
    this.squirrelListListenerSync = [];
    // console.log(uid);
  }

  init(firebaseApp) {
    this._initialized = true;
    this._firebaseApp = firebaseApp;
    this.database = firebase.database(this.firebaseApp);
  }

  setUID(newUID, listenerCallback) {
    if (newUID == null) {
      if (this._squirrelListRef != null) {
        this._squirrelListRef.off();
      }
      this._squirrelListRef = null;
    }
    if (this._squirrelListRef != null) {
      this._squirrelListRef.off();
    }
    this._squirrelListRef = null;
    this._uid = newUID;
    this._squirrelListRef = firebase
      .database(this.firebaseApp)
      .ref("users/" + this._uid + "/squirrelList");
    this._squirrelListRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (typeof listenerCallback == "function") {
        listenerCallback(data);
      }
      console.dir(data.list);
      if (typeof data == "string")
        this.squirrelListListenerSync = data.split(",");
    });
  }

  oneShotSync() {
    // TODO: Implement
    const dbRef = firebase.database(this._firebaseApp).ref();
    let savedSquirrelVal = null;
    dbRef
      .child("users")
      .child(this._uid)
      .child("squirrelList")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          return snapshot.val();
          // savedSquirrelVal = snapshot.val();
        } else {
          console.log("No data available");
        }
        return savedSquirrelVal;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
    // throw new NotYetImplementedError();
  }

  writeSquirrelList(squirrelList) {
    firebase
      .database()
      .ref("users/" + this._uid + "/squirrelList")
      .set(
        {
          list: squirrelList,
        },
        (error) => {
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
  }
}

// eslint-disable-next-line no-unused-vars
class NotYetImplementedError extends Error {
  constructor() {
    super();
    this.message = "This function is not yet implemented!";
    this.name = "NotYetImplemented";
  }
}
