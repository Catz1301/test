<template>
  <div class="RowSquirrel">
    <p class="rowText">{{ day }}: {{ sqrlname }}</p>
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
  },
  methods: {},
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
</style>
