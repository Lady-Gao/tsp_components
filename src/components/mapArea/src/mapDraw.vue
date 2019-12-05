<template>
     <div class="formAction" v-show="isShow||toolDia">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="line-height: 1;font-size: 18px;">{{title}}</span>
                <i class="el-icon-close" style="float: right;" @click="clearDia" v-if="!toolType"></i>
                <el-button-group style="float: right;" v-if="toolType">
                    <el-button  type="primary" :loading="subStatus" @click="submitFence">{{$t('action.save')}}</el-button>
                    <el-button  @click="comeBack">{{$t("action.back")}}</el-button>
                </el-button-group>
            </div>
            <cv-scrollbar class="formClass">
                <div class="tool">
                    <label class="typeName">标注类型</label>
                    <el-button-group>
                        <el-tooltip class="item" effect="dark" content="点" placement="top-start" v-if="toolType">
                            <el-button :class="(isModify &&ruleType == 0)?'disClass':(drawType == 0?'disClass':'')" :disabled="isModify" icon="el-icon-location-outline" @click="mapDrawTool(0,'Marker')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('common.fence.circle')" placement="top-start">
                            <el-button :class="(isModify &&ruleType == 1)?'disClass':(drawType == 1?'disClass':'')" :disabled="isModify" icon="el-icon-tsp-yuanxing" @click="mapDrawTool(1,'Circle')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('common.fence.rectangle')" placement="top-start" >
                            <el-button :class="(isModify &&ruleType == 2)?'disClass':(drawType == 2?'disClass':'')" :disabled="isModify" icon="el-icon-tsp-rectangle" @click="mapDrawTool(2,'Rectangle')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('common.fence.polygon')" placement="top-start" v-if="toolType">
                            <el-button :class="(isModify && ruleType == 3)?'disClass':(drawType == 3?'disClass':'')" :disabled="isModify" icon="el-icon-tsp-duobianxing" @click="mapDrawTool(3,'Polygon')"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('action.reset')" placement="top-start">
                            <el-button :disabled="isModify" icon="el-icon-delete" @click="clearOverlay"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </div>
                <slot ></slot>
            </cv-scrollbar>
        </el-card>
    </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import bluePng from "@/assets/img/map/2.png"
// import { setTimeout } from 'timers';
export default {
    name:"MapArea",
//     props:{
//         title:'',//卡片名称
//         isModify: false,//新增or修改
//         ruleType:null,//标注类型
//         mapFun:null,//地图方法
//         diaFlag:true,//禁止标注
//         toolType:true,
//         toolDia:false,
//         data:{}
//     },
//     // data(){
//     //     return {
//     //         isShow:true,
//     //         drawType:null,
//     //         overlay:null
//     //     }
//     // },
//     // computed:{
//     //     ...mapGetters(["mapName"]),
//     // },
//     // methods:{
//     //     //鼠标事件
//     //     mapDrawTool(ruleType,name){
//     //         this.isShow = false;
//     //         this.clearOverlay();
//     //         this.drawType = ruleType;
//     //         if(ruleType != 0){
//     //             this.mapFun.mapMethods.drawOverlay(name,(options => {
//     //                 this.overlay = options.overlay;
//     //                 this.$emit("update:diaFlag", false);
//     //                 this.isShow = true;
//     //                 this.$emit("getArea",this.overlay);//获取经纬度
//     //             }));
//     //         }else{
//     //             this.AddMarker();
//     //         }
//     //     },
//     //     //显示圆
//     //     addCircleView(data){
//     //         let pointarr = data.pointList[0];
//     //         let points = { lat: pointarr.latitude, lng: pointarr.longitude };
//     //         this.radius = data.radius;
//     //         let point = this.mapFun.mapMethods.point(points);
//     //         this.overlay = this.mapFun.mapMethods.mapAddcircle(point, this.radius);
//     //     },
//     //     //显示矩形
//     //     addRectangleView(data){
//     //         let latArr = [],lngArr = [], rectangleData = {};
//     //         if (data.pointList.length > 0) {
//     //             data.pointList.forEach(data => {
//     //                 latArr.push(Number(data.latitude));
//     //                 lngArr.push(Number(data.longitude));
//     //             });
//     //             rectangleData.minLng = Math.min.apply(Math, lngArr);
//     //             rectangleData.minLat = Math.min.apply(Math, latArr);
//     //             rectangleData.maxLng = Math.max.apply(Math, lngArr);
//     //             rectangleData.maxLat = Math.max.apply(Math, latArr);
//     //             this.overlay = this.mapFun.mapMethods.mapAddrectangle(
//     //                 rectangleData,
//     //                 {}
//     //             );
//     //         }
//     //     },
//     //     //显示多边形
//     //     addPolygonView(data){
//     //         let polygonPoints = [];
//     //         data.pointList.forEach(data => {
//     //           polygonPoints.push({ lat: data.latitude, lng: data.longitude });
//     //         });
//     //         this.overlay = this.mapFun.mapMethods.mapAddpolygon(polygonPoints, {});
//     //     },
//     //     //显示点标注
//     //     addPointView(data){
//     //         let polylinePoints = [];
//     //         let point ={
//     //             longitude:data.pointList[0].longitude,
//     //             latitude:data.pointList[0].latitude
//     //         }
//     //         this.overlay = this.mapFun.mapMethods.mapAddpoint(point,bluePng);
//     //         this.mapFun.mapMethods.addOverlay(this.overlay);
//     //     },
//     //     viewMap(data){
//     //         switch (this.ruleType) {
//     //             case 1:
//     //                 this.addCircleView(data);
//     //             break;
//     //             case 2:
//     //                 this.addRectangleView(data);
//     //             break;
//     //             case 3:
//     //                 this.addPolygonView(data);
//     //             break;
//     //             case 0:
//     //                 this.addPointView(data);
//     //             break;
//     //         }
//     //         this.ruleType!=0 && this.mapFun.mapMethods.overlayEdit(this.overlay, true);
//     //     },
//     //     //添加点
//     //     AddMarker() {
//     //         this.mapFun.mapMethods.map.setDefaultCursor("crosshair");
//     //         this.mapName == "cvGaodeMap" ? this.gaodeFun() : this.baiduFun();
//     //     },
//     //     //兼容处理，百度方法
//     //     baiduFun(){
//     //         this.mapFun.mapMethods.addEventListener(this.mapFun.mapMethods.map, 'click',this.drawMarker);
//     //     },
//     //     //兼容处理，高德方法
//     //     gaodeFun(){
//     //         this.mapFun.mapMethods.addEventListener(this.mapFun.mapMethods.MouseTool, 'draw', this.drawMarker)
//     //         this.mapFun.mapMethods.MouseTool.marker({
//     //             map: this.mapFun.mapMethods.map
//     //         });
//     //     },
//     //     drawMarker(event){
//     //         let lat = this.mapName != "cvGaodeMap"?event.point.lat:event.obj.getPosition().lat;
//     //         let lng = this.mapName != "cvGaodeMap"?event.point.lng:event.obj.getPosition().lng;
//     //         if(this.mapName !="cvGaodeMap"){
//     //             //画marker点
//     //             let point = this.mapFun.mapMethods.mapAddpoint({longitude:lng,latitude:lat,},bluePng);
//     //             this.mapFun.mapMethods.addOverlay(point);
//     //             this.overlay = point;
//     //             point.setOffset(new BMap.Size(5, -15));
//     //             this.mapFun.mapMethods.removeEventListener(this.mapFun.mapMethods.map, 'click', this.drawMarker);
//     //         }else{
//     //             this.mapFun.mapMethods.MouseTool.close(false);
//     //             this.overlay = {
//     //                 point: event.obj.getBounds(),
//     //                 overlay: event.obj
//     //             }
//     //             this.mapFun.mapMethods.removeEventListener(this.mapFun.mapMethods.MouseTool, 'draw', this.drawMarker);
//     //         }
//     //         this.$emit("getArea",this.overlay);
//     //         this.$emit("update:diaFlag", false);
//     //         this.mapFun.mapMethods.map.setDefaultCursor("pointer");
//     //         this.isShow = true;
//     //     },
//     //     clearOverlay() {
//     //         if (this.overlay) {
//     //             this.mapFun.mapMethods.removeOverlay(this.overlay);
//     //             this.overlay = null;
//     //             this.$emit("update:diaFlag", true);
//     //             this.drawType = "";
//     //         }
//     //     },
//     //     clearDia(){
//     //         this.overlay = null;
//     //         this.drawType = "";
//     //         this.mapFun.mapMethods.MouseTool.close(true);
//     //         this.mapFun.mapMethods.map.setDefaultCursor("pointer");
//     //         this.$emit("update:toolDia", false);
//     //     },
//     //     submitFence(){
//     //         this.$emit('save',{overlay:this.overlay,ruleType:this.drawType||this.ruleType});
//     //     },
//     //     comeBack(){
//     //         this.$emit("back");
//     //     }
//     // },
//     // mounted(){
//     //     if(this.isModify){
//     //         setTimeout(() => {
//     //             this.viewMap(this.data);
//     //             this.drawType = this.ruleType;
//     //         }, 500);
//     //     }
//     // },
//     watch:{
//         drawType(newVal){
//             this.$emit("update:ruleType", newVal);
//         },
//     }
}
</script>
<style lang="scss" >
.formClass{
    .tool{
        margin-bottom: 18px;
    }
    .typeName{
        width: 108px;
        display: inline-block;
        text-align: right;
        font-size: 14px;
        color: #606266;
        padding: 0 12px 0 0;
        vertical-align: middle;
    }
    .disClass{
        background-color:#20a0ff;
        color:#fff
    }
    
}
</style>
