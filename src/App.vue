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
        @click="newList()"
        :iconSrc="require('./assets/clear_icon.webp')"
        text="New List"
        showIcon
      />
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
import Squirrels from "./Squirrels.js";
import SqueakBounds from "./SqueakBounds.js";
import Days from "./Days.js";
import "./assets/productSans.woff2";
import { FirebaseAuth } from "./FirebaseAuth.js";
import { FirebaseRTDb } from "./FirebaseRTDb";
// import firebase from "firebase/compat/app";

/** @type {FirebaseAuth} */
var firebaseAuth;
var firebaseRTDb;

// var clearListBtn;

export default {
  name: "App",
  components: {
    RowSquirrel,
    ButtonIcon,
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
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
            firebaseRTDb.setUID(firebaseAuth.userId, (data) => {
              let fbRTDbSquirrelList = data.list;
              let fbRTDbSquirrelListArr = fbRTDbSquirrelList.split(",");
              // this.$data.items = []; // <-- UNNEEDED
              this.$data.items = makeSquirrelList(fbRTDbSquirrelListArr);
            });
            let syncdSquirrelList = firebaseRTDb.oneShotSync();
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
    /* getSquirrelOrderAsArray() {
      for (let i = 0; i < this.$data.items)
      console.log(this.$data.items);
    }, */
  },
  created() {
    // eslint-disable-next-line no-unused-vars
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
      firebaseRTDb.setUID(firebaseAuth.userId, (data) => {
        let fbRTDbSquirrelList = data.list;
        let fbRTDbSquirrelListArr = fbRTDbSquirrelList.split(",");
        // this.$data.items = [];
        this.$data.items = makeSquirrelList(fbRTDbSquirrelListArr);
      });
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
    } else {
      this.$data.items = makeSquirrelList();
    }
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
</style>
