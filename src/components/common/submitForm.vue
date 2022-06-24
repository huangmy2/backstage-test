<template>
  <div>
    <el-form>
      <template v-for="(item,index) in forms">
        <div :key="index">
          <el-form-item v-if="item.type==='input'">
            <el-input></el-input>
          </el-form-item>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    forms: { type: Array }
  }

}
</script>

<style>
</style>
