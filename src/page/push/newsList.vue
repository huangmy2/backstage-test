<template>
  <div class="wrap">
    <el-card>
      <el-button @click="refresh" style="background-color:#22a7a7;color:#FFF">刷新列表</el-button>
      <dqd-table :isPagination="false" :table-data="tableData" :table-label="tableLabel" :pagination="pagination"
        :isSelection='false' :isIndex='true' :loadingFlag="loadingFlag" @handleCurrentChange="handleCurrentChange">
      </dqd-table>
      <div style="float:right;margin-top:-25px;margin-right:135px">
        <span @click="goToPage('1')">第一页</span>
        <span @click="goToPage('former')">上一页</span>
        <span @click="goToPage('next')">下一页</span>
      </div>
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
      tableLabel: [
        {
          label: '时间',
          param: 'show_time',
          align: 'center',
          type: 'timeTwoRow'
        },
        {
          label: '资讯',
          param: 'title',
          align: 'center'
        },
        {
          label: '操作',
          type: 'operation',
          list: [
            {
              label: '推送',
              func: this.handlePush,
              type: 'danger'
            }
          ]
        }
      ],
      loadingFlag: false,
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
    goToPage (val) {
      if (val === '1') {
        this.pagination.pageNum = 1
      } else if (val === 'former') {
        if (this.pagination.pageNum === 1) {
          this.$message({
            message: '已无上一页',
            type: 'warning'
          })
          return
        } else {
          this.pagination.pageNum = this.pagination.pageNum - 1
        }
      } else if (val === 'next') {
        this.pagination.pageNum = this.pagination.pageNum + 1
      }
      this.getData()
    },
    refresh () {
      this.getData()
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.getData()
    },
    handlePush (row) {
      console.log(row)
      this.$confirm('此次推送将推送给全部用户，请认真确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/admin/push', {
          relate_id: row.id,
          type: 2,
          range: 1
        }).then((res) => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '推送成功'
            })
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消推送'
        })
      })
    },
    getData () {
      this.loadingFlag = true
      this.$axios.get(`/admin/news?page=${this.pagination.pageNum}&size=${this.pageSize ? this.pageSize : 20}`).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.data
          this.loadingFlag = false
        } else {
          this.tableData = []
        }
        console.log(res)
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
</style>
