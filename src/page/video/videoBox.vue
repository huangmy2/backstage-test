<template>
  <div class="videoList">
    <el-card>
      <div class="search-dom">
        <!-- <span>搜索类型：</span> -->
        <el-select v-model="searchActive" size="medium" placeholder="请选择" @change="searchStock = [];searchContent = ''">
          <el-option
            v-for="item in searchType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select
            clearable
            class="stock-input"
            v-if="searchActive == 'stock_code'"
            v-model="searchStock"
            size="medium"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入股票关键词"
            :remote-method="remoteMethod"
            :loading="loadinginput"
            @change="stockchange">
            <el-option
              v-for="item in searchInfo"
              :key="item.code"
              :label="item.name + '-' + item.code"
              :value="item.code">
            </el-option>
        </el-select>
        <el-select
            clearable
            class="stock-input"
            v-if="searchActive == 'user_name'"
            v-model="searchUser"
            size="medium"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入发布账号"
            :remote-method="remoteUser"
            :loading="loadingUser"
            @change="userchange">
            <el-option
              v-for="item in userOptions"
              :key="item.nickname"
              :label="item.nickname"
              :value="item.nickname">
            </el-option>
        </el-select>
        <el-input v-else clearable v-model="searchContent" size="medium" placeholder="请输入搜索内容" @change="contentchange"></el-input>
        <el-button type="primary" size="medium" round @click="searchData()">搜索</el-button>
      </div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="videoList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="550px">
        <el-table-column type="selection" width="42" align="center"></el-table-column>
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope"><span class="edit_id" @click="toEdit(scope.row.id)">{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column label="类别" width="75" align="center">
          <template slot-scope="scope">{{ scope.row.category | filterCate }}</template>
        </el-table-column>
        <el-table-column label="配文" width="180" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isShow">{{ scope.row.title | filterTitle}}<span v-if="scope.row.title.length > 50" style="color:#ed2e2e;cursor: pointer;" @click="changeZhan(scope.row)">展开</span> </span>
            <span v-else @click="scope.row.isShow = false">{{ scope.row.title}} <span style="color:#ed2e2e;cursor: pointer;">收起</span></span>
          </template>
        </el-table-column>
        <el-table-column prop="show_cnt" label="VV" width="60" align="center"></el-table-column>
        <el-table-column prop="finish_play_times" label="完播率" width="60" align="center"></el-table-column>
        <el-table-column prop="up_cnt" label="点赞" width="54" align="center"></el-table-column>
        <el-table-column prop="comment_cnt" label="评论" width="54" align="center"></el-table-column>
        <el-table-column prop="share_cnt" label="转发" width="54" align="center"></el-table-column>
        <el-table-column prop="down_cnt" label="下载" width="54" align="center"></el-table-column>
        <el-table-column label="发布账号" width="108" align="center"><template slot-scope="scope">{{ scope.row.user_info.nickname }}</template></el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="90" align="center"></el-table-column>
        <el-table-column prop="play_time" label="时长" width="70" align="center"></el-table-column>
        <el-table-column prop="show_status" label="操作" align="center" width="74">
          <template slot-scope="scope">
            <div class="btn-arr">
              <el-button v-if="scope.row.show_status == 0 || scope.row.show_status == 1 || scope.row.show_status == 3" type="danger" size="mini" @click="changeStatus(scope.row.id,2)">删除</el-button>
              <el-button v-if="scope.row.show_status == 0 || scope.row.show_status == 2 || scope.row.show_status == 3" type="success" size="mini" @click="changeStatus(scope.row.id,1)">通过</el-button>
              <el-button type="success" size="mini" class="transfer-comment" @click="transfer(scope.row)">转评赞</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="播放" width="50" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <img class="playIcon" title="播放" alt="播放" @click="playVideo(scope.row)" src="../../assets/video/play.png">
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="70" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.show_status == 1">已通过</span>
            <span v-else-if="scope.row.show_status == 2">已删除</span>
            <span v-else-if="scope.row.show_status == 3">待发布</span>
            <span v-else>未通过</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="状态"
          width="100"
          align="center">
          <template slot="header" slot-scope="scope">
            <div class="status-header">
              <el-select v-model="show_status" @change="filterStatus()" placeholder="状态">
                <el-option
                  v-for="item in searchStatus"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.show_status == 1">已通过</span>
            <span v-else-if="scope.row.show_status == 2">已删除</span>
            <span v-else-if="scope.row.show_status == 3">待发布</span>
            <span v-else>未通过</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="修改排序" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
             <el-button type="info" plain size="mini" @click="changeSort(scope.row)">↓</el-button>
            <el-button type="primary" plain size="mini" @click="changeSort(scope.row)">↑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="stock_dom">
        <el-button round @click="toggleSelection(videoList)">反选</el-button>
        <el-button round @click="toggleSelection()">清除</el-button>
        <el-button round type="danger" @click="deleteInfo()">删除</el-button>
        <el-pagination
          :hide-on-single-page="true"
          class="prev_block"
          layout="total, prev, pager, next"
          :current-page="currentPage"
          @current-change="changepage"
          :page-size="20"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        :title="playVideoInfo.title"
        :visible.sync="videoPlay"
        top="6vh"
        width="40%"
        @close="closeDialog"
        center>
        <div class="video_info" v-show="playVideoInfo">
          <!-- <p>{{playVideoInfo.title}}</p> -->
          <video :src="playVideoInfo.video_url" :id="'video' + playVideoInfo.id" x5-playsinline="true" playsinline="true" webkit-playsinline="true" muted autoplay controls="controls"></video>
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
      playVideoInfo: {},
      searchType: [{
        value: 'user_name',
        label: '发布账号'
      }, {
        value: 'title',
        label: '视频配文'
      }, {
        value: 'stock_code',
        label: '股票名称/代码'
      }],
      searchStatus: [
        {
          value: '',
          name: '状态'
        }, {
          value: 1,
          name: '已通过'
        }, {
          value: 2,
          name: '已删除'
        }, {
          value: 3,
          name: '待发布'
        }],
      searchActive: 'user_name',
      searchContent: '',
      searchStock: [],
      searchUser: [],
      loadinginput: false,
      searchInfo: [],
      userOptions: [],
      type: 'list',
      show_status: '',
      loadingUser: false
    }
  },
  created () {
    console.log('返回======', this.$route)
    if (this.$route.params.pageFlag) {
      this.currentPage = parseInt(this.$route.params.pageFlag)
    } else {
      this.currentPage = 1
    }
    this.getData()
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
          cate = '暂无类别'
      }
      return cate
    },
    filterTitle (text) {
      if (text.length > 50) {
        return text.slice(0, 50) + '...'
      } else {
        return text
      }
    }
  },
  methods: {
    transfer (row) {
      // this.$router.push({
      //   name: 'transferVideo',
      //   params: {
      //     id: row.id,
      //     currentPage: this.currentPage
      //   }
      // })
      this.$goToNewBlank(this, {
        path: '/transferVideo',
        query: {
          id: row.id,
          currentPage: this.currentPage
        }
      })
    },
    changeZhan (info) {
      console.log(info)
      if (info.title.length <= 50) {
        return
      }
      this.videoList.forEach(item => {
        if (item.id === info.id) {
          item.isShow = !item.isShow
        }
      })
      this.videoList = JSON.parse(JSON.stringify(this.videoList))
      this.$forceUpdate()
    },
    getData () {
      this.type = 'list'
      this.loading = true
      this.$axios.get(`/admin/getMediaList?page=${this.currentPage}&size=20`).then((res) => {
        console.log(res)
        if (res.data && res.data.code === 0) {
          this.videoList = res.data.data && res.data.data.list
          this.total = res.data.data && res.data.data.total
          this.videoList.forEach(item => {
            let obj = {
              isShow: false
            }
            Object.assign(item, obj)
          })
        }
        this.loading = false
      })
    },
    contentchange () {
      if (this.searchContent === '') {
        this.currentPage = 1
        this.getData()
      }
    },
    stockchange () {
      if (!this.searchStock.length) {
        this.currentPage = 1
        this.getData()
      }
    },
    userchange () {
      if (!this.searchUser.length) {
        this.currentPage = 1
        this.getData()
      }
    },
    getSearchData () {
      this.type = 'search'
      this.loading = true
      let content = this.searchActive === 'stock_code' ? this.searchStock : this.searchActive === 'user_name' ? this.searchUser : this.searchContent
      this.$axios.get(`/admin/searchMedia?page=${this.currentPage}&size=20&${this.searchActive}=${content}&show_status=${this.show_status}`).then((res) => {
        console.log(res)
        if (res.data && res.data.code === 0) {
          this.videoList = res.data.data && res.data.data.list
          this.total = res.data.data && res.data.data.total
        }
        this.loading = false
      })
    },
    filterStatus () {
      this.currentPage = 1
      this.getSearchData()
    },
    searchData () {
      this.currentPage = 1
      this.getSearchData()
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.$axios.get(`/admin/searchStockInfo?name=${query}`).then((res) => {
          this.searchInfo = res.data.data
          this.loading = false
        })
      } else {
        // this.loading = false
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
    closeDialog () {
      let videoid = document.getElementById(`video${this.playVideoInfo.id}`)
      videoid.pause()
    },
    changepage (page) {
      this.currentPage = page
      if (this.type === 'search') {
        this.getSearchData()
      } else {
        this.getData()
      }
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
    toEdit (id) {
      // this.$router.push({
      //   path: '/editVideo',
      //   query: {
      //     id: id,
      //     page: this.currentPage
      //   }
      // })
      window.open(`http://${location.host}/#/editVideo?id=${id}&page=${this.currentPage}`, '_blank')
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
.transfer-comment{
  padding-right: 0 !important;
  padding-left: 0 !important;
  width: 55px;
  margin-top: 2px !important;
}
.videoList{
  padding: 0;
  .playIcon{
    width: 22px;
    border-radius: 50%;
    margin-top: 4px;
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
  .btn-arr {
    .el-button {
      margin-bottom: 4px;
    }
  }
  .edit_id {
    color: #13a8a8;
    cursor: pointer;
    font-weight: 500;
    text-decoration: underline;
  }
  .search-dom {
    margin-bottom: 10px;
    .el-select {
      width: 134px;
      .el-input {
        width: 134px;
      }
      .el-input__inner {
        border: none;
      }
    }
    .stock-input {
      width: 300px;
      margin-right: 14px;
      .el-input__inner {
        border: 1px solid #dcdfe6;
      }
      .el-input {
        width: 300px;
      }
    }
    .el-input {
      width: 300px;
      margin-right: 14px;
    }
  }
  .status-header {
    display: block;
    padding: 0;
    line-height: 0;
    .el-select {
      width: 76px;
      padding: 0;
    }
    .el-table th div {
      padding: 0;
    }
    .el-select > .el-input {
      padding: 0;
    }
    .el-input--suffix .el-input__inner{
      padding-right: 8px;
      padding-left: 4px;
    }
  }
}
</style>
