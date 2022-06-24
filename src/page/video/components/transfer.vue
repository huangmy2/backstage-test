<template>
  <div>
    <!-- <span>标题</span>
    <el-input class="desc" type="text" v-model="title" disabled></el-input>

    <div class="comment">
      <span>评论</span>
      <el-input class="desc" type="text" v-model="comment_content"></el-input>
      <el-button class="sure" type="danger" @click="ensure('add')">添加</el-button>
    </div> -->
    <el-form label-width="50px" class="demo-ruleForm">
      <el-form-item label="标题" prop="name">
        <el-input v-model="title" style="width:30%" disabled></el-input>
      </el-form-item>
      <el-form-item label="评论" prop="name">
        <el-input v-model="comment_content" style="width:30%"></el-input>
        <el-button class="sure" type="danger" @click="ensure('add')" :loading="addButton">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="up">
      <span class="up-current">当前点赞</span><span class="up-number">{{up}}</span>
      <el-input class="up-in" v-model="upnew" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
      <el-button type="success" @click="ensure('up')">修改</el-button>
    </div>

    <div class="up">
      <span class="up-current">当前转发</span><span class="up-number">{{transferCrrrent}}</span>
      <el-input class="up-in" v-model="transfer" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
      <el-button type="success" @click="ensure('transfer')">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      comment_content: '',
      up: 0,
      upnew: 0,
      transfer: 0,
      transferCrrrent: 0,
      pageFlag: 1,
      media_id: 0,
      ids: 0,
      formData: {},
      addButton: false
    }
  },

  created () {
    this.media_id = this.$route.query.id
    this.getData()
  },

  methods: {
    ensure (val) {
      if (val === 'add') {
        this.addButton = true
        if (this.comment_content) {
          let params = {
            media_id: parseInt(this.media_id),
            up_num: parseInt(this.upnew),
            share_num: parseInt(this.transfer),
            comment_content: this.comment_content
          }
          let paramHandle = {}
          for (const key in params) {
            if (params[key]) {
              paramHandle[key] = params[key]
            }
          }
          this.$axios.post('/admin/addMediaComentUpShare', paramHandle).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$message.success('添加成功')
              // 添加成功自动置空
              this.comment_content = ''
              this.addButton = false
              this.getData()
            } else {
              this.addButton = false
              this.$message.warning(res.data.message)
            }
          })
        } else {
          this.addButton = false
          this.$message.warning('请输入内容')
        }
      } else {
        if (val === 'transfer' && this.transfer === this.transferCrrrent) {
          this.$message.warning('当前转发无变化')
          return
        }
        if (val === 'up' && this.up === this.upnew) {
          this.$message.warning('当前点赞无变化')
          return
        }
        let params = {
          media_id: parseInt(this.media_id),
          up_num: parseInt(this.upnew),
          share_num: parseInt(this.transfer)
        }
        let paramHandle = {}
        for (const key in params) {
          if (params[key]) {
            paramHandle[key] = params[key]
          }
        }
        this.$axios.post('/admin/addMediaComentUpShare', paramHandle).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('修改成功')
            this.upnew = 0
            this.transfer = 0
            this.getData()
          } else {
            this.$message.warning(res.data.message)
          }
        })
      }
    },

    getData () {
      this.$axios.get(`/admin/getMediaInfos?ids=${this.media_id}`).then((res) => {
        console.log(res)
        this.formData = res.data.data.list[0] || {}
        this.up = this.formData.up_cnt
        // this.upnew = this.formData.up_cnt
        this.transferCrrrent = this.formData.share_cnt
        // this.transfer = this.formData.share_cnt
        this.title = this.formData.title
      })
    }
  }
}
</script>

<style lang="less" scoped>
.desc {
  width: 40%;
  margin-top: 20px;
  margin-left: 8px;
}
.up {
  width: 80%;
  margin-top: 20px;
  margin-left: 8px;
  font-size: 25px;
  &-current {
    margin-right: 40px;
  }
  &-in {
    width: 10%;
    margin-left: 2%;
  }
  &-add {
    display: inline-block;
    margin-left: 40px;
    border: 1px solid red;
    width: 40px;
    height: 38px;
    text-align: center;
    padding: -4px 0;
    color: #fff;
    background: red;
    border-radius: 30px;
    cursor: pointer;
  }
  &-number {
    display: inline-block;
    width: 30px;
  }
}
.comment {
  display: flex;
  .sure {
    margin-left: 20px;
    margin-top: 20px;
    height: 40px;
  }
}
</style>
