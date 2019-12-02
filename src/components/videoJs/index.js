import VideoJs from './src/video.vue'

VideoJs.install = function (Vue) {
    Vue.component(VideoJs.name, VideoJs);
}

export default VideoJs;