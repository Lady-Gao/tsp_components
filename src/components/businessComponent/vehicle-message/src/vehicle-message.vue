<template>
    <div>
        <el-dialog :visible.sync='options.visible'  :modal='false'  v-dialogdrag
      v-borderlimit>
             <div class="messTool">
                        <el-tag >沪A32434</el-tag>
                        <el-tag type="info" >{{this.$t('components.common.location')}}</el-tag>
                        <el-dropdown class="hoveTag" @command='commondChange'>
                            <el-tag >{{this.$t('components.common.order')}}<i class="el-icon-arrow-down el-icon--right"></i></el-tag>
                            <el-dropdown-menu slot = "dropdown" > 
                                <el-dropdown-item command='1'>{{this.$t('components.common.limit')}}</el-dropdown-item>
                                <el-dropdown-item command='2'>{{this.$t('components.common.SingleCarp')}}</el-dropdown-item> 
                                <el-dropdown-item command='3'>{{this.$t('components.common.Naming')}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                       <el-tag v-for="(item,index) in btnList" :key='index' type="info" class="hoveTag" title={item.text} @click='switchFn(item.key)'><i class="el-icon-delete"></i></el-tag>
                        
                 </div> 
                 <component class = "infoGrounp" :is='baseTable' :basicInfo='data'></component>
                 <div class = "messTab">
                  <el-tabs v-model='activeName' type="border-card"  >
                                          <el-tab-pane :label='item.label' :name='item.name' v-for='(item,index) in bottomTabLists' :key='index'>
                                               <component class = "infoGrounp" :is='item.name' :basicInfo='data'></component>
                                           </el-tab-pane>
                              </el-tabs>
                </div>
        </el-dialog>
    </div>
</template>

<script>
import './vehicle-message.scss'
//指令
import localCar from "./isLocalCar/localCar.vue";
import localCarPassword from "./isLocalCar/localCarPassword.vue";
import engineCar from "./isLocalCar/engineCar.vue";
//tabs
import car from './modules/car.vue'
import sensor from './modules/sensor.vue'
import electric from './modules/electric.vue'
import canInfo from './modules/canInfo.vue'
//中间信息列表
import basic from './modules/base.vue'

    export default {
        name: 'VehicleMessage',
         components: {
       localCar,
       localCarPassword,
       engineCar,
       car,
       sensor,
       electric,
       canInfo,
       basic
    },
        props:  {
           //下部tabs
           // bottomTabLists:Array,
            options: {},
            isSend: {
                type: Boolean,
                default: true
            },
            data: {
                default () {
                    return {}
                }
            }
        },
        data(){
            return {
         locaCarPower: true,
          dialog: {
              title: "--",
              flag: false,
              name: "",
              size: "dialog-tiny",
              infoAll: {}
          },
          //视频和轨迹图标
          btnList: [{
                  name: "aguiji",
                  text: 'Trackreplay',
                  key: "track",
                  disabled: false
              },
              {
                  name: "bofang",
                  text: 'video',
                  key: "vedio",
                  disabled: false
              }
          ],
          //中间信息列表
          baseTable: "basic",
           //下部tabs name页面组件名字 label选项名
          activeName: 'car', //底部tab选中
          bottomTabLists: [ //底部tab組件數組
                {name:'car',label:this.$t('components.common.vehicleInfo')},
                {name:'sensor',label:this.$t('components.common.sensor')},
                {name:'electric',label:this.$t('components.common.Electricalsigna')},
                {name:'canInfo',label:this.$t('components.common.CANinformation')},
                ]
            }
        },
        methods: {
            /**
             * 点击弹框
             */
            toggle() {
                
            },
           //指令
        commondChange(val) {
            console.log(val)
            this.commond = val;
            switch (val) {
                case "1":
                    this.localCar();
                    break;
                case "2":
                     this.singleCamera();
                    break;
                case "3":
                    this.rollCall();
                    break;
                default:
                    break;
            }
        },
        isUserPower() {
            this.$http({
                url: "/lockCar/hasPerm",
                method: "POST"
            }).then(data => {
                if (data.flag) {
                    this.locaCarPower = true;
                } else {
                    this.$message.error({
                        message:    ("error." + data.errorCode)
                    });
                    return (this.locaCarPower = false);
                }
            });
        },
        // 锁车指令
        localCar() {
          
                    this.dialog.flag = true;
                    this.dialog.size = "dialog-small";
                    this.dialog.name = "localCarPassword";
                   
        },
        // 单车拍照指令
        singleCamera() {
                // 弹框显示设置
                if (this.data.vehicleId) {
                    this.dialog.flag = true;
                    this.dialog.size = "dialog-small";
                    this.dialog.name = "singleCamera";
                    this.dialog.title = this.$t("multiCar.SingleCarp")+this.data.plateCode
                } else {
                    this.$message.error(this.$t("action.positionmess"));
                }
            },
            // 多车拍照指令
            multiCamera() {
                // 弹框显示设置
                if (this.data.vehicleId) {
                    this.dialog.flag = true;
                    this.dialog.size = "dialog-small";
                    this.dialog.name = "multiCamera";
                    this.dialog.title = this.$t("multiCar.SingleCarp")+this.data.plateCode
                } else {
                    this.$message.error(this.$t("action.positionmess"));
                }
            },
            // 点名
            rollCall() {
                // 弹框显示设置
                if (this.data.vehicleId) {
                    this.dialog.flag = true;
                    this.dialog.size = "dialog-tiny";
                    this.dialog.name = "rollCall";
                    this.dialog.title =  this.$t("multiCar.Naming")+this.data.plateCode
                    this.dialog.id = this.data.vehicleId;
                } else {
                }
            },
            //功能跳转
            switchFn(name) {
                switch (name) {
                    case "single-camera":
                        return this.singleCamera();
                    case "vedio":
                        return this.jumpVedio();
                    case "track":
                        return this.jumpTrack();
                    case "baojing":
                        return this.baojing();
                }
            },
            // 跳转视频页面
            jumpVedio() {
                    if (this.data.protocolVersion == "1073741831") {
                        this.$router.push({
                            path: "/monitor/realtimevideoNew",
                            query: {
                                vid: this.data.vehicleId,
                                eid: this.data.enterpriseId,
                                pcode: this.data.plateCode
                            }
                        });
                    } else {
                        if (this.data.vehicleId) {
                            this.$store.dispatch("getVideoLogin", this.data.vehicleId);
                        } else {
                            this.$message.error(this.$t("action.checkCar"));
                        }
                    }
                },
                // 跳转历史轨迹
                jumpTrack() {
                    let vehicleId = this.data.vehicleId,
                        plateCode = this.data.plateCode;
                    if (vehicleId) {
                        let winParams = this.$service.winParams("/monitor/historyTrack", {
                            id: vehicleId,
                            plateCode: plateCode
                        });
                        this.$service.winOpen(winParams);
                    } else {
                        this.$message.error(this.$t("action.checkCar"));
                    }
                },
      }
    }
</script>

<style scoped>

</style>