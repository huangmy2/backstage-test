<template>
  <div class="table-index">
    <el-table
      v-loading="loadingFlag"
      element-loading-text="加载中..."
      :data="tableData"
      ref="multipleTable"
      tooltip-effect="dark"
      style="width:100%"
      max-height="580px"
      @selection-change="select"
    >
      <template v-for="(column, index) in tableLabel">
        <template v-if="!column.hidden">
          <template v-if="!column.type">
            <el-table-column :key="index" :show-overflow-tooltip="column.showOverflowTooltip !== undefined ? column.showOverflowTooltip : true" :fixed="column.fixed" :prop="column.param" :label="column.label" :width="column.width" :min-width="column.minWidth" :align="column.align || 'center'" :sortable="column.sortable" :formatter="column.formatter"/>
          </template>
          <template v-else>
            <!--用于不同条件下，td显示不同style-->
            <!-- 显示复选框列 -->
            <template v-if="column.type === 'selection'">
              <el-table-column :key="index" type="selection"></el-table-column>
            </template>
            <!-- 需要排序列 -->
            <template v-if="column.type === 'sortable'">
              <el-table-column :label="column.label" sortable :align="column.align || 'center'" :width="column.width" :sort-method="column.sortable" :key="index">
                <template slot-scope="scope">
                      {{scope.row[column.param]}}
                </template>
              </el-table-column>
            </template>
            <!-- 显示彩色字体 -->
            <template v-if="column.type === 'colorText'">
              <el-table-column :key="index" prop="column.param" :label="column.label" :width="column.width" :min-width="column.minWidth" :align="column.align || 'center'">
                  <template slot-scope="scope">
                      <div :style="column.render ? column.render(scope.row ? scope.row : '') : ''" @click="column.func(scope.row)">{{ column.formatter ? column.formatter(scope.row) : scope.row[column.param] }}</div>
                  </template>
              </el-table-column>
            </template>
            <!-- 时间俩行 -->
            <template v-if="column.type === 'timeTwoRow'">
              <el-table-column :key="index" prop="column.param" :label="column.label" :width="column.width" :min-width="column.minWidth" :align="column.align || 'center'">
                  <template slot-scope="scope">
                    <div>{{scope.row.show_time ? scope.row.show_time.split(' ')[0] : ''}}</div>
                    <div>{{scope.row.show_time ? scope.row.show_time.split(' ')[1] : ''}}</div>
                  </template>
              </el-table-column>
            </template>
            <!-- 显示索引列 -->
            <template v-if="column.type === 'index'">
              <el-table-column :key="index" :align="column.align || 'center'" :width="column.width" :min-width="column.minWidth" type="index" :label="column.label" :index="column.func" />
            </template>
            <!-- 视频播放 -->
            <template v-if="column.type === 'video'">
              <el-table-column :key="index" :align="column.align || 'center'" :width="column.width" :min-width="column.minWidth" :label="column.label">
                <template slot-scope="scope">
                  <img class="playIcon" title="播放" alt="播放" @click="column.func(scope.row)" src="../../assets/video/play.png">
                </template>
              </el-table-column>
            </template>
             <!-- 图片 -->
            <template v-if="column.type === 'img'">
              <el-table-column :key="index" :align="column.align || 'center'" :width="column.width" :min-width="column.minWidth" :label="column.label">
                <template slot-scope="scope">
                  <img v-if="scope.row[column.param]" class="userImage" :src="scope.row[column.param]" @click="imageShow(scope.row[column.param])">
                </template>
              </el-table-column>
            </template>
            <!-- 显示操作按钮列 -->
            <template v-if="column.type === 'operation'">
              <el-table-column :key="index" :label="column.label" :width="column.width" :min-width="column.minWidth" :align="column.align || 'center'">
                <template slot-scope="scope">
                  <template v-for="(item, i) in column.list">
                    <template v-if="!item.hidden || !item.hidden(scope.row)">
                      <template>
                        <el-button v-if="item.label || item.render(scope.row)" size="mini" :key="i" :disabled="item.formatter ? item.formatter(scope.row).disabled : false" :type="item.formatter ? item.formatter(scope.row) : item.type || ''" @click="item.func(scope.row, scope.$index)">
                            {{ item.render ? item.render(scope.row) : item.label ? item.label : scope.row[column.param] }}
                        </el-button>
                      </template>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </template>
          </template>
        </template>
      </template>
    </el-table>
    <section class="table-footer">
      <div class="stock_dom">
        <span v-if="buttonFooter && buttonFooter.length">
          <el-button round @click="toggleSelection(tableData)">反选</el-button>
          <el-button round @click="toggleSelection()">清除</el-button>
          <el-button round v-for="(item, index) in buttonFooter" :key="index" :type="item.type" @click="btnChange(item.func)">{{item.text}}</el-button>
        </span>
        <el-pagination
          v-if="isPagination"
          class="table-pagination"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-size="pagination.pageSize"
          :current-page="pagination.pageNum"
          :total="pagination.total"
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
    </section>
    <el-dialog
        :visible.sync="bigImageShow"
        top="6vh"
        width="40%"
        center>
        <div class="image_info">
          <img :src="imageSrc" alt="">
        </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      bigImageShow: false,
      imageSrc: ''
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableLabel: {
      type: Array,
      default: () => {
        return []
      }
    },
    buttonFooter: {
      type: Array,
      default: () => {
        return []
      }
    },
    loadingFlag: {type: Boolean, default: false},
    // 是否显示表格复选框
    isSelection: {type: Boolean, default: false},
    isPagination: { type: Boolean, default: true },
    // 分页数据
    pagination: {
      type: Object,
      default: () => ({ pageSize: 10, pageNum: 1, total: 0 })
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.$emit('handleSizeChange')
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
    // 批量删除按钮
    btnChange (val) {
      this.$emit(val)
    },
    // 表格勾选
    select (rows) {
      this.$emit('selectSingle', rows)
    },
    imageShow (src) {
      this.imageSrc = src
      this.bigImageShow = true
    }
  }
}
</script>
<style lang="less">
.table-index {
  .playIcon {
    width: 22px;
    border-radius: 50%;
    margin-top: 4px;
    cursor: pointer;
  }
  .userImage {
    width: 45px;
  }
  .table-footer {
    padding: 24px 0 14px 0;
    .stock_dom{
      display: flex;
      align-items: center;
      position: relative;
      .prev_block{
        display: inline-block;
        position: absolute;
        right: 25px
      }
      .table-pagination {
        position: absolute;
        right: 10px;
        display: inline-flex;
        justify-content: flex-end;
        height: 100%;
        align-items: center;
      }
    }
  }
  .image_info {
    text-align: center;
    img {
      max-width:100%
    }
  }
}

.el-tooltip__popper {
  max-width: 500px;
}
</style>
