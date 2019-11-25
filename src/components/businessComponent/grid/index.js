import Grid from './src/gridtest.vue'
Grid.install = function (Vue) {
    Vue.component(Grid.name, Grid);
}
export default Grid; 