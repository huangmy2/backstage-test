<template>
  <div class="add-video">
    <el-card>
      <el-form ref="form" v-if="formData" :model="formData" label-width="95px" class="height-css">
        <el-form-item label="用户账号"  label-width="95px">
          <span>{{formData.user_info.nickname}}</span>
        </el-form-item>
        <el-form-item label="视频" label-width="95px">
            <div class="videoInfo" v-if="formData.post_url" @click="playVideo">
                <img class="video_active" :src="formData.post_url" alt="">
                <img class="video_play" src="../../assets/video/video_play.png" alt="">
            </div>
            <div class="videoChoose">
              <el-button class="seeBtn" type="primary" round size="small">重新上传视频<i class="el-icon-upload el-icon--right"></i></el-button>
              <input class="hideBtn" type="file" value="重新上传视频" id="currentVideo" @change="getFile($event)">
              <span class="fileName">{{fileName || '未选择任何文件'}}</span>
              <span v-if="fileName" @click="deleteFile"><i class="el-icon-circle-close"></i> </span>
            </div>
          <el-progress v-if="showProcess" class="progress" :percentage="percentage"></el-progress>
        </el-form-item>
        <el-form-item label="视频封面"  label-width="95px" v-if="showPoster">
          <div class="video-image" v-loading="loadingPoster" element-loading-text="获取智能封面候选中...">
            <div class="video-img-result">
              <img v-if="cover" :src="cover" alt="">
              <span v-else>暂无封面</span>
            </div>
            <div class="video-img-right">
              <p v-if="posterArr && posterArr.length">智能封面候选<span>（您可以从智能封面候选中选择一张作为封面）</span></p>
              <div class="video-img-demo" v-if="posterArr && posterArr.length">
                <div :class="item == cover ? 'video-img-dom poster-active':'video-img-dom'" v-for="item in posterArr" :key="item" @click="cover = item">
                  <img :src="item" alt="">
                  <span class="poster-cur-icon" v-if="item == cover">✔</span>
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
        <!-- <el-form-item label="配文"  label-width="95px">
          <span>{{formData.title}}</span>
        </el-form-item> -->
        <el-form-item label="配文"  label-width="95px">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入配文"
            v-model="formData.title">
          </el-input>
        </el-form-item>
        <el-form-item label="类目选择">
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
        <el-form-item v-if="formData.show_status == 3 && formData.cron_info" label="定时时间">
          <el-date-picker
            v-model="formData.cron_info.pub_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布日期时间"
            size="medium">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" label-width="95px">
          <el-button round type="primary" @click="submit()"> 提交修改 </el-button>
        </el-form-item>
       </el-form>
    </el-card>
    <el-dialog
        :title="playVideoInfo.title"
        :visible.sync="videoPlay"
        top="6vh"
        width="40%"
        @close="closeDialog"
        center>
        <div class="video_info" v-show="playVideoInfo">
          <video :src="playVideoInfo.video_url" :id="'video' + playVideoInfo.id" x5-playsinline="true" playsinline="true" webkit-playsinline="true" muted autoplay controls="controls"></video>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import TTUploader from 'tt-uploader'
export default {
  name: 'addVideo',
  data () {
    return {
      ids: '',
      fileList: [],
      cover: '',
      formData: null,
      videoData: {
        vid: '',
        height: '',
        width: ''
      },
      percentage: 0,
      showProcess: false,
      playVideoInfo: {},
      videoPlay: false,
      fileName: '',
      searchInfo: [],
      loading: false,
      showPoster: false,
      posterArr: [],
      posterTimer: {},
      loadingPoster: true,
      timeDelate: false,
      listPage: 1
    }
  },
  created () {
    this.getToken()
  },
  mounted () {
    this.ids = this.$route.query.id || 0
    this.listPage = this.$route.query.page || 1
    this.getData()
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
        this.posterArr = []
        this.showProcess = false
        this.fileName = $event.target.files[0].name
        this.formData.post_url = ''
        this.videoData.vid = infor.uploadResult.Vid
        this.videoData.width = infor.uploadResult.SourceInfo.Width
        this.videoData.height = infor.uploadResult.SourceInfo.Height
        this.getVideoPoster(this.videoData.vid)
        this.loadingPoster = true
        let timer = 0
        this.posterTimer = setInterval(() => {
          timer++
          if (this.posterArr.length) {
            clearInterval(this.posterTimer)
            this.loadingPoster = false
          } else if (!this.posterArr.length && timer < 60) {
            this.getVideoPoster(this.videoData.vid)
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
      this.videoData.vid = ''
      this.videoData.height = ''
      this.videoData.width = ''
      this.showPoster = false
      this.posterArr = []
      this.formData.cover = ''
    },
    getToken () {
      this.$axios.get(`/admin/getUploadToken`).then((res) => {
        console.log(res)
        this.token = res.data.data.upload_token || {}
        this.userOptions = res.data.data.post_user_list || {}
      })
    },
    getData () {
      this.$axios.get(`/admin/getMediaInfos?ids=${this.ids}`).then((res) => {
        this.formData = res.data.data.list[0] || {}
        this.cover = this.formData.post_url ? this.formData.post_url : ''
        this.formData.quality = this.formData.quality === '1'
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
      })
    },
    changePoster (img) {
      console.log(this.formData.cover)
      console.log(img)
      this.cover = img
    },
    playVideo () {
      this.videoPlay = true
      this.playVideoInfo = this.formData
    },
    closeDialog () {
      let videoid = document.getElementById(`video${this.playVideoInfo.id}`)
      videoid.pause()
    },
    // 获取视频封面图智能列表
    getVideoPoster (vid) {
      this.showPoster = true
      this.$axios.get(`/admin/getVidRecommendedPoster?vid=${vid}`).then((res) => {
        let data = res.data
        if (data.code === 0) {
          if (data.data.Result.StoreUriGroups && data.data.Result.StoreUriGroups.length && data.data.Result.StoreUriGroups[0].StoreUris) {
            this.posterArr = data.data.Result.StoreUriGroups[0].StoreUris
          }
        }
      })
    },
    // 上传封面图成功回调
    posterUpSuccess (res) {
      if (res.code === 0) {
        console.log(res)
        this.cover = res.data[0].url
      }
    },
    // 删除封面图回调，选中智能封面第一个
    posterRemove (res) {
      this.cover = this.posterArr[0]
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
      this.cover = res.response.data[0].url
      // this.$message.error('只允许上传一个文件，请删除之前的再重新上传')
    },
    submit () {
      this.formData.vid = this.videoData.vid ? this.videoData.vid : this.formData.vid
      let obj = {
        ids: this.ids,
        category: this.formData.category || '',
        prescription: this.formData.prescription || '',
        stock_type: this.formData.stock_type || '',
        identity: this.formData.identity || '',
        title: this.formData.title,
        weight: this.formData.weight,
        cover: this.cover,
        vid: this.formData.vid,
        pub_time: this.formData.cron_info && this.formData.cron_info.pub_time ? this.formData.cron_info.pub_time : '',
        quality: this.formData.quality ? '1' : '0'
      }
      this.$axios.post(`/admin/setMediaInfo`, obj).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('修改成功')
          this.$router.push(
            {
              name: 'videoList',
              params: {
                pageFlag: parseInt(this.listPage)
              }
            }
          )
          // window.location.href = document.referrer
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
      width: 60%;
      position: relative;
      color: #666;
      display: inline-block;
      vertical-align: text-bottom;
      margin-left: 20px;
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
      width: 240px;
    }
    .video-image {
      display: flex;
      width: 805px;
      .video-img-result {
        display: inline-flex;
        width: 240px;
        height: 200px;
        background: #dedede;
        margin-right: 24px;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        img {
          max-width:240px;
          max-height:200px;
        }
      }
      .video-img-right {
        p {
          line-height: 20px;
          font-size: 14px;
          margin:1px 0;
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
    .el-textarea{
      width: 400px;
    }
    .input-new-tag{
      .el-input{
        width: 250px;
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
    .videoInfo {
        width: 240px;
        height: 200px;
        cursor: pointer;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #dedede;
        .video_active {
            max-width: 240px;
            max-height: 200px;
            opacity:0.4;
        }
        .video_play {
            position: absolute;
            width: 36px;
            left: calc(~"50% - 18px");
        }
    }
    .video_info{
        text-align: center;
        video{
            max-width: 100%;
            max-height: 560px;
        }
    }
  }
</style>
