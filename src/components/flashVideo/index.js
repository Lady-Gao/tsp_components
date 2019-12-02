import FlashVideo from './src/flashVideo.vue'

FlashVideo.install = function (Vue) {
    Vue.component(FlashVideo.name, FlashVideo);
}

export default FlashVideo;