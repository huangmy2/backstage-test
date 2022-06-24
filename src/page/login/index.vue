<template>
    <div class="login">
      <el-form :model="ruleForm" :prop="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="login-form">
          <h3 class="login-tit">Welcome Login</h3>
          <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model.number="ruleForm.phoneNumber"></el-input>
          </el-form-item>
          <div class="password-content">
            <el-form-item label="验证码" prop="codeNumber" class="pass-code">
                <el-input v-model="ruleForm.codeNumber"></el-input>
            </el-form-item>
            <span @click="getCode" class="get-code-btn" v-if="!count">获取验证码</span>
            <span class="get-code-btn resend" v-else>重新发送{{count}}</span>
          </div>
          <span @click="handleLogin('ruleForm')" class="login-btn">登录</span>
      </el-form>
    </div>
</template>
<script>
export default {
  data () {
    var checkPhoneNumber = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          return callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      count: 0,
      redirect: undefined,
      loading: false,
      ruleForm: {
        codeNumber: '',
        phoneNumber: ''
      },
      rules: {
        codeNumber: [
          { validator: validateCode, trigger: 'blur' }
        ],
        phoneNumber: [
          { validator: checkPhoneNumber, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    getCode () { // 获取验证码
      if (!this.ruleForm.phoneNumber) {
        this.$message.error('请输入正确手机号')
        return false
      }
      this.$axios.get(`/admin/smsSend?phone=${this.ruleForm.phoneNumber}`).then((res) => {
        console.log(res)
        let data = res.data
        if (data.code === 0) {
          this.$message({
            message: '获取验证码成功',
            type: 'success'
          })
          this.count = 60
          const timer = setInterval(() => {
            this.count--
            if (this.count <= 0) {
              clearInterval(timer)
            }
          }, 1000)
        } else {
          this.$message.error('获取验证码失败')
        }
      })
    },
    handleLogin (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('审核通过，登录成功！！！')
          this.loading = true
          this.$store.dispatch('user/Login', this.ruleForm).then((res) => {
            if (res === 'loginSuccess') {
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({ path: this.redirect || '/' })
              }, 1000)
            } else {
              this.$message.error(res)
            }
            this.loading = false
          }).catch((data) => {
            console.log(data)
            this.$message.error(data)
            this.loading = false
          })
        } else {
          console.log('登录失败！！！error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  *{
    margin:0;
    padding:0;
  }
  html,body{
    width: 100%;
    height: 100%;
  }
  #app{
    width: 100%;
    height: 100%;
  }
  .login{
    width: 100%;
    height: 100%;
    background:#2d3a4b;
    /* background: #315e3c; */
  }
  .login-tit{
    font-size: 26px;
    text-align: center;
    font-weight: 700;
    color: #fff;
    margin-bottom: 20px;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 35px 0;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
  }
  .el-form-item__label{
    color: #fff;
    font-weight: bold;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #000;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .password-content{
    position: relative;
  }
  .pass-code{
    width: 360px;
  }
  .login-btn{
    width: 520px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    margin: 40px auto 0;
    display: block;
    color: #fff;
    background: #409eff;
    border: 1px solid #409eff;
  }
  .login-btn:visited,.get-code-btn:visited,.login-btn:hover,.get-code-btn:hover{
    cursor: pointer;
  }
  .get-code-btn{
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 6px;
    font-size: 14px;
    color: #fff;
    background: #409eff;
    border: 1px solid #409eff;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .resend{
    width: 120px;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 14px;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    text-align: center;
    cursor:initial !important;
  }
</style>
