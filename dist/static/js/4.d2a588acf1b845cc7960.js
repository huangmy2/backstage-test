webpackJsonp([4],{fAfb:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o={data:function(){return{count:0,redirect:void 0,loading:!1,ruleForm:{codeNumber:"",phoneNumber:""},rules:{codeNumber:[{validator:function(e,r,t){if(!r)return t(new Error("请输入验证码"));t()},trigger:"blur"}],phoneNumber:[{validator:function(e,r,t){return""===r?t(new Error("请输入手机号")):/^1[3456789]\d{9}$/.test(r)?void t():t(new Error("请输入正确的手机号"))},trigger:"blur"}]}}},watch:{$route:{handler:function(e){this.redirect=e.query&&e.query.redirect},immediate:!0}},methods:{getCode:function(){var e=this;if(!this.ruleForm.phoneNumber)return this.$message.error("请输入正确手机号"),!1;this.$axios.get("http://test-admin-dstock.dongqiudi.net/admin/smsSend?phone="+this.ruleForm.phoneNumber).then(function(r){if(console.log(r),0===r.data.code){e.$message({message:"获取验证码成功",type:"success"}),e.count=60;var t=setInterval(function(){e.count--,e.count<=0&&clearInterval(t)},1e3)}else e.$message.error("获取验证码失败")})},handleLogin:function(e){var r=this;this.$refs[e].validate(function(e){if(!e)return console.log("登录失败！！！error submit!!"),!1;console.log("审核通过，登录成功！！！"),r.loading=!0,r.$store.dispatch("user/Login",r.ruleForm).then(function(e){"loginSuccess"===e?(r.$message({message:"登录成功",type:"success"}),setTimeout(function(){r.$router.push({path:r.redirect||"/"})},1e3)):r.$message.error(e),r.loading=!1}).catch(function(e){console.log(e),r.$message.error(e),r.loading=!1})})}}},n={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"login"},[t("el-form",{ref:"ruleForm",staticClass:"login-form",attrs:{model:e.ruleForm,prop:e.ruleForm,"status-icon":"",rules:e.rules,"label-width":"60px"}},[t("h3",{staticClass:"login-tit"},[e._v("Welcome Login")]),e._v(" "),t("el-form-item",{attrs:{label:"手机号",prop:"phoneNumber"}},[t("el-input",{model:{value:e.ruleForm.phoneNumber,callback:function(r){e.$set(e.ruleForm,"phoneNumber",e._n(r))},expression:"ruleForm.phoneNumber"}})],1),e._v(" "),t("div",{staticClass:"password-content"},[t("el-form-item",{staticClass:"pass-code",attrs:{label:"验证码",prop:"codeNumber"}},[t("el-input",{model:{value:e.ruleForm.codeNumber,callback:function(r){e.$set(e.ruleForm,"codeNumber",r)},expression:"ruleForm.codeNumber"}})],1),e._v(" "),e.count?t("span",{staticClass:"get-code-btn resend"},[e._v("重新发送"+e._s(e.count))]):t("span",{staticClass:"get-code-btn",on:{click:e.getCode}},[e._v("获取验证码")])],1),e._v(" "),t("span",{staticClass:"login-btn",on:{click:function(r){return e.handleLogin("ruleForm")}}},[e._v("登录")])],1)],1)},staticRenderFns:[]};var s=t("VU/8")(o,n,!1,function(e){t("kpro")},null,null);r.default=s.exports},kpro:function(e,r){}});
//# sourceMappingURL=4.d2a588acf1b845cc7960.js.map