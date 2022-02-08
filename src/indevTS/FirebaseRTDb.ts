// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// eslint-disable-next-line no-unused-vars
// import { FirebaseAuth } from "./FirebaseAuth.js";
require("firebase/compat/auth");
require("firebase/compat/database");
// import type BasicUserInfo from "../types/BasicUserInfo";
import type ListConfig from "../types/ListConfig";

class FirebaseRTDb {
  public database: firebase.database.Database;
    
  _initialized: boolean;
  _firebaseApp: firebase.app.App;
  _uid;
  _squirrelListRef: firebase.database.Reference;
  _squirrelListConfigRef: firebase.database.Reference;

  constructor() {
    this._initialized = false;
    this._uid = null;
    this.database = null;
    this._squirrelListRef = null;
    this._squirrelListConfigRef = null;
    // this.squirrelListListenerSync = [];
  }

  init(firebaseApp: firebase.app.App): void {
    this._initialized = true;
    this._firebaseApp = firebaseApp;
    this.database = firebase.database(this._firebaseApp);
  }

  setUID(newUID, listListenerCallback, listConfigListenerCallback) {
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
    this._squirrelListRef = firebase
      .database(this._firebaseApp)
      .ref("users/" + this._uid + "/squirrelList");
    this._squirrelListConfigRef = firebase
      .database(this._firebaseApp)
      .ref("users/" + this._uid + "/squirrelConfig");
    // set callbacks when values change
    this._squirrelListRef.on("value", (snapshot) => {
      // capture the snapshot value
      const data = snapshot.val();
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
    this._squirrelListConfigRef.on("value", (snapshot) => {
      // capture the snapshot value
      const data = snapshot.val();
      // console.log(data);

      // make sure listConfigListenerCallback is a function before attempting to call it
      if (typeof listConfigListenerCallback == "function") {
        listConfigListenerCallback(data);
      }
    });
  }

  oneShotListConfigSync(): any {
    const dbRef = firebase.database(this._firebaseApp).ref();
    dbRef
      .child("users")
      .child(this._uid)
      .child("squirrelConfig")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.log("No data available in '/users/[HIDDEN]/squirrelConfig");
        }
        return null;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  oneShotListSync(): any {
    const dbRef = firebase.database(this._firebaseApp).ref();
    let savedSquirrelVal = null;
    dbRef
      .child("users")
      .child(this._uid)
      .child("squirrelList")
      .get()
      .then((snapshot) => {
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
      .catch((error) => {
        console.error(error);
        return null;
      });
    // throw new NotYetImplementedError();
  }

  writeListConfigs(listConfig: ListConfig): void {
    firebase
      .database()
      .ref("users/" + this._uid + "/squirrelConfig")
      .set(listConfig, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log(
            "%c IT WORKED!!!!!!!!!",
            "background: #222; color: #bada55"
          );
        }
      });
  }

  writeSquirrelList(squirrelList: string): void {
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

export default FirebaseRTDb;