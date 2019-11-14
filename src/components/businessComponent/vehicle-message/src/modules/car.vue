<template>
	<div>
			<el-row class="item" >
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">car:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">car:</el-col>
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
          label: this.$t("placeholder.Owneden"),
          prop: "enterpriseName",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Groupings"),
          prop: "fleetName",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Framenumber"),
          prop: "carVin",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.SIMcar"),
          prop: "simCode",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Terminalnumber"),
          prop: "terminalCode",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.LicenseColor"),
          prop: "plateColor",
          filter: "plateCodeColor|isValue"
        },
        {
          label: this.$t("multiCar.Driver"),
          prop: "driver",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Vehicleband"),
          prop: "brandName",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Vehiclemodel"),
          prop: "modelName",
          filter: "isValue"
        },
        {
          label: this.$t("multiCar.Vehicletype"),
          prop: "vehicleType",
          filter: "vehicleType|isValue"
        },
        {
          label: this.$t("multiCar.Enginenumber"),
          prop: "engineCode",
          filter: "isValue"
        }
      ];
    }
  }
};
</script>
