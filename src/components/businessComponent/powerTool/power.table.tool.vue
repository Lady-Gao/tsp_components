<template>
	<div class="cv-table-tool">
		<span type="success" v-show="modify" @click.native="modifyEvent()" v-if="isModify">{{$t('power.modify')}}</span>
		<span type="danger" v-show="remove" @click.native="removeEvent()" v-if="isRemove">{{$t('power.remove')}}</span>
		<span type="warning" v-show="resend" @click.native="resendEvent()" v-if="isResend">{{$t('power.resend')}}</span>
		<span type="success" v-show="sendAdd" @click.native="sendAddEvent()" v-if="isSendadd">{{$t('power.sendAdd')}}</span>
		<span type="success" v-show="sendEdit" @click.native="sendEditEvent()" v-if="isSendedit">{{$t('power.sendEdit')}}</span>
		<span type="success" v-show="sendDown" @click.native="sendDownEvent()" v-if="isSenddown">{{$t('power.sendDown')}}</span>
		<span type="success" v-show="sendResert" @click.native="resetEvent()" v-if="isSendResert">{{$t('power.sendResert')}}</span>
	</div>
</template>

<script>
// import cvSpan from '../span/span.vue'
export default {
  name: "TableTool",
  props: {
    isModify: {
      type: Boolean,
      default: true
    },
    isRemove: {
      type: Boolean,
      default: true
    },
    isResend: {
      type: Boolean,
      default: false
    },
    isSendadd: {
      type: Boolean,
      default: false
    },
    isSendedit: {
      type: Boolean,
      default: false
    },
    isSenddown: {
      type: Boolean,
      default: true
    },
    isSendResert: {
      type: Boolean,
      default: false
    },
    data: {
      default() {
        return [];
      }
    },
    name: {},
    size: {
      default: "small"
    }
  },
  data() {
    return {
      modify: false,
      remove: false,
      resend: false,
      sendAdd: false,
      sendEdit: false,
      sendDown: false,
      search: true,
      add: false,
      sendResert: false
    };
  },
  methods: {
    isPower(data) {
      data &&
        data.forEach(val => {
          console.log(val)
          switch (val) {
            case "search":
              return (this.search = true);
            case "add":
              return (this.add = true);
            case "modify":
              return (this.modify = true);
            case "remove":
              return (this.remove = true);
            case "resend":
              return (this.resend = true);
            case "sendAdd":
              return (this.sendAdd = false);
            case "sendEdit":
              return (this.sendEdit = false);
            case "sendDown":
              return (this.sendDown = true);
            case "sendResert":
              return (this.sendResert = true);
          }
        });
    },
    modifyEvent() {
      this.$emit("modify");
    },
    removeEvent() {
      this.$emit("remove");
    },
    resendEvent() {
      this.$emit("resend");
    },
    sendAddEvent() {
      this.$emit("sendAdd");
    },
    sendEditEvent() {
      this.$emit("sendEdit");
    },
    sendDownEvent() {
      this.$emit("sendDown");
    },
    resetEvent() {
      this.$emit("sendResert");
    },
  },
  mounted() {
    if (this.$service.isArray(this.data) && this.data.length > 0) {
      this.isPower(this.data);
    }
  },
  watch: {
    data(val){
        if(val){
            this.isPower(val);
        }
    }
  }
};
</script>

<style lang="scss">
.cv-table-tool {
  display: inline;
}
</style>
