import Ocx from './src/ocx.vue'

Ocx.install = function (Vue) {
    Vue.component(Ocx.name, Ocx);
}

export default Ocx;