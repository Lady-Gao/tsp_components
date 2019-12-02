import Operation from "./src/operation.vue";
Operation.install = function (Vue) {
    Vue.component(Operation.name, Operation);
}

export default Operation;
