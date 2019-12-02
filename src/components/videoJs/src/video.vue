<template>
    <div class="cv-video" ref="videoBox">
        <video ref="video" controls class="video-js vjs-big-play-centered" style="object-fit:fill;width:100%;height:100%;" data-setup='{}'>
                        <!-- <source src="" :type="type" />   -->
                    </video>
        <div v-if="initFlag" class="cv-video-title">{{title.plateCode}} / {{title.text}}</div>
        <!-- <ul class="cv-video-tool" v-show="init" :style="{
                                                zIndex: fullscreenFlag ? '9999999999' : '0'
                                            }"> -->
        <!-- 暂定播放 -->
        <!-- <cv-icon class="icon-style" :name="playFlag?'zanting':'bofang'" color="#fff" @click.native="isPlay"></cv-icon> -->
        <!-- 停止播放 -->
        <!-- <cv-icon class="icon-style" name="tingzhi" color="#fff" @click.native="stop"></cv-icon> -->
        <!-- 刷新重载 -->
        <!-- <cv-icon class="icon-style" name="Refresh" color="#fff" @click.native="reLoad"></cv-icon> -->
        <!-- 全屏 -->
        <!-- <cv-icon class="icon-style right" :name="fullscreenFlag?'fullscreen-exit':'fullscreen'" color="#fff" @click.native="isFullscreen"></cv-icon> -->
        <!-- 截图 -->
        <!-- <cv-icon class="icon-style right" name="renyuanjiankong" color="#fff" @click.native="screenshot"></cv-icon> -->
        <!-- 声音 -->
        <!-- <span class="video-volume-control right" @click="volumeFlag = !volumeFlag">
                                            <cv-icon class="icon-style" :name="volume==0?'yuyan6':'yuyan4'" color="#fff"></cv-icon>
                                            <el-slider v-model="volume" v-show="volumeFlag" vertical height="50px" class="video-volume-slider"></el-slider>
                                        </span>
                                    </ul> -->
        <!-- <div :class="this.flashReady?'masker':''"></div> -->
    </div>
</template>

<script>
    import video from "video.js";
    import "./assets/video.flash";
    import hotkeys from "./assets/video.hotkeys";
    // ssvideo.options.flash.swf = "static/video-js.swf";
    export default {
        name:'VideoJs',
        props: {
            src: {
                default: ""
            },
            title: {
                default () {
                    return {};
                }
            },
            ratio: {
                default: "1:1"
            },
            type: {
                default: "rtmp/flv"
            },
            resetInit:false
        },
        data() {
            return {
                initFlag: false,
                player: null,
                playFlag: false,
                fullscreenFlag: false,
                flashReady: false
            };
        },
        methods: {
            /** 
             * 播放操作
             * @param {String} src:播放推流地址
             */
            play(src) {
                 console.log(this.title,'play')
                this.player.pause();
                this.player.reset();
                this.player.src(src);
                this.player.load();
            },
            /** 
             * videojs初始化
             */
            init() {
                let _this = this;
                const P = new Promise((resolve, reject) => {
                    _this.player = video(_this.$refs["video"], {
                        controls: true,
                        bigPlayButton: true,
                        preload: false,
                        autoplay: true,
                        errorDisplay: false,
                        loop: false,
                        controlBar: {
                            captionsButton: false,
                            chaptersButton: false,
                            subtitlesButton: false,
                            liveDisplay: false,
                            playbackRateMenuButton: false,
                            progressControl: false,
                            playToggle: true,
                            volumePanel: {
                                inline: false,
                            },
                            fullscreenToggle: true,
                            currentTimeDisplay: false,
                            timeDivider: false,
                            durationDisplay: true,
                            remainingTimeDisplay: false
                        }
                    });
                    resolve(_this.player);
                });
                return P;
            },
            /** 
             * vidoejs实例销毁
             */
            dispose() {
                this.player.dispose();
            },
            reLoad(src) {
                this.player.reset();
                this.player.load();
                this.player.play()
                console.log(this.title,'play')
            },
            resetVideo(){
                this.init().then((_player) => {
                    _player.ready(() => {
                        this.flashReady = true;
                        _player.on("fullscreenchange", _ => {
                            this.fullscreenFlag = _player.isFullscreen();
                        });
                        _player.on('pause', _ => {
                            this.playFlag = false;
                            this.initFlag = false;
                        });
                        _player.on('play', _ => {
                            this.playFlag = true;
                            this.initFlag = true;
                        });
                    })
                })
            }
        },
        watch: {
            src(newVal) {
                this.play(newVal);
            },
            resetInit(newVal){
                if(newVal){
                    this.resetVideo();
                }
                
            }
        },
        mounted() {
            // console.log('hello')
            this.init()
                .then((_player) => {
                    _player.ready(() => {
                        this.flashReady = true;
                        _player.on("fullscreenchange", _ => {
                            this.fullscreenFlag = _player.isFullscreen();
                        });
                        _player.on('pause', _ => {
                            this.playFlag = false;
                            this.initFlag = false;
                        });
                        _player.on('play', _ => {
                            this.playFlag = true;
                            this.initFlag = true;
                        });
                    })
                })
        }
    };
</script>

<style lang="scss">
    @import "./assets/video.source.css";
    .cv-video {
        $bg: rgba(33, 34, 33, 0.8);
        position: relative;
        height: 99%;
        width: 100%; // .cv-video-box {
        //     // padding-bottom: 56.25%;
        // }
        // background-color: black;
        .video-js .vjs-tech{
            pointer-events: auto !important;
        }
        
        .vjs-paused.vjs-has-started .vjs-big-play-button {
            display: block;
        }
        .cv-video-title {
            position: absolute;
            top: 0;
            right: 0;
            background: $bg;
            padding: 5px;
            color: #fff;
        }
        .cv-video-tool {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 32px;
            line-height: 32px;
            background: $bg;
            .icon-style {
                line-height: inherit;
            }
            .video-volume-control {
                position: relative;
                .video-volume-slider {
                    position: absolute;
                    display: inline-block;
                    left: 50%;
                    margin-left: -18px;
                    bottom: 100%;
                }
            }
            .left {
                float: left;
            }
            .right {
                float: right;
            }
        }
    }
</style>
