import MapArea from "./src/mapDraw.vue"
MapArea.install = function (Vue) {
    Vue.component(MapArea.name, MapArea);
}
export default MapArea;