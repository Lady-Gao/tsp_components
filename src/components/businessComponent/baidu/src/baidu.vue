<template>
  <div>
    <div class="cv-map" ref="map"></div>
  </div>
</template>
<script>
import Baidu from "./js/baidu.map";
import { getMapScript, createScript, createStyle } from "../../../../utils/scriptHelper"
export default {
  name: "BaiduMap",
  props: {
    mapLoaded: Function,
    plugins: {
      type: Array,
      default() {
        return [];
      }
    },
    zooms: {
      type: Array,
      default() {
        return [3, 19];
      }
    },
    controls: {
      type: Array,
      default() {
        return [];
      }
    },
    mapType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      mapMethods: null,
      localElements: {
        styles: [],
        script: []
      },
      pluginsSrc: [
        {
          css:
            "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css",
          js:
            "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"
        },
        {
          css:
            "http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css",
          js:
            "http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js"
        },
        {
          js:
            "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js"
        },
        {
          js:
            "http://api.map.baidu.com/library/RectangleZoom/1.2/src/RectangleZoom_min.js"
        },
        {
          js:
            "http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"
        }
      ]
    };
  },
  computed: {
    _map() {
      return this.$refs["map"];
    }
  },
  beforeDestroyed() {},
  mounted() {},
  methods: {}
};
</script>
