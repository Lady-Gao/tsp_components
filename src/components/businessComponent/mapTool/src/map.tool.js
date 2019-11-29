import "../css/index.scss";
import exportCanvas from "../../../../utils/mixins/export-canvas";
import service from "../../../../utils/service";
export default {
  name: "Maptool",
  mixins: [exportCanvas],
  components: {
  },
  props: {
    layout: {
      type: Array,
      default() {
        return [
          "tool",
          "mapTypes",
          "search",
          "switchmap",
          "bestview",
          "fullscreen"
        ];
      }
    },
    // 需要全屏的DOM id 默认 contents
    fullscreenTarget: {
      type: String,
      default: "contents"
    },
    // marker点数组，只是为了最佳视野聚合
    markers: {
      type: Array,
      default() {
        return [];
      }
    },
    // 需要操作的地图对象(this.refs['map'])
    mapTarget: {},
    target: {
      default: "#contents"
    },
    //传入的地图名称
    currentMapname: {
      default: "GaodeMap"
    },
    //显示的地图选项
    mapView: {
      type: Array,
      default() {
        return [
          // {val:"superMap",name:"GIS地图"},
          // {val:"BaiduMap",name:"components.common.baiduMap"},
          { val: "GaodeMap", name: "components.common.gaodeMap" },
          { val: "GoogleMap", name: "components.common.googleMap" }
          // {val:"GaodeMap1",name:"components.common.tairuMap"}
        ];
      }
    }
  },
  mounted(){
  },
  data() {
    return {
      mapName: "",
      fullscreenFlag: false,
      mapSearch: "",
      throttle: null,
      mapTypeFlag: false,
      checkedVal: true,
      TrafficFlag: false,
       Truckvisible: false,//线路规划弹框
       TruckValue:0,//线路模式类型
      
    };
  },
  watch: {
    mapSearch(val) {
      this.throttle();
    },
    mapTarget(val,oldVal){
      if(val){
        this.mapTarget=val;
      }
    }
  },
  created() {
    this.throttle = this.$service.throttle(_ => {
      if (this.mapSearch == "") {
        this.mapTarget.mapMethods.Geocoder("上海");
      } else {
        this.mapTarget.mapMethods.Geocoder(this.mapSearch);
      }
    });
    this.mapName = this.currentMapname;
  },
  render(h) {
    const childs = this.layout.map(child => {
      const render = this[child];
      return render && render();
    });
    childs.splice(childs.length - 1, 0, this.$slots.default);

     return <div>
      <ul class="cv-maptool">{childs}</ul>
      {
        this.Truckvisible ? ( <div class='TruckBox' >
          <i class = 'el-icon-close' onClick={()=>{this.cloaseTruckbox()}}> </i>
          <h5 onClick={()=>{this.handleClick(0)}} style={{'color':this.TruckValue?' rgb(106, 157, 233)':'#52ad30c9'}}>距离最短</h5>
          <h5 onClick={()=>{this.handleClick(1)}} style={{'color':this.TruckValue?'#52ad30c9':' rgb(106, 157, 233)'}}>路况最好</h5>
         </div>):null

      }
    </div>;
  },
  methods: {
    //选择加载的地图
    switchmap() {
      let options = this.mapView.map(item => {
        return <el-option value={item.val} label={this.$t(item.name)} />;
      });
      return (
        <el-select
          value={this.mapName}
          size="mini"
          class="maptool-default maptool-search"
          onChange={val => this.handlerSwitchMap(val)}
        >
          {options}
        </el-select>
      );
    },
    //显示地图类型
    mapTypes() {
      let mapTypeText = this.mapTypeFlag
        ? this.$t("components.common.mapViewType")
        : this.$t("components.common.satellite");
      let mapTypeClass = this.mapTypeFlag ? "roadType" : "noMapType";
      return (
        <el-dropdown class="maptool-default maptool-tool">
          <span onClick={this.setMapType}>
            <icon name="map-marker" />
            {mapTypeText}
          </span>
          <el-dropdown-menu slot="dropdown" class={mapTypeClass}>
            <el-checkbox
              value={this.checkedVal}
              onChange={val => this.setRoad(val)}
            >
              {this.$t("components.common.road")}
            </el-checkbox>
          </el-dropdown-menu>
        </el-dropdown>
      );
    },
    //设置显示的是普通地图还是卫星地图
    setMapType() {
      if (!this.mapTarget) return;
      // 地图方法
      this.mapTypeFlag = !this.mapTypeFlag;
      if(this.mapName=="GaodeMap"){
        this.mapTarget.mapMethods.getTrfficObj(
          ["Satellite", "RoadNet"],
          this.mapTypeFlag
        );
      }else{
        this.mapTarget.mapMethods.setMapType(this.mapTypeFlag ? 2 : 0 );
      }
    },
    /**
     * 设置是否有路网
     * @param {boolean} val 是否显示路网
     */
    setRoad(val) {
      this.checkedVal = val;
      if(this.mapName=="GaodeMap"){
        this.mapTarget.mapMethods.getTrfficObj(["RoadNet"], val);
      }else{
        this.mapTarget.mapMethods.setMapType(this.checkedVal ? 2 : 1 );
      
      }
    },
    handlerSwitchMap(val) {
      this.mapName = val;
      //设置地图
      // 目前只支持百度（1）和高德（3）
      let mapVal = "";
      switch (val) {
        case "BaiduMap":
          this.setLayout("add", "search");
          mapVal = 1;
          break;
        case "GaodeMap":
          this.setLayout("add", "search");
          mapVal = 3;
          break;
        case "GoogleMap":
          this.setLayout("remove", "search");
          mapVal = 4;
          break;
        case "GaodeMap1":
          this.setLayout("add", "search");
          mapVal = 5;
          break;
      }
this.$emit('changeMap',mapVal)
      this.mapTypeFlag = false;
      this.checkedVal = true;
      this.TrafficFlag = false;
      this.setMapType(mapVal);
    },
    //设置工具栏显示
    setLayout(type, option) {
      let idx = this.layout.findIndex(val => val == option);
      switch (type) {
        case "add":
          idx == -1 && this.layout.splice(2, 0, option);
          break;
        case "remove":
          idx > -1 && this.layout.splice(idx, 1);
          break;
      }
    },

    search() {
      return (
        <el-input 
          size="mini"
          v-model={this.mapSearch}
          value={this.mapSearch}
          style={{
            display: this.mapName == "GoogleMap" ? "none" : "inline-block"
          }}
          placeholder={this.$t("components.common.findplace")}
          class="maptool-default maptool-search"
          clearable
          onChange={val => (this.mapSearch = val)}
        />
      );
    },

    /**
     * 工具箱内容渲染
     */
    tool() {
      let tools =[
        {
          key: "toolScreen",
          name: this.$t("components.common.Screenshot")
        },
        {
          key: "toolZoom",
          name: this.$t("components.common.magnification")
        },
        {
          key: "toolDistance",
          name: this.$t("components.common.ranging")
        },
        {
          key: "toolPrint",
          name: this.$t("components.common.Printing")
        },
        {
          key: "toolTraffic",
          name: this.$t("components.common.Traffic")
        },
        {
          key: "Driving",
          name:'线路规划'
        },
        {
          key: "toolArea",
          name:'面积量算'
        },
      ].map(tool => {
        return (
          <el-dropdown-item
            nativeOnClick={this[tool.key]}
            class={
              this.mapName == "GoogleMap" && tool.key == "toolTraffic"
                ? "noMapType"
                : ""
            }
          >
            {tool.name}
          </el-dropdown-item>
        );
      });
      return (
        <el-dropdown class="maptool-default maptool-tool">
          <span>
            <icon name="tool-cabinet_icon" />
            {this.$t("components.common.Holall")}
          </span>
          <el-dropdown-menu slot="dropdown">{tools}</el-dropdown-menu>
        </el-dropdown>
      );
    },

    /**
     * 屏幕截图事件
     */
    toolScreen() {
      const _vm = this;
      html2canvas(document.body, {
        onrendered(canvas) {
          _vm.mixins_exportCanvas(canvas);
        }
      });
    },

    /**
     * 区域放大事件
     */
    toolZoom() {
      const rectangleZoom = this.mapTarget.mapMethods.mapTools("rectangleZoom");
      rectangleZoom.open();
    },
    /**
     * 线路规划事件
     */
    Driving() {
      const rectangleZoom = this.mapTarget.mapMethods.mapTools("Driving");
        this.Truckvisible = true;
      rectangleZoom.open();
    },
     //关闭线路规划弹框
     cloaseTruckbox() {
         this.Truckvisible = false;
         this.mapTarget.mapMethods.driving.clear()
       },
       //线路规划选择
       handleClick(e) {
         if (e !== this.TruckValue) {
           this.TruckValue = e
           let str=''
           switch (e) {
             case 0:
               str='LEAST_TIME'
               break;
               case 1:
                  str='REAL_TRAFFIC'
               break;
           
           }
           this.mapTarget.mapMethods.Driving(str,(e)=>{
           })
         }
       },
    /**
     * 面积量算
     */
    toolArea() {
      const rectangleZoom = this.mapTarget.mapMethods.mapTools("Driving", {
        type: 'LEAST_TIME'
        });
      rectangleZoom.open();
    },

    /**
     * 测距事件
     */
    toolDistance() {
      const distance = this.mapTarget.mapMethods.mapTools("distance");
      distance.open();
    },

    /**
     * 打印事件
     */
    toolPrint() {
      window.print();
    },

    /***
     * 路况事件
     */
    toolTraffic() {
      this.TrafficFlag = !this.TrafficFlag;
      this.mapTarget.mapMethods.getTrfficObj(["Traffic"], this.TrafficFlag);
    },

    /**
     * 全屏内容渲染
     */
    fullscreen() {
      return (
        <icon
          class="maptool-default"
          name={!this.fullscreenFlag ? "fullscreen" : "fullscreen-exit"}
          onClick={this.handlerFullScreen}
        />
      );
    },
    /**
     * 全屏按钮事件
     */
    handlerFullScreen() {
      let dom = this.mapTarget.$el;
      service.requestFullScreen(dom);
    },
    

    /**
     * 最佳视野内容渲染
     */
    bestview() {
      return (
        <span class="maptool-default" onClick={this.handlerGetBestView}>
          <icon name="niaokanpressed" />
          <span style="font-size: 14px">
            {this.$t("components.common.bestView")}
          </span>
        </span>
      );
    },
    // 最佳视野的事件
    handlerGetBestView() {
      if (!this.mapTarget) return;
      // 地图方法
      const { mapMethods } = this.mapTarget;
      if (this.markers.length > 0) {
        mapMethods.getBestView(this.markers);
      } else {
        mapMethods.setCity("上海");
      }

      this.$emit("best-view", this.markers);
    }
  }
};
