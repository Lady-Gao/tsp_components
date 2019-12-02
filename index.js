const modulesFiles = require.context("./src/components", true, /index.js$/);

var modulearr = {}

modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath);
    console.log(value)
    modulearr[value.default.name] = value
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
