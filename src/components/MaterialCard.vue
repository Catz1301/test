<template>
  <div class="mdc-card">
    <div class="mdc-mdl-card__supporting-text">This is some text</div>
  </div>
</template>

<script>
import { MDCRipple } from "@material/ripple";
// import { MDCCard } from "@material/card";

const selector = ".mdc-button, .mdc-icon-button, .mdc-card__primary-action";
// eslint-disable-next-line no-unused-vars
const ripples = [].map.call(
  document.querySelectorAll(selector),
  (el) => new MDCRipple(el)
);
export default {
  name: "Test",
  created() {},
  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@use "@material/card";

@include card.core-styles;
</style>
