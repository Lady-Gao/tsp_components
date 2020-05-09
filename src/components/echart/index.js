import Echart from './src/echart.vue'

Echart.install = function(Vue) {
    Vue.component(CvEchart.name, CvEchart);
}

export default Echart;