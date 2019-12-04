import markerCluster from "./markerCluster";

/**
 * @class 谷歌地图封装
 * @author 张婵玉
 */
export default class googleMap{
    constructor(mapId, options, isMarkerClusterer = false) {
        this.markerArray=[];
        this.map = new google.maps.Map(mapId,options);
        this.zoom = options.zoom;
        if (isMarkerClusterer){
            this.markerClusterer = new markerCluster(this.map, {
                maxZoom: this.zoom
            });
        }else{
            this.markerClusterer = null;
        }
    }

     /**
     *point坐标方法
     *
     * @param {object} point
     * @memberof baiduMap
     */
    point(pointobj) {
        return new google.maps.LatLng(pointobj.latitude || pointobj.lat, pointobj.longitude || pointobj.lng);
    }
    /**
     *创建Lable并返回文本对象
     *
     * @param {object} point
     * @param {string} text
     * @param {object} options
     * @memberof baiduMap
     */
    createdLable(point, text, options) {
        return {
            setStyle(opts){

            }
        }
    }
    /**
     *创建Icon并返回
     *
     * @param {object} marker
     * @param {string} url
     * @param {number} x
     * @param {number} y
     * @returns
     * @memberof baiduMap
     */
    creteadIcon(marker,url, x, y) {
        return marker.setIcon({
            path:url.path||url.url,
            fillColor:url.fillColor,
            fillOpacity:1,
            strokeColor:url.strokeColor
        })
    }
    /**
     *设置中心点为城市，如果为城市，zoom不是必要参数
     *
     * @param {string} city
     * @param {number} zoom 范围3-19
     * @memberof baiduMap
     */
    setCity(city, zoom) {
        this.map.setCenter({lat:31.22,lng:121.48});
        this.map.setZoom(zoom||this.zoom);
    }
    // 单个点居中
    moveToCenter(point, zoom) {
        this.map.setCenter(point);
        this.map.setZoom(zoom || this.zoom);
    }
    /**
     *设置经纬度为中心点，zoom是必要参数
     *
     * @param {object} point
     * @param {number} zoom 范围3-19
     * @memberof baiduMap
     */
    setCenterByPoint(point, zoom) {
        this.map.setCenter(point);
        this.map.setZoom(zoom||this.zoom);
    }
    /**
     *设置最佳视野
     *
     * @param {*} views
     * @memberof baiduMap
     */
    setBastView(views) {
        if(views.length){
            let points = [],bounds = new google.maps.LatLngBounds();
            if (toString.call(views) === '[object Array]') {
                views.array.forEach(view => {
                    points.push(view.point ? {lat:view.point.lat(),lng:view.point.lng()}:view);
                });
            } else {
                points= views.points;
            }
            points.forEach(item =>{
                bounds.extend(item);
            });
            this.map.fitBounds(bounds);
        }

    }
    /**
     *设置地图类型
     *
     * @param {number} type 0：普通街道地图，1：卫星图，2：卫星和路网混合图
     * @memberof baiduMap
     */
    setMapType(type) {
        switch (type) {
            case 0:
                this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                break;
            case 1:
                this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                break;
            case 2:
                this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                break;
            default:
                this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                break;
        }
    }
    /*==========================================地图覆盖物创建方法及地图添加相关===================================================================================== */


    /**
     * 在地图上添加覆盖物
     * @param {object} overlay
     */
    addOverlay(overlay) {
        this.markerArray.push(overlay);
        overlay.setMap(this.map);
    }
    /**
     * 删除覆盖物
     * @param {*} overlay
     */
    removerOverlay(overlay) {
        overlay.setMap(null);
    }
    /**
     * 清空地图上所有覆盖物
     */
    removerAllOverlay() {
        this.markerArray.forEach(overlay =>{
            overlay.setMap(null);
        });
        this.markerArray=[];
    }
    /**
     * 创建标点marker
     * @param {object} marker
     */
    _createMarker(overlayOptions) {
        // if (overlayOptions instanceof Marker) {
            let point = this.point(overlayOptions.point);
            return new google.maps.Marker({
                icon: overlayOptions.icon,
                position:point
            })
        // } else {
        //     return null;
        // }
    }
    // 获得地图的覆盖类(overlay) ----  args[0](图标地址) args[1](图标大小)args[2] (zoom)
    mapAddpoint(points, ...args) {
        var size, img, marker, point = this.point(points);
        if (args.length !== 0) {
            args[1] = undefined ? size = {
                width: 24,
                height: 24
            } : size = args[1];
            marker = new google.maps.Marker({
                position: point,
                icon: args[0],
            });
            marker.point = point;
            args[2] ? this.moveToCenter(point, args[2]) : null
            return marker;
        }
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
            let lineOptions = {
                geodesic:true,
                strokeColor:"#5298ff",
                strokeOpacity:1,
                strokeWeight:2,
                path:points
            }
            return new google.maps.Polyline(lineOptions);
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
            let circleOption = {
                strokeColor:"#20a0ff",
                strokeOpacity:1,
                strokeWeight:2,
                fillColor:"#fff",
                fillOpacity:0.5,
                center:point,
                radius:100
            }
            return new google.maps.Circle(circleOption);
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
            let rectangleOption = {
                strokeColor:"#20a0ff",
                strokeWeight:2,
                strokeOpacity:1,
                fillColor:"#FFF",
                fillOpacity:0.5,
                map:this.map,
                bounds:{
                    north:overlayOptions.maxLat,
                    south:overlayOptions.minLat,
                    east:overlayOptions.minLng,
                    west:overlayOptions.maxLng
                }
            }
            return new google.maps.Rectangle(rectangleOption);
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
            });
            let polygonOption = {
                strokeColor:"#20a0ff",
                strokeWeight:2,
                strokeOpacity:1,
                fillColor:"#FFF",
                fillOpacity:0.5,
                paths:points
            };
            return new google.maps.Polygon(polygonOption);
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
     * @memberof baiduMap
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
        let options = {
            points: overlay.getPath(),
            overlay: overlay,
            center: overlay.point,
            radius: overlay.getRadius()
        };
        return options;
    }
    /**
     * 获取多边形及线的数据
     * @param {object} overlay
     */
    getPolygonOptions(overlay) {
        let options = {
            points: overlay.getPath(),
            overlay: overlay
        };
        return options;
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
     * 开启绘制类
     * @param {string} name
     */
    _getDrawingManager() {
        let styleOptions = {
            strokeColor: "red", //边线颜色。
            fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3, //边线的宽度，以像素为单位。
            strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed
        };
        return new BMapLib.DrawingManager(this.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
                scale: 0.8 //工具栏缩放比例
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });
    }
    _openDrawingManagerByMode(name) {
        this.drawingManager = null;
        this.drawingManager = this._getDrawingManager();
        this.drawingManager.setDrawingMode(name);
        this.drawingManager.open();
    }
    /**
     * 绘制内部私有函数
     * @param {string} drawModel
     * @param {Function} eventFunction
     */
    _drawUtils(drawModel, eventFunction) {
        this._openDrawingManagerByMode(drawModel);
        this.drawingManager.addEventListener("overlaycomplete", eventFunction);
    }
    /**
     * 绘制圆形
     * @param {Function} callback
     */
    _drawCricle(callback) {
        this._drawUtils(BMAP_DRAWING_CIRCLE, _overlay => {
            let options = this.getCricleOptions(_overlay.overlay);
            this.drawingManager.close();
            if (toString.call(callback) === '[object Function]')
                callback(options);
        });
    }
    /**
     * 绘制线
     * @param {Function} callback
     */
    _drawLine(callback) {
        this._drawUtils(BMAP_DRAWING_POLYLINE, _overlay => {
            let options = this.getPolygonOptions(_overlay.overlay);
            this.drawingManager.close();
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        });
    }
    /**
     * 绘制多边形
     * @param {Function} callback
     */
    _drawpolygon(callback) {
        this._drawUtils(BMAP_DRAWING_POLYGON, _overlay => {
            let options = this.getPolygonOptions(_overlay.overlay);
            this.drawingManager.close();
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        });
    }

    /**
     * 绘制矩形
     * @param {Function} callback
     */
    _drawRectangle(callback) {
        this._drawUtils(BMAP_DRAWING_POLYLINE, _overlay => {
            let options = this.getRectangleOptions(_overlay.overlay);
            this.drawingManager.close();
            if (toString.call(callback) === '[object Function]') {
                callback(options);
            }
        })
    }

    /**
     * 绘制覆盖物
     * @param {string} type
     * @param {Function} callback
     */
    drawOverlay(type, callback) {
        if (type === "cricle")
            this._drawCricle(callback);
        else if (type === "line")
            this._drawLine();
        else if (type === "polygon")
            this._drawpolygon();
        else if (type === "rectangle")
            this._drawRectangle();
    }
    /*===========================地图弹窗类操作=================================================================== */

    /**
     * 创建地图信息弹窗
     * @param {string} content
     * @param {object} options
     */
    createInfoWindow(content, options,point) {
        let infoWindow = new google.maps.InfoWindow({
            content:content,
            position:point
        });
        this.markerArray.push(infoWindow);
        return infoWindow;
    }
    /**
     * 创建地图信息弹窗并打开
     * @param {string} content
     * @param {object} options
     * @param {*} point
     */
    createAndOpenInfoWindow(content, options, point) {
        let infoWindow = this.infoWindow(content,options, point);
        infoWindow.open(this.map);
        this.markerArray.push(infoWindow);
        infoWindow.open(this.map);
    }
    /**
     * 在地图上打开信息弹窗
     * @param {object} infoWindow
     * @param {*} point
     */
    openInfoWindow(infoWindow, point) {
        infoWindow.open(this.map);
    }
    /**
     * 关闭信息弹窗
     * @param {object} infoWindow
     */
    closeInfoWindow(infoWindow) {
        infoWindow.close();
    }
    /**
     * 点击覆盖物打开弹窗
     * @param {object} overlay
     * @param {string} content
     * @param {object} point
     * @param {function} callback
     * @param {object} options
     */
    overlayClickOpenInfoWindow(overlay, content, point, callback, options) {
        this.addEventListener(overlay,'click',() =>{
            let infoWindow = this.openInfoWindow(content, options, point);
            if (toString.call(callback) === "[object Function]"){
                callback(infoWindow);
            }
        });
    }
    /*====================================覆盖物（marker）基础操作================================================================= */

    /**
     * 覆盖物编辑
     * @param {object} overlay
     * @param {boolean} isEdit
     */
    overlayEdit(overlay, isEdit) {
        overlay.setEditable(isEdit);
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
        let icon = overlay.getIcon();
        overlay.setIcon({
            path:icon.url||icon.path,
            fillColor:icon.fillColor,
            strokeColor:icon.strokeColor,
            rotation:Rotation,
            fillOpacity:1
        })
        return overlay;
    }
    /*============================地图工具类操作=============================================================== */

    /**
     * 地图工具类
     * @param {string} type
     * @param {object} options
     */
    mapTools(type, options) {
        alert("谷歌地图该功能需要收费，暂未开通");
        return {
            open(){
                return null;
            }
        }
    }
    /*============================f地图聚合类操作============================================================ */

    /**
     * 地图聚合操作函数
     * @param {string} type
     * @param {object} markers
     */
    markerClustererAction(type, markers) {
        if (toString.call(markers) === "[object Array]") {
            switch (type) {
                case "addMarkers":
                    this.markerClusterer.addMarkers(markers);
                    break;
                case "addMarker":
                    this.markerClusterer.addMarker(markers[0]);
                    break;
                case "removerMarkers":
                    this.markerClusterer.removeMarkers(markers)
                    break;
                case "removeMarker":
                    this.markerClusterer.removeMarker(markers[0]);
                    break;
                case "clearMarkers":
                    this.markerClusterer.clearMarkers();
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
        if(eventName == "clickclose"){
            eventName = 'closeclick';
        }
        target.addListener(eventName, handler);
    }
    /**
     * 删除事件监听
     * @param {*} target
     * @param {*} eventName
     * @param {*} handler
     */
    removeEventListener(target, eventName, handler) {
        if(eventName == "clickclose"){
            eventName = 'closeclick';
        }
        target.removeListener(eventName, handler);
    }
    /*=============================地图样式操作==================================================== */

    /**
     * 设置地图的样式（自定义）
     * @param {object} json
     */
    setMapStyle(json) {
        this.map.setMapStyle({
            styleJson: json
        })
    }
}