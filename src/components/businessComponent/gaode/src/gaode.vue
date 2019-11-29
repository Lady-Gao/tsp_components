<template>
    <div>
        <div class="cv-map" ref="map"></div>
    </div>
</template>

<script>
import Gaode from './js/gaode.map'
import { getMapScript, createScript, createStyle } from '../../../../utils/scriptHelper.js'

export default {
    name: 'GaodeMap',
    props: {
        // 地图加载完成的回调
        mapLoaded: Function
    },
    data() {
        return {
            map: null,
            mapMethods: null,
            // 控件名称集合
            controls: ['ScaleControl', 'NavigationControl', 'OverviewMapControl']
        }
    },
    computed: {
        _map() {
            return this.$refs['map']
        }
    },
    mounted() {
        console.log('comp')
        getMapScript('AMap', 'http://webapi.amap.com/maps?v=1.4.2&key=edfc1f354a8b8203758949cf999b8b4b')
        .then(this.mapInitial)
    },
    methods: {
        mapInitial() {
            this.map = new AMap.Map(this._map, { resizeEnable: true });
            this.mapMethods = new Gaode(this.map);

            var timer = setTimeout( _ => {
                clearTimeout(timer);
                timer = null;

                typeof this.mapLoaded == 'function' && this.mapLoaded();
                this.controlGroups_Load();
            }, 200)
        },

        /**
         * 地图控件的组合
         * 比例尺 平移控件 添加地图缩略图
         */
        controlGroups() {
            const { map } = this;

            return {
                // 比例尺
                ScaleControl() {
                    map.plugin(["AMap.Scale"], function() {
                        var scale = new AMap.Scale({
                        offset: new AMap.Pixel(20, 60)
                        });
                        map.addControl(scale);
                        scale.show();
                    });
                },
                // 平移控件
                NavigationControl() {
                    map.plugin(["AMap.ToolBar"], function() {
                        //加载工具条
                        var tool = new AMap.ToolBar({
                        position: "RB",
                        offset: new AMap.Pixel(20, 120),
                        ruler: false
                        });
                        map.addControl(tool);
                    });
                },
                CityListControl() {},
                // 添加地图缩略图
                OverviewMapControl(isControl) {
                    map.plugin(["AMap.OverView"], function() {
                        const view = new AMap.OverView({
                            isOpen: true
                        });
                        isControl && map.addControl(view);
                    });
                }
            }
        },

        /**
         * 加载控件的时候需要延时
         */
        controlGroups_Load() {
            const controlMethods = this.controlGroups();
            var timer = setTimeout( _ => {
                clearTimeout(timer);
                timer = null;
                this.controls.forEach(control => {
                    controlMethods[control](true);
                });
            }, 100)
        }
    }
}
</script>

<style lang="scss">
   .cv-map{
    min-width: 500px;
	min-height: 500px;
   }
</style>
