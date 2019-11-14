<template>
	<div>
	
	<el-row class="item" >
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">electiric:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	</div>
</template>
<script>
// import BaseTemplate from './base-template'
export default {
  props: {
    detailInfo: {}
	},
	components:{
		// BaseTemplate
	},
	methods: {
			renderTemplate() {
			return [
					{ label: this.$t("油路状态"), prop: 'oilWayStatus', filter: 'oilWayStatus'},
					{ label: this.$t("multiCar.cardoorstate"), prop: 'doorLockStatus', filter: 'doorLockStatus'},
				{ label: this.$t("multiCar.Circuitstate"), prop: 'circuitStatus', filter: 'circuitStatus'},
				{ label: this.$t("multiCar.braking"), prop: 'brakeSignal', filter: 'topCapStatus'},
					{ label: this.$t("multiCar.Nearlight"), prop: 'nearLightSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Farlight"), prop: 'beamSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Leftturn"), prop: 'leftTurnSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.rightturn"), prop: 'rightTurnSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Reversegear"), prop: 'reverseSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Foglamp"), prop: 'fogSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.porchlamp"), prop: 'outlineMarkerLamps', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.horn"), prop: 'speakerSingnal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.AIRconditioner"), prop: 'conditioningState', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Empty"), prop: 'neutralSignal', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.retarder"), prop: 'retarder', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.ABS"), prop: 'absWorking', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.heater"), prop: 'heater', filter: 'topCapStatus'},
				{ label: this.$t("multiCar.Clutch"), prop: 'clutchStatus', filter: 'topCapStatus'},
			]
		},
	},
};
</script>
