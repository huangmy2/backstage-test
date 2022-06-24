<template>
  <div class="headerTitle">
    <span class="titleSpan">
      {{currentTitle}}
    </span>
    <span class="userinfo">{{username}}<img src="../assets/out_login.png" alt="退出登录" @click="loginOut"></span>
    <!-- <el-breadcrumb>
        <el-breadcrumb-item>{{currentTitle}}</el-breadcrumb-item>
    </el-breadcrumb> -->
  </div>
</template>

<script>
export default {
  name: 'navBar',
  data () {
    return {
      currentTitle: '',
      username: this.$store.state.user.name || ' '
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.currentTitle = route.meta.title || '列表'
      },
      immediate: true
    }
  },
  methods: {
    async loginOut () {
      await this.$store.dispatch('user/logout')
      let routeParam = ''
      if (this.$route.fullPath && this.$route.fullPath !== '/') {
        routeParam = `?redirect=${this.$route.fullPath}`
      }
      this.$router.push(`/login${routeParam}`)
      sessionStorage.removeItem('usertoken')
    }
  }
}
</script>

<style lang="less" scoped>
.headerTitle {
  margin: 8px;
  font-weight: 700;
  padding: 12px 16px 12px 25px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(235, 235, 235, 0.1);
  background-color: #ffffff;
  color: #333;
  .titleSpan {
    display: inline-flex;
    align-items: center;
  }
  .titleSpan:before {
    content: " ";
    width: 3px;
    height: 12px;
    border-radius: 2px;
    margin-right: 6px;
    background: #3e5f8a;
  }
  .userinfo {
    color: #6d6d6d;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    img {
      width: 20px;
      height: 18px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
}
</style>
