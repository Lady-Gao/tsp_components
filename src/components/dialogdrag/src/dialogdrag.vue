
<template>
  <el-dialog
    :modal="false"
    :modal-append-to-body="true"
    :title="tittle"
    :visible.sync="dialogVisible"
    :width="width"
    :height="height"
    :close-on-click-modal="false"
    :show-close="true"
    :close-on-press-escape="true"
    center
    v-dialogdrag
    v-borderlimit>
    <slot></slot>
  </el-dialog>
</template>
<script>
  export default {
    name:"Dialogdrag",
    props: {
      dialogVisible: {
        type: Boolean,
        default: true
      },
      switchStyle: {
        type: Boolean,
        default: true
      },
      tittle: {
        type: String,
        default: '标题'
      },
      width: {
        type: String,
        default: "35%"
      },
      height: {
        type: String,
        default: "1000px"
      },
    },
    data(){
      return {
      }
    },
    methods: {
    },
    components: {
    }
 
  }
</script>
<style >
  .divauto{
    margin:  10px auto 0 auto;
  }
</style>