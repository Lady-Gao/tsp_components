var render = require('json-templater/string')
var path = require('path')
var fs = require('fs')
var endLine = require('os').EOL;

var ROOT = path.resolve(__dirname, '../src/index.js');
var COMPONENT_ROOT = path.resolve(__dirname, '../src/components');
var IMPORT_TPL = `import {{name}} from \'./components/{{components}}/index.js\';`;
var INSTALL_TPL = '{{name}}';     
var MAIN_TPL = `
/** auto(wukangjun) components */
{{imports}}
import config from './utils/config.js'
import http from './utils/http.js'
import clickOutHide from './utils/directive/clickoutside'

const components = [
{{install}}
];

const install = function(Vue, options={}) {
    components.map(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$COMMON = {
        ...options
    };

    Vue.prototype.$http = http(options);
    Vue.directive('clickoutside', clickOutHide)
};

export default {
version: '{{version}}',
install,
{{lists}}
};
`

// get all files of components example: tree/index.js
const files = fs.readdirSync(COMPONENT_ROOT).filter(function(file) {
    return file !== '.DS_Store'
});

var imports = [];
var installs = [];
files.forEach(function(file) {
    imports.push(render(IMPORT_TPL, {
        name: whipptreeFilter(upperFirst(file)),
        components: file
    }));
    installs.push(render(INSTALL_TPL, {
        name: whipptreeFilter(upperFirst(file))
    }))
})

var template = render(MAIN_TPL, {
    version: process.env.VERSION || '1.0.0',
    imports: imports.join(endLine),
    install: installs.join(',' + endLine),
    lists: installs.join(',' + endLine)
})
fs.writeFileSync(ROOT, template);

/**
 * first letter trnasfer Uppercase
 * @param {String} str 
 */
function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function whipptreeFilter(str) {
    var results = str.replace(/(-)(\w)/g, function(math, val0, val1) {
        return val1.toUpperCase();
    });

    return results;
}

