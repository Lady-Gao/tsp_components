<template>
    <div class="cv-map" ref="map"></div>
</template>

<script>
import google from '../../../component-utils/map/google/google.map.js'
import { getMapScript, createScript, createStyle } from '../../../../utils/scriptHelper.js'

export default {
    name: 'GoogleMap',
    props: {
        // 地图加载完成的回调
        mapLoaded: Function,
        // [{js:'', css:''}]
        plugins: {
            type: Array,
            default() { return [] }
        },
        zooms: {
            type: Array,
            default() {
                return [3, 18]
            }
        },
        language: {
            type:String,
            default(){
                return 'zh-CN'
            }
        },
        mapTypes:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            map: null,
            mapMethods: null
        }
    },
    computed: {
        _map() {
            return this.$refs['map']
        }
    },
    mounted() {
        getMapScript('google', `http://ditu.google.cn/maps/api/js?key=AIzaSyDMvlx7bDzZPe-7Tf7pmmeV-V8oMaYjRac&sensor=true&language=${this.language}&libraries=drawing`)
        .then(this.mapInitial)
    },
    methods: {
        mapInitial() {
            let myOptions = {
                zoom: 12,
                center: {lat:31.22, lng:121.48},
                fullscreenControl:false,
                mapTypeControl: false,//Map类型控件的初始启用/禁用状态。
                
            };
            // this.map = new google.maps.Map(this._map,myOptions);
            this.mapMethods = new google(this._map,myOptions);
         
            var timer = setTimeout( _ => {
                clearTimeout(timer);
                timer = null;

                typeof this.mapLoaded == 'function' && this.mapLoaded();
                // this.controlGroups_Load();
            }, 200)
        }
    },
}
</script>
<style>
.mapbase {
	min-width: 100px;
	min-height: 100px;
}
</style>
