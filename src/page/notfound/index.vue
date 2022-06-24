<template>
  <div class="notfound">
    <div class="notimg">
      <img src="../../assets/404_images/404image.png" alt="">
      <div><span class="backbtn" @click="backHome()">返回</span></div>
      <div class="text">页面不存在，{{second}} 秒之后将返回上一页...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notfound',
  data () {
    return {
      second: 5
    }
  },
  mounted () {
    let timer = setInterval(res => {
      if (this.second <= 0) {
        clearInterval(timer)
        this.backHome()
      }
      this.second--
    }, 1000)
  },
  methods: {
    backHome () {
      window.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.notimg{
  width: 100%;
  text-align: center;
  div{
    width: 100%;
    text-align: center;
    .backbtn{
      cursor: pointer;
      border: 1px solid #345490;
      color: #345490;
      padding: 5px 28px;
      border-radius: 30px;
    }
    .backbtn:hover{
      border: 1px solid #fff;
      color: #fff;
      padding: 4px 28px;
      background: #345490;
      border-radius: 30px;
    }
  }
  .text{
    color: #464646;
    font-size: 16px;
    margin-top: 35px;
  }
}
</style>
