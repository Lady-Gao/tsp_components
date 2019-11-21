import Grid from "./src/components/businessComponent/grid/index"
import CheckboxLists from "./src/components/businessComponent/checkLists/index"
import Ocx from "./src/components/businessComponent/video/ocx/ocx.vue";
import H5Video from "./src/components/businessComponent/video/h5Video/h5Video.vue";
import FlashVideo from "./src/components/businessComponent/video/flashVideo/flashVideo.vue";
import RadioLists from "./src/components/businessComponent/radioLists/index";
import ThemePicker from "./src/components/businessComponent/themePicker/index";
import GaodeMap from "./src/components/businessComponent/map/gaode/gaode.vue";
import BaiduMap from "./src/components/businessComponent/map/baidu/baidu.vue";
import GoogleMap from "./src/components/businessComponent/map/google/index";
import LazyRender from "./src/components/businessComponent/lazyRender/index";
import Icon from "./src/components/businessComponent/icon/index";
import BreadCrumb from "./src/components/businessComponent/breadCrumb/index";
import MapArea from './src/components/businessComponent/mapArea/index';
import Scrollbar from "./src/components/component-utils/scrollbar/index";
import Maptool from "./src/components/businessComponent/mapTool"
import Operation from "./src/components/businessComponent/operation/index"
import PowerTool from "./src/components/businessComponent/powerTool/power.tool.vue"
import TableTool from "./src/components/businessComponent/powerTool/power.table.tool.vue"
import Dropdown from "./src/components/businessComponent/dropDown/index"
import BodyContent from "./src/components/businessComponent/bodyContent/content.vue"

import PasswordStrength from "./src/components/businessComponent/passwordStrength/passwordStrength.vue"
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
    // TabsTree,
    BreadCrumb,
    MapArea,
    CheckboxLists,
    Operation
]
const install = function (Vue) {
    console.log(components)
    components.map(component => {
        Vue.component(component.name, component);
    });

};
export default {
    version: '0.1.0',
    install,
    Dropdown,
    Grid,
    Ocx,
    BodyContent,
    H5Video,
    FlashVideo,
    PasswordStrength,
    RadioLists,
    ThemePicker,
    Scrollbar,
    TableTool,
    PowerTool,
    // Tabs,
    GaodeMap,
    BaiduMap,
    GoogleMap,
    LazyRender,
    Maptool,
    Icon,
    // TabsTree,
    BreadCrumb,
    MapArea,
    CheckboxLists,
    Operation
}