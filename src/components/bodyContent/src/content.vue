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
</style>
