<template>
  <div class="wrap">
    <el-card>
      <dqd-table :isPagination="true" :table-data="tableData" :table-label="tableLabel" :isSelection='false'
        :loadingFlag="loadingFlag" :isIndex='true' @handleCurrentChange="handleCurrentChange" :pagination="pagination">
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
      loadingFlag: false,
      tableData: [],
      totalNumber: 0,
      tableLabel: [
        {
          label: '编号',
          param: 'id',
          align: 'center'
        },
        {
          label: '推送视频/资讯配文',
          param: 'relate_title',
          align: 'center'
        },
        {
          label: '推送文案标题',
          param: 'title',
          align: 'center',
          width: '180'
        }, {
          label: '推送文案内容',
          param: 'content',
          align: 'center',
          width: '180'
        },
        {
          label: '完成推送操作的账号名',
          param: 'operator_name',
          align: 'center'
        },
        {
          label: '推送时间',
          param: 'created_at',
          align: 'center'
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
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.getData()
    },
    getData () {
      this.loadingFlag = true
      this.$axios.get(`/admin/push?page=${this.pagination.pageNum}&size=${this.pageSize ? this.pageSize : 20}`).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.pagination.total = res.data.data.total
          this.loadingFlag = false
        } else {
          this.tableData = []
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
</style>
