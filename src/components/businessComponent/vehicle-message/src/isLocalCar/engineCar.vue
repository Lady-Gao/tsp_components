<template>
	<div class="loaclLast" style="height=360px">
		<el-form :model="form" :rules="rules" ref="form" label-width="100px">
			<el-form-item :label="$store.getters.isShowCar?$t('cvtsp.remove'):$t('cvtsp.limit')" prop="reason" style="width:512px">
				<el-input type="textarea"  :placeholder="$t('companyManage.ph1')" v-model.trim="form.reason"   class="text2">
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('cvtsp.tel')" prop="number" style="width:512px">
				<el-checkbox v-model="checked">{{$t('cvtsp.telMessage')}}</el-checkbox>
				<el-input :placeholder="$t('companyManage.ph1')" v-model="form.number">
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('cvtsp.telMessage')" prop="message" style="margin-top:20px;width:512px">
				<el-input type="textarea" :placeholder="$t('companyManage.ph1')" v-model="form.message"  class="text2">
				</el-input>
			</el-form-item>
			<el-form-item style="margin-top:30px;">
				<el-button type="primary" @click="goBack()" class="confirm">{{$t('cvtsp.prevStep')}}</el-button>
				<el-button type="primary" @click="submitForm(form)" class="cancel" :loading="loading" aria-label="Close" v-if="!$store.getters.isShowCar">{{$t('cvtsp.lit')}}</el-button>
				<el-button type="primary" @click="submitForm(form)" class="cancel" :loading="loading" aria-label="Close" v-if="$store.getters.isShowCar">{{$t('cvtsp.reomveLit')}}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
// import { http, COMMON } from "@/utils";
// import { mapGetters } from "vuex";
export default {
  props: {
    data: {}
  },
  computed: {
    // ...mapGetters(["multicar_currentVehicle"], ["isLocalPassword"])
  },
  inject: ["store"],
  data() {
    return {
      typePam: "",
      loading: false,
      checked: false,
      form: {
        reason: "",
        number: "",
        message: ""
      },
      dialog: {
        flag: false
      },
      rules: {
        reason: [
          {
            required: true,
            message: "限制原因不能为空",
            trigger: "blur,change"
          }
        ],
        number: [
          {
            required: false,
            message: "手机号不能为空",
            trigger: "blur,change"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message:   ("terminalProM.typeCorrectNum")
          }
        ],
        message: [
          {
            required: false,
            message: "短信内容不能为空",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  methods: {
    lastCarStatus() {
      let params = {
        vehicleId: this.multicar_currentVehicle.vehicleId
      };
      this.$http({
        url: "/lockCar/queryStatus",
        method: "POST",
        params: params
      }).then(data => {
        if (data.flag) {
          if (data.data == "0") {
            this.$store.dispatch("isShowCar", true);
          } else {
            this.$store.dispatch("isShowCar", false);
          }
        } else {
        }
      });
    },
    goBack() {
      this.$parent.$parent.dialog.active = 2;
      this.data.moreErect = false;
    },
    submitForm(form) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {
            vehicleId: this.multicar_currentVehicle.vehicleId,
            //限制类型
            type: this.$store.getters.isShowCar ? 0 : 1,
            //能力项id
            // abillityIds: this.$store.getters.isShowCar ? this.$store.getters.isAllInfo.abillityIds : this.$store.getters.isLocalCar,
            abillityIds: 7,
            //操作通知的手机号
            number: this.form.number,
            //限制原因
            reason: this.form.reason,
            //限制密码
            password: this.store.isLocalPassword,
            //短信内容
            content: this.form.message,
            //断油类型参数
            infoParam: "5,1"
          };
          this.typePam = params.type;
          this.loading = true;
          this.$http({
            url: "/lockCar/confirm",
            method: "POST",
            params: params
          }).then(data => {
            let _self = this;
            if (data.flag) {
              _self.store.$parent.$parent.dialog.flag = false;
              this.lastCarStatus();
              this.loading = false;
            } else {
              this.$message.error(  ("error." + data.errorCode));
              this.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    checked(newVal) {
      if (newVal == true) {
        this.rules.number[0].required = true;
        this.rules.message[0].required = true;
      } else if (newVal == false) {
        this.rules.number[0].required = false;
        this.rules.message[0].required = false;
      }
    },
    "data.flag"(newVal) {
      this.dialog.flag = newVal;
    }
    // 'typePam'(newVal){
    // 	if(newVal==0){
    // 		return this.$store.getters.isShowCar=false;
    // 	}else{
    // 		return this.$store.getters.isShowCar=true;
    // 	}
    // }
  }
};
</script>
<style lang="scss">
.text2 {
  textarea {
    overflow-y: hidden;
  }
}
</style>
