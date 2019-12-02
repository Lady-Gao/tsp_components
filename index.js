const modulesFiles = require.context("./src/components", true, /index.js$/);
const modulearr = modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath);
    modules[value.default.name] = value;
    return modules
}, {});



const install = function (Vue) {
    for (var key in modulearr) {
        Vue.component(key, modulearr[key].default);
    }
    
};
let moduleComponent = {
    version: '0.1.54',
    install,
    ...modulearr
}
console.log(moduleComponent)
export default moduleComponent
