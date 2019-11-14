<template>
	<div>
		<el-row class="item" >
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">caninfo:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	</div>
</template>

<script>
// import BaseTemplate from "./base-template";
export default {
  props: {
    detailInfo: {}
  },
  components: {
    // BaseTemplate
  },
  methods: {
    renderTemplate() {
      return [
        {
          label: this.$t("multiCar.speedAround"),
          prop: "can1",
          filter: "isValue(rm)"
        },
        {
          label: this.$t("multiCar.throttle"),
          prop: "can2",
          filter: "isValue(%)"
        },
        {
          label: this.$t("multiCar.torque"),
          prop: "can3",
          filter: "isValue(%)"
        },
        {
          label: this.$t("multiCar.temperature"),
          prop: "can4",
          filter: "isValue(℃)"
        },
        {
          label: this.$t("multiCar.oilpressure"),
          prop: "can4",
          filter: "isValue(ka)"
        },
        {
          label: this.$t("multiCar.voltage"),
          prop: "can5",
          filter: "isValue(V)"
        },
        {
          label: this.$t("multiCar.fuellevel"),
          prop: "can6",
          filter: "isValue(%)"
        }
      ];
    }
  }
};
</script>
