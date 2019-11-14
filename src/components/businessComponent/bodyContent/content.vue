<template>
    <div class="cv-content" ref="content">
        <!-- 主界面内容区域 -->
        <Scrollbar
            tag="ul"
            wrap-class="heightStyle"
            v-loading="loading"
            :noresize="noresize"
            :class="['cv-content-main']"
            >
            <slot></slot>
        </Scrollbar>
    </div>
</template>

<script>
export default {
  name: "BodyContent",
  props: {
    loading: Boolean,
    noresize: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    content() {
      return this.$refs["content"];
    },
  },
  mounted() {
    this.calcContentHeight();
  },
  methods: {
    /**
     * 计算content高度的变化
     */
    calcContentHeight() {
      var timer = setTimeout(_ => {
        clearTimeout(timer);
        timer = null;
        const top = this.content.getBoundingClientRect().top;
        this.content.style.height = window.innerHeight - top - 5 + "px";
      }, 500);
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/css/element-variables.scss";
.cv-content {
  position: relative;
  @mixin position {
    position: absolute;
    top: 0;
    bottom: 0;
  }
  $padding-10: 0 10px;

  .cv-content-main {
    @include position;
    right: 0;
    left:0;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
  }
  .heightStyle {
    height: 100%;
    overflow-x: hidden;
    .cv-scrollbar__view {
      height: 100%;
    }
  }
}
</style>
