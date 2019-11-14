<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class='bread'>
    <el-breadcrumb-item :to='{path:item.path}' v-for="item in levelList" :key="item.path">{{item.meta.title}}</el-breadcrumb-item>
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
<style scpoed lang='scss'>
.bread{
    padding-top: 4px;
    line-height: 34px;
    height: 34px;
    box-sizing: border-box;
    .el-icon-arrow-right:before {
        content: "/"  !important;
        color: #5f5a5a;
        margin: 0px 5px; 
    }
}
</style>

