<template>
    <div class="cv-tree" ref="tree" v-loading="treeLoading">
        <div class="cv-tree-emptytext" v-show="isEmptyText">{{$t('components.common.empty')}}</div>

        <!-- 树的容器 -->
        <ul class="cv-ztree" ref="ztree" v-show="!isEmptyText"></ul>

        <!-- 右点击下拉框 -->
        <ul class="el-dropdown-menu el-popper" 
            v-if="isContextmenu" v-show="rightDropdown" :style="rightPosition">
            <slot name="dropdown" :api="zTree">
                <!-- <li tabindex="-1" class="el-dropdown-menu__item">黄金糕</li> -->
            </slot>
            <div x-arrow="" class="popper__arrow" style="left: 46px;"></div>
        </ul>
    </div>
</template>

<script>
import BaseTree from './js/base-tree';
import dom from '../../../../utils/dom';
export default {
    name: 'Tree',
    props: {
        baseUrl:'',
        // 同步树的所有数据 {data: [], async: url/false/null, initial: 'default/none'}
        data: {},
        // 树的异步接口(/monitor/findVehicleTreeInfoList)
        url: {
            type: String
        },
        lazy: {
            default: false
        },
        isCopy:{
            default:false//拖拽时，是否复制节点，false为移动节点
        },
        isMove:{
            default:false//拖拽时，设置是否允许移动节点
        },
        // 是否是多选还是单选模式 true(多选)
        isCheck: {
            type: Boolean,
            default: false
        },
        // 树上的节点图标筛选
        iconsFilter: {
            type: Function
        },
        // 树节点操作区域
        operation: {},
        // 树上的节点筛选 return [条件, 符合的结果]
        nodeFilter: {
            type: Array,
            default() {return [] }
        },
        // 是否开启右击功能
        isContextmenu: {
            type: Boolean,
            default: false
        },
        // 是否默认打开根节点
        isExpand: {
            type: Boolean,
            default: true
        },
        // 是否冻结根节点
        isFreeze: {
            type: Boolean,
            default: false
        },
        // 点击节点需要的节点参数
        autoParam: {
            type: Array,
            default() {
                return ['id', "type=type"];
            }
        },
        // 增加树基础传参
        otherParam:{
            default(){
                return {}
            }
        },
        limitCheck: Function,
        // 拖拽之前的限定条件
        limitDrop: Function,
        // 树接受数据加载完成的回调
        treeLoaded: Function,
        // 树的初始节点渲染到页面
        treeReady: Function,
        // 树的每次异步回调
        asyncCallback: Function
    },
    data() {
        return {
            tree: null,
            treeLoading: false,
            rightDropdown: false,
            rightPosition: {
                position: 'absolute',
                top: 0,
                left: 0
            },
            // zTree api
            zTree: {},
            isEmptyText: true
        }
    },
    computed: {
        _tree() {
            return this.$refs['tree'];
        },
        _ztree() {
            return this.$refs['ztree'];
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                if( Array.isArray(val) ) {
                    !val.length ? this.isEmptyText = true : this.isEmptyText = false;
                    this.tree && this.tree.setInitialTree(val);
                }
            }
        }
    },
    methods: {
        ztreeApi() {
            return this.tree.zTree;
        },

        /**
         * 右击显示下拉框事件
         * @param {Event} event: 事件源对象
         * @param {Number|String} treeId: 点击的节点id
         * @param {Object} treeNode: 点击的节点所有信息
         */
        rightCLickEvent(event, treeId, treeNode) {
            const target = dom.delegation(event, 'a');

            if(target && this.isContextmenu) {
                this.rightDropdown = true;
                const {zTree} = this.tree;
                const {clientX, clientY} = event, {top, left} = this._tree.getBoundingClientRect();

                zTree.cancelSelectedNode();
                zTree.selectNode(treeNode);
                this.rightPosition = Object.assign(this.rightPosition, {
                    top: (this._tree.scrollTop + clientY - top) + 'px',
                    left: (clientX - left) + 'px'
                });

                this.zTree = zTree;
                this.zTree.currentNode = treeNode;
                this.$emit('right-click', treeNode);
            }
        },
        hideDropdown() {
            this.rightDropdown = false;
        },

        /**
         * 随意生成树的id编号
         */
        randomMakeTreeid() {
            const nowTime = new Date() * 1 + parseInt(Math.random() * 100000);
            var treeId = `tree${nowTime}`;
            this._ztree.id = treeId;

            return treeId;
        },

        /**
         * 异步树的初始化请求
         * @param {String} url: api接口路径
         */
        initialTree(url) {
            this.treeLoading = true;
            this.$http({ url }).then(mess => {
                this.treeLoading = false;
                const {data, flag, errorCode } = mess;
                errorCode && (this.isEmptyText = true);
                if(flag && data) {
                    this.isEmptyText = false;
                    this.tree.initialTree(data);
                }
            });
        },

        /**
         * 设置树的初始化数据
         * @param {Array} val
         */
        setInitialTree(val) {
            this.tree && this.tree.setInitialTree(val);
        },

        /**
         * 每次树异步成功请求返回的节点
         * @param {Object} treeNode: 节点信息
         * @param {String} handlerName: 当前异步的事件的名称(expand or check)
         */
        treeSuccessCallback(treeNode, handlerName) {
            const { zTree } = this.tree;
            
            // 树异步成功返回的回调
            typeof this.asyncCallback === 'function' && this.asyncCallback(treeNode);
            if(handlerName == 'check') {
                this._asyncLoadChilds(treeNode);
            }
        },

        /**
         * 异步加载父节点下面的子节点
         * @param {Node} parentNode: 当前节点
         * @param {String} name: check/cancel
         */
        _asyncLoadChilds(parentNode, name='check') {
            var childs = parentNode.children;
            const {zTree} = this.tree;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : (name=='check' ? true : false);

            if(name == 'check') {
                childs && childs.forEach(child => {
                    zTree.checkNode(child, true, true);
                    !child.zAsync && zTree.reAsyncChildNodes(child, true, true);
                });
            }   
            
            var checkedChild = zTree.getNodesByParam(condition, result, parentNode);
            this.$emit('current-change', {
                name,
                data: checkedChild.length !== 0 ? checkedChild : []
            });
        },

        /**
         * checkbox勾选事件
         * @param {event}
         * @param {treeId}
         * @param {treeNode} 当前勾选的节点信息
         */
        handlerCheck(event, treeId, treeNode) {
            const { zTree } = this.tree;
            const {zAsync, checked, isParent} = treeNode;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : true;

            this.$emit('node-check', treeNode);
            if(!zAsync) {              
                // zAsync=false 表示还未进行异步加载--异步
                // arguments[0]节点  arguments[1]="refresh" 表示清空后重新加载
                zTree.reAsyncChildNodes(treeNode, true);
            }else {
                // zAsync=true 表示已经加载完成了--同步
                // 如果当前状态为父节点输出父节点和子节点／状态为不是父节点输出当前节点信息
                if(isParent) {
                    this._asyncLoadChilds(treeNode, checked ? 'check' : 'cancel');
                }else {
                    let checkedChild = treeNode[condition] == result ? [treeNode] : [];
                    // check勾选变化的回调函数
                    this.$emit('current-change', {
                        name: checked ? 'check' : 'cancel',
                        data: checkedChild
                    })
                }
            }
        },

        handlerClick(treeNode) {
            const {zTree} = this.tree;
            const condition = this.nodeFilter[0] ? this.nodeFilter[0] : 'checked';
            const result = this.nodeFilter[1] ? this.nodeFilter[1] : true;
            this.$emit('node-click', treeNode);
            // 是否点击节点关联checkbox勾选
            // if( condition && result && treeNode[condition] == result ) {
            //     zTree.checkNode(treeNode, true, true);
            // }
        },

        /**
         * 通过 keys 设置目前勾选的节点(默认为车辆id)
         * @param {Array} keys=[id, id, id]
         * @param {Boolean} isChecked 是否勾选还是取消
         * @param {Object} parentNode 该父节点下查找
         */
        setCheckedKeys(keys, isChecked=true, parentNode) {
            const { zTree } = this.tree;

            if(!Array.isArray(keys)) return new Error('keys is must be Array!!!');
            if(keys.length > 0) {
                keys.forEach( key => {
                    var node = zTree.getNodeByParam('id', key, parentNode);
                    node && zTree.checkNode(node, isChecked, true);
                })
            }else {
                // keys数组为空， 表示取消所有勾选
                zTree.checkAllNodes(false);
            }
        },

        /**
         * 获得当前根节点所有加载完成的节点
         */
        getAllNodes() {
            return this.tree.zTree.getNodes();
        },

        /**
         * 获取当前勾选的所有节点
         */
        getCheckedNodes(isCheck=true) {
            return this.tree.zTree.getCheckedNodes(isCheck);
        },

        /**
         * 根据条件过滤符合的节点数组
         * @param {String} condition: 条件
         * @param {String} result: 筛选目标
         * @param {Node} parentNode: 父节点
         * @return {Array|null|Object} 有数据返回数据 否则为空
         */
        getNodeByParam(condition, result, parentNode) {
            const {zTree} = this.tree;
            return zTree && zTree.getNodeByParam.apply(this, arguments);
        },

        /**
         * 更新某节点数据，主要用于该节点显示属性的更新
         * @param {Object} treeNode
         * @param {Boolean} checkTypeFlag: 父子节点是否勾选联动操作(默认不联动)
         */
        updateNode(treeNode, checkTypeFlag=false) {
            const {zTree} = this.tree;
            zTree.updateNode(treeNode);
        },

        /**
         * 取消选中的节点
         * $param {treeNode} 当前选中的节点
         */
        cancelSelectedNode(treeNode) {
            const {zTree} = this.tree;
            return zTree.cancelSelectedNode(treeNode);
        },

        /**
         * 选中需要的节点
         * @param {Object} treeNode: 节点对象
         * @param {Boolean} addFlag: true:表示追加选中，会出现多点同时被选中的情况 false:表示单独选中，原先被选中的节点会被取消选中状态
         * @param {Boolean} isSilent:true: 选中节点时，不会让节点自动滚到到可视区域内;false:表示选中节点时，会让节点自动滚到到可视区域内 
         */
        selectNode(treeNode, addFlag=false, isSilent=false) {
            const {zTree} = this.tree;
            return zTree.selectNode.apply(this, arguments);   
        },

        /**
         * 添加节点
         * @param {Node} parentNode: 添加节点的父节点
         * @param {Object} newNodes: 需要增加的节点数据 JSON 对象集合
         * @param {Boolean} isSilent: true不展开节点  false: 展开节点
         */
        addNodes(parentNode, newNodes, isSilent=false) {
            const { zTree } = this.tree;
            return zTree.addNodes(parentNode, newNodes, isSilent);
        },
        /**
        * 删除节点
        * @param {Node} treeNode: 需要删除的节点
        * */ 
        removeNode(treeNode) {
            const { zTree } = this.tree;
            return zTree.removeNode(treeNode);
        },

        /**
         * 设置某节点进入编辑名称状态。
         */
        editName(treeNode) {
            const { zTree } = this.tree;
            return zTree.editName(treeNode);
        },
        /**
         * 取消编辑名称
         * 
         */
        cancelEditName(newName) {
            const {zTree} = this.tree;
            return zTree.cancelEditName(newName);
        },


        /**
         * 根据内容过滤已存在的节点数据
         * @param {String} value
         */
        filterNodes(value) {
            var { zTree } = this.tree;
            var all_nodes = zTree.getNodes();
            
            if(!Array.isArray(all_nodes) && !zTree) return;

            var { childs, parents } = this.filterNodes_search(value);
            all_nodes.forEach(node => {
                const children = node && node.children;
                children && zTree.hideNodes(children);
            });
            zTree.showNodes(value == '' ? childs : parents);
            this.filterNodes_highlight(value, all_nodes);
        },

        /**
         * 过滤节点信息
         * @param {String} value 查找文本
         */
        filterNodes_search(value, level=1) {
            var parents = [];
            var { zTree } = this.tree;
            var results = zTree.getNodesByParamFuzzy('text', value);

            results.forEach(result => {
                var item = result;
                while(item.level > level) {
                    item = item.getParentNode();
                }
                parents.push(item);
            })
            return {
                parents,
                childs: results
            }
        },
        /**
         * 设置过滤节点高亮
         * @param {String} value 需要筛选的文本条件
         * @param {Node} allNodes 所有符合条件的节点
         */
        filterNodes_highlight(value, allNodes) {
            var {zTree} = this.tree;
            var all_nodes = zTree.transformToArray(allNodes ? allNodes : zTree.getNodes());
            var { childs } = this.filterNodes_search(value);

            // 初始化清除所有高亮
            all_nodes.forEach(node => {
                node.highlight = false;
                zTree.updateNode(node);
            });

            value != '' && childs.forEach(child => {
                child.highlight = true;
                zTree.updateNode(child);
            })
        }
    },
    /**
     * 
     */
    destoryed() {
        dom.off(document, 'click', this.hideDropdown);
    },
    mounted() {
        console.log(this.baseUrl)
        const _this = this;
        dom.on(document, 'click', this.hideDropdown);
        this.tree = new BaseTree({
            el: _this.randomMakeTreeid(), 
            options: {
                // 异步用url
                url: _this.url,
                baseUrl: _this.baseUrl,
                // 同步用data
                data: _this.data,
                isMove:_this.isMove,
                isCopy:_this.isCopy,
                lazy: _this.lazy,
                isCheck: _this.isCheck,
                isExpand: _this.isExpand,
                isFreeze: _this.isFreeze,
                limitDrop: _this.limitDrop,
                limitCheck: _this.limitCheck,
                iconsFilter(nodes) {
                    var {data, flag} = nodes;
                    if(_this.iconsFilter && Array.isArray(data)) {
                        data.forEach(val => {
                            _this.iconsFilter(val);
                        });
                        return data;
                    }else {
                        Array.isArray(data) && data.forEach(val => {
                            switch(val.type) {
                                case 1: return val.iconSkin = 'company';
                                case 2: return val.iconSkin = 'organize';
                                case 3: return val.iconSkin = 'fleed';
                                case 4: return val.iconSkin = val.deviceTypeCode == 2 ? (val.online?'onlineCamera':'unlineCamera') : (val.online ? 'online'+(val.vehicleIcon||'icon1') : 'unline'+(val.vehicleIcon||'icon1'));
                                case 5: return val.iconSkin = 'camera';
                            }
                        });
                        return data;
                    }
                },
                autoParam: _this.autoParam,
                otherParam:_this.otherParam
            },
            methods: {
                nodeClick(event, treeId, treeNode){
                    _this.handlerClick(treeNode);
                },
                nodeBeforeExpand(treeId, treeNode){
                    _this.$emit('node-before-expand', treeNode);
                },
                nodeBeforeCheck(treeId, treeNode) {
                    _this.$emit('node-before-check', treeNode);
                },
                nodeBeforeEditName(treeId, treeNode) {
                    _this.$emit('node-before-editname', treeNode);
                },
                nodeBeforeRemove(treeId, treeNode) {
                    _this.$emit('node-before-remove', treeNode);
                }, 
                nodeExpand(event, treeId, treeNode) {
                    _this.$emit('node-expand', treeNode);
                },
                nodeCheck(event, treeId, treeNode) {
                    _this.handlerCheck(event, treeId, treeNode);
                },
                rightClick(event, treeId, treeNode) {
                   _this.rightCLickEvent(event, treeId, treeNode);
                },
                nodeRename(event, treeId, treeNode, isCancel) {
                    _this.$emit('node-rename', treeNode);
                },
                nodeCollapse(event, treeId, treeNode) {
                    _this.$emit('node-collapse', treeNode);
                },
                load(treeNode, handlerName) {
                    _this.treeSuccessCallback(treeNode, handlerName);
                },
                // 数据成功渲染完成的回调
                treeLoaded(data) {
                    typeof _this.treeLoaded === 'function' && _this.treeLoaded(data, _this.tree.zTree);
                },
                nodeDrop(treeNodes,targetNode){
                    _this.$emit('node-drop',treeNodes,targetNode);
                },
                nodeBeforeDrop(treeNodes,targetNode){
                    _this.$emit('node-before-drop',treeNodes,targetNode);
                },

                /**
                 * 树上的操作
                 * @return {template: '', methods(){}}
                 */
                operation(treeNode) {
                    if(typeof _this.operation === 'function') {
                        return _this.operation(treeNode);
                    }else {
                        return {}
                    }
                }
            }
        });
        
        // url 和 data 不能共存
        this.url && this.initialTree(this.url);  
        if(Array.isArray(this.data) && this.data.length > 0) {
            this.tree.setInitialTree(this.data);  
        };
        
        typeof this.treeReady === 'function' && this.treeReady();
    }
}
</script>

<style lang="scss">
// @import '../../../theme/color/index.scss';
@mixin font-family {
    font-family: "iconfont" !important;
    display: inline-block;
}
@mixin font-familyel {
    font-family: "el-icon" !important;
    display: inline-block;
}
.cv-tree {
    width: 100%;
    min-height: 36px;
    .cv-tree-emptytext {
        text-align: center;
        font-size: 16px;
        color: #ccc;
    }
}
    // 公司icon
    .cv-ztree li span.button.company_ico_open:before,
    .cv-ztree li span.button.company_ico_close:before,
    .cv-ztree li span.button.company_ico_docu:before{
        content: '\e672';
        @include font-family;
    };
    // 机构icon
    .cv-ztree li span.button.organize_ico_open:before,
    .cv-ztree li span.button.organize_ico_close:before,
    .cv-ztree li span.button.organize_ico_docu:before{
        content: '\e62a';
        @include font-family;
    };
    // 车组icon
    .cv-ztree li span.button.fleed_ico_open:before,
    .cv-ztree li span.button.fleed_ico_close:before,
    .cv-ztree li span.button.fleed_ico_docu:before{
        content: '\e639';
        @include font-family;
    };
    // 在线车辆icon
    .cv-ztree li span.button.onlineicon0_ico_open:before,
    .cv-ztree li span.button.onlineicon0_ico_close:before,
    .cv-ztree li span.button.onlineicon0_ico_docu:before{
         content: '\e6e7';
        color: rgb(27, 202, 34);
        @include font-familyel;
    };
    .cv-ztree li span.button.onlineicon1_ico_open:before,
    .cv-ztree li span.button.onlineicon1_ico_close:before,
    .cv-ztree li span.button.onlineicon1_ico_docu:before{
       content: '\e631';
        color: rgb(27, 202, 34);
        @include font-family;
    };
    // 离线车辆icon
    .cv-ztree li span.button.unlineicon0_ico_open:before,
    .cv-ztree li span.button.unlineicon0_ico_close:before,
    .cv-ztree li span.button.unlineicon0_ico_docu:before{
          content: '\e6e7';
          @include font-familyel;
    };
    .cv-ztree li span.button.unlineicon1_ico_open:before,
    .cv-ztree li span.button.unlineicon1_ico_close:before,
    .cv-ztree li span.button.unlineicon1_ico_docu:before{
       content: '\e631';
        @include font-family;
    };
   
    // 在线视频车辆icon
    .cv-ztree li span.button.onlineCamera_ico_open:before,
    .cv-ztree li span.button.onlineCamera_ico_close:before,
    .cv-ztree li span.button.onlineCamera_ico_docu:before{
        content: '\e614';
        color: rgb(27, 202, 34);
        @include font-family;
    };
    // 离线视频车辆icon
    .cv-ztree li span.button.unlineCamera_ico_open:before,
    .cv-ztree li span.button.unlineCamera_ico_close:before,
    .cv-ztree li span.button.unlineCamera_ico_docu:before{
        content: '\e614';
        @include font-family;
    };
    // 摄像头icon
    .cv-ztree li span.button.camera_ico_docu:before{
        content: '\e67e';
        @include font-family;
    }
</style>


