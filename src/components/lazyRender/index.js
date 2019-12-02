import LazyRender from './src/lazy-render.vue'
LazyRender.install = function (Vue) {
    Vue.component(LazyRender.name, LazyRender);
}

export default LazyRender;