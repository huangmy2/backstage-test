<template>
  <div class="pushpage">
    <div class="form">
      <el-input v-model="title" placeholder="标题"></el-input>
      <el-input v-model="content" placeholder="内容"></el-input>
      <el-input v-model="videoid" placeholder="视频关联(输入视频ID)"></el-input>
      <div class="radio">
        <el-radio-group v-model="radio">
          <el-radio :label="1">全局</el-radio>
          <el-radio :label="2">新手</el-radio>
        </el-radio-group>
      </div>
      <el-button @click="submit" style="margin-left:40px;margin-top:50px;width:90px" type="danger">提交</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div>
        <span>标题:</span>
        <span>{{title}}</span>
      </div>
      <div>
        <span>内容:</span>
        <span>{{content}}</span>
      </div>
      <div>
        <span>视频:</span>
        <span>{{videoInfo && videoInfo.length ? videoInfo[0].title : '未搜索到相关信息'}}</span>
      </div>
      <div>
        <span>范围:</span>
        <span>{{radio == 1 ? '全局' : '新手'}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="ensure">确认推送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: 1,
      dialogVisible: false,
      title: '',
      content: '',
      videoid: '',
      videoInfo: []
    }
  },
  methods: {
    submit () {
      if (this.title === '' || this.content === '' || this.videoid === '' || this.radio === '') {
        this.$message({
          message: '表单项需填写完整',
          type: 'warning'
        })
        return
      }
      this.$axios.get(`/admin/getMediaInfos?ids=${this.videoid}`).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.videoInfo = res.data.data.list
          this.dialogVisible = true
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    ensure () {
      this.$axios.post('/admin/push', {
        type: 1,
        relate_id: this.videoid,
        range: this.radio,
        title: this.title,
        content: this.content
      }).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message({
            message: '新建推送成功',
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="less">
.pushpage {
  .el-input {
    width: 30%;
    margin-top: 10px;
    display: block;
    margin-left: 40px;
  }
}
</style>
<style lang="less" scoped>
.form {
  display: block;
}
.radio {
  margin-left: 40px;
  margin-top: 10px;
}
</style>
