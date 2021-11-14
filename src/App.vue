<template>
  <!-- <img alt="Vue logo" style="width: 350px" src="./assets/logo.png" />  <- We may use this, who knows? -->
  <div id="squirrels">
    <div id="storageBtns">
      <button @click="saveList()" class="storageBtn" id="btnLeft">
        Save List
      </button>
      <button @click="clearList()" class="storageBtn" id="btnRight">
        Clear List
      </button>
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
    <p class="todo">
      Add picture maps that play the squirrel's squeak sound when clicked on.
    </p>
  </div>
</template>

<script>
import RowSquirrel from "./components/RowSquirrel.vue";
import Squirrels from "./Squirrels.js";
import SqueakBounds from "./SqueakBounds.js";
import Days from "./Days.js";
import "./assets/productSans.woff2";

export default {
  name: "App",
  components: {
    RowSquirrel,
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    saveList() {
      let squirrels = [];
      for (let i = 0; i < this.$data.items.length; i++) {
        let squirrel = this.$data.items[i].squirrel;
        squirrels.push(squirrel);
      }
      // this.getSquirrelOrderAsArray();
      localStorage.setItem("sqrlList", squirrels.join(","));
    },
    clearList() {
      localStorage.clear();
    },
    /* getSquirrelOrderAsArray() {
      for (let i = 0; i < this.$data.items)
      console.log(this.$data.items);
    }, */
  },
  created() {
    if (localStorage.getItem("sqrlList") != null) {
      let sqrlArr = localStorage.getItem("sqrlList").split(",");
      this.$data.items = makeSquirrelList(sqrlArr);
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

.storageBtn {
  border-radius: 7px;
  font-family: product-sans;
  outline: none;
  border: 1px solid black;
  width: 170px;
  margin-bottom: 8px;
  height: 32px;
  background-color: peachpuff;
  /* display: flexbox; */
}

#btnLeft {
  float: left;
}

#btnRight {
  float: right;
}

.todo::before {
  content: "TODO: ";
}
</style>
