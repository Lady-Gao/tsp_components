<template>
    <el-form :inline="true" 
    :class="['cv-operation', position=='right'?'cv-operation-right': 'cv-operation-left']">
        <slot></slot>
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
    }
}
</script>

<style lang="scss">
    .cv-operation-left {
        text-align: left;
    }
    .cv-operation-right {
        text-align: right;
    }
</style>


