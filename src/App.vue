<!-- 
  TODO:
    1. Implement some sort of animation thing to slide the name of person logged in into
        their profile picture, and then change the button text with their name on it to
        to 'Log out' or something like that.
    2. Add a settings button inbetween the 2 buttons on top. This should either expand
        some space below or open some sort of modal for settings.
    3. Allow for saving config settings.
    4. Add an about modal to give credit to the sources of the icons used, because legals.
    5. Add a card at the bottom for todo things.
 -->
<template>
  <!-- <img alt="Vue logo" style="width: 350px" src="./assets/logo.png" />  <- We may use this, who knows? -->
  <div class="signin">
    <button @click="signInSignOut()" id="signInOutBtn">Sign in</button>
    <img src="" alt="" id="userPP" />
  </div>
  <div id="squirrels">
    <div id="storageBtns">
      <button-icon
        @click="saveList()"
        :iconSrc="require('./assets/save_icon.webp')"
        text="Save List"
        showIcon
      />
      <button-icon
        @click="exColSettings()"
        :iconSrc="require('./assets/settings_icon.webp')"
        text=""
        iconOnly
      />
      <button-icon
        @click="newList()"
        :iconSrc="require('./assets/clear_icon.webp')"
        text="New List"
        showIcon
      />
    </div>
    <div id="settings">
      <input
        type="range"
        min="1"
        max="12"
        step="1"
        name="NumberOfSquirrels"
        id="numberOfSquirrels"
        value="2"
        oninput="document.getElementById('nOSOutput').value =
      document.getElementById('numberOfSquirrels').value"
        :onchange="settings_NumberOfSquirrelsChanged()"
      />
      <label for="NumberOfSquirrels">&nbsp;Number of Squirrels:&nbsp;</label>
      <output
        id="nOSOutput"
        name="NOS"
        for="numberOfSquirrels"
        value="2"
      ></output>
      <br />
      <input
        type="checkbox"
        name="AutoRemovePastDays"
        id="autoRemovePastDays"
        :oninput="settings_AutoRemovePastDaysInput()"
      />
      <label for="AutoRemovePastDays">&nbsp;Auto remove past days</label>
      <br />
      <input
        type="checkbox"
        name="IncludeTeapotRat"
        id="includeTeapotRat"
        :oninput="settings_IncludeTeapotRatInput()"
      />
      <label for="IncludeTeapotRat">&nbsp;Include Teapot Rat</label>
    </div>
    <row-squirrel
      v-for="sqrl in items"
      :key="sqrl.id"
      :sqrlname="sqrl.squirrel"
      :day="sqrl.day"
      :coordBody="sqrl.coordBody"
      :coordTail="sqrl.coordTail"
      class="rowSquirrel"
    />
    <!-- <p class="todo">Implement sync abilities - DONE!!!!!!!!!!!</p> -->
    <p class="copyright">
      Copyright 2022 by Joshua Miller. All rights reserved.
    </p>
  </div>
</template>

<script>
// Importing components
import RowSquirrel from "./components/RowSquirrel.vue";
import ButtonIcon from "./components/ButtonIcon.vue";
// import MaterialCard from "./components/MaterialCard.vue";
import Squirrels from "./Squirrels.js";
import SqueakBounds from "./SqueakBounds.js";
import Days from "./Days.js";
import "./assets/productSans.woff2";
import { FirebaseAuth } from "./FirebaseAuth.js";
import { FirebaseRTDb } from "./FirebaseRTDb";
// import NotYetImplementedError from "./Errors/NotYetImplementedError.js";

/** @typedef {Object} ListConfig
 *  @property {int} squirrelsPerDay - How many squirrels are being taken a day?
 *  @property {boolean} autoRemoveDays - Automatically remove previous days.
 *  @property {boolean} includeTeapotRat = Includes Teapot rat if enabled.
 */
/** @typedef {Object} SquirrelListSnapshotVal
 *  @property {string} squirrelList - An array of squirrels represented by a comma-separated string.
 */

/** @type {FirebaseAuth} */
var firebaseAuth;
var firebaseRTDb;
var settingsExpanded = false;
// eslint-disable-next-line no-unused-vars
var settingsChanged;
/** @type {ListConfig} */
var settingsConfig = {};
// var clearListBtn;

export default {
  name: "App",
  components: {
    RowSquirrel,
    ButtonIcon,
    // MaterialCard,
  },
  data() {
    return {
      items: [],
      settingsChanged: false,
      s: false,
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    settings_NumberOfSquirrelsChanged() {
      // console.assert(
      //   document.getElementsByName("NOS")[0],
      //   "Something's stupid with nOSOutput!"
      // );
      // console.log(document.getElementById("nOSOutput").value);
      this.$data.settingsChanged = true;
      setTimeout(() => {
        console.log(document.getElementById("numberOfSquirrels").value);
      }, 1);
    },
    settings_AutoRemovePastDaysInput() {
      this.$data.settingsChanged = true;
    },
    settings_IncludeTeapotRatInput() {
      this.$data.settingsChanged = true;
    },
    /** @method
     *  Expand or Collapse settings space. Syncs any settings changes with server when settings space is collapsed.
     */
    exColSettings() {
      if (settingsExpanded == false) {
        this.$data.s = false;
        this.$data.settingsChanged = false;
        settingsChanged = false;
      }
      document.getElementById("settings").style.height =
        settingsExpanded == false ? "65px" : "0px";
      document.querySelectorAll("#settings > *").forEach((el) => {
        el.style.height = settingsExpanded == false ? "initial" : "0px";
        el.style.display = settingsExpanded == false ? "initial" : "none";
      });
      if (!settingsExpanded) {
        document.getElementById("numberOfSquirrels").value =
          settingsConfig.squirrelsPerDay;
        document.getElementById("autoRemovePastDays").value =
          settingsConfig.autoRemoveDays;
        document.getElementById("includeTeapotRat").value =
          settingsConfig.includeTeapotRat;
      }
      settingsExpanded = !settingsExpanded;
      if (!settingsExpanded) {
        let squirrelNum = document.getElementById("numberOfSquirrels").value;
        // let squirrelNum = nos.value;
        let autoRemoveDays =
          document.getElementById("autoRemovePastDays").checked;
        // let autoRemoveDays = ard.checked;
        let includeTeapotRat =
          document.getElementById("includeTeapotRat").checked;
        // let inclTeapot = .checked;

        /** @type {ListConfig} */
        let config = {
          squirrelsPerDay: squirrelNum,
          autoRemoveDays,
          includeTeapotRat,
        };
        //#region debug
        /* console.debug("oink");
        console.debug("config: %o", config);
        console.debug("settingsConfig: %o", settingsConfig);
        console.debug(
          "config.squirrelsPerDay != settingsConfig.squirrelsPerDay && \
          config.autoRemoveDays != settingsConfig.autoRemoveDays && \
          config.includeTeapotRat != settingsConfig.includeTeapotRat): ",
          config.squirrelsPerDay != settingsConfig.squirrelsPerDay ||
            config.autoRemoveDays != settingsConfig.autoRemoveDays ||
            config.includeTeapotRat != settingsConfig.includeTeapotRat
        );
        console.group("DEBUG");
        console.debug(config.squirrelsPerDay != settingsConfig.squirrelsPerDay);
        console.debug(config.autoRemoveDays != settingsConfig.autoRemoveDays);
        // eslint-disable-next-line prettier/prettier
        console.debug(config.includeTeapotRat != settingsConfig.includeTeapotRat);
        console.groupEnd(); */
        //#endregion
        if (
          config.squirrelsPerDay != settingsConfig.squirrelsPerDay ||
          config.autoRemoveDays != settingsConfig.autoRemoveDays ||
          config.includeTeapotRat != settingsConfig.includeTeapotRat
        ) {
          // We got it! A workable hook.
          if (firebaseRTDb._initialized && firebaseAuth.signedIn) {
            console.log("writing list configs to database");
            firebaseRTDb.writeListConfigs(config);
          } else {
            localStorage.setItem("squirrelConfig", JSON.stringify(config));
          }
        }
        settingsConfig = config;
        // if (config != settingsConfig) {
        //   //#region DEBUGSETTINGSPROPERTIES
        //   // eslint-disable-next-line no-prototype-builtins
        //   if (settingsConfig.hasOwnProperty("squirrelsPerDay")) {
        //     console.groupCollapsed("squirrelsPerDay");
        //     // console.log(
        //     //   config.numberOfSquirrels && settingsConfig.numberOfSquirrels
        //     // );
        //     console.log("config: " + config.squirrelsPerDay);
        //     console.log("settingsConfig: " + settingsConfig.squirrelsPerDay);
        //     console.groupEnd();
        //   }
        //   // eslint-disable-next-line no-prototype-builtins
        //   if (settingsConfig.hasOwnProperty("autoRemoveDays")) {
        //     console.groupCollapsed("autoRemoveDays");
        //     console.log(config.autoRemoveDays == settingsConfig.autoRemoveDays);
        //     console.log("config: " + config.autoRemoveDays);
        //     console.log("settingsConfig: " + settingsConfig.autoRemoveDays);
        //     console.groupEnd();
        //   }
        //   // eslint-disable-next-line no-prototype-builtins
        //   if (settingsConfig.hasOwnProperty("includeTeapotRat")) {
        //     console.groupCollapsed("includeTeapotRat");
        //     console.log(
        //       config.includeTeapotRat == settingsConfig.includeTeapotRat
        //     );
        //     console.log("config: " + config.includeTeapotRat);
        //     console.log("settingsConfig: " + settingsConfig.includeTeapotRat);
        //     console.groupEnd();
        //   }
        //   //#endregion DEBUGSETTINGSPROPERTIES
        //   settingsConfig = config;
        //   console.log("new config");
        // }
      }
      // if (this.$data.s == true) console.log("meo");
    },
    signInSignOut() {
      /** @type {HTMLImageElement} */
      let userProfilePic = document.getElementById("userPP");
      if (firebaseAuth._initialized && !firebaseAuth.signedIn) {
        firebaseAuth.popupSignin(() => {
          document.getElementById("signInOutBtn").innerText =
            firebaseAuth.getBasicUserInfo().displayName;

          userProfilePic.src = firebaseAuth.getBasicUserInfo().photoURL;
          userProfilePic.style.display = "block";

          if (firebaseRTDb._initialized) {
            // set uid in the FirebaseRTDb class and handle database changes.
            firebaseRTDb.setUID(
              firebaseAuth.userId,
              (listData) => {
                this.handleSynchronization(listData, false, true);
                // let fbRTDbSquirrelList = data.list; // squirrel list
                // settingsConfig = data.config; // squirrel list generating settings.

                // // break up squirrel order string into array.
                // let fbRTDbSquirrelListArr = fbRTDbSquirrelList.split(",");
                // // this.$data.items = []; // <-- UNNEEDED
                // this.$data.items = makeSquirrelList(fbRTDbSquirrelListArr);
              },
              (listConfigData) => {
                this.handleSynchronization(listConfigData, true, false);
              }
            );
            let syncdSquirrelList = firebaseRTDb.oneShotListSync();
            // eslint-disable-next-line no-unused-vars
            let listConfigData = firebaseRTDb.oneShotListConfigSync();

            // this.handleSynchronization(listData, false, true);
            // this.handleSynchronization(listConfigData, true, false);

            console.log(syncdSquirrelList);
            this.$data.items = [];
            this.$data.items = makeSquirrelList(syncdSquirrelList);
          }
        });
      } else {
        let confirmSignOut = confirm("Are you sure you want to sign out?");
        if (confirmSignOut) {
          firebaseAuth.signOut(() => {
            console.debug("Signed out successfully");

            userProfilePic.src = "";
            userProfilePic.style.display = "none";
            document.getElementById("signInOutBtn").innerText = "Sign In";
          });
        }
      }
    },
    saveList() {
      let squirrels = [];
      for (let i = 0; i < this.$data.items.length; i++) {
        let squirrel = this.$data.items[i].squirrel;
        squirrels.push(squirrel);
      }

      if (firebaseAuth._initialized && !firebaseAuth.signedIn) {
        localStorage.setItem("sqrlList", squirrels.join(","));
      } else {
        // update firebase realtime database listing
        // console.log(
        //   firebaseAuth._initialized &&
        //     firebaseAuth.signedIn &&
        //     firebaseRTDb._initialized &&
        //     firebaseRTDb._uid != null
        // );
        // console.debug(firebaseAuth._initialized);
        // console.debug(firebaseAuth.signedIn);
        // console.debug(firebaseRTDb._initialized);
        // console.debug(firebaseRTDb._uid != null);

        if (
          firebaseAuth._initialized &&
          firebaseAuth.signedIn &&
          firebaseRTDb._initialized &&
          firebaseRTDb._uid != null
        ) {
          console.log("writeSquirrelList(squirrels.join(',')");
          firebaseRTDb.writeSquirrelList(squirrels.join(","));
        }
      }
    },
    newList() {
      this.$data.items = makeSquirrelList();
    },

    /** @method
     *  @param {SquirrelListSnapshotVal | ListConfig} snapshotVal The {@link SquirrelListSnapshotVal} snapshot value from database change listener.
     *  @param {boolean} syncConfigs If enabled, method will handle list config synchronization. False by default.
     *  @param {boolean} syncList If enabled, method will handle list synchronization. True by default.
     *  @returns void
     */
    // eslint-disable-next-line no-unused-vars
    handleSynchronization(snapshotVal, syncConfigs = false, syncList = true) {
      if (syncConfigs) {
        console.debug("Snapshot val: %o", snapshotVal);
        if (snapshotVal == null) return;
        settingsConfig = snapshotVal; //.listConfig;
        console.debug(settingsConfig);
        document.getElementById("numberOfSquirrels").value =
          settingsConfig.squirrelsPerDay;
        document.getElementById("nOSOutput").value =
          settingsConfig.squirrelsPerDay;
        document.getElementById("autoRemovePastDays").checked =
          settingsConfig.autoRemoveDays;
        document.getElementById("includeTeapotRat").checked =
          settingsConfig.includeTeapotRat;
      }
      if (syncList) {
        /** @type {SquirrelListSnapshotVal} */
        let fbRTDbSquirrelList = snapshotVal; // squirrel list
        console.warn(snapshotVal);
        // settingsConfig = data.config; // squirrel list generating settings.

        // break up squirrel order string into array.
        let fbRTDbSquirrelListArr = fbRTDbSquirrelList.list.split(",");
        // this.$data.items = []; // <-- UNNEEDED
        this.$data.items = makeSquirrelList(fbRTDbSquirrelListArr);
        // throw new NotYetImplementedError(301, "handleSynchronization", "App.vue");
      }
    },
    /* getSquirrelOrderAsArray() {
      for (let i = 0; i < this.$data.items)
      console.log(this.$data.items);
    }, */
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    settingsChanged = false;
    firebaseAuth = new FirebaseAuth();
    firebaseRTDb = new FirebaseRTDb();
    firebaseAuth.init(() => {
      // document.getElementById("signinStatus").innerText =
      // "Signed in as " + firebaseAuth.getBasicUserInfo().displayName;
      // document.getElementById("signInOutBtn").innerText = "Sign out";
      document.getElementById("signInOutBtn").innerText =
        firebaseAuth.getBasicUserInfo().displayName;
      /** @type {HTMLImageElement} */
      let userProfilePic = document.getElementById("userPP");

      userProfilePic.src = firebaseAuth.getBasicUserInfo().photoURL;
      userProfilePic.style.display = "block";
      firebaseRTDb.init(firebaseAuth._app);
      firebaseRTDb.setUID(
        firebaseAuth.userId,
        (listData) => {
          this.handleSynchronization(listData, false, true);
          // let fbRTDbSquirrelList = data.list;
          // let fbRTDbSquirrelListArr = fbRTDbSquirrelList.split(",");
          // // this.$data.items = [];
          // this.$data.items = makeSquirrelList(fbRTDbSquirrelListArr);
        },
        (listConfigData) => {
          this.handleSynchronization(listConfigData, true, false);
        }
      );
      // this.$data.items = firebaseRTDb.oneShotSync();
    });
    if (!firebaseRTDb._initialized) {
      // firebaseRTDb = new FirebaseRTDb();
      firebaseRTDb.init(firebaseAuth._app);
    }
    // clearListBtn = document.get("")

    if (firebaseAuth._initialized && !firebaseAuth.signedIn) {
      if (localStorage.getItem("sqrlList") != null) {
        let sqrlArr = localStorage.getItem("sqrlList").split(",");
        this.$data.items = makeSquirrelList(sqrlArr);
      } else {
        this.$data.items = makeSquirrelList();
      }
      if (localStorage.getItem("squirrelConfig") != null) {
        settingsConfig = JSON.parse(localStorage.getItem("squirrelConfig"));
        document.getElementById("numberOfSquirrels").value =
          settingsConfig.squirrelsPerDay;
        document.getElementById("nOSOutput").value =
          settingsConfig.squirrelsPerDay;
        document.getElementById("autoRemovePastDays").checked =
          settingsConfig.autoRemoveDays;
        document.getElementById("includeTeapotRat").checked =
          settingsConfig.includeTeapotRat;
      }
    } else {
      this.$data.items = makeSquirrelList();
    }
    // window.firebaseAuth = firebaseAuth;
    // window.firebaseRTDb = firebaseRTDb;
  },
};

function makeSquirrelList(sqrlArr) {
  let squirrelList;
  if (sqrlArr && Array.isArray(sqrlArr)) {
    squirrelList = sqrlArr;
  } else {
    squirrelList = shuffle(Squirrels);
  }
  let returnArray = [];
  let squirrelsPerDay = 2;
  let accumIndex = 0;
  for (let i = 0; i < squirrelList.length; i++) {
    returnArray.push({
      id: i,
      squirrel: squirrelList[i],
      day: getWeekdayName(Math.floor(accumIndex)),
      coordBody: SqueakBounds[squirrelList[i]].Body,
      coordTail: SqueakBounds[squirrelList[i]].Tail,
    });
    accumIndex += 1 / squirrelsPerDay;
  }
  return returnArray;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    // eslint-disable-next-line prettier/prettier
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getWeedDay() {
  let date = new Date();
  // return 420;
  return date.getDay();
  //let w =
}

function getWeekdayName(index) {
  let dayOffset = getWeedDay();
  let day = (dayOffset + index - 1) % 5;
  return Days[day];
}
</script>

<style>
@font-face {
  font-family: product-sans;
  src: url("./assets/productSans.woff2");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 16px;
  width: 355.555px;
  margin: auto;
}

#app .rowSquirrel {
  margin-bottom: 16px;
  font-family: "product-sans";
}

#app .todo {
  width: 100%;
  color: grey;
}

#storageBtns {
  display: flex;
  justify-content: space-between;
}

#btnLeft {
  float: left;
}

#btnRight {
  float: right;
}

.signin {
  position: fixed;
  bottom: 8px;
  right: 8px;
  justify-content: right;
  display: flex;
  background: #333342;
  border-color: tan;
}

.signin button {
  background-color: dodgerblue;
  color: black;
  outline: none;
  /* outline-color: transparent; */
  padding: 4pt;
  border: 1px solid transparent;
  box-shadow: none;
  border-radius: 4px;
  margin-right: 8px;
}

.signin #userPP {
  /* text-align: right; */
  width: 32px;
  height: 32px;
  background-size: 32px 32px;
  border-radius: 50%;
  display: none;
}

.todo::before {
  content: "TODO: ";
}

.copyright {
  width: 100%;
  color: grey;
}

.todo-card {
  width: 350;
  height: 350;
}

.todo-card-content {
  padding: 16px;
}

#settings {
  display: block;
  height: 0px;
  margin-bottom: 8px;
  transition: height 0.5s ease-out;
}

#settings > * {
  display: none;
}

@media (prefers-color-scheme: dark) {
  label,
  output {
    color: rgb(255, 255, 255);
  }
}
@media (prefers-color-scheme: light) {
  label,
  output {
    color: rgb(0, 0, 0);
  }
}
</style>
