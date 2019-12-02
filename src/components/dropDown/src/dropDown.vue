<template>
    <div class="cv-dropdown">
        <slot></slot>
        <transition name="el-zoom-in-top">
            <div :class="['cv-dropdown-content', className]" v-show="visible">
                <div :class="['cv-arrow', 'cv-arrow'+placement]"></div>
                <slot name="dropdown"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Dropdown',
    props: {
        // 箭头出现的位置(top(start, end),right,bottom,left)
        placement: {
            type: String,
            default: 'top-start'
        },
        visible: {
            type: Boolean,
            default: true
        },
        className: String
    }

}
</script>

<style lang="scss">
    @import '../css/arrow.scss';
    .cv-dropdown {
        position: relative;
    }
    .cv-dropdown-content {  
        min-width: 100px;
        padding: 8px;
        box-sizing: border-box;
        position: absolute;
        top: 100%;
        z-index: 2001;
        margin-top: 12px;
        border-radius: 2px;
        background: #fff;
        border: 1px solid #eee;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
</style>


