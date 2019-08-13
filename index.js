import HelloWorld from "./src/components/HelloWorld/index"

const components = [
    HelloWorld
]
const install = function (Vue) {
    components.map(component => {
        Vue.component(component.name, component);
    });

};
export default {
    version:'0.1.0',
    install,
    HelloWorld
}