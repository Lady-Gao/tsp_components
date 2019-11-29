<template>
    <div>
        <ul class="cv-maptool">
            <!--   工具箱   -->
            <el-dropdown class="maptool-default maptool-tool" @command="switchOpt">
                <span>
                    <icon name="tool-cabinet_icon" />
                    {{this.$t("components.common.Holall")}} 
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item  v-for="(tool,idx) in tools" :key="idx"  :command="tool.key">
                        {{tool.name}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 地图类型 -->
            <el-dropdown class="maptool-default maptool-tool">
                <span @click="setMapType">
                    <icon name="map-marker" />
                    {{this.mapTypeFlag  ? this.$t("components.common.mapViewType")  : this.$t("components.common.satellite")}}
                </span>
                <el-dropdown-menu slot="dropdown" :class='this.mapTypeFlag ? "roadType" : "noMapType"'>
                    <el-checkbox v-model='checkedVal' @change="setRoad">
                        {{this.$t("components.common.road")}}
                    </el-checkbox>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 搜索地址 -->
            <el-input  size="mini" v-model="mapSearch" v-if="mapName=='GoogleMap' ? false :true"
            :placeholder='$t("components.common.findplace")'  class="maptool-default maptool-search" clearable  />
            <!-- 地图切换  -->
            <el-select v-model="mapName" size="mini" class="maptool-default maptool-search"  @change="handlerSwitchMap">
                <el-option :value="item.val" :label="$t(item.name)" v-for="(item,idx) in mapView" :key="idx" />
            </el-select>
            <!-- 最佳视野-->
            <span class="maptool-default" @click="handlerGetBestView">
                <icon name="niaokanpressed" />
                <span style="font-size: 14px">
                    {{this.$t("components.common.bestView")}}
                </span>
            </span>
            <!-- 全屏 -->
            <icon class="maptool-default" :name="!this.fullscreenFlag ? 'fullscreen' : 'fullscreen-exit'"  @click="handlerFullScreen" />
        </ul>
    </div>
</template>


<script>

import "../css/index.scss";
import exportCanvas from "../../../../utils/mixins/export-canvas";
import service from "../../../../utils/service";
export default { 
  name: "Maptool",
  mixins: [exportCanvas],
    props:{
        layout: {
            type: Array,
            default() {
                return [
                "tool",
                "mapTypes",
                "search",
                "switchmap",
                "bestview",
                "fullscreen"
                ];
            }
        },
        // 需要全屏的DOM id 默认 contents
        fullscreenTarget: {
            type: String,
            default: "contents"
        },
        // marker点数组，只是为了最佳视野聚合
        markers: {
            type: Array,
            default() {
                return [];
            }
        },
        // 需要操作的地图对象(this.refs['map'])
        mapTarget: {},
        target: {
            default: "#contents"
        },
        //传入的地图名称
        currentMapname: {
            default: "GaodeMap"
        },
        //显示的地图选项
        mapView: {
            type: Array,
            default() {
                return [
                    { val: "GaodeMap", name: "components.common.gaodeMap" },
                    { val: "GoogleMap", name: "components.common.googleMap" }
                ];
            }
        }
    },
    data(){
        return {
            tools:[
                {
                key: "toolScreen",
                name: this.$t("components.common.Screenshot")
                },
                {
                key: "toolZoom",
                name: this.$t("components.common.magnification")
                },
                {
                key: "toolDistance",
                name: this.$t("components.common.ranging")
                },
                {
                key: "toolPrint",
                name: this.$t("components.common.Printing")
                },
                {
                key: "toolTraffic",
                name: this.$t("components.common.Traffic")
                },
                {
                key: "Driving",
                name:'线路规划'
                }
            ],
            mapName: "",
            fullscreenFlag: false,
            mapSearch: "",
            mapTypeFlag: false,
            checkedVal: true,
            TrafficFlag: false,
            Truckvisible: false,//线路规划弹框
            TruckValue:0,//线路模式类型
        }
    },
    methods:{
        switchOpt(key){
            this[key]();
        },
        /**
         * 屏幕截图事件
         */
        toolScreen() {
            const _vm = this;
            html2canvas(document.body, {
                onrendered(canvas) {
                    _vm.mixins_exportCanvas(canvas);
                }
            });
        },
        /**
         * 区域放大事件
         */
        toolZoom() {
            const rectangleZoom = this.mapTarget.mapMethods.mapTools("rectangleZoom");
            rectangleZoom.open();
        },
         /**
         * 线路规划事件
         */
        Driving() {
            const rectangleZoom = this.mapTarget.mapMethods.mapTools("Driving");
            this.Truckvisible = true;
            rectangleZoom.open();
        },
        //关闭线路规划弹框
        cloaseTruckbox() {
            this.Truckvisible = false;
            this.mapTarget.mapMethods.driving.clear()
        },
        //线路规划选择
        handleClick(e) {
            if (e !== this.TruckValue) {
                this.TruckValue = e
                let str=''
                switch (e) {
                    case 0:
                        str='LEAST_TIME'
                    break;
                    case 1:
                        str='REAL_TRAFFIC'
                    break;
                }
            }
        },
        /**
         * 测距事件
         */
        toolDistance() {
            const distance = this.mapTarget.mapMethods.mapTools("distance");
            distance.open();
        },

        /**
         * 打印事件
         */
        toolPrint() {
            window.print();
        },

        /***
         * 路况事件
         */
        toolTraffic() {
            this.TrafficFlag = !this.TrafficFlag;
            this.mapTarget.mapMethods.getTrfficObj(["Traffic"], this.TrafficFlag);
        },
        /**
         * 设置是否有路网
         * @param {boolean} val 是否显示路网
         */
        setRoad(val) {
            this.checkedVal = val;
            if(this.mapName=="GaodeMap"){
                this.mapTarget.mapMethods.getTrfficObj(["RoadNet"], val);
            }else{
                this.mapTarget.mapMethods.setMapType(this.checkedVal ? 2 : 1 );
            
            }
        },
        /**
         * 切换地图
         */
        handlerSwitchMap(val) {
            this.mapName = val;
            let mapVal = "";
            switch (val) {
                case "GaodeMap":
                    mapVal = 3;
                break;
                case "GoogleMap":
                    mapVal = 4;
                break;
            }
            this.$emit('changeMap',val)
            this.mapTypeFlag = false;
            this.checkedVal = true;
            this.TrafficFlag = false;
        },
        //设置显示的是普通地图还是卫星地图
        setMapType() {
            if (!this.mapTarget) return;
            // 地图方法
            this.mapTypeFlag = !this.mapTypeFlag;
            if(this.mapName=="GaodeMap"){
                this.mapTarget.mapMethods.getTrfficObj(["Satellite", "RoadNet"],this.mapTypeFlag );
            }else{
                this.mapTarget.mapMethods.setMapType(this.mapTypeFlag ? 2 : 0 );
            }
        },
        // 最佳视野的事件
        handlerGetBestView() {
            if (!this.mapTarget) return;
            // 地图方法
            const { mapMethods } = this.mapTarget;
            if (this.markers.length > 0) {
                mapMethods.getBestView(this.markers);
            } else {
                mapMethods.setCity("上海");
            }
            this.$emit("best-view", this.markers);
        },
        /**
         * 全屏按钮事件
         */
        handlerFullScreen() {
            let dom = this.mapTarget.$el;
            service.requestFullScreen(dom);
        },
       
    },
    created() {
        this.throttle = this.$service.throttle(_ => {
            if (this.mapSearch == "") {
                this.mapTarget.mapMethods.Geocoder("上海");
            } else {
                this.mapTarget.mapMethods.Geocoder(this.mapSearch);
            }
        });
        this.mapName = this.currentMapname;
    },
    watch: {
        mapSearch(val) {
            this.throttle();
        },
        mapTarget(val,oldVal){
            if(val){
                this.mapTarget=val;
            }
        }
    },
}
</script>
<style lang="scss" scoped>

</style>