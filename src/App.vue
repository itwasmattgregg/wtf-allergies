<template>
  <div id="app">
    <h1>WTF Allergies</h1>
    <h2>Find out which allergies are gonna fuck up your day!</h2>
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
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  min-height: 100vh;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  background: darkslategray;
  justify-content: center;
}
</style>
