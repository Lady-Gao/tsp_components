<template>
    <div :class="isToggleTree ? 'cv-tabs-vehiclelists isToggleTree':'cv-tabs-vehiclelists'">
        <tabs :titles="titles" :is-scrollbar="true" class="cv-tabs-tree" v-model="activeName" type="border-card">
            <!-- 车辆树tabs -->
            <tree-search 
                ref="tree"
                :vehicle-search="vehicleSearch"
                @vehicle-choose-search="handlerVehicleSearch"
                :data="tree" 
                :baseUrl='baseUrl'
                :lazy="vehilceApi"
                :is-check="isChecked" 
                :node-filter="nodeFilter"
                :auto-param="autoParam"
                :other-param="otherParam"
                :operation="isOperation && treeOperation"
                :limit-check="handlerLimitCheck"
                @node-click="handlerTreeClick">
            </tree-search>
           

            <!-- 车辆列表(多选／单选) -->
            <tree-lists ref="lists"
                :search-api="listsApi" 
                :is-check="isChecked"
                :online-monitor="onlineMonitor"
                :vehicle-monitor="vehicleMonitor"
                :attention-monitor="attentionMonitor"
                :other-param="otherParam"
                @node-click="handlerListsClick">
                <template slot="checkbox">
                    <el-checkbox label="1">{{$t('components.common.online')}}</el-checkbox>
                    <el-checkbox label="0">{{$t('components.common.offline')}}</el-checkbox>
                </template>
                <template slot="label" slot-scope="scope">
                    <icon :name="(scope.row.icon||'icon1')+'cheliang'" :color="scope.row.onlineStatus=='1'?'#1bca22':''"  class="tabicongao"/>
                    <span class="pointer">{{scope.row.plateCodeAlias || scope.row.text}}</span>
                </template>
                <!-- 收藏按钮 -->
                <template slot="operation" slot-scope="scope" v-if="isOperation">
                    <icon name="shoucang1" :color="scope.row.isAttention=='1'?'#f3aa4e':''"
                    @click="handlerCollection($event, scope.row)"></icon>
                </template>
            </tree-lists>

            <!-- 车辆关注(多选／单选) -->
            <tree-lists ref="attentions"
                :search-api="attentionApi" 
                :is-check="isChecked"
                :online-monitor="onlineMonitor"
                :vehicle-monitor="vehicleMonitor"
                :other-param="otherParam"
                @node-click="handlerListsClick">
                <template slot="checkbox">
                    <el-checkbox label="1">{{$t('components.common.online')}}</el-checkbox>
                    <el-checkbox label="0">{{$t('components.common.offline')}}</el-checkbox>
                </template>
                <template slot="label" slot-scope="scope">
                    <icon :name="(scope.row.icon||'icon1')+'cheliang'" :color="scope.row.onlineStatus=='1'?'#1bca22':''" class="tabicongao"/>
                    <span class="pointer">{{scope.row.plateCodeAlias || scope.row.text}}</span>
                </template>
                <template slot="operation" slot-scope="scope" v-if="isOperation">
                    <i class="attention-icon el-icon-edit" @click="attentionEditHandler($event, scope.row)"></i>
                    <i class="attention-icon el-icon-delete" @click="attentionDeleteHandler(scope.row)"></i>
                </template>
            </tree-lists>
        </tabs>
        <div class='toggleIcons' title='车辆树' @click="toggleTree" v-if="iconFlag" >
            <i :class="isToggleTree?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
             style='vertical-align: middle;' color='rgb(161,191,223)'></i>
		</div>
        <!-- 下拉气泡收藏内容 -->
        <el-popover ref="popover" placement="bottom" width="160">
            <el-form v-clickoutside="handlerCollectionDestory">
                <el-form-item :label="$t('components.common.remark')">
                    <el-input size="mini" clearable v-model="popover.alias" />
                </el-form-item>
                <div style="text-align: right;">
                    <el-button size="mini" type="text" @click="handlerCollectionDestory">{{$t('components.common.cancle')}}</el-button>
                    <el-button type="primary" size="mini" @click="collectionConfirm">{{$t('components.common.confirm')}}</el-button>
                </div>
            </el-form>
        </el-popover>
    </div>
</template>

<script>
import tabTree from '../../../component-utils/tree/js/tabs-tree.js'
import togglePopover from '../../../../utils/mixins/toggle-popover'
import mergeMin from '../../../../utils/mixins/merge-min'
import confirm from '../../../../utils/mixins/confirm'
import TreeSearch from "./tree-search"
import TreeLists from "./tree-list"


export default {
    name: 'TabsTree',
    mixins: [tabTree, togglePopover, mergeMin, confirm],
    components:{
       TreeSearch,TreeLists
    },
    props: {
        showTree:true,
        iconFlag:{
            default:true
        },
        baseUrl:"",
        // 上下线--监听
        onlineMonitor: {},
        // 车辆是否添加--监听
        vehicleMonitor: {},
        // 车辆是否关注--监听
        attentionMonitor: {},
        // 公司和车组--监听
        enterpriseFleetMonitor: {},
        // 是否存在操作按钮
        isOperation: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 200
        },
        // 节点过滤（目前车辆树的节点类型:4）
        nodeFilter: {
            type: Array,
            default() {
                return ['type', 4]
            }
        },
        // 点击节点需要的节点参数
        autoParam: {
            type: Array,
            default() {
                return ['id', "type=type"];
            }
        },
        otherParam: {
            default() { return {} }
        }
    },
    data() {
        return {
            vehicle_choose: '',
            activeName: '',
            popover: {
                alias: '',
                id: ''
            },
            throttle: null,
            isToggleTree:false,
            // 关注的颜色
            attention_color: '#f3aa4e'
        }
    },
    computed: {
        _popoverMethods() {
            return this.$refs['popover'];
        }
    },
    watch: {
        showTree(val){
            this.isToggleTree = !val;
        },
        // 监听车辆树上下线
        onlineMonitor(val) {
            this.monitor_VehicleOnline(val);
        },
        // 监听车辆树关注状态
        attentionMonitor(val) {
            this.monitor_vehicleAttention(val);
        },
        // 监听车辆是否添加和删除
        vehicleMonitor(val) {
            this.monitor_vehicle(val);
        },
        // 监听公司和车组树
        enterpriseFleetMonitor(val) {
            switch(val.entOrFleet){
                case 'ENTERPRISE': return this.monitor_enterpriseFleet(val, 1);
                case 'ORGANIZATION': return this.monitor_enterpriseFleet(val, 2);
                case 'FLEET': return this.monitor_enterpriseFleet(val, 3);
                
            }
        }
    },
    methods: {
        /**
         * 车辆选择搜索的回调
         */
        handlerVehicleSearch(val) {
            this.$emit('vehicle-choose-search', val);
        },

        /** 
         * 树节点的点击事件
         * @param {Object} treeNode: 树的节点信息
        */
        handlerTreeClick(treeNode) {
            this.$emit('node-click', treeNode);
        },

        /**
         * 监听车辆上下线变化
         * @param {Object} val: 推送的新数据
         */
        monitor_VehicleOnline(val) {
            const _treeMethods = this.$refs['tree'].reference();

            if(_treeMethods) {
                const { vehicleId, messageText } = val;
                const node = _treeMethods.getNodeByParam('id', vehicleId);
                
                if(node) {
                    node.iconSkin = (messageText == this.$t('components.common.getLine')  ? 'online' : 'unline');
                    node.online = (messageText == this.$t('components.common.getLine')  ? true : false);
                    _treeMethods.updateNode(node);
                }
            }
        },

        /**
         * 监听车辆关注变化
         */
        monitor_vehicleAttention(val) {
            const _treeMethods = this.$refs['tree'].reference();

            if(_treeMethods) {
                const { vehicleId, isAttention } = val;
                const node = _treeMethods.getNodeByParam('id', vehicleId);
                
                if(node) {
                    const operation = document.getElementById(`operation-btn${node.id}`);
                    if(operation) {
                        const isAttention_icon = operation.querySelector('i');
                        isAttention == 1 
                        ? isAttention_icon.style.color = this.attention_color
                        : isAttention_icon.setAttribute('style', '');
                    }
                    
                    node.isAttention = isAttention;
                    _treeMethods.updateNode(node);
                   
                }  
            }
        },

        /**
         * 监听车辆添加还是删除还是修改
         * add remove modify
         * @param {Object}
         */
        monitor_vehicle(val) {
            switch(val.operation) {
                case 'ADD':
                    // 1. 不存在车辆就更新车辆父级数字+1
                    this.monitor_vehicle_updateParentNodeNumber(val, '+1');
                    // 2. 存在车辆的直系父节点就加节点
                    this.monitor_vehicle_updateNode(val, '+1');
                break;
                case 'DELETE':
                    this.monitor_vehicle_updateParentNodeNumber(val, '-1');
                    this.monitor_vehicle_updateNode(val, '-1');
                break;
                case 'UPDATE':
                    this.monitor_vehicle_updateNode(val, '0');
                break;
            }
        },

       /**
        * 新增车辆进行更新父节点上的车辆数字(Number) +1 -1
        * @param {Object} val={} 
        * @param {String} type = +1 -1
        */
        monitor_vehicle_updateParentNodeNumber(val, type) {
            
            const _treeMethods = this.$refs['tree'].reference();
            // 获取当前车辆的所有父节点id(Array)
            var treePids = val.treePids.split(',');
            if(!_treeMethods) return;

            const { getNodeByParam, updateNode } = _treeMethods;
            treePids.forEach(pid => {
                let treeNode = getNodeByParam('id', pid);
                if(treeNode) {
                    let text = treeNode.text.replace(/[(]\d+[)]/g, ""),
                    count = treeNode.sumCount + Number(type),
                    sumCount = (count < 0 ? 0 : count);

                    treeNode.sumCount = sumCount;  
                    treeNode.text = text + `(${sumCount})`;
                    updateNode(treeNode);
                }
            })  
        },

        /**
         * 对存在的节点进行新增(+1)，删除(-1)， 修改(0)
         */
        monitor_vehicle_updateNode(val, type) {
            const _treeMethods = this.$refs['tree'].reference();
            const { fleetId, plateCode, vehicleId, online } = val;
            if(!_treeMethods) return;

            const { getNodeByParam, addNodes, removeNode, updateNode } = _treeMethods;
            switch(Number(type)) {
                // 在该车辆的父节点下添加（fleed）
                case 1: 
                    var parentNode = getNodeByParam('id', fleetId);
                    parentNode && addNodes(parentNode, {
                        pId: fleetId,
                        text: plateCode,
                        id: vehicleId,
                        type: 4,
                        iconSkin: online=="true" ? 'online' : 'unline'
                    });
                break;
                // 删除符合要求的节点
                case -1:
                    var deleteNode = getNodeByParam('id', vehicleId);
                    deleteNode && removeNode(deleteNode);
                break;
                // 更新符合要求的节点
                case 0:
                    var modifyNode = getNodeByParam('id', vehicleId);
                    modifyNode && updateNode(modifyNode);
                break;
            }
        },
        
        /**
         * 公司和车组的新增(+1)，删除(-1)， 修改(0)
         * @param {Number} type: 公司(1)，机构(2)和车组(3)的类型
         */
        monitor_enterpriseFleet(val, type) {
            const _treeMethods = this.$refs['tree'].reference();
            const { operation, pid, name, id } = val;
            if(!_treeMethods) return;

            const { setInitialTree, getNodeByParam, addNodes, getAllNodes, removeNode, updateNode} 
            = _treeMethods;

            switch(operation){
                case 'ADD':
                    var addNode = getNodeByParam('id', pid);
                    addNode && addNodes(addNode, {
                        children: [],
                        pId: pid,
                        text: `${name}(0)`,
                        id,
                        type,
                        iconSkin: (type == 1 && 'company') || (type == 2 && 'organize') || (type == 3 && 'fleed')
                    });
                    setInitialTree(getAllNodes());
                break;
                case "DELETE":
                   var deleteNode = getNodeByParam('id', id);
                   deleteNode && removeNode(deleteNode);
                break;
                case 'UPDATE':
                   var modifyNode = getNodeByParam('id', id);
                   if(modifyNode) {
                       modifyNode.text = name;
                       updateNode(modifyNode);
                   }
                break;
            }
        },

        /**
         * 树节点的操作区域
         * @param {Object} treeNode
         * @return {Object} {template, methods}
         */
        treeOperation(treeNode) {
            let template = '';
            const _this = this;
            const { type, isAttention } = treeNode;
            
            if(type == 4) {
                template = (
                    isAttention == 1 
                    ? `<i id="tree-collection" class="cv-icon-font el-icon-star-on" style="color:${_this.attention_color}"></i>`
                    : `<i id="tree-collection" class="cv-icon-font el-icon-star-on"></i>`
                )
            }
            return {
                template,
                methods() {
                    const collection = document.getElementById('tree-collection');

                    if(collection) {
                        collection.onclick = (event) => {
                            this.currentTreeNode = treeNode;
                            _this.handlerCollection(event, treeNode);
                        }
                    }
                }
            }
        },

        /**
         * 获取所有车辆树已存在的节点数据
         * @return {Array} []
         */
        getAllNodes() {
            return this.$refs['tree'].reference().getAllNodes();
        },

        /**
         * ztree方法暴露出去
         */
        treeReference() {
            return this.$refs['tree'].reference().ztreeApi();
        },
        // 收缩树
        toggleTree() {
            this.isToggleTree = !this.isToggleTree;
            this.$emit("toggle",this.isToggleTree);
        },

        /**
        * 车辆列表关注按钮点击事件
        * @param {Object} mess:
        */
        async handlerCollection(event, mess) {
            event.stopPropagation();
            const { isAttention, id } = mess;

            if(isAttention == '1') {
                // 已经关注过，执行取消(cancel)操作
                try {
                    const { flag } = await this.deleteVehicleAttentionInfo(id);
                    this.handlerCollection_callback(flag,this.$t('cvcomponents.commontsp.cancel'));
                }
                catch(e) {
                    this.$message.error(this.$t('components.common.Networkerror'));
                }
            }else {
                // 未关注过， 执行打开气泡，显示input内容
                this.mixins_mergeMin(this.popover, mess);
                this.mixins_showPopover(this._popoverMethods, event.target);
            }
        },

        /**
         * 关注和取消关注的回调事件
         * @param {Boolean} flag
         * @param {String} text
         */
        handlerCollection_callback(flag, text='') {
            if(flag) {
                this.$message.success(text+this.$t('components.common.FocusSuccess'));
                this.handlerCollectionDestory();
                // 刷新车辆关注列表
                this.$refs['attentions'] && this.$refs['attentions'].handlerSearch(false);
            }else {
                this.$message.error(text+this.$t('components.common.FocusFail'));
            }
        },

        /**
         * 下拉气泡的确定按钮事件(车辆选择/车辆列表/车辆关注)
         */
        async collectionConfirm() {
            const {alias, id} = this.popover;

            try {
                const { flag } = await this.insertVehicleAttentionInfo({
                    alias,
                    vehicleId: id
                });
                this.handlerCollection_callback(flag, this.activeName=='tabs2'?this.$t('components.common.edit'):'');
            } catch (error) {
                 this.$message.error(this.$t('components.common.Networkerror'));
            }
        },

        /**
         * 关闭弹框的方法
         */
        handlerCollectionDestory() {
            this.mixins_hidePopover(this._popoverMethods);
        },

        /**
         * 车辆关注的编辑事件
         * @param {Event} event: 当前的编辑元素
         * @param {Object} mess: 当前行的信息
         */
        attentionEditHandler(event, mess) {
            event.stopPropagation();
            this.mixins_mergeMin(this.popover, mess);
            this.mixins_showPopover(this._popoverMethods, event.target);
        },

        /**
         * 车辆关注的删除事件
         */
        async attentionDeleteHandler(mess) {
            event.stopPropagation();
            await this.mixins_confirm();
            const { flag } = await this.deleteVehicleAttentionInfo(mess.id);
            this.handlerCollection_callback(flag, this.$t('components.common.cancel'));
        },

        /**
         * 列表的文本单击事件(车辆列表和车辆关注)
         */
        handlerListsClick(value) {
            this.$emit('node-click', value);
        },

        /**
         * 根据条件限制check是否勾选
         * @return {Boolean} true: 限制勾选 false: 不限制勾选
         */
        handlerLimitCheck(treeNode) {
            if(treeNode.sumCount > this.limit) {
                this.$message.warning(this.$t('components.common.moreThen')+`${this.limit}`+this.$t('components.common.checkAll'));
                return false;
            }
        },

        /**
         * 取消关注的api
         * @param {String|Number} vehicleId: 当前取消的车辆id
         */
        deleteVehicleAttentionInfo(vehicleId) {
            return this.$http({
                url: '/basic/vehicle/deleteVehicleAttentionInfo',
                params: {
                    vehicleId
                },
                method:"DELETE"
            })
        },

        /**
         * 关注确认api
         */
        insertVehicleAttentionInfo(params) {
            return this.$http({
                url: '/basic/vehicle/insertVehicleAttentionInfo',
                params
            })
        }
    }
}
</script>

<style lang="scss">
.cv-tabs-vehiclelists{
    height: 99.5%;
    width: 300px;
    position: absolute;
    z-index: 170;
    .el-checkbox{
        margin-right: 0px;
    }
}
.cv-tabs-tree {
    background: #fff;
    .attention-icon {
        cursor: pointer;
    }
    .pointer{
        cursor: pointer;
    }
    .tabicongao:before{
        display: block;
        width:15px;
        margin-right: 5px;
    }
}
.toggleIcons {
    position: absolute;
    top: 45%;
    cursor: pointer;
    width: 20px;
    height: 25px;
    line-height: 25px;
    right: -20px;
    border: 1px solid #ccc;
    border-left: 0px;
    background: #fff;
    border-radius: 0px 5px 5px 0px;
    -moz-border-radius: 0px 5px 5px 0px;
    -webkit-border-radius: 0px 5px 5px 0px;
}
.isToggleTree {
  left: -300px;
  transition: all 0.2s ease-in-out;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
</style>


