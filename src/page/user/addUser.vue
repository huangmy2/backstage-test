<template>
  <div class="add-user">
    <el-card>
        <el-form ref="form" :model="formData" label-width="85px" class="height-css">
        <el-form-item required label="新建昵称" label-width="85px">
          <el-input
            type="text"
            placeholder="请输入昵称"
            v-model="formData.nickname">
          </el-input>
        </el-form-item>
        <el-form-item required label="上传头像"  label-width="85px">
              <div class="video-img-upload">
                <el-upload
                  class="upload-demo"
                  action="https://admin.doujinchaogu.com/admin/uploadImg"
                  :on-success="posterUpSuccess"
                  :on-error="posterError"
                  :on-remove="posterRemove"
                  :on-exceed="posterExceed"
                  :before-upload="beforeAvatarUpload"
                  list-type="picture-card"
                  :multiple="false"
                  :limit="1"
                  :file-list="fileList">
                  <span>+</span>
                </el-upload>
              </div>
              <div class="tips">仅支持JPG、PNG格式，且小于2MB</div>
        </el-form-item>
        <el-form-item label="角色"  label-width="85px">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              key="creator"
              label="创作者"
              value="creator">
            </el-option>
            <el-option
              key="robot"
              label="机器人"
              value="robot">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="85px">
          <el-button round type="primary" @click="submit()">新建账号</el-button>
        </el-form-item>
       </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'addUser',
  data () {
    return {
      fileList: [],
      formData: {
        nickname: '',
        avatar: '',
        type: 'creator'
      }
    }
  },
  methods: {
    // 上传封面图成功回调
    posterUpSuccess (res) {
      if (res.code === 0) {
        console.log(res)
        this.formData.avatar = res.data[0].url
      }
    },
    // 删除封面图回调，选中智能封面第一个
    posterRemove (res) {
      this.formData.avatar = ''
    },
    // 上传封面图失败回调
    posterError (res) {
      this.$message.error('上传封面图失败，请重新上传')
    },
    posterExceed (res) {
      console.log(res)
      this.$message.error('只允许上传一个文件，请删除之前的再重新上传')
    },
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('请上传jpg/png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不要超过2MB')
      }
      return isJPG && isLt2M
    },
    submit () {
      if (!this.formData.nickname) {
        this.$message.error('请输入昵称')
        return
      }
      if (!this.formData.avatar) {
        this.$message.error('请选择头像')
        return
      }
      let params = JSON.stringify(this.formData)
      this.$axios.post(`/admin/addUser`, params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('上传成功')
          this.$router.push(`/userList`)
        }
      })
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
html body {
  height: 100%;
}
.add-user {
    .el-input {
        width: 330px;
    }
    .tips {
        color: #999;
        font-size: 12px;
    }
}
</style>
