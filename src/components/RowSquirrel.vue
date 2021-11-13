<template>
  <div class="RowSquirrel">
    <p class="rowText">{{ day }}: {{ sqrlname }}</p>
    <img
      class="squirrelImg"
      :src="'/img/' + sqrlname + '.jpg'"
      :usemap="'#squirrel_' + sqrlname.replace(' ', '_') + 'ImgMap'"
    />
    <map
      :name="'squirrel_' + sqrlname.replace(' ', '_') + 'ImgMap'"
      :id="sqrlname + 'Map'"
    >
      <area
        id="areaBody"
        :alt="'Squeak ' + sqrlname + '\'s body!'"
        @click="squeakBody()"
        :title="'Squeak ' + sqrlname + '\'s body!'"
        :coords="coordBody"
        shape="polygon"
      />
      <area
        id="areaTail"
        :alt="'Squeak ' + sqrlname + '\'s tail!'"
        @click="squeakTail()"
        :title="'Squeak ' + sqrlname + '\'s tail!'"
        :coords="coordTail"
        shape="polygon"
      />
    </map>
  </div>
</template>

<script>
import { Howl } from "../howler.js";

export default {
  name: "Test",
  created() {},
  data() {
    return {};
  },
  props: {
    sqrlname: String,
    day: String,
    coordBody: String,
    coordTail: String,
  },
  methods: {
    say(str) {
      alert(str);
    },
    squeakBody() {
      console.log(this.$props);
      let sound = new Howl({
        src: [`/snd/Body/${this.$props.sqrlname}.m4a`],
      });
      sound.play();
    },
    squeakTail() {
      // alert("Tail Squeaked!");
      let sound = new Howl({
        src: [`/snd/Tail/${this.$props.sqrlname}.m4a`],
      });
      sound.play();
    },
  },
};
</script>

<style>
.rowText {
  box-sizing: border-box;
  background-color: aquamarine;
  width: 100%;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 6px;
  border-radius: 10px;
  margin: 0px;
  margin-bottom: 4px;
}

.squirrelImg {
  height: 200px;
}
</style>
