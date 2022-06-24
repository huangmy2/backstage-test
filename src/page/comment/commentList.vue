<template>
  <div class="videoList">
    <el-card>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="commentList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="580px">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="视频/评论" width="400" align="left">
          <template slot-scope="scope">
            <div style="cursor: pointer" @click="toEdit(scope.row.media_info.media_id)">
              <div><span class="comment_tips">配文</span>{{ scope.row.media_info.media_desc }}</div>
              <div class="yinyong">
                <p v-if="scope.row.comment_info.quote && scope.row.comment_info.quote.comment_info && scope.row.comment_info.quote.comment_info.content">
                  <span class="comment_tips">引用</span>{{scope.row.comment_info.quote.comment_info.content}}
                </p>
              </div>
              <div><span class="comment_tips">评论</span>{{ scope.row.comment_info.content }}</div>
              <div class="commentImg" @click="showImgFun(scope.row.comment_info.attachment)">
                <img v-for="(item, index) in scope.row.comment_info.attachment" :key="index" :src="item.url" alt="" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fav_cnt" label="发布用户" width="150" align="center">
          <template slot-scope="scope"><span :class="+scope.row.comment_info.user_info.userId > 100000 ? 'redText':''">{{ scope.row.comment_info.user_info.username }}</span></template>
        </el-table-column>
        <el-table-column sortable label="赞" :sort-method="sortByUp" align="center">
          <template slot-scope="scope">
            {{ scope.row.comment_info.up }}
          </template>
        </el-table-column>
        <el-table-column sortable label="举报" :sort-method="sortByReport" align="center">
          <template slot-scope="scope">
            {{ scope.row.comment_info.report }}
          </template>
        </el-table-column>
        <el-table-column sortable label="时间" :sort-method="sortByDate" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.comment_info.created_at }}
          </template>
        </el-table-column>
        <el-table-column prop="show_status" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.comment_info.status == 0 || scope.row.comment_info.status == 2" type="success" size="mini" @click="changeStatus([scope.row.comment_info.id], 1)">通过</el-button>
            <el-button v-if="scope.row.comment_info.status == 0 || scope.row.comment_info.status == 1" type="danger" size="mini" @click="changeStatus([scope.row.comment_info.id], 2)">删除</el-button>
            <el-button type="danger" size="mini" @click="handleCloser([scope.row.comment_info.user_info.userId], 0)">封禁</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="70" align="center">
          <template slot-scope="scope">{{ scope.row.comment_info.status_desc || '未审核'}}</template>
        </el-table-column>
      </el-table>
      <div class="stock_dom">
        <el-button round @click="toggleSelection(commentList)">反选</el-button>
        <el-button round @click="toggleSelection()">清除</el-button>
        <el-button round type="danger" @click="deleteInfo()">删除</el-button>
        <el-pagination
          :hide-on-single-page="true"
          class="prev_block"
          layout="total, prev, pager, next"
          :current-page="currentPage"
          @current-change="changepage"
          :page-size="10"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        title="评论配图"
        :visible.sync="imgShow"
        top="6vh"
        width="74%"
        center>
        <div class="img_info" v-show="imgShow">
          <img v-for="(item, index) in showImgInfo" :src="item.url" :key="index" :class="showImgInfo.length > 1 ? 'long' : 'short'" alt="">
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'commentList',
  data () {
    return {
      commentList: [],
      currentPage: 1,
      multipleSelection: [],
      loading: false,
      total: 0,
      imgShow: false,
      showImgInfo: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this.$axios.get(`/admin/comment/commentList?page=${this.currentPage}&size=20`).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.commentList = res.data.data.comment_list
          this.total = res.data.data.total_count
        }
        this.loading = false
      })
    },
    handleCloser (id) { // status: 0:封禁， 1:解封
      this.$confirm(`确定封禁用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(`/admin/setUserStatus?user_id=${id}&status=1`).then((res) => {
          let data = res.data
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: `封禁成功!`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消封禁`
        })
      })
    },
    toEdit (id) {
      this.$router.push({
        path: '/editVideo',
        query: {
          id: id
        }
      })
    },
    changepage (page) {
      this.currentPage = page
      this.getData()
    },
    // 按照点赞数排序
    sortByUp (obj1, obj2) {
      let val1 = obj1.comment_info.up
      let val2 = obj2.comment_info.up
      return val1 - val2
    },
    // 按照举报数排序
    sortByReport (obj1, obj2) {
      let val1 = obj1.comment_info.report
      let val2 = obj2.comment_info.report
      return val1 - val2
    },
    // 按照时间排序
    sortByDate (obj1, obj2) {
      let nowTime1 = obj1.comment_info.created_at
      let nowTime2 = obj2.comment_info.created_at
      let thisTime1 = nowTime1.replace(/-/g, '/')
      let thisTime2 = nowTime2.replace(/-/g, '/')
      let time1 = new Date(thisTime1).getTime()
      let time2 = new Date(thisTime2).getTime()
      return time1 - time2
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
      this.multipleSelection = val
    },
    changeStatus (ids, status) {
      let title = status === 1 ? '通过' : '删除'
      var formData = new FormData()
      formData.append('comment_id', ids)
      formData.append('status', status)
      this.$confirm(`确定${title}所选评论？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/admin/comment/deal`, formData).then((res) => {
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
          message: `已取消${title}`
        })
      })
    },
    deleteInfo () {
      let ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.comment_info.id)
      })
      this.changeStatus(ids, 2)
    },
    showImgFun (item) {
      this.imgShow = true
      this.showImgInfo = item
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.videoList{
  padding: 0;
  .redText {
    color: #e2412f;
    font-weight: bold;
  }
  .playIcon{
    width: 22px;
    border-radius: 50%;
    cursor: pointer;
  }
  .stock_dom{
    margin-top: 20px;
    position: relative;
    .prev_block{
      display: inline-block;
      position: absolute;
      right: 25px
    }
  }
  .el-dialog--center .el-dialog__body{
    padding: 10px;
  }
  .el-button + .el-button{
    margin:0
  }
  .video_info{
    text-align: center;
    video{
      max-width: 100%;
      max-height: 560px;
    }
  }
  .commentImg{
    margin-top: 5px;
    img{
      max-width: 110px;
      // height: 82px;
      background: #eef1f6;
      border-radius: 2px;
      margin: 0 1px;
    }
  }
  .comment_tips{
    background: #7290b5;
    color: #fff;
    font-size: 10px;
    display:inline-block;
    padding: 0px 5px;
    border-top-left-radius: 6px;
    border-bottom-right-radius: 6px;
    margin-right: 2px;
    transform: scale(0.65);
  }
  .yinyong{
    p{
      margin: 2px auto;
    }
  }
  .yinyong{
    font-size: 12px;
    border-radius: 2px;
    background: #f8f8f8;
    color: #aaa8a8;
    .comment_tips{
      background: #b2c0d1
    }
  }
  .img_info{
    text-align: center;
    img{
      margin: 0 2px;
    }
    .long{
      width: 320px;
    }
    .short{
      width: 520px;
    }
  }
}
</style>
