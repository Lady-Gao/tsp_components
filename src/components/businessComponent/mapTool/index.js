import Maptool from "./src/map.tool.vue";
Maptool.install = function (Vue) {
    Vue.component(Maptool.name, Maptool);
}

export default Maptool;
