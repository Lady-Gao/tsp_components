<template>
<div>

	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
	<el-row class="item" >
			<el-col :span="6">ACC状态0:</el-col>
			<el-col :span="6">/</el-col>
			<el-col :span="6">ACC状态1:</el-col>
			<el-col :span="6">/</el-col>
		</el-row>
</div>
	
</template>

<script>
// import BaseTemplate from './base-template'
export default {
  props: {
    basicInfo: {}
	},
	
	// components: { BaseTemplate },

  computed: {
    /**
     * 定位状态
     */
    locMode() {
      if (!this.basicInfo.locationMode) return "/";
      switch (this.basicInfo.locationMode.mode) {
        case 0:
          return this.$t("common.alarm.Nolocation");
          break;
        case 1:
          return this.$t("common.alarm.GPSpositioning");

          break;
        case 2:
          let str = this.$t("common.alarm.HighPpositioning");
          str +=
            "(" +
            this.$filter.baseMode(this.basicInfo.pattern, this.basicInfo.mode) +
            ")";
          return str;
          break;
        case 3:
          return this.$t("common.alarm.BaseStation");
          break;
      }
    }
	},
	
  methods: {
		renderTemplate() {
			return [
			
				{ label: this.$t("common.vehicleMessage.speed"), formatter: this.speedFormatter },
				{ label: this.$t("common.vehicleMessage.Totalmileage"), prop: 'mileage', filter: 'isValue(km)'},
				{ label: this.$t("common.mtindex.direction"), prop: 'directionText', filter: 'direction|isValue'},
				{ label: this.$t("historyTrack.altitude"), prop: 'height', filter: 'isValue(m)'},
				{ label: this.$t("common.vehicleMessage.longitude"), prop: 'mapLongitude', filter: 'toFixed(6)|isValue'},
				{ label: this.$t("common.vehicleMessage.latitude"), prop: 'mapLatitude', filter: 'toFixed(6)|isValue'},
				{ label: this.$t("common.vehicleMessage.currenAlarn"), prop: 'alarmCount', filter: 'isValue'},
				{ label: this.$t("common.vehicleMessage.TerminalesidualEnergylongitude"), prop: 'devBattery', filter: 'isValue(%)'},
				{ label: this.$t("是否在机场内"), prop: 'relativePosition',  formatter: this.relativePosition},
				
        { label: this.$t("common.vehicleMessage.Accstate"), prop: 'accStatus', filter: 'accStatus'},
        { label: this.$t("common.alarm.positioning"), formatter: this.localPosition,width:"440px"},
        	{ 
					label: this.$t("common.vehicleMessage.Reportingtime"), 
					prop: 'gpsTime', 
					filter: 'format("yyyy-MM-dd HH:mm:ss")|isValue',width:"440px"},
				{ label: this.$t("common.alarm.videoAlarm"), prop: 'videoAlarm', filter: 'isValue',width:"440px"},
				{ label: this.$t("common.alarm.alarmMsg"), prop: 'alarmShortInfo', filter: 'isValue',width:"440px" },
				{ label: this.$t("common.vehicleMessage.geographical"), prop: 'locationDesc', filter: 'isValue',width:"440px" ,itemWidth:'340px'},
			]
		},

		speedFormatter(row, column) {
			const result = column.dspeed == "0.0"
				? column.gpsSpeed =='0.0' ? ''
				:column.gpsSpeed:column.dspeed;
			return (
				<span style={{'color':column.locateStatus == 1?'#000':'red'}}>
					{this.$filter.isValue(result, 'km/h')}
				</span>
			)
		},
relativePosition(val){
     switch (val) {
                   case undefined:
                       return "/"
                       break;
                   case "in":
                       return "是"
                       break;
                   case "out":
                       return "否"
                       break;
               
               }
},
		localPosition(row, column) {
			if (!column.locationMode) return "/";
      switch (column.locationMode.mode) {
        case 0:
          return this.$t("common.alarm.Nolocation");
          break;
        case 1:
          return this.$t("common.alarm.GPSpositioning");

          break;
        case 2:
          let str = this.$t("common.alarm.HighPpositioning");
          str +=
            "(" +
            this.$filter.baseMode(column.pattern, column.mode) +
            ")";
          return str;
          break;
        case 3:
          return this.$t("common.alarm.BaseStation");
          break;
      }
		}
	}
};
</script>
<style scoped> 
.item{
	margin: 10px 0;
}
</style>

