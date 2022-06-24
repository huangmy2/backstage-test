<template>
  <div id="app">
    <!-- <navBar/> -->
      <router-view/>
  </div>
</template>

<script>
import navBar from './barItem/navBar.vue'
import headerTop from './barItem/headerTop.vue'
export default {
  name: 'App',
  components: {
    navBar, headerTop
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
}
</style>
