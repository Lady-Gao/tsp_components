export default {
    props: {
        isChecked: {
            type: Boolean,
            default: true
        },
        titles: {
            type: [Array,Function],
            default() {
                return [
                    'components.common.choesCar',
                    'components.common.carList',
                    'components.common.Carattention',
                ] 
            }
        },
        vehilceApi: {
            default: '/basic/tree/findVehicleTreeInfoList'
        },
        listsApi: {
            default: '/basic/tree/getVehicleListByPlate'
        },
        attentionApi: {
            type: String,
            default: '/basic/vehicle/findVehicleAttentionInfoList'
        },
        // 监听节点的变化的回调
        nodeMonitor: Function,
        // 默认的树数据
        treeData: Array,
        // 已经勾选的节点对象
        storeData: {
            type: Object,
            default() {return {} }
        },
        // 车辆搜索
        vehicleSearch: {
            default: ''
        }
    },
    data() {
        var _vm = this;
        return {
            tree: [],
            isNeedLoad: false,
            store: {
                // {id, id, id}
                vehicles: {},
                // [id, id, ...]
                vehiclesArray: [],
                // 获取列表接口方法
                getLists(params) {
                    return _vm.$http({
                        url: _vm.listsApi,
                        params
                    })
                },
                // 写入或者删除车辆id
                addOrRemoveVehicles(mess) {
                    const {name, data} = mess;

                    typeof _vm.nodeMonitor === 'function'&& _vm.nodeMonitor(mess);
                    switch(name) {
                        case 'check':
                            data.forEach(val => {
                                this.vehicles[val.id] = val;
                                _vm.$refs['tree'].reference().setCheckedKeys([val.id], true);
                            });
                        break;
                        case 'cancel':
                            data.forEach(val => {
                                _vm.$refs['tree'].reference().setCheckedKeys([val.id], false);
                                delete this.vehicles[val.id];
                            });
                        break;
                    };
                    // 对象转换数组 {id, id} ==> [id, id]
                    this.vehiclesArray = _vm._ObjectTransferArray(this.vehicles);
                }
            }
        }
    },
    provide() {
        return {
            store: this.store
        }
    },
    watch: {
        // 监听是否有已经缓存的车辆数据
        treeData: {
            immediate: true,
            handler(val) {
                if(Array.isArray(val) && val.length > 0) {
                    this.tree = val;
                } else {
                    this.tree = [];
                    // 需要请求树的标识
                    //this.isNeedLoad = true;
                }
            }
        },
        // 监听存储的对象id
        storeData: {
            immediate: true,
            handler(val) {
                this.store.vehicles = val;
                this.store.vehiclesArray = this._ObjectTransferArray(val);
            }
        }
    },
    methods: {
        /**
         * 对象转换数组
         * @param {Object} obj
         */
        _ObjectTransferArray(obj) {
            var results = [];
            //直接可使用数组的情况{isArray:[id,id,id....]}
            if (obj.isArray) {
                results= obj.isArray
            }else{
            //是数组对象的情况{[],[],[]...}
                 Object.keys(obj).forEach(val => {
                     results.push(val);
                 });
            }
           
            return results;
        }
    }
}