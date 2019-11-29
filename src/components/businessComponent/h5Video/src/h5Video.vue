<template>
    <div id="player" class="playerfull" ></div>
</template>

<script>

import { asyncDownloadScript } from "../../../../../utils/scriptHelper.js"
import service from "../../../../../utils/service"
    export default {
         name:"H5Video",
        props: {
            //屏数
             num:{
                default:4
            },
            // isFull:false,
            //是否全屏显示 默认不全屏
           
            opt:Function
        },
        data(){
            return {
                isFull:false
            }
        },
        computed: {
            video_id(){
                return this.getSelectVideo().video_id
            }
        },
        created () {
          //加载js文件  
           asyncDownloadScript(
                "CvNetVideo",
                "http://lib.cvtsp.com/video/CVNetVideoJs/0.6.0/CvNetVideo.js"
            ).then(()=>{
                this.init()
            })
        },
        mounted () {
            //监听全屏状态
             ["", "moz", "webkit", "ms"].forEach(val => {
                document.addEventListener(val + "fullscreenchange", () => {
                    this.isFull=this.isFullscreen()
                });
            });
        },
        beforeDestroy(){
            //销毁
             this.Colse(-1);
        },
        methods: {
            /**
             *
             * 视频初始化
             * @param {id}  id
             * @param {  num}  屏数
             * @param { opt}  基础配置： callback:回调
             */
            init(){
                if(this.opt){

                    CvNetVideo.Init(document.getElementById("player"), this.opt  );
                }else{

                    CvNetVideo.Init(document.getElementById("player"), this.num ||1 );
                }
            },
            //设置屏的整体大小
            Resize(width, height){
                CvNetVideo.Resize(width, height);
            },
            //显示隐藏osd
            setOsdVisible(flag){
                CvNetVideo.SetOsdVisible(flag);
            },
            //设置osd文本颜色
            setOsdColor(color){
                CvNetVideo.SetOsdColor(color);
            },
            //设置osd文本
            setOsdText(videoId,text){
                CvNetVideo.SetOsdText(videoId,text);
            },
            /**
             *
             * 回放历史视频
             * @param {sim, Channal:通道号,MideaType:音视频类型,StreamType:码流类型,StorageType:存储器类型,PlaybackMode:回放方式,Multiple:快进或快退倍数,Starttime,Endtime,id,server:服务器}
             */
            PlaybackVideo(obj){
                console.log(this.getSelectVideo())
                //判断传参是否是对象
                if(!typeof obj =='object')return
                CvNetVideo.PlaybackVideo(
                    obj.simCode,//sim卡号
                    obj.channel,//通道号
                    obj.MideaType, //音视频类型
                    obj.StreamType,//码流类型
                    obj.StorageType,//存储器类型
                    obj.PlaybackMode,//回放类型
                    obj.Multiple,//快进或快退倍数
                    obj.Starttime, //开始时间
                    obj.Endtime,//结束时间
                    this.getSelectVideo().video_id,
                    {
                        clusterHost: obj.server,
                        clusterPort: obj.port
                    }
                    );
            },
            /**
             *
             * 开始播放实时视频
             * @param {sim,Channal:通道号,StreamType:码流类型,true,id,server:服务器}
             */
            StartRealTimeVideo(obj) {
               
                this.setOsdText(0,obj.plateCode+"/CH"+obj.channel)
                this.setOsdColor("#ffffff");
                CvNetVideo.StartRealTimeVideo(
                    obj.simCode,//sim卡号
                    obj.channel,//通道号
                    obj.StreamType,//码流类型
                    obj.flag,//快进或快退倍数
                   this.getSelectVideo().video_id,
                    {
                        clusterHost:obj.server,
                        clusterPort:obj.port
                    } 
                )
            },
            /**
             * 全部播放
             */
            playAll(obj){
               for (let index = 1; index <=obj.channel; index++) {
                    this.setOsdText(index,obj.plateCode+"/CH"+index);
                    this.setOsdColor("#ffffff");
                    CvNetVideo.StartRealTimeVideo(
                        obj.simCode,//sim卡号
                        index, 
                        obj.StreamType,//码流类型
                        obj.flag,//快进或快退倍数
                        this.getSelectVideo().video_id, 
                        {
                            clusterHost:obj.server,
                            clusterPort:obj.port
                        } 
                    );
                }
            },
             /**
             * 分屏操作
             */
            LayoutByScreens(num) {
                CvNetVideo.LayoutByScreens(num||this.num)
            },
             /**
             * 全屏操作
             */
            fullscreen() {
                var elem = document.getElementById("player");
                service.requestFullScreen(elem)
            },
             /**
             * 全屏判断
             */
            isFullscreen() {
                return (
                    document.fullscreen ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    false
                );
            },
             /**
             * 设置屏的整体大小
             */
            Resize(width, height) {
                CvNetVideo.Resize(width, height);
            },
            /**
             * 设置osd文本颜色
             */
            SetOsdColor(videoId, text) {
                CvNetVideo.SetOsdColor(videoId, text);
            },
            /**
             * 设置osd文本
             */
            setOsdText(videoId, text) {
                CvNetVideo.SetOsdText(videoId, text);
            },
            /**
             * 返回当前点击屏的下标
             */
           getSelectVideo() {
                return CvNetVideo.GetSelectedVideo();
            },
            /**
             *
             * 关闭实时视频 {关闭所有: Colse(-1)}
             * @param {id}  id
             */
            Colse(id) {
                CvNetVideo.Stop(id);
            },
             /**
             *
             * 关闭实时视频
             * @param {sim, ControlCommand:控制指令,Channal:通道号, StreamType:码流类型, TurnOffMediaType:关闭音视频类型,id, server:服务器 }
             */
            AVTransferControl(obj) {
                CvNetVideo.AVTransferControl(
                    obj.simCode,//sim卡号
                    obj.ControlCommand,//控制指令
                    obj.Channal,//通道
                    obj.StreamType,//码流类型
                    obj.TurnOffMediaType,//关闭音视频类型
                    this.getSelectVideo().video_id,
                    {
                     remoteHost: obj.server //server
                    }
                );
            },
             /**
             *
             * 历史视频回放控制
             * @param {sim, Channal:通道号, PlaybackControl:回放控制, Multiple:快进或快退倍数, DragPlaybackPosition:拖放回位置, server:服务器}
             */
            PlaybackVideoControl(obj) {
                CvNetVideo.PlaybackVideoControl(
                    obj.simCode,//sim卡号
                    obj.Channal,//通道
                    obj.PlaybackControl,//码流类型
                    obj.Multiple,//关闭音视频类型
                    obj.DragPlaybackPosition,//关闭音视频类型
                    this.getSelectVideo().video_id,
                    {
                        remoteHost: obj.server
                    }
                );
            }
        },
        watch:{
            num(val){
                    this.LayoutByScreens(val)
            },
            isFull(val){
                setTimeout(() => {
                    this.LayoutByScreens(this.num)
                }, 100); 
            }
    }
       
    }
</script>

<style scoped>
#player{
    height:100%;
    width:100%;
    overflow-y: scroll;
}

.playerfull{
     /* height: 100%;width:100%; */
     /* overflow-y: scroll; */
}
.inContent-full {
            width: 100%;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            }
</style>