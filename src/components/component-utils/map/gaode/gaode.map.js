import service from '../../../../utils/service'
import { asyncDownloadScript } from "../../../../utils/scriptHelper";
import {
    Circle,
    Rectangle,
    Line,
    Marker
} from '../mapModle'
  var toString = Object.prototype.toString;
export default class GaoDe {
    constructor(map, zoom = 11) {
        this.trffic ={};
        this.map = map
        this.zoom = zoom;
        this.len = [];
        this.pathSimplifierIns=null;//平滑对象
        this.navg1=null
        this.map.plugin(['AMap.MarkerClusterer'], () => {
            this.MarkerClusterer = new AMap.MarkerClusterer(this.map, [], {
                maxZoom: 15
            });
        });
        this.map.plugin(['AMap.MouseTool'], () => {
            this.MouseTool = new AMap.MouseTool(this.map);
        });

    }

    /**
     *point坐标方法
     *
     * @param {object} point
     * @memberof gaodeMap
     */
    point(pointobj) {
        return new AMap.LngLat(pointobj.longitude || pointobj.lng || 0, pointobj.latitude || pointobj.lat || 0);
    }

      // 获得地图的覆盖类(overlay) ----  args[0](图标地址) args[1](图标大小)args[2] (zoom)
      mapAddpoint(points, ...args) {
          var size, img, marker, point = this.point(points);
          if (args.length !== 0) {
              args[1] = undefined ? size = {
                  width: 24,
                  height: 24
              } : size = args[1];
              marker = new AMap.Marker({
                  map: this.map,
                  offset: new AMap.Pixel(-16, -16),
                  position: point,
                  topWhenClick: true,
                  icon: args[0]
              });
              marker.point = point;
              args[2] ? this.moveToCenter(point, args[2]) : null
              return marker;
          }
      }

       // 单个点居中
       moveToCenter(point, zoom) {
           var minSize = this.map.getZoom()
           var size,_point;
           point[0] ? _point = point[0] : _point = point;
           if (zoom) {
               size = Math.max(minSize, zoom);
               this.map.setZoomAndCenter(zoom, _point);
           } else {
               this.map.setZoomAndCenter(minSize, _point);
           }
       }


    /**
     * 本地搜索区域
     * @param {string} location 
     */
    Geocoder(location) {
        let _self =this;
        AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                map: _self.map
            });
            placeSearch.search(location, function(state, result) {
                _self.removerAllOverlay();
            });
        });
    }
    /**
     *创建Lable并返回文本对象
     *
     * @param {object} point
     * @param {string} text
     * @param {object} options
     * @memberof gaodeMap
     */
    createdLable(point, text, options) {
        let points = [point.lng, point.lat];
         let _option = {
             style: {
                 'background-color': '#fff',
                 'border': 'solid 1px #0088ff',
                 'padding': '10px 20px'
             }
         };
        let _options = service.extend(_option, options);
        var text = new AMap.Text(_options);
        text.setStyle(_options.style)
        text.setOffset(new AMap.Pixel(_options.size.x, _options.size.y) )//设置文本偏移量)
        text.setPosition(points) 
        return text;
    }

    /**
     *创建Icon并返回
     *
     * @param {string} url
     * @param {number} x
     * @param {number} y
     * @returns
     * @memberof gaodeMap
     */
    creteadIcon(url, x, y) {
        return new AMap.Icon({
            image: url,
            size: new AMap.Size(x, y)
        })
    }

    /**
     *设置中心点为城市，如果为城市，zoom不是必要参数
     *
     * @param {string} city
     * @param {number} zoom 范围3-19
     * @memberof gaodeMap
     */
    setCity(string) {
        this.map.setCity(string);
    }

    /**
     *设置经纬度为中心点，zoom是必要参数
     *
     * @param {object} point
     * @param {number} zoom 范围3-19
     * @memberof gaodeMap
     */
    setCenterByPoint(point, zoom) {
        this.map.setZoomAndCenter(zoom || this.zoom, point);
    }

    /**
     *设置最佳视野
     *
     * @param {*} views  [marker, marker ...]
     * @memberof gaodeMap
     */
    setBastView(views) {
        let points = [];
        if (toString.call(views) === '[object Array]') {
            views.array.forEach(view => {
                points.push(view.point ? view.point : view);
            });
            this.map.setFitView(points);
        } else {
            this.map.setFitView([views]);
        }
    }

    /**
     *设置地图类型
     *
     * @param {number} type 取值为0：默认底图 取值为1：卫星图
     * @memberof gaodeMap
     */
    setMapType(type) {
        let _self = this;
        this.map.plugin(["AMap.MapType"], function () {
            var mapType = new AMap.MapType({
                defaultType: type, //使用2D地图
            });
            // mapType.hide();
            _self.map.addControl(mapType);
        });

    }

    /*==========================================地图覆盖物创建方法及地图添加相关===================================================================================== */


    /**
     * 在地图上添加覆盖物
     * @param {object} overlay 
     */
    addOverlay(overlay) {
        let array = [];
        array.push(overlay);
        this.map.add(array);

    }
    /**
     * 删除覆盖物
     * @param {*} overlay 
     */
    removeOverlay(overlay) {
        if (overlay) {
            let array = [];
            array.push(overlay);
            this.map.remove(array);
        }
    }
    /**
     * 清空地图上所有覆盖物
     */
    removerAllOverlay() {
        this.map.clearMap();
    }

    /**
     * 创建标点marker
     * @param {object} marker 
     */
    _createMarker(overlayOptions) {
        // if (overlayOptions instanceof Marker) {
            let point = this.point(overlayOptions.point);
            return new AMap.Marker(point, {
                offset: new AMap.Pixel(overlayOptions.offset.x||0, overlayOptions.offset.y||0),
                position: point,
                topWhenClick: true,
                icon: overlayOptions.icon||null,
                rotation: overlayOptions.rotation||null,
            })
        // } else {
        //     return null;
        // }
    }

    /**
     * 创建线line
     * @param {object} overlayOptions 
     */
    _createLine(overlayOptions) {
        // if (overlayOptions instanceof Line) {
            let points = [];
            overlayOptions.points.forEach(p => {
                points.push(this.point(p));
            });
            return new AMap.Polyline({
                path: points,
                ...overlayOptions.style
            });

        // } else {
        //     return null;
        // }
    }

    /**
     * 创建圆Circle
     * @param {object} overlayOptions 
     */
    _createCircle(overlayOptions) {
        if (overlayOptions instanceof Circle) {
            let point = this.point(overlayOptions.point);
            return new AMap.Circle({
                map: this.map,
                center: point,
                ...overlayOptions.style
            });
        } else {
            return null;

        }

    }
    /**
     * 创建矩形Rectangle
     * @param {object} overlayOptions 
     */
    _createRectangle(overlayOptions) {
        if (overlayOptions instanceof Rectangle) {
            let leftBottom = this.point({
                    lng: overlayOptions.minLng,
                    lat: overlayOptions.maxLat
                }),
                rightTop = this.point({
                    lng: overlayOptions.maxLng,
                    lat: overlayOptions.minLat
                })
            let bounds = new AMap.Bounds(leftBottom, rightTop);

            return new AMap.Rectangle({
                map: this.map,
                bounds: bounds,
                ...overlayOptions.style
            });
        } else {
            return null;
        }
    }

    /**
     * 创建多边形Polygon
     * @param {object} overlayOptions 
     */
    _createPolygon(overlayOptions) {
        if (overlayOptions instanceof Line) {
            let points = [];
            overlayOptions.points.forEach(p => {
                points.push(this.point(p));
            })
            return new AMap.Polygon({
                map: this.map,
                path: points,
                ...overlayOptions.style
            });
        } else {
            return null;
        }
    }

    /**
     *添加地图覆盖物方法（marker,line,circle,rectangle,polygon）
     *
     * @param {string} type 要添加的覆盖物类型（（marker,line,circle,rectangle,polygon））
     * @param {object} overlayOptions 覆盖物自定义对象object,覆盖物属性在自定义对象属性中（marker,line,circle,rectangle,polygon）
     * @param {boolean} isDraw 是否在地图上绘制
     * @memberof gaodeMap
     */
    createOverlay(type, overlayOptions, isDraw = true) {
        let overlay = null;
        if (type === "marker") {
            overlay = this._createMarker(overlayOptions);
        } else if (type === "line") {
            overlay = this._createLine(overlayOptions);
        } else if (type === "circle") {
            overlay = this._createCircle(overlayOptions);
        } else if (type === "rectangle") {
            overlay = this._createRectangle(overlayOptions);
        } else if (type === "polygon") {
            overlay = this._createPolygon(overlayOptions);
        } else {
            overlay = null;
        }
        if (overlay && isDraw)
            this.addOverlay(overlay);
        return overlay;
    }

    /*===============================覆盖物绘制操作=========================================================== */
    /**
     * 获取圆形数据
     * @param {object} overlay 
     */
    getCricleOptions(overlay) {
        var options = {
            points: overlay.getBounds(),
            overlay: overlay,
            center: overlay.getCenter(),
            radius: overlay.getRadius()
        };
        return options;
    }
    /**
     * 获取多边形及线的数据
     * @param {object} overlay 
     */
    getPolygonOptions(overlay) {
        var options = {
            points: overlay.getPath(),
            overlay: overlay
        };
        return options

    }
    /**
     * 获取矩形数据
     * @param {object} overlay 
     */
    getRectangleOptions(overlay) {
        let options = {};
        let params = {
            minLng: overlay.getPath()[0].lng,
            minLat: overlay.getPath()[2].lat,
            maxLng: overlay.getPath()[2].lng,
            maxLat: overlay.getPath()[0].lat
        };
        options.points = overlay.getPath();
        options.params = params;
        options.overlay = overlay;
        return options;
    }
   
    /**
     * 绘制内部私有函数
     * @param {string} drawModel 
     * @param {Function} eventFunction 
     */
    _drawUtils(drawModel, eventFunction) {
        
          this.MouseTool.close(true) //关闭，并清除覆盖物
          this.MouseTool.on('draw', eventFunction)
          this.MouseTool[drawModel]();
    }
    /**
     * 绘制圆形
     * @param {Function} callback 
     */
    _drawCricle(callback) {
        let _self = this;
        this._drawUtils('circle',fn);
        function fn(e){
            let options = {
                point: e.obj.getBounds(),
                overlay: e.obj,
                center: e.obj.getCenter(),
                radius: e.obj.getRadius()
            }
            _self.removeEventListener(_self.MouseTool, 'draw', fn);
            if (toString.call(callback) === '[object Function]')
                callback(options);
        }
    }
    /**
     * 绘制Marker
     * @param {Function} callback 
     */
    _drawMarker(callback) {
        let _self = this;
        this._drawUtils('marker', fn);
        function fn(_overlay){
            let options = _overlay.obj
            _self.removeEventListener(_self.MouseTool, 'draw', fn)
            if (toString.call(callback) === '[object Function]')
                callback(options);
        }
    }
    /**
     * 绘制线
     * @param {Function} callback 
     */
    _drawLine(callback) {
        let _self = this;
        this._drawUtils('polyline', fn);
        function fn(_overlay){
            let options = {
                point: _overlay.obj.getBounds(),
                overlay: _overlay.obj
            }
            _self.removeEventListener(_self.MouseTool, 'draw', fn)
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        };
    }
    /**
     * 绘制多边形
     * @param {Function} callback 
     */
    _drawpolygon(callback) {
        let _self = this;
        this._drawUtils('polygon', fn);
        function fn(_overlay){
            let options = {
                point: _overlay.obj.getBounds(),
                overlay: _overlay.obj
            }
            _self.removeEventListener(_self.MouseTool, 'draw', fn);
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        };
    }

    /**
     * 绘制矩形
     * @param {Function} callback 
     */
    _drawRectangle(callback) {
        let _self = this;
        this._drawUtils('rectangle', fn);
        function fn(_overlay){
            var bounds = _overlay.obj.getBounds();
            let options = {
                point: bounds,
                overlay: _overlay.obj,
                params: {
                    minLng: bounds.southwest.lng,
                    minLat: bounds.southwest.lat,
                    maxLng: bounds.northeast.lng,
                    maxLat: bounds.northeast.lat
                }
            }
            _self.removeEventListener(_self.MouseTool, 'draw', fn);
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        }
    }
    /**
     * 绘制覆盖物
     * @param {string} type 
     * @param {Function} callback 
     */
    drawOverlay(type, callback) {
         
        if (type === "circle")
            this._drawCricle(callback);
        else if (type === "line")
            this._drawLine(callback);
        else if (type === "polygon")
            this._drawpolygon(callback);
        else if (type === "rectangle")
            this._drawRectangle(callback);
        else if (type === "Marker")
            this._drawMarker(callback);
    }
    /*===========================地图弹窗类操作=================================================================== */

    /**
     * 创建地图信息弹窗
     * @param {string} content 
     * @param {object} options 
     * @param {object} clb 使用自定义弹框 
     */
    createInfoWindow(content, options={}, clb=true) {
        debugger
        let style = Object.assign(options, {
            isCustom: clb ? true : false,
            autoMove: true,
            offset: new AMap.Pixel(16, -50)
        });
        return new AMap.InfoWindow(content, style);
    }
     /**
      * 在地图上打开信息弹窗(创建infoWindow对象)
      * @param {object} infoWindow 
      * @param {*} point 
      */
    openInfoWindow(content, point, options={},callback ) {
          //样式
          let style = {
              isCustom: true,
              autoMove: true,
              offset: new AMap.Pixel(16, -50),
              ...options
          }
          //弹框对象
          var infoWindow = new AMap.InfoWindow({
              content,
              style
          });
          infoWindow.open(this.map, point);
           if (callback&&(toString.call(callback) === "[object Function]"))
               callback(infoWindow);
          return infoWindow
    }
    /**
     * 关闭信息弹窗
     * @param {object} infoWindow 
     */
    closeInfoWindow(infoWindow) {
        infoWindow&&infoWindow.close()
    }
     /**
      * 点击覆盖物打开弹窗
      * @param {object} overlay 
      * @param {string} content 
      * @param {object} point 
      * @param {function} callback 
      * @param {object} options //弹框样式 
      */
     overlayClickOpenInfoWindow(overlay, point, content, options = {}, callback) {
        this.addEventListener(overlay, 'click', ()=>{
            this.openInfoWindow(content, point, options, callback)
        })
     }
      /*====================================覆盖物（marker）基础操作================================================================= */

      /**
       * 覆盖物编辑
       * @param {object} overlay 
       * @param {boolean} isEdit 
       */
      overlayEdit(overlay, isEdit) {
         var nameArray = overlay.CLASS_NAME.split('.'),
             name = nameArray[nameArray.length - 1];
         if (name == 'Circle') {
             name += 'Editor';
         } else {
             name = 'PolyEditor'
         }
         this.map.plugin(["AMap." + name], function () {
             var edit = new AMap[name](this.map, overlay);
             isEdit ? edit.open() : edit.close();
         })

      }
       /**
        * 设置覆盖物位置
        * @param {object} overlay 
        * @param {*} point 
        */
       setPosition(overlay, point) {
           overlay.setPosition(point);
           return overlay;
       }
       /**
        * 设置覆盖物旋转角
        * @param {object} overlay 
        * @param {number} Rotation 
        */
       setRotation(overlay, Rotation) {
           overlay.setRotation(Rotation);
       }
        /*============================地图工具类操作=============================================================== */

        /**
         * 地图工具类
         * @param {string} type 
         * @param {object} options 
         */
        mapTools(type, callback) {
            let _self = this;
            switch (type) {
                case 'distance':
                    var ruler1;
                    this.map.plugin(["AMap.RangingTool"], function () {
                        ruler1 = new AMap.RangingTool(_self.map);
                        AMap.event.addListener(ruler1, "end", function (e) {
                            ruler1.turnOff();
                        });
                    });
                    return {
                        open() {
                            ruler1.turnOn();
                        }
                    }
                break;
                case 'rectangleZoom':
                     this.addEventListener(this.map, 'zoomchange', function (e) {
                         _self.MouseTool.close(false);
                     })
                     _self.MouseTool.rectZoomIn();
                     return {
                         open() {
                             return null;
                         }
                     }
                break;
                case 'Driving':
                    this.len=[]
                    function  drawMarker(event){
                        _self.len.push(event.obj)
                        if(_self.len.length>=2){
                            _self.removeEventListener(_self.MouseTool, 'draw', drawMarker);
                            _self.Driving('LEAST_TIME');
                        }
                    }
                    this._drawUtils("marker",drawMarker);
                    
                    // this.addEventListener(this.MouseTool, 'draw', this.drawMarker.bind(this))
                    // this.MouseTool.marker({
                    //     map: this.map
                    // });
                    return {
                        open() {
                            return null;
                        }
                    }
                    break;
            
            }
           
        }
       
         //调用线路规划
         Driving(TruckValue ) {
            let _self = this;
            this.driving && this.driving.clear();
            let start = this.len[0].getPosition();
            let end = this.len[1].getPosition();
             AMap.plugin('AMap.Driving', function () {
                 _self.driving = new AMap.Driving({
                     map: _self.map,
                     policy: AMap.DrivingPolicy[TruckValue]
                 });
                 
                 let startLngLat = [start.lng, start.lat];
                 let endLngLat = [end.lng, end.lat];
                 _self.driving.search(startLngLat, endLngLat, (e)=>{
                    _self.MouseTool.close(true);
                 });
             });
         }
        /**
         * 获取交通流量实例 实时路况图层
         */
        getTrfficObj(type,flag) {
            if(flag){
                type.forEach(name =>{
                    this.trffic[name] = new AMap.TileLayer[name];
                    this.map.add(Object.values(this.trffic));
                });
            }else{
                type.forEach(name =>{
                    if(this.trffic[name]){
                        this.map.remove([this.trffic[name]]);
                        delete this.trffic[name];
                    }
                    
                });
            }
            // this.trffic && this.map.remove([this.trffic]);
            // this.trffic = new AMap.TileLayer.Traffic();
            // this.map.add([this.trffic]);
            // return this.trffic;
        }
         /**
          * 是否开启交通流量s
          * @param {boolean} flag 
          */
        //  setTrffic(flag) {
        //      if (flag) {
        //          this.trffic.show();
        //         } else {
        //          this.trffic.hide();
        //         }
        //  }
          /*============================f地图聚合类操作============================================================ */

        /**
         * 聚合方法 添加， 删除
         * @params {Array} markers: 多个或单个覆盖物数组
         */

          markerClustererAction(type, markers) {
              if (toString.call(markers) === "[object Array]") {
                  switch (type) {
                      case "addMarkers":
                          this.MarkerClusterer.addMarkers(markers);
                          break;
                      case "addMarker":
                          this.MarkerClusterer.addMarker(marker);
                          break;
                      case "removerMarkers":
                          this.MarkerClusterer.removeMarkers(markers);
                          break;
                      case "removeMarker":
                          this.MarkerClusterer.removeMarker(marker);
                          break;
                      case "clearMarkers":
                          this.MarkerClusterer.clearMarkers();
                          break;
                      default:
                          break;
                  }
              }
          }
           /*================================事件操作============================================ */

           /**
            * 添加事件监听
            * @param {*} target 
            * @param {*} eventName 
            * @param {*} handler 
            */
           addEventListener(target, eventName, handler) {
                // 兼容百度的， 百度有clickclose ，高德没有(只有close)
                if (eventName == 'clickclose') {
                    eventName = 'close'
                }
                target.on(eventName, handler);
           }
            /**
             * 删除事件监听
             * @param {*} target 
             * @param {*} eventName 
             * @param {*} handler 
             */
            removeEventListener(target, eventName, handler) {
                if (eventName == 'clickclose') {
                    eventName = 'close'
                }
                target.off(eventName, handler);

            }
             /*=============================地图样式操作==================================================== */

             /**
              * 设置地图的样式（自定义）
              * @param {object} json {style:'normal'}
              */
             setMapStyle(json) {
                 this.map.setMapStyle('amap://styles/' + json.style)
             }
             /*============================地图插件cdn加載============================================================ */
            /**
             * cdn加載
             * @param {Array} Array [{name:'gaode1',src:'http'},{name:'gaode2',src:'http'}]
             */
             DownloadScript(arr){
                return new Promise((resolve,reject)=>{
                    arr.forEach(item => {
                        asyncDownloadScript(item.name,item.src)
                    });
                    resolve(true)
                })
            }
             /*============================平滑移動============================================================ */
              
              /**
               * 巡航器初始化
               * @param {Object} obj: {
               *        speed 
               *        src 
               *        name 
               *        id 
               *        path: [[116.405289, 39.904987]]
               *        path: [[lont, lat],[lont, lat]...]
               *      }
               * @param {FUN} clickCallback 点击图片和线实践
               * @param {FUN} HoverTitleCallback 选传 hove时的文本框内容
               */
             newprealTimeSimplifier(type = 'moved', obj, clickCallback, HoverTitleCallback) {
                 //清空
                 if (this.pathSimplifierIns) {
                    this.pathSimplifierIns.setData([])
                    this.pathSimplifierIns=null
                  };
               AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {
                   if (!PathSimplifier.supportCanvas) {
                       alert("当前环境不支持 Canvas！");
                       return;
                   }
                   this.PathSimplifier = PathSimplifier
                   const emptyLineStyle= {
                    lineWidth: 0,
                    fillStyle: null,
                    strokeStyle: null,
                    borderStyle: null
                };
                   this.pathSimplifierIns = new PathSimplifier({
                       zIndex: 60000,
                       autoSetFitView: false,
                       map: this.map, //所属的地图实例
                       getPath: function (pathData, pathIndex) {
                           return pathData.path;
                       },
                       getHoverTitle: HoverTitleCallback,
                       renderOptions: type=='moved'?{
                        //将点、线相关的style全部置emptyLineStyle
                        pathLineStyle: emptyLineStyle,
                        pathLineSelectedStyle: emptyLineStyle,
                        pathLineHoverStyle: emptyLineStyle,
                        keyPointStyle: emptyLineStyle,
                        startPointStyle: emptyLineStyle,
                        endPointStyle: emptyLineStyle,
                        keyPointHoverStyle: emptyLineStyle,
                        keyPointOnSelectedPathLineStyle: emptyLineStyle
                    }:{}
                   });
                   //点击事件
                   this.pathSimplifierIns.on("pointClick pathClick", clickCallback);
                   let dataArr = this.pathData(obj,type)
                   this.pathSimplifierIns.setData([dataArr]);
                   //对第一条线路（即索引 0）创建一个巡航器
                   this.navg1 = this.pathSimplifierIns.createPathNavigator(0, {
                       loop: true,
                       speed: 1000000,

                   });

                   this.navg1.start();
               })

               }
             /**
              * @param {Number} type 0:实时 1 轨迹
              * @param {Object}
              */
             pathData(obj) {
                         return {
                             name: obj.name,
                             id: obj.id,
                             path: obj.path
                         }
             }
             /**
              * 实时平滑的移动
              * @param {Object} obj:{
              *      speed
              *      src
              *      name
              *      id
              *      path:[lont,lat]
              *    } 
              */
             tradoExpand(obj) {
                 if (!this.pathSimplifierIns) return
                 //保存巡航器的位置
                 let cursor = this.navg1.getCursor().clone(),
                     status = this.navg1.getNaviStatus();
                 //增加路线
                  let dataArr = this.pathData(obj)
                 this.pathSimplifierIns.setData([dataArr]); //延展路径
debugger
                 //重新建立一个巡航器
                 this.navg1 = this.pathSimplifierIns.createPathNavigator(0, {
                     // loop: true, //循环播放
                     speed:obj.speed? obj.speed * 100:1000000, //巡航速度，单位千米/小时
                     pathNavigatorStyle: {
                         width: 32,
                         height: 32,
                         //使用图片
                        //  content: this.PathSimplifier.Render.Canvas.getImageContent(obj.src,
                        //      () => {
                        //          this.pathSimplifierIns.renderLater();
                        //      },
                        //      null
                        //  )
                     }
                 });

                 if (status !== "stop") {
                     this.navg1.start();
                 }

                 //恢复巡航器的位置
                 if (cursor.idx >= 0) {
                     this.navg1.moveToPoint(cursor.idx, cursor.tail);
                 }
             }
}