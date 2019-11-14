import _Promise from 'babel-runtime/core-js/promise';
import service from './service';

/**
 * 获取地图cdn接口
 */
export var getMapScript = function getMapScript() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'BMap';
    var cdn = arguments[1];

    if (!global[name]) {
        global[name] = {};
        global[name]._preloader = new _Promise(function (resolve, reject) {
            global._initMap = function () {
                resolve(global[name]);
                //global.document.body.removeChild($script)
                global[name]._preloader = null;
                global._initMap = null;
            };
            var $script = document.createElement('script');
            $script.type = 'text/javascript';
            global.document.body.appendChild($script);
            $script.src = cdn + '&callback=_initMap';
        });

        return global[name]._preloader;
    } else if (!global[name]._preloader) {
        return _Promise.resolve(global[name]);
    } else {
        return global[name]._preloader;
    }
};
/**
 * 异步加载远程js脚本(对地图貌似不是很适用，后期会研究一下)
 * @param {String} name: 全局变量名
 * @param {URL} cdn: 远程cdn地址
 * @return {Promise} 返回一个promise
 */
export const asyncDownloadScript = function (name = "Baidu", cdn) {
    // global == window   window.baidu = {_preloader: null}
    if (!global[name]) {
        global[name] = {}; // window.baidu = {}
        // window.baidu._preloader = new promise
        global[name]._preloader = new Promise((resolve, reject) => {
            const $script = document.createElement("script");
            $script.src = cdn;
            global.document.body.appendChild($script); // window.document.body.appendCHild
            if (service.isIe() && service.IE_VERSION < 11) {
                // ie
                $script.onreadystatechange = function () {
                    if (
                        $script.readyState == "loaded" ||
                        $script.readyState == "complete"
                    ) {
                        resolve(global[name]);
                        // wind.baidu._preloader = null 释放内存
                        global[name]._preloader = null;
                    }
                };
            } else {
                // 高级浏览器  11  edge chrome fix opera
                $script.onload = function () {
                    resolve(global[name]);
                    // wind.baidu._preloader = null 释放内存
                    global[name]._preloader = null;
                };
            }
        });
        return global[name]._preloader;
    } else if (!global[name]._preloader) {
        return Promise.resolve(global[name]);
    } else {
        return global[name]._preloader;
    }
};


/**
 * 动态创建script路径
 * @param {String} url 
 * @return {Element} script标签
 */
export var createScript = function createScript(url) {
    var $script = document.createElement('script');
    $script.type = 'text/javascript';
    $script.src = url;
    global.document.body.appendChild($script);

    return $script;
};

/**
 * 动态创建link样式路径
 * @param {String} id 
 * @param {Element} link标签
 */
export var createLink = function createStyle(id,url) {
     let oldtheme = document.getElementById(id)
     if (oldtheme) {
         document.head.removeChild(oldtheme)
     }
    let link = document.createElement('link');
     link.id = id;
     link.type = 'text/css';
     link.rel = 'stylesheet';
     link.href = url
     document.head.appendChild(link)
};
