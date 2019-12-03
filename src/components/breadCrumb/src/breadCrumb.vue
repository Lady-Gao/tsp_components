<template>
  <el-breadcrumb  class='bread'>
    <el-breadcrumb-item :to='{path:item.path}' v-for="item in levelList" :key="item.path" class="linkitm">{{item.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name:"BreadCrumb",
  data() {
    return {
    };
  },
  computed:{
    levelList(){
      return this.$route.matched
    }

  }
};
</script>
<style  lang='scss'>
.bread{
  height:34px;
  line-height: 34px !important;
  vertical-align: middle;
  padding-left: 12px;
  font-size: 12px;
  border-bottom: 1px solid #e9e9e9;
  background: #fff;
  .is-link >>>{
    font-family: PingFangSC-Regular;
    font-weight: 100 !important;
    color:#868789 !important;
  }

}
.el-breadcrumb__item:last-child .el-breadcrumb__inner {
   color: #1989FA !important;
 }
</style>

