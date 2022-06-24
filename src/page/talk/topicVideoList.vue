<template>
  <div class="videoList">
    <el-card>
      <el-table v-loading="loading" ref="multipleTable" :data="videoList" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" max-height="580px">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="ID" width="70" align="center"><template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="类别" width="75" align="center">
          <template slot-scope="scope">{{ scope.row.relate_type | filterCate }}</template>
        </el-table-column>
        <el-table-column label="配文" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.title | filterTitle }}</template>
        </el-table-column>
        <el-table-column prop="show_cnt" label="VV" width="70" align="center"></el-table-column>
        <el-table-column prop="finish_play_times" label="完播率" width="70" align="center"></el-table-column>
        <el-table-column prop="up_cnt" label="点赞" width="62" align="center"></el-table-column>
        <el-table-column prop="comment_cnt" label="评论" width="62" align="center"></el-table-column>
        <el-table-column prop="share_cnt" label="转发" width="62" align="center"></el-table-column>
        <el-table-column prop="down_cnt" label="下载" width="62" align="center"></el-table-column>
        <el-table-column label="发布账号" width="108" align="center">
          <template slot-scope="scope">{{ scope.row.user_info.nickname || scope.row.user_info.username }}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="108" align="center"></el-table-column>
        <el-table-column prop="play_time" label="时长" width="70" align="center"></el-table-column>
        <el-table-column prop="show_status" label="禁用" align="center" width="74">
          <template slot-scope="scope">
            <div class="btn-arr">
              <el-button v-if="scope.row.show_status == 0 || scope.row.show_status == 1" type="danger" size="mini" @click="changeStatus(scope.row.id,2)">删除</el-button>
              <el-button v-if="scope.row.show_status == 0 || scope.row.show_status == 2" type="success" size="mini" @click="changeStatus(scope.row.id,1)">通过</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="播放" width="50" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <img class="playIcon" title="播放" alt="播放" @click="playVideo(scope.row)" src="../../assets/video/play.png">
          </template>
        </el-table-column>
        <el-table-column label="状态" width="70" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.show_status == 1 ? '已通过' : scope.row.show_status == 2 ? '已删除' : '未通过'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="stock_dom">
        <el-button round @click="toggleSelection(videoList)">反选</el-button>
        <el-button round @click="toggleSelection()">清除</el-button>
        <el-button round type="danger" @click="deleteInfo()">删除</el-button>
        <el-pagination :hide-on-single-page="true" class="prev_block" layout="total, prev, pager, next"
          :current-page="currentPage" @current-change="changePage" :page-size="10" :total="total">
        </el-pagination>
      </div>
      <el-dialog :title="playVideoInfo.title" :visible.sync="videoPlay" top="6vh" width="40%" @close="closeDialog"
        center>
        <div class="video_info" v-show="playVideoInfo">
          <!-- <p>{{playVideoInfo.title}}</p> -->
          <video :src="playVideoInfo.video_url" :id="'video' + playVideoInfo.id" x5-playsinline="true"
            playsinline="true" webkit-playsinline="true" muted autoplay controls="controls"></video>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'videoList',
  data () {
    return {
      videoList: [],
      currentPage: 1,
      multipleSelection: [],
      loading: false,
      total: 0,
      videoPlay: false,
      playVideoInfo: {}
    }
  },
  created () {
    this.getData()
    console.log(this.$route)
  },
  filters: {
    filterCate (val) {
      let cate = ''
      switch (+val) {
        case 1:
          cate = '资讯'
          break
        case 2:
          cate = '观点'
          break
        case 3:
          cate = '研报&预测'
          break
        case 4:
          cate = '科普'
          break
        case 5:
          cate = '日常'
          break
        default:
          cate = '暂无dd类别'
      }
      return cate
    },
    filterTitle (text) {
      if (text.length > 15) {
        return text.slice(0, 15) + '...'
      } else {
        return text
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.$axios.get(`/admin/getTalkMedias?id=${this.$route.params.id}`).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.videoList = res.data.data.list
          this.total = res.data.data.total
        }
        this.loading = false
      })
    },
    closeDialog () {
      let videoid = document.getElementById(`video${this.playVideoInfo.id}`)
      videoid.pause()
    },
    changePage (page) {
      this.currentPage = page
      this.getData()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    changeStatus (ids, status) {
      let title = status === 1 ? '审核通过' : '删除'
      this.$confirm(`确定${title}所选视频？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(`/admin/setMediaShowstaus?ids=${ids}&status=${status}`).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: `${title}成功!`
            })
          }
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消`
        })
      })
    },
    deleteInfo () {
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      this.changeStatus(ids, 2)
    },
    playVideo (item) {
      this.videoPlay = true
      this.playVideoInfo = item
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.videoList {
  padding: 0;
  .playIcon {
    width: 22px;
    border-radius: 50%;
    margin-top: 4px;
    cursor: pointer;
  }
  .stock_dom {
    margin-top: 20px;
    position: relative;
    .prev_block {
      display: inline-block;
      position: absolute;
      right: 25px;
    }
  }
  .el-dialog--center .el-dialog__body {
    padding: 10px;
  }
  .el-button + .el-button {
    margin: 0;
  }
  .video_info {
    text-align: center;
    video {
      max-width: 100%;
      max-height: 560px;
    }
  }
  .btn-arr {
    .el-button {
      margin-bottom: 4px;
    }
  }
}
</style>
