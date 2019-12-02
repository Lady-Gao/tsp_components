import Grid from "./src/components/grid/index"
import CheckboxLists from "./src/components/checkLists/index"
import Ocx from "./src/components/ocx/index";
import H5Video from "./src/components/h5Video/index";
import FlashVideo from "./src/components/flashVideo/index";
import RadioLists from "./src/components/radioLists/index";
import ThemePicker from "./src/components/themePicker/index";
import GaodeMap from "./src/components/gaode/index";
import BaiduMap from "./src/components/baidu/index";
import GoogleMap from "./src/components/google/index";
import LazyRender from "./src/components/lazyRender/index";
import Icon from "./src/components/icon/index";
import BreadCrumb from "./src/components/breadCrumb/index"
import MapArea from './src/components/mapArea/index';
import Scrollbar from "./src/components/scrollbar/index";
import Operation from "./src/components/operation/index"
import PowerTool from "./src/components/powerTool/index"
import TableTool from "./src/components/tableTool/idnex"
import Dropdown from "./src/components/dropDown/index"
import BodyContent from "./src/components/bodyContent/index"
import Tabs from "./src/components/tabs/index"
import Dialogdrag from "./src/components/dialogdrag/index"
import TabsTree from "./src/components/tabs-tree/index"
import Tree from "./src/components/tree/index"
import DropdownTree from "./src/components/dropdown-tree/index"
import Maptool from "./src/components/mapTool/index"

import PasswordStrength from "./src/components/passwordStrength/index"


const modulesFiles = require.context("./src/components", true, /index.js$/);

var modulearr = {}

modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath);
    console.log(value)
    modulearr[value.default.name] = value
}, {});


const components = [
    Dropdown,
    Grid,
    Ocx,
    H5Video,
    FlashVideo,
    RadioLists,
    ThemePicker,
    Scrollbar,
    PowerTool,
    TableTool,
    BodyContent,
    PasswordStrength,
    GaodeMap,
    BaiduMap,
    GoogleMap,
    LazyRender,
    Maptool,
    Icon,
    TabsTree,
    BreadCrumb,
    MapArea,
    CheckboxLists,
    Operation,
    Tabs,
    Dialogdrag,
    DropdownTree,
    Tree
]
const install = function (Vue) {
    // console.log(components)
    // components.map(component => {
    //     Vue.component(component.name, component);
    // });
    for (var key in modulearr) {
        Vue.component(key, modulearr[key].default);
    }
    
};
let index = {
    version: '0.1.0',
    install,
    ...modulearr
}
console.log(index)
export default index
