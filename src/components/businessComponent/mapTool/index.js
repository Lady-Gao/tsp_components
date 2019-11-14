import Maptool from "./src/map.tool";
Maptool.install = function (Vue) {
    Vue.component(Maptool.name, Maptool);
}

export default Maptool;
