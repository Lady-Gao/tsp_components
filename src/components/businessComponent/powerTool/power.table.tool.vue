<template>
	<div class="cv-table-tool">
		<span class="blue" v-show="modify" @click="modifyEvent()" v-if="isModify">{{$t('power.modify')}}</span>
		<span class="red" v-show="remove" @click="removeEvent()" v-if="isRemove">{{$t('power.remove')}}</span>
		<span class="blue1" v-show="resend" @click="resendEvent()" v-if="isResend">{{$t('power.resend')}}</span>
		<span class="green" v-show="sendAdd" @click="sendAddEvent()" v-if="isSendadd">{{$t('power.sendAdd')}}</span>
		<span class="red1" v-show="sendEdit" @click="sendEditEvent()" v-if="isSendedit">{{$t('power.sendEdit')}}</span>
		<span class="red2" v-show="sendDown" @click="sendDownEvent()" v-if="isSenddown">{{$t('power.sendDown')}}</span>
		<span class="green" v-show="sendResert" @click="resetEvent()" v-if="isSendResert">{{$t('power.sendResert')}}</span>
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
      default: false
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
            case "reset":
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
      this.$emit("reset");
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
  span{
    padding:0px 8px;
    border-right: 1px solid rgba(0,0,0,0.09);
    font-size: 14px;
    cursor: pointer;
  }
  span:last-child{
    border: 0px;
  }
   .blue{
      color: #008FFF;
    }
    .blue1{
      color: #62EBDE;
    }
    .green{
      color: #00C900;
    }
    .red{
      color: #FF4200;
    }
    .red1{
      color: #FF0099;
    }
    .red2{
      color: #7E19D9;
    }
}
</style>
