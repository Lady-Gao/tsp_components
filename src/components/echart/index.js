import Echart from './src/echart.vue'

Echart.install = function(Vue) {
    Vue.component(Echart.name, Echart);
}

export default Echart;