import BreadCrumb from './src/breadCrumb.vue'

BreadCrumb.install = function (Vue) {
    Vue.component(BreadCrumb.name, BreadCrumb);
}

export default BreadCrumb;