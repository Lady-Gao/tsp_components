<template>
    <div class="cv-content" ref="content">
        <!-- 侧边栏区域 -->
        <aside class="cv-content-aside" :style="{left: toggle_open ? 0 : '-' + this.defaultLeft + 'px'}">
            <div class="aside-content" ref="aside"><slot name="aside"></slot></div>
            <div class="aside-toggle" @click="handlerToggle" v-if="isAside">
              <i :class="toggle_open?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
            style='vertical-align: middle;' color='rgb(161,191,223)'></i>
            </div>
        </aside>

        <!-- 主界面内容区域 -->
        <ul 
            v-loading="loading"
            :noresize="noresize"
            class="cv-content-main heightStyle"
            :style="{left: main_left + 'px'}">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
export default {
  name: "content",
  props: {
    loading: Boolean,
    noresize: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      main_left: 310,
      toggle_open: true,
      isAside: true,
      defaultLeft: 310,
      isNoEmpty: true
    };
  },
  computed: {
    content() {
      return this.$refs["content"];
    },
    aside() {
      return this.$refs["aside"];
    }
  },
  methods: {
    handlerToggle() {
      this.toggle_open = !this.toggle_open;
      this.updateToggle(this.toggle_open);
    },

    /**
     * 根据标示Boolean控制缩进
     * @param {Boolean} flag: true: 打开 false: 铺满
     */
    updateToggle(flag) {
      if (flag) {
        this.toggle_open = true;
        this.main_left = this.defaultLeft;
      } else {
        this.toggle_open = false;
        this.main_left = 0;
      }
      this.$emit("showTree",flag)
    }
  }
};
</script>

<style lang="scss">
@import "@assets/css/var.scss";
.cv-content {
  height: 100%;
//   position: relative;
  @mixin position {
    position: absolute;
    top: 0;
    bottom: 0;
  }
  $padding-10: 0 10px;
  .cv-content-aside {
    @include position;
    left: 0;
    width: 300px;
    padding: $padding-10;
    transition: $all-transition;
    .aside-content {
      height: 100%;
    }
    .aside-toggle {
      z-index: 1;
      position: absolute;
      top: 45%;
      cursor: pointer;
      width: 20px;
      height: 25px;
      line-height: 25px;
      right: -11px;
      border: 1px solid #ccc;
      border-left: 0px;
      background: #fff;
      border-radius: 0px 5px 5px 0px;
      -moz-border-radius: 0px 5px 5px 0px;
      -webkit-border-radius: 0px 5px 5px 0px;

    }
  }
  .cv-content-main {
    @include position;
    right: 0;
    background: rgb(255, 255, 255);
    margin: 0px 10px 0px 15px;
    transition: $all-transition;
  }
  .heightStyle {
    height: 100%;
    padding: 10px;
    .cv-scrollbar__view {
      height: 100%;
    }
  }
}
</style>
