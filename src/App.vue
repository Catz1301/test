<template>
  <!-- <img alt="Vue logo" style="width: 350px" src="./assets/logo.png" />  <- We may use this, who knows? -->
  <div id="squirrels">
    <row-squirrel
      v-for="sqrl in items"
      :key="sqrl.id"
      :sqrlname="sqrl.squirrel"
      :day="sqrl.day"
    />
    <row-squirrel sqrlname="Pathetic Rat" day="Thursday" />
    <p class="todo">Add pictures for each squirrel and chipmunk.</p>
  </div>
</template>

<script>
import RowSquirrel from "./components/RowSquirrel.vue";
import Squirrels from "./Squirrels.js";
import Days from "./Days.js";

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
  created() {
    this.$data.items = makeSquirrelList();
  },
};

function makeSquirrelList() {
  let squirrelList = shuffle(Squirrels);
  let returnArray = [];
  let squirrelsPerDay = 2;
  let accumIndex = 0;
  for (let i = 0; i < squirrelList.length; i++) {
    returnArray.push({
      id: i,
      squirrel: squirrelList[i],
      day: getWeekdayName(Math.floor(accumIndex)),
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 16px;
}
#app .todo {
  width: 100%;
  text-align: center;
  color: grey;
}

.todo::before {
  content: "TODO: ";
}
</style>
