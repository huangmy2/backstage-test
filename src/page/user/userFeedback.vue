<template>
  <div class="wrap">
    <el-card>
      <dqd-table
        :isPagination="true"
        :table-data="tableData"
        :table-label="tableLabel" :pagination="pagination" :loadingFlag='loading'
        @handleCurrentChange='handleCurrentChange'>
      </dqd-table>
    </el-card>
  </div>
</template>

<script>
import dqdTable from '../../components/common/table'
export default {
  name: 'userChack',
  data () {
    return {
      total: 0,
      loading: false,
      tableData: [],
      tableLabel: [
        { label: 'ID', param: 'user_id', align: 'center', width: '200' },
        { label: '用户账号', param: 'user_name', align: 'center', width: '200' },
        { label: '反馈内容', param: 'content', align: 'center' },
        { label: '反馈类型', param: 'type', align: 'center' },
        { label: '提交时间', type: 'sortable', sortable: this.sortByDate, param: 'created_at', align: 'center' }
      ],
      pagination: {
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      selectRows: []
    }
  },
  components: {
    dqdTable
  },
  methods: {
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.init()
    },
    // 按照时间排序
    sortByDate (obj1, obj2) {
      console.log(obj1)
      let nowTime1 = obj1.created_at
      let nowTime2 = obj2.created_at
      let thisTime1 = nowTime1.replace(/-/g, '/')
      let thisTime2 = nowTime2.replace(/-/g, '/')
      let time1 = new Date(thisTime1).getTime()
      let time2 = new Date(thisTime2).getTime()
      return time1 - time2
    },
    init () {
      this.loading = true
      this.$axios.get(`/admin/getUserFeedBack?page=${this.pagination.pageNum}&size=20`).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.UserFeedBack || []
          this.pagination.total = res.data.data.total_count || 0
          this.loading = false
          console.log(this.tableData)
        } else {
          console.log('无数据')
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
html body {
  height: 100%;
}
.wrap {
  height: 100%;
  position: relative;
  .form {
    position: absolute;
    top: 50%;
    left: 40%;
  }
}
</style>
