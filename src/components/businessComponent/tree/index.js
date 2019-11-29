import TabsTree from './src/tabs-list.vue'

TabsTree.install = function (Vue) {
    Vue.component(TabsTree.name, TabsTree);
}

export default TabsTree;