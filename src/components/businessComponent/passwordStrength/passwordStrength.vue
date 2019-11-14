<template>
	<ul class="cv-password-strength">
		<li class="password-strength-item" :style="{'background':danger?color[0]:defaultColor, 'width': '50px'}">危险</li>
		<li class="password-strength-item" :style="{'background':normal?color[1]:defaultColor}">一般</li>
		<li class="password-strength-item" :style="{'background':safe?color[2]:defaultColor}">安全</li>
	</ul>
</template>

<script>
export default {
  name: "PasswordStrength",
  props: {
    value: {}
  },
  data() {
    return {
      defaultColor: "#d9d5d5",
      color: ["#ff4949", "#f7ba2a", "#13ce66"],
      danger: false,
      normal: false,
      safe: false
    };
  },
  methods: {
    checkStrength(val) {
      let level = 0;
      /\d+/.test(val) && level++;
      /[A-Za-z]+/.test(val) && level++;
      /[^A-Za-z0-9]+/.test(val) && level++;
      switch (level) {
        case 1:
          this.danger = true;
          this.normal = false;
          this.safe = false;
          this.$emit("level", 1);
          break;
        case 2:
          this.normal = true;
          this.danger = false;
          this.safe = false;
          this.$emit("level", 2);
          break;
        case 3:
          this.safe = true;
          this.danger = false;
          this.normal = false;
          this.$emit("level", 3);
          break;
        default:
          this.safe = false;
          this.danger = false;
          this.normal = false;
          this.$emit("level", 0);
          break;
      }
    }
  },
  watch: {
    value(newVal) {
      this.checkStrength(newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.cv-password-strength {
  display: inline-block;
  .password-strength-item {
    display: inline-block;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    width: 50px ;
    color: #fff;
  }
}
</style>
