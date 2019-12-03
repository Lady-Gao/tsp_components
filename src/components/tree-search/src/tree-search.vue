<template>
    <div class="cv-tabs-treesearch">
        <el-input 
            :placeholder="$t('components.common.placeholoder')" 
            class="vehicle-choose-search" 
            v-model.trim="vehicle_choose" 
            @change="handlerChange"
            clearable>
        </el-input>
        <scrollbar class="vehicle-lists" ref="scrollbar">
            <tree ref="basetree" :data="data" 
                :baseUrl='baseUrl'
                :is-check="isCheck" 
                :lazy="lazy" 
                :tree-ready="handlerTreeLoaded"
                :auto-param="autoParam"
                :other-param="otherParam"
                :icons-filter="iconsFilter"
                :node-filter="nodeFilter"
                :operation="operation"
                :limit-check="limitCheck"
                :async-callback="updateScrollbar"
                @node-collapse="updateScrollbar"
                @node-click="handlerClick"
                @node-expand="handlerExpand"
                @current-change="handlerCheckChange">
            </tree>
        </scrollbar>
    </div>
</template>

<script>
import service from '../../../utils/service'
import Tree from '../../tree/index'
export default {
    components:{
        Tree,
    },
    name: 'TreeSearch',
    props: {
        baseUrl:"",
        //
        data: {
            type: Array,
            default() { return [] }
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
        },
        isCheck: {},
        // 是否存在操作按钮
        isOperation: {
            type: Boolean,
            default: true
        },
        operation: [Function, Boolean],
        lazy: {
            default: '/basic/tree/findVehicleTreeInfoList'
        },
        iconsFilter: Function,
        limitCheck: Function,
        nodeFilter: {
            type: Array,
            default() {
                return ['type', 4]
            }
        },
        vehicleSearch: {
            default: ''
        }
    },
    inject: ['store'],
    
    data() {
        return {
            vehicle_choose: ''
        }
    },
    created() {
        
        this.throttle = service.throttle(_ => {
            this.$refs['basetree'].filterNodes(this.vehicle_choose);
        });
    },
    computed: {
        _scrollbarMethods() {
            return this.$refs['scrollbar'];
        }
    },
    watch: {
        // 监听以存在的节点
        vehicle_choose(val) {
            this.throttle && this.throttle();
        },
        vehicleSearch: {
            immediate: true,
            handler(val) {
                this.vehicle_choose = this.vehicleSearch;
            }
        }
    },
    methods: {
        /**
         * 参考，引用（所有方法的应用）
         */
        reference() {
            return this.$refs['basetree'];
        },

        /**
         * 搜索的回调函数
         * @param {String} value: 输入的内容
         */
        handlerChange(value) {
            this.$emit('vehicle-choose-search', value);
        },

        /**
         * 树的初始化完成
         */
        handlerTreeLoaded() {
            this.store.isNeedLoad && this.$refs['basetree'].initialTree(this.vehilceApi);
        },

        /**
         * 滚动条的更新
         */
        updateScrollbar() {
            this._scrollbarMethods.update();
        },

        /**
         * node节点点击事件
         * @param {Object} treeNode={type(Number), checked(Boolean)}
         */
        handlerClick(treeNode) {
            const { type, checked, text } = treeNode;

            type != 5 && (treeNode.plateCode = text);
            if(!checked) {
                (type == this.nodeFilter[1] || this.nodeFilter.length == 0) && this.store.addOrRemoveVehicles({
                    name: 'check',
                    data: [treeNode]
                });
            };
            this.$emit('node-click', treeNode);
        },

        /**
         * 节点的展开之前的事件
         * @param {TreeNode} treeNode: 当前展开的节点信息
         */
        handlerExpand(treeNode) {      
            this.$refs['basetree'].setCheckedKeys(this.store.vehiclesArray, true, treeNode);
        },

        /**
         * checkbox变化回调
         * @param {Object} mess: {name(check/cancel), data[Array]}
         */
        handlerCheckChange(mess) {
            this.store.addOrRemoveVehicles(mess);
        }
    }
}
</script>

<style lang="scss" scoped>
    .cv-tabs-treesearch {
        .vehicle-choose-search {
            width: 92%;
            margin: 5px 4%;
        }
        .vehicle-lists {
            z-index: 2;
            position: absolute;
            width: 100%;
            top: 60px;
            bottom: 0;
        }
    }
</style>


