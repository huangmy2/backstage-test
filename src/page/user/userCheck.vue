<template>
  <div class="wrap">
    <el-card>
      <dqd-table
        :isPagination="true"
        :table-data="tableData"
        :table-label="tableLabel" :pagination="pagination" :loadingFlag='loading'
        :button-footer="buttonFooter"
        @handleCurrentChange='handleCurrentChange'
        @selectSingle="selectChange"
        @pass="deleteInfo">
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
      buttonFooter: [{
        text: '批量通过',
        type: 'success',
        func: 'pass'
      }],
      tableLabel: [
        {
          type: 'selection',
          hidden: false
        },
        {
          type: 'img',
          label: '新头像',
          param: 'new_avatar',
          align: 'center',
          hidden: false
        },
        { label: '原昵称', param: 'nickname', align: 'center', width: '200' },
        { label: '新昵称', param: 'new_nickname', align: 'center' },
        { label: '修改时间', type: 'sortable', sortable: this.sortByDate, param: 'post_at', align: 'center' },
        {
          label: '操作',
          type: 'operation',
          list: [
            {
              label: '',
              render: (row) => { // 按钮动态文案
                if (row.state === 2 || row.state === 0) {
                  return '通过'
                } else {
                  return ''
                }
              },
              formatter: (row) => { // 按钮动态背景色
                return 'success'
              },
              func: this.chagneStatusTrue
            },
            {
              label: '',
              render: (row) => { // 按钮动态文案
                if (row.state === 1 || row.state === 0) {
                  return '拒绝'
                } else {
                  return ''
                }
              },
              formatter: (row) => { // 按钮动态背景色
                return 'danger'
              },
              func: this.chagneStatusFalse
            }
          ]
        }
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
    selectChange (rows) {
      console.log(rows)
      this.selectRows = rows
    },
    deleteInfo () {
      let ids = []
      this.selectRows.forEach(item => {
        ids.push(item.cid)
      })
      this.chagneStatus(ids, 1)
    },
    chagneStatusTrue (row) {
      this.chagneStatus(row.cid, 1)
    },
    chagneStatusFalse (row) {
      this.chagneStatus(row.cid, 2)
    },
    // 按照时间排序
    sortByDate (obj1, obj2) {
      console.log(obj1)
      let nowTime1 = obj1.post_at
      let nowTime2 = obj2.post_at
      let thisTime1 = nowTime1.replace(/-/g, '/')
      let thisTime2 = nowTime2.replace(/-/g, '/')
      let time1 = new Date(thisTime1).getTime()
      let time2 = new Date(thisTime2).getTime()
      return time1 - time2
    },
    chagneStatus (ids, status) {
      let title = status === 1 ? '通过' : '拒绝'
      this.$confirm(`确定${title}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('Ddddd')
        this.$axios.get(`/admin/SetUserChangeState?ids=${ids}&state=${status}`).then((res) => {
          let data = res.data
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: `${title}成功!`
            })
            this.init()
          } else {
            this.$message({
              type: 'info',
              message: `操作失败`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${title}`
        })
      })
    },
    init () {
      this.loading = true
      this.$axios.get(`/admin/GetAccountChangelogs?page=${this.pagination.pageNum}&size=10`).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list || []
          this.pagination.total = res.data.data.total || 0
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
