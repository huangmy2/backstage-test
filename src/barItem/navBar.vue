<template>
  <div class="menuBar" v-if="routes && routes.length">
    <el-row class="tac">
        <el-col>
            <el-menu
                :default-active="currentRoute?currentRoute:'/videoList'"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#1b273b"
                text-color="#fff"
                :router="true"
                active-text-color="#ffd04b">
                <span v-for="(item, index) in routes" :key="index">
                  <el-submenu popper-append-to-body :index="item.path" v-show="!item.hidden && item.children && item.children.length && item.children.length > 1">
                    <template slot="title">
                        <Icons icon="stock" :title="item.meta && item.meta.title"/>
                    </template>
                    <span v-for="item1 in item.children" :key="item1.name" >
                      <el-submenu  popper-append-to-body :index="item1.meta.title" v-if="!item1.hidden && item1 && item1.children && item1.children.length">
                          <template slot="title">
                            <!-- 二级菜单 -->
                            <Icons :icon="item1.meta.icon" :title="item1.meta && item1.meta.title"/>
                          </template>
                          <span v-for="item2 in item1.children" :key="item2.name">
                            <el-menu-item :index="item2.path" v-if="!item2.hidden">
                              <!-- 三级菜单 -->
                              <template slot="title" >
                                <Icons :icon="item2.meta.icon" :title="item2.meta && item2.meta.title"/>
                              </template>
                            </el-menu-item>
                          </span>
                      </el-submenu>
                      <el-menu-item :index="item1.path" v-if="!item1.hidden && (!item1.children || !item1.children.length)">
                        <Icons :icon="item1.meta.icon" :title="item1.meta && item1.meta.title"/>
                      </el-menu-item>
                    </span>
                  </el-submenu>
                  <el-menu-item :index="item.path" v-show="!item.hidden && (!item.children || !item.children)">
                    <Icons icon="stock" :title="item.meta && item.meta.title"/>
                  </el-menu-item>
                </span>
            </el-menu>
        </el-col>
    </el-row>
    <!-- <div class="outLogin" >
      <span class="name">{{username}}</span>
      <img src="../assets/outlogin.png" @click="loginOut" alt="">
    </div> -->
  </div>
</template>

<script>
import Icons from './icon.vue'
export default {
  name: 'navBar',
  data () {
    return {
      currentPath: '',
      currentRoute: this.$route.fullPath
    }
  },
  props: ['routes'],
  components: {
    Icons
  },
  mounted () {
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log(route)
        // 转评赞页面显示一级菜单
        this.currentRoute = this.$route.fullPath.indexOf('transfer') > 0 ? '/' : route.path
        if (!route.name) {
          this.$router.push(`/videoList`)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar{display:none;}
.menuBar{
  width: 210px;
  height: 100vh;
  overflow: auto;
  display: inline-block;
  background: #1b273b;
  -moz-box-shadow: 1px 5px 15px #e4e4e4;
  box-shadow: 1px 5px 15px #e4e4e4;
  z-index: 10;
  position: relative;
}
.el-menu{
  border-right: none;
}
</style>
