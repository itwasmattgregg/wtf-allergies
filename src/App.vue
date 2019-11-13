<template>
  <div id="app">
    <img :src="pollen" height="150" alt="fucking allergies" />
    <h1>WTF Allergies</h1>
    <router-view />
  </div>
</template>

<script>
import pollen from "./assets/pollen.jpg";

export default {
  data() {
    return {
      pollen
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
