// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// eslint-disable-next-line no-unused-vars
// import { FirebaseAuth } from "./FirebaseAuth.js";
require("firebase/compat/auth");
require("firebase/compat/database");

/** @typedef {Object} ListConfig
 *  @property {int} squirrelsPerDay - How many squirrels to be taken a day.
 *  @property {boolean} autoRemoveDays - Automatically remove previous days.
 *  @property {boolean} includeTeapotRat = Includes Teapot rat if enabled.
 */

/** @typedef {Object} SquirrelListSnapshotVal
 *  @property {string} squirrelList - An array of squirrels represented by a comma-separated string.
 */
// /** @callback listConfigListenerCallback
//  *  @param {ListConfig} listConfig - A {@link ListConfig} containing the settings for generating new lists.
//  */
/** @callback listListenerCallback
 *  @param {SquirrelListSnapshotVal} data - An object containing the list of squirrels and {@link ListConfig|configurations} for generating new lists.
 *  @returns void
 */
/** @callback listConfigListenerCallback
 *  @param {ListConfig} listConfig - A {@link ListConfig} containing the settings for generating new lists.
 */

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
    this._squirrelListConfigRef = null;
    this.squirrelListListenerSync = [];
    // console.log(uid);
  }

  init(firebaseApp) {
    this._initialized = true;
    this._firebaseApp = firebaseApp;
    this.database = firebase.database(this.firebaseApp);
  }

  /** @method
   *  Sets the instance's _uid property to user's uid. The method then sets up a listener for changes in the database and calls listenerCallback when a change happens.
   *  @param {firebase.User.userId} newUID - The uid from {@link FirebaseAuth#userId}
   *  @param {listenerCallback} listenerCallback - Called when a property of user/userId/squirrelList changes in the database.
   */
  // eslint-disable-next-line no-unused-vars
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
      .database(this.firebaseApp)
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
      if (typeof data.list == "string")
        this.squirrelListListenerSync = data.list.split(",");
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

  /** @method
   *  Gets the value of users/this._uid/squirrelList/listConfig in the firebase database.
   *  @returns any
   */

  oneShotListConfigSync() {
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

  /** @method
   *  Gets the value of users/this._uid/squirrelList in the firebase database.
   *  @returns any
   */
  oneShotListSync() {
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

  /** @method
   * writes ListConfig settings to database;
   *
   * @param {ListConfig} listConfig - the List configuration.
   */
  writeListConfigs(listConfig) {
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
// class NotYetImplementedError extends Error {
//   constructor() {
//     super();
//     this.message = "This function is not yet implemented!";
//     this.name = "NotYetImplemented";
//   }
// }
