<template>
    <div class="Echarts" ref="chart">
</div>
</template>

<script>
import lineOptions from "./model/lineOptions";
import barOptions from "./model/barOptions";
import mapOptions from "./model/mapOptions";
import pieOptions from "./model/pieOptions";
import gaugeOptions from "./model/gaugeCarOptions";
import radarOptions from "./model/radarOptions";
import { asyncDownloadScript } from "../../../utils/scriptHelper.js";
import service from '../../../utils/service'
export default {
    name: "Echart",
    props: {
        data: {},
        name: {},
        dataValue:{},
        plugins: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            // EchartDom元素
            baseResource: [{
                name: 'Echarts',
                resource: 'http://lib.cvtsp.com/echarts/echarts.min.js'
            }],
            chart: null,
            throttle: null,
            lineModel: lineOptions, // 折线图基础模型
            pieModel: pieOptions, // 饼状图基础模型
            barModel: barOptions, // 柱状图基础模型
            mapModel: mapOptions, // 地图基础模型
            gagueModel: gaugeOptions, // 油表图基础模型
            radarModel: radarOptions // 油表图基础模型
        };
    },

    computed: {
        _plugins() {
            return this.baseResource.concat(this.plugins);
        }
    },

    methods: {
        /** 
         * 返回echarts对象
         * @return :返回echarts对象
        */
        getEchart() {
            return this.chart;
        },
        /** 
         * 设置图表
        */
        setOptions() {
            if (this.name === "map") {
                // console.log(Vue.config.lang)
                window.echarts && echarts.registerMap(
                    "china",
                    require("./model/china").default
                );
            }
            this.chart = window.echarts ? echarts.init(this.$refs["chart"]):null;
            switch (this.name) {
                case "line":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ?
                        this.lineModel :
                        this.data
                    );
                    break;
                case "bar":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ? this.barModel : this.data
                    );
                    break;
                case "pie":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ? this.pieModel : this.data
                    );
                    break;
                case "map":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ? this.mapModel : this.data
                    );
                    break;
                case "radar":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ? this.radarModel : this.data
                    );
                    break;
                case "gaugeCar":
                    this.chart.setOption(
                        service.isEmptyObject(this.data) ?
                        this.gagueModel :
                        this.data
                    );
                    break;
            }
        },
        reiszeEchart() {       
            this.chart && this.chart.resize();
        }
    },
    watch: {
        data(newVal) {
            // console.log(Vue.config.lang)
            if (!window.echarts || !this.chart) return;
            if (this.name === 'map') {
                window.echarts && echarts.registerMap('china', require('./model/china').default)
            }
            switch (this.name) {
                case 'line':
                    let tempLine =newVal && service.extend({},this.lineModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempLine:this.lineModel);
                    break;
                case 'bar':
                    let tempBar = newVal && service.extend({},this.barModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempBar:this.barModel);
                    break;
                case 'pie':
                    let tempPie = newVal && service.extend({},this.pieModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempPie:this.pieModel);
                    break;
                case 'map':
                    let tempMap = newVal && service.extend({},this.mapModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempMap:this.mapModel);
                    break;
                case 'radar':
                    let tempRadar = newVal && service.extend({},this.radarModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempRadar:this.radarModel);
                    break;
                case 'gaugeCar':
                    let tempG = newVal && service.extend({},this.gagueModel, newVal);
                    this.chart.clear();
                    this.chart.setOption(newVal?tempG:this.gagueModel);
                    break;
            }
        },
        dataValue(newVal){
            if(newVal.length){
                this.chart.setOption({series:newVal});
            }
        }
    },
    created() {
        this.throttle = service.throttle(() => {
            this.reiszeEchart();
        });
    },
    async mounted() {
        const {
            setOptions
        } = this;
        for(let i = 0; i < this._plugins.length; i++) {
            const { name, resource } = this._plugins[i];
            await asyncDownloadScript(name, resource);
        }
        setOptions();
        window.addEventListener("resize", this.throttle);
    },
    beforeDestory() {
        window.removeEventListener('resize', this.throttle);
    }

};
</script>
<style lang="scss">
    // @import '../../../theme/mixins/map.scss';

    .Echarts{
       height:200px;
    }
</style>
