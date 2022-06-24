<template>
  <div class="wrap">
  <el-card>
    <el-input clearable v-model="searchContent" size="medium" placeholder="请输入发布账号" @change="contentchange"></el-input>
    <el-button type="primary" size="medium" round @click="searchData()">搜索</el-button>
      <dqd-table
        :isPagination="true"
        :table-data="tableData"
        :table-label="tableLabel"
        :pagination="pagination"
        :isSelection='false'
        :isIndex='true'
        @handleCurrentChange = "handleCurrentChange"
      >
      </dqd-table>
    </el-card>
  </div>
</template>

<script>
import dqdTable from '../../components/common/table'
export default {
  name: 'userList',
  data () {
    return {
      tableData: [],
      totalNumber: 0,
      searchContent: '',
      tableLabel: [
        {
          label: '序号',
          param: 'index',
          align: 'center',
          type: 'index'
        },
        {
          label: 'ID',
          param: 'id',
          align: 'center',
          width: '120'
        },
        {
          label: '用户名',
          param: 'nickname',
          align: 'center',
          width: '180'
        },
        {
          label: '发表数',
          param: 'publish_num',
          align: 'center'
        },
        {
          label: '评论数',
          param: 'comment_num',
          align: 'center'
        },
        {
          label: '点赞数',
          param: 'up_num',
          align: 'center'
        },
        {
          label: '上一次登录IP',
          param: 'last_login_ip',
          align: 'center',
          width: '160'
        },
        {
          label: '上一次登录时间',
          param: 'last_login_time',
          align: 'center',
          width: '150'
        },
        {
          label: '操作',
          type: 'operation',
          list: [
            {
              label: '预览',
              render: (row) => { // 按钮动态文案
                if (row.status === 1) {
                  return '解封'
                } else if (row.status === 0) {
                  return '封禁'
                }
              },
              formatter: (row) => { // 按钮动态背景色
                return row.status === 1 ? 'success' : 'danger'
              },
              func: this.handleCloser
            }
          ]
        }
      ],
      pagination: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    contentchange () {
      if (this.searchContent === '') {
        this.currentPage = 1
        this.getData()
      }
    },
    searchData () {
      this.currentPage = 1
      this.$axios.get(`/admin/getUserList?page=${this.pagination.pageNum}&size=${this.pageSize ? this.pageSize : 20}&user_name=${this.searchContent}`).then((res) => {
        let data = res.data
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pagination.total = data.data.total
        }
      })
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.getData()
    },
    handleCloser (row, index) { // status: 0:封禁， 1:解封
      let status = row.status === 1 ? 0 : 1
      let title = row.status === 1 ? '解封' : '封禁'
      this.$confirm(`确定${title}用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(`/admin/setUserStatus?user_id=${row.id}&status=${status}`).then((res) => {
          let data = res.data
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: `${title}成功!`
            })
            this.searchData()
            // this.$set(this.tableData[index], 'status', Number(data.data.status))
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${title}`
        })
      })
    },
    getData () {
      this.$axios.get(`/admin/getUserList?page=${this.pagination.pageNum}&size=${this.pageSize ? this.pageSize : 20}`).then((res) => {
        let data = res.data
        if (data.code === 0) {
          this.tableData = data.data.list
          this.pagination.total = data.data.total
        }
      })
    }
  },
  components: {
    dqdTable
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .el-input {
    width: 250px;
    margin: 10px 20px 10px 5px;
  }
</style>
