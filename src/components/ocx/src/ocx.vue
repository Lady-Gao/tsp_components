<template>
  <div id="videoPort" v-show="!this.hiddenOcx" class="videoPort">
    <object
      style="background:#ccc;"
      :width="width"
      :height="heigth"
      id="realOcx"
      :codebase="codebase"
      classid="clsid:f3943464-829d-4bb8-8b05-10516831ceed"
    ></object>
  </div>
</template>

<script>
import ocxMethods from "./js/ocxMethods"; //ocx方法混合
export default {
  name:"Ocx",
  props: {
    hiddenOcx: Boolean,
    width: {
      type:String,
      default:'100%'
    },
     heigth:{
      type:String,
      default:'100%'
    },
     codebase:{
       type:String,
       default:'http://lib.cvtsp.com/video/OcxSetup2_0_2.CAB#version=2,0,2'
     },
     num:Number
  },
  mixins: [ocxMethods],
  data() {
    return {
      
    };
  },
  computed:{
      video(){
          return document.getElementById("realOcx")
      }
  },
  mounted() {
    this.setWh()
  },
  methods: {
   /**
     * 实时
     */
    nowPlay(obj){
      this.ocxInit(obj)
      this.ocxRealtimePlayXY(obj);
    },
    /**
     * 历史
     */
    hisPlay(obj){
       this.ocxInit( obj);
       this.ocxReplay(obj)
    },
    /**
     * 设置宽高
     */
    setWh(){
      this.videoPortHeightC=window.innerHeight -
        document.getElementById("videoPort").getBoundingClientRect().top -
        80
        this.videoPortWidthC=document
        .getElementById("videoPort")
        .getBoundingClientRect().width
    },
     /**
     * 分屏初始化
     */
    setScreens(num) {
      setTimeout(() => {
        this.video.SetOrResetVideos(Number(num || 1));
      }, 500);
    },
    /**
     * 初始化OCX控件
     * @param {String} poster ：需要初始化的object 实例id
     * @param {Object} options ：初始化设置的ip跟端口{ipAddress：''，port:'',userLevel:'',replayPower:'',picCutPower:'',ytCtrlPower:'',MTpowerPower:''}
     */
    ocxInit(options) {
      this.video.SetServerInfo(
        options.ipAddress,
        options.port,
        options.userLevel,
        options.replayPower,
        options.picCutPower,
        options.ytCtrlPower,
        options.MTpowerPower
      );
    this.setScreens(1)

    },

    /**
     * 播放实时视频
     * @param {String} poster :需要播放的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxRealtimePlay( options) {
     this.video.StartRealTimeVideo(
        options.simCode,
        options.channel,
        options.StreamType,
        options.hasAudio
      );
    },

    /**
     * 播放实时视频
     * @param {String} poster :需要播放的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxRealtimePlayXY(options) {
      this.video.StartRealTimeVideoProtocolStandard(
        options.simCode,
        options.channel,
        options.dataType,
        options.StreamType
      );
    },

    /**
     * 回放播放
     * @param {String} poster: 需要回放视频的object 实例id
     * @param {Object} options ：回放相关信息 {simCode:车辆sim卡号，channel：通道号，MediaType：音视频类型，StreamType：码流类型，StorageType：存储器类型，PlaybackMode：回放方式，Multiple：快退/快进，StartTime：开始时间，EndTime：结束时间}
     */
    ocxReplay( options) {
      this.video.PlayBack_Utc(
        options.simCode,
        options.channel,
        options.MediaType,
        options.StreamType,
        options.StorageType,
        options.PlaybackMode,
        options.Multiple,
        options.StartTime,
        options.EndTime,
        options.DataSource
      );

    },

    /**
     * 关闭视频
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxCloseVideo(poster) {
     this.video.StopAll();
    },

    /**
     * 开启双向对讲
     * @param {String} poster：需要开启的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxSpeaking( options) {
     this.video.StartRTSpeaking(
        options.simCode.options.channel,
        options.StreamType
      );
    },

    /**
     * 关闭双向对讲
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxStopSpeaking(poster) {
     this.video.StopRTSpeaking();
    },

    /**
     * 开启监听
     * @param {String} poster：需要开启的object 实例id
     * @param {Object} options :播放实时视频的相关信息，sim卡，通道号，码流类型 {simCode:'',channel:'',StreamType:''}
     */
    ocxMonitor( options) {
     this.video.StartMonitorVoice(
        options.simCode.options.channel,
        options.StreamType
      );
    },

    /**
     * 关闭监听
     * @param {String} poster：需要关闭的object 实例id
     */
    ocxStopMonitor(poster) {
     this.video.StopMonitorVoice();
    }
  },watch: {
    num(val){
      this.setScreens(val)
    }
  },
};
</script>

<style lang="scss" scoped>
.videoPort{
  height:80%;
}
</style>