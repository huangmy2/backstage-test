<template>
  <div class="wrap">
    <el-card>
      <dqd-table :isPagination="true" :table-data="
        tableData
      " :table-label="tableLabel" :pagination="pagination" :loadingFlag='loading'
        @handleCurrentChange='handleCurrentChange'>
      </dqd-table>
    </el-card>
  </div>
</template>

<script>
import dqdTable from '../../components/common/table'
export default {
  name: 'talkList',
  data () {
    return {
      total: 0,
      loading: false,
      tableData: [],
      tableLabel: [
        { label: 'ID', param: 'id', align: 'center', hidden: false },
        {
          label: '话题名称',
          param: 'title',
          align: 'center',
          func: this.cancelDialog,
          type: 'colorText',
          render: row => {
            if (row.title) {
              return 'color: #13a8a8'
            }
          }
        },
        { label: '视频数', param: 'video_num', align: 'center', width: '200' },
        { label: '账号数', param: 'user_num', align: 'center' },
        {
          label: '话题总VV',
          param: 'talk_video_show',
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
  components: {
    dqdTable
  },
  methods: {
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.init()
    },
    cancelDialog (row) {
      this.$router.push(`/topicVideoList/${row.id}`)
    },
    init () {
      this.loading = true
      this.$axios.get(`/admin/getTalkList?page=${this.pagination.pageNum}&size=20`).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.tableData = res.data.data.List || []
          this.pagination.total = res.data.data.count || ''
          this.loading = false
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
