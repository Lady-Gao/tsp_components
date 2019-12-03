<template>
    <el-form :inline="true"  :class="['cv-operation', position=='right'?'cv-operation-right': 'cv-operation-left']">
        <slot></slot>
        <span v-if="$slots.header" class="toggle" @click="showItem">{{flag ? '收起' : '展开'}}<i :class="flag?'el-icon-arrow-up' :'el-icon-arrow-down'"></i></span>
        <div :class="flag?'blank':''">
            <slot name="header" v-if="flag"></slot>
        </div>
    </el-form>
</template>

<script>
export default {
    name: 'Operation',
    props: {
        // 目前只有左和右2个位置
        position: {
            type: String,
            default: 'left'
        }
    },
    data(){
        return {
            flag:false
        }
    },
    methods:{
        showItem(){
            this.flag=!this.flag;
        }
    }
}
</script>

<style lang="scss" >
.cv-operation{
    .cv-operation-left {
        text-align: left;
    }
    .cv-operation-right {
        text-align: right;
    }
    .blank{
        padding-top: 10px;
        border-top: 1px dashed  #E9E9E9;
    }
    .toggle{
        font-size: 14px;
        color: #1890FF;
        cursor: pointer;
        float:right;
        margin: 7px 20px 0px 0px;
    }
}  
</style>


