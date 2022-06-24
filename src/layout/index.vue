<template>
  <div id="layout">
    <navBar :routes="routes"/>
    <div class="content">
      <headerTop/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import navBar from '../barItem/navBar.vue'
import headerTop from '../barItem/headerTop.vue'
export default {
  name: 'layout',
  components: {
    navBar, headerTop
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  }
}
</script>

<style scoped>
#layout{
    width: 100%;
    display: flex;
}
.content{
  display: inline-block;
  width: calc(100% - 210px);
  background: #f8f8f8;
  box-sizing: border-box;
}
</style>
