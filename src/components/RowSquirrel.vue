<template>
  <div class="RowSquirrel">
    <p class="rowText">{{ day }}: {{ sqrlname }}</p>
    <img
      class="squirrelImg"
      :src="'/img/' + sqrlname + '.jpg'"
      usemap="#squirrelImgMap"
    />
    <map name="squirrelImgMap">
      <!-- eslint-disable-next-line prettier/prettier -->
      <area
        shape="rect"
        coords="0,0,175,200"
        @click="say('meow');"
        alt=""
      />
      <area
        id="areaBody"
        :alt="'Squeak ' + sqrlname"
        @click="squeakBody()"
        title="Squeak Defect Rat"
        coords=""
        shape="polygon"
      />
      <area shape="rect" coords="176,0,355,200" @click="say('woof')" alt="" />
    </map>
  </div>
</template>

<script>
export default {
  name: "Test",
  created() {},
  data() {
    return {};
  },
  props: {
    sqrlname: String,
    day: String,
    // coord: String,
  },
  methods: {
    say(str) {
      alert(str);
    },
  },
};
</script>

<style>
.rowText {
  box-sizing: border-box;
  background-color: aquamarine;
  width: 355.555px;
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
