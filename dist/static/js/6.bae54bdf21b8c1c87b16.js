webpackJsonp([6],{UgR0:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={name:"talkList",data:function(){return{total:0,loading:!1,tableData:[],tableLabel:[{label:"ID",param:"id",align:"center",hidden:!1},{label:"话题名称",param:"title",align:"center",func:this.cancelDialog,type:"colorText",render:function(a){if(a.title)return"color: #13a8a8"}},{label:"视频数",param:"video_num",align:"center",width:"200"},{label:"账号数",param:"user_num",align:"center"},{label:"话题总VV",param:"talk_video_show",align:"center"}],pagination:{pageSize:20,pageNum:1,total:0}}},components:{dqdTable:e("yivU").a},methods:{handleCurrentChange:function(a){this.pagination.pageNum=a,this.init()},cancelDialog:function(a){this.$router.push("/topicVideoList/"+a.id)},init:function(){var a=this;this.loading=!0,this.$axios.get("/admin/getTalkList?page="+this.pagination.pageNum+"&size=20").then(function(t){console.log(t),0===t.data.code?(a.tableData=t.data.data.List||[],a.pagination.total=t.data.data.count||"",a.loading=!1):console.log("无数据")})}},created:function(){this.init()}},i={render:function(){var a=this.$createElement,t=this._self._c||a;return t("div",{staticClass:"wrap"},[t("el-card",[t("dqd-table",{attrs:{isPagination:!0,"table-data":this.tableData,"table-label":this.tableLabel,pagination:this.pagination,loadingFlag:this.loading},on:{handleCurrentChange:this.handleCurrentChange}})],1)],1)},staticRenderFns:[]};var l=e("VU/8")(n,i,!1,function(a){e("VVcj")},"data-v-35efa2d0",null);t.default=l.exports},VVcj:function(a,t){}});
//# sourceMappingURL=6.bae54bdf21b8c1c87b16.js.map