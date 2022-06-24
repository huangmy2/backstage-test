<template>
  <div class="add-video">
    <el-card>
      <el-form ref="form" :model="formData" label-width="85px" class="height-css">
        <el-form-item label="" label-width="85px">
          <div class="videoChoose">
            <el-button class="seeBtn" type="primary" round size="small">选择视频<i class="el-icon-upload el-icon--right"></i></el-button>
            <input class="hideBtn" type="file" value="选择视频" id="currentVideo" @change="getFile($event)">
            <span class="fileName">{{fileName || '未选择任何文件'}}</span>
            <span v-if="fileName" @click="deleteFile"><i class="el-icon-circle-close"></i> </span>
          </div>
          <el-progress v-if="showProcess" class="progress" :percentage="percentage"></el-progress>
        </el-form-item>
        <el-form-item required label="视频封面"  label-width="85px" v-if="showPoster">
          <div class="video-image" v-loading="loadingPoster" element-loading-text="获取智能封面候选中...">
            <div class="video-img-result">
              <img :src="formData.cover" alt="">
            </div>
            <div class="video-img-right">
              <p v-if="posterArr && posterArr.length">智能封面候选<span>（您可以从智能封面候选中选择一张作为封面）</span></p>
              <div class="video-img-demo" v-if="posterArr && posterArr.length">
                <div :class="item == formData.cover ? 'video-img-dom poster-active':'video-img-dom'" v-for="item in posterArr" :key="item" @click="formData.cover = item">
                  <img :src="item" alt="">
                  <span class="poster-cur-icon" v-if="item == formData.cover">✔</span>
                </div>
              </div>
              <p>自定义封面<span>（您也可以上传自定义封面，仅支持JPG、PNG格式、且小于2MB）</span></p>
              <div class="video-img-upload">
                <el-upload
                  class="upload-demo"
                  action="https://admin.doujinchaogu.com/admin/uploadImg"
                  :on-success="posterUpSuccess"
                  :on-error="posterError"
                  :on-remove="posterRemove"
                  :on-exceed="posterExceed"
                  :on-preview="posterClick"
                  :before-upload="beforeAvatarUpload"
                  :multiple="false"
                  :limit="1"
                  :file-list="fileList">
                  <span>上传封面图</span>
                </el-upload>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item required label="配文输入"  label-width="85px">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入配文"
            v-model="formData.title">
          </el-input>
        </el-form-item>
        <el-form-item label="股票基金">
          <el-select
            v-model="formData.stocks"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in searchInfo"
              :key="item.code"
              :label="item.name + '-' + item.code"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="类目选择">
           <div>
            <el-radio-group v-model="formData.category" size="small">
              <el-radio-button label="1">资讯</el-radio-button>
              <el-radio-button label="2">观点</el-radio-button>
              <el-radio-button label="3">研报&预测</el-radio-button>
              <el-radio-button label="4">科普</el-radio-button>
              <el-radio-button label="5">日常</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group v-model="formData.prescription" size="small">
              <el-radio-button label="1">时效</el-radio-button>
              <el-radio-button label="2">非时效</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group v-model="formData.stock_type" size="small">
              <el-radio-button label="1">股票大盘</el-radio-button>
              <el-radio-button label="2">股票个股</el-radio-button>
              <el-radio-button label="3">基金</el-radio-button>
              <el-radio-button label="4">其他</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <el-radio-group v-model="formData.identity" size="small">
              <el-radio-button label="1">新手</el-radio-button>
              <el-radio-button label="2">非新手</el-radio-button>
              <el-radio-button label="3">通用</el-radio-button>
            </el-radio-group>
          </div>
          <div>
              <el-checkbox-group v-model="formData.quality" size="small">
                <el-checkbox-button>优质</el-checkbox-button>
              </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="权重调整">
          <el-select v-model="formData.weight" clearable placeholder="请选择权重" size="medium">
            <el-option label="Top 1" value=1></el-option>
            <el-option label="Top 3" value=3></el-option>
            <el-option label="Top 5" value=5></el-option>
            <el-option label="Back 10" value=-10></el-option>
            <el-option label="Back 30" value=-30></el-option>
            <el-option label="Back 100" value=-100></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="账号选择" filterable label-width="85px">
          <el-select
            v-model="formData.user_id"
            multiple
            filterable
            reserve-keyword
            placeholder="请选择发布账号"
            :multiple-limit="1"
            :filter-method="remoteUser"
            :loading="loadingUser"
            @change="clearUser()">
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" label-width="85px">
          <el-radio-group v-model="submitType" size="medium">
            <el-radio :label="1" border>立即发布</el-radio>
            <el-radio :label="2" border>定时发布</el-radio>
            <span class="sub-time" v-if="submitType == 2">
              <el-date-picker
                v-model="formData.pub_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择发布日期时间"
                size="medium">
              </el-date-picker>
            </span>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" label-width="85px">
          <el-button round type="primary" @click="submit()"> 发 布 </el-button>
        </el-form-item>
       </el-form>
    </el-card>
  </div>
</template>

<script>
import TTUploader from 'tt-uploader'
export default {
  name: 'addVideo',
  data () {
    return {
      fileList: [],
      formData: {
        vid: '',
        height: '',
        width: '',
        title: '',
        category: 1,
        prescription: 1,
        stock_type: 1,
        identity: 1,
        stocks: [],
        weight: '',
        user_id: '',
        cover: '',
        pub_time: '',
        quality: false
      },
      threeUser: '',
      submitType: 1,
      userOptions: [],
      dynamicTags: [],
      showProcess: false,
      percentage: 0,
      stockBind: '',
      fileName: '',
      uploader: null,
      restaurants: {},
      token: '',
      searchInfo: [],
      userInfo: [],
      loading: false,
      loadingUser: false,
      showPoster: false,
      posterArr: [],
      posterTimer: {},
      loadingPoster: true,
      timeDelate: false
    }
  },
  created () {
    this.getToken()
  },
  mounted () {
    // 初始化TTUploader
    this.uploader = new TTUploader({
      userId: '339993',
      appId: 210426,
      videoConfig: {
        spaceName: 'd-sport' // 在视频点播中申请的点播空间名
      }
    })
  },
  methods: {
    // 上传视频
    getFile ($event) {
      console.log($event)
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov', 'video/quicktime'].indexOf($event.target.files[0].type) === -1) {
        this.$message.error('上传失败，请上传正确的视频格式')
        return false
      }
      let fileAuth = $event.target.files[0]
      let tokenObj = {
        AccessKeyID: this.token.access_key_id,
        SecretAccessKey: this.token.secret_access_key,
        SessionToken: this.token.session_token,
        ExpiredTime: this.token.expired_time,
        CurrentTime: this.token.current_time
      }

      let fileKey = this.uploader.addFile({
        file: fileAuth,
        stsToken: tokenObj, // 从服务端拿到的token
        type: 'video' // 上传文件类型，三个可选值：video(视频或者音频，默认值)，image(图片)，object（普通文件）
      })
      // 监听视频上传 完成 报错 进度
      this.uploader.on('complete', (infor) => {
        console.log('complete')
        this.showProcess = false
        this.fileName = $event.target.files[0].name
        this.formData.vid = infor.uploadResult.Vid
        this.formData.width = infor.uploadResult.SourceInfo.Width
        this.formData.height = infor.uploadResult.SourceInfo.Height
        this.getVideoPoster(this.formData.vid)
        let timer = 0
        this.posterTimer = setInterval(() => {
          timer++
          if (this.posterArr.length) {
            clearInterval(this.posterTimer)
            this.loadingPoster = false
          } else if (!this.posterArr.length && timer < 60) {
            this.getVideoPoster(this.formData.vid)
          } else if (timer >= 60) {
            clearInterval(this.posterTimer)
            this.timeDelate = true
            this.loadingPoster = false
            this.$message.error('获取智能封面失败，请手动上传')
          }
        }, 1000)
        console.log(infor.uploadResult)
      })

      this.uploader.on('error', (infor) => {
        console.log('error')
        console.log(infor.extra)
      })

      this.uploader.on('progress', (infor) => {
        console.log('progress')
        this.showProcess = true
        this.percentage = infor.percent
      })

      this.uploader.start(fileKey)
    },
    // 删除视频
    deleteFile () {
      let file = document.getElementById('currentVideo')
      file.value = ''
      this.fileName = ''
      this.formData.vid = ''
      this.formData.height = ''
      this.formData.width = ''
      this.showPoster = false
      this.posterArr = []
      this.formData.cover = ''
    },
    getToken () {
      this.$axios.get(`/admin/getUploadToken`).then((res) => {
        this.token = res.data.data.upload_token || {}
        this.userOptions = res.data.data.post_user_list || {}
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.$axios.get(`/admin/searchStockInfo?name=${query}`).then((res) => {
          this.searchInfo = res.data.data
          this.loading = false
        })
      }
    },
    remoteUser (query) {
      if (query !== '') {
        this.loadingUser = true
        this.$axios.get(`/admin/searchUsers?name=${query}`).then((res) => {
          console.log(res.data)
          this.userOptions = res.data.data
          this.loadingUser = false
        })
      }
    },
    clearUser (val) {
      if (!val) {
        this.$axios.get(`/admin/getUploadToken`).then((res) => {
          this.userOptions = res.data.data.post_user_list || []
        })
      }
    },
    // 获取视频封面图智能列表
    getVideoPoster (vid) {
      this.showPoster = true
      this.$axios.get(`/admin/getVidRecommendedPoster?vid=${vid}`).then((res) => {
        let data = res.data
        if (data.code === 0) {
          if (data.data.Result.StoreUriGroups && data.data.Result.StoreUriGroups.length && data.data.Result.StoreUriGroups[0].StoreUris) {
            this.posterArr = data.data.Result.StoreUriGroups[0].StoreUris
            this.formData.cover = this.posterArr[0]
          }
        }
      })
    },
    // 上传封面图成功回调
    posterUpSuccess (res) {
      if (res.code === 0) {
        console.log(res)
        this.formData.cover = res.data[0].url
      }
    },
    // 删除封面图回调，选中智能封面第一个
    posterRemove (res) {
      this.formData.cover = this.posterArr[0]
    },
    // 上传封面图失败回调
    posterError (res) {
      console.log(res)
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
    posterClick (res) {
      console.log(res)
      this.formData.cover = res.response.data[0].url
      // this.$message.error('只允许上传一个文件，请删除之前的再重新上传')
    },
    submit () {
      console.log(this.formData)
      if (!this.formData.vid) {
        this.$message.error('请上传视频')
        return
      }
      if (!this.formData.title) {
        this.$message.error('请输入配文')
        return
      }
      if (!this.formData.user_id || !this.formData.user_id.length) {
        this.$message.error('请输入发布账号')
        return
      }
      if (this.submitType === 1) {
        this.formData.pub_time = ''
      }
      this.formData.user_id = this.formData.user_id[0]
      this.formData.quality = this.formData.quality ? '1' : '0'
      let params = JSON.stringify(this.formData)
      this.$axios.post(`/admin/addMedia`, params).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message.success('上传成功')
          this.$router.push(`/videoList`)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .add-video{
    .height-css {
      max-height: 615px;
      overflow: auto;
    }
    .videoChoose{
      position: relative;
      color: #666;
      .fileName{
        margin: 0 4px 0 10px;
      }
      .hideBtn{
        position: absolute;
        left:0;
        opacity: 0;
        width: 100px;
        height: 40px;
      }
    }
    .progress{
      width: 260px;
    }
    .typeChoose{
      span{
        border: 1px solid #e4e4e4;
        border-radius: 30px;
        margin-right: 6px;
        padding: 5px 14px;
        cursor: pointer;
      }
      span:hover{
        border: 1px solid #666;
      }
      .active{
        background: #666;
        color: #fff;
        border: 1px solid #666;
      }
    }
    .video-image {
      display: flex;
      width: 805px;
      .video-img-result {
        display: inline-flex;
        width: 240px;
        height: 215px;
        background: #dedede;
        margin-right: 24px;
        justify-content: center;
        border-radius: 2px;
        img {
          max-width:240px;
          max-height:215px;
        }
      }
      .video-img-right {
        p {
          line-height: 20px;
          font-size: 14px;
          margin:2px 0;
          span {
            font-size: 12px;
            color: #888;
          }
        }
        .video-img-demo {
          display: inline-flex;
          flex-flow: wrap;
          width: 500px;
          height: 140px;
          align-items: center;
          justify-content: space-between;
          .video-img-dom {
            position: relative;
            width: 118px;
            height: 66px;
            background: #dedede;
            display: inline-flex;
            flex-shrink: 0;
            justify-content: center;
            border-radius: 2px;
            .poster-cur-icon {
              position: absolute;
              bottom: 2px;
              right: 2px;
              line-height: 14px;
              display: inline-block;
              font-size: 12px;
              padding: 2px 4px;
              background: #0ac1c1;
              border-radius: 50%;
              color: #fff;
            }
          }
          .poster-active {
            border:2px solid #0bc1c1;
            box-sizing: border-box;
          }
          img {
            max-width: 118px;
            max-height: 66px;
          }
        }
        .video-img-upload {
          line-height: 20px;
          color: #13a8a8;
          span {
            cursor: pointer;
          }
        }
      }
    }
    .el-textarea{
      width: 400px;
    }
    .input-new-tag{
      .el-input{
        width: 250px;
      }
    }
    .sub-time {
      margin-left: 10px;
      .el-input {
        width: 230px;
      }
    }
    .el-form-item{
      margin-bottom: 16px;
    }
    .el-card__body{
      padding: 30px 20px;
    }
    .el-tag + .el-tag {
      margin-left: 5px;
    }
    .el-select{
      width: 400px;
    }
    .el-input {
      width: 400px;
    }
    .el-upload-list {
      margin-top: -8px;
    }
    .el-progress__text {
      margin-left: 4px !important;
    }
    .el-progress-bar__outer {
      width: 92% !important;
    }
  }
</style>
