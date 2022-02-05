<template>
  <button
    v-if="iconOnly == false"
    class="iconButton iconText"
    @click="$emit('click', $event)"
  >
    <img
      v-if="showIcon == true"
      class="icon"
      :src="iconSrc"
      width="16"
      height="16"
      @click="$"
    />
    <span class="text">{{ text }}</span>
  </button>
  <button
    v-if="iconOnly == true"
    class="iconButton iconOnly"
    @click="$emit('click', $event)"
  >
    <img class="icon" :src="iconSrc" width="16" height="16" />
    <!-- <span class="text">{{ text }}</span> -->
  </button>
</template>

<script>
export default {
  name: "Test",
  created() {},
  data() {
    return {};
  },
  props: {
    showIcon: Boolean,
    iconOnly: Boolean,
    iconSrc: String,
    text: String,
  },
  methods: {},
};
</script>

<style>
.iconText {
  width: 170px;
}

.iconOnly {
  width: 48px;
  margin-left: unset;
}

.iconOnly > .icon {
  margin-left: 0px;
  margin-right: auto;
}
.iconButton {
  border-radius: 7px;
  font-family: product-sans;
  outline: none;
  border: 1px solid black;
  margin-bottom: 8px;
  height: 32px;
  background-color: peachpuff;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-user-select: none;
  -moz-user-select: -moz-none;
  /*IE10*/
  -ms-user-select: none;
  user-select: none;

  /*You just need this if you are only concerned with android and not desktop browsers.*/
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.iconButton:hover {
  background-color: #e7c1a0;
  transition-property: background-color;
  transition-duration: 0.3s;
}
.iconButton .icon {
  margin-left: auto;
}

.iconButton .text {
  width: 100px;
  margin-right: auto;
}
</style>
