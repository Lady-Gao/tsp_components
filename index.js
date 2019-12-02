const modulesFiles = require.context("./src/components", true, /index.js$/);
const modulearr = modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath);
    modules[value.default.name] = value;
    return modules
}, {});
const install = function (Vue) {
    for (let key in modulearr) {
        Vue.component(key, modulearr[key].default);
    }
    
};
    

export default {
    version: '0.1.0',
    install,
    ...modulearr
}
