import TabsTree from './src/tabs-tree.vue'

TabsTree.install = function (Vue) {
    Vue.component(TabsTree.name, TabsTree);
}

export default TabsTree;