<template>
    <dropdown 
        :visible="!disabled && isToggle" 
        v-clickoutside="handlerIstoggle" 
        class="cv-dropdown-tree"
        class-name="cv-dropdown-width">
        <el-input 
            readonly 
            :disabled="disabled" 
            :placeholder="placeholder"
            @click.native="isToggle=true" 
            size="small"
            v-model.trim="treeContent">
            <i slot="suffix" class="el-input__icon el-icon-error removeCu" v-show='(treeContent && !disabled) ? true :false' @click='removeNode'></i>
        </el-input>
        <div slot="dropdown">
            <div class="dropdown-search">
               <el-input :placeholder="$t('cvtsp.treeSearch.search')" v-model="search" clearable />
            </div>
            <scrollbar 
                tag="ul"
                wrap-class="el-select-dropdown__wrap"
                v-loading="treeLoading"
                element-loading-spinner="el-icon-loading">
                <tree ref="tree"
                :data="treeData" 
                :is-check="isCheck" 
                :icons-filter="treeIconsFilter"
                :tree-loaded="handlerTreeLoaded"
                @node-click="handlerNodeClick" 
                @node-check="handlerNodeCheck" />
            </scrollbar>
        </div>
    </dropdown>
</template>

<script>
import service from '@/utils/service'
import tree from "../../tree/src/tree";
/**
 * 目前只支持同步加载
 * 异步树暂不支持，尽情期待
 */
export default {
    components:{tree},
    name: 'DropdownTree',
    props: {
        placeholder: {
             default(){return this.$t('cvtsp.treeSearch.content') }
        },
        // 文本内容(目前默认id值)
        value: {},
        // 返回的节点文字信息
        text: String,
        // 需要的信息值--返回的节点各种信息
        label: {},
        // 是否禁止
        disabled: {
            type: Boolean,
            default: false
        },
        // 接口方式
        url: String,
        // 数据方式
        data: Array,
        // 需要请求的参数
        autoParams: {
            type: Object,
            default() {return {} }
        },
        // 是否初始化加载数据(默认加载)
        isInitial: {
            type: Boolean,
            default: true
        },
        // 是否多选还是单选
        isCheck: Boolean,
        diff: {
            type: String,
            default: 'pId'
        },
        // 树上的节点筛选 return [条件, 符合的结果]----目前对多选有效
        nodeFilter: {
            type: Array,
            default() { return [] }
        },
        // 树上节点除去当前的过滤条件 和nodeFilter相反--多选有效
        // 默认 type=null的节点不给勾选
        unNodeFilter: {
            type: Array,
            default() {return ['type', null] }
        },
        // 当树的数据完全渲染完成的回调
        treeLoaded: Function
    },
    data() {
        return {
            treeData: this.data ? this.data : [],
            treeContent: '',
            search: "",
            isToggle: false,
            treeLoading: false,
            throttle: null
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                if(this.$refs['tree']) {    
                    this.isCheckAccordValue(newVal);
                }
            }
        },
        data(val) {
            if(Array.isArray(val)) {
                this.treeData = val;
            }else {
                this.treeData = [];
            } 
        },
        // 此块逻辑可能针对带参数树 
        autoParams(val, old) {
            // 车组数 新数值和旧数值相同不清除文本内容
            if(!(service.isObject(val) && (val[this.diff] == old[this.diff]))) {
                this.treeContent = '';
                this.treeData = [];
            }
            // key-value中存在undefined不发请求（此个场景出现公司输入清空）
            if(this.eachAutoParamsIsExistValue(this.autoParams)) {
                // 清空已选项
               this.treeContent = '';
               this.treeData = [];
            }else {
                (val[this.diff] != old[this.diff]) && this.treeRequestType();
            }  
        },
        // 监听文本为空
        treeContent(val) {
            val == '' && this.isCheckAccordValue(val);
        },
        // 搜索已存在的树节点
        search: {
            immediate: true,
            handler(val) {
                this.throttle && this.throttle();
            }
        }
    },
    created() {
        this.throttle = service.throttle(_ => {
            this.filterNeedNodes(this.search);
        })
    },
    mounted() {
        // 数据方式不存在的情况下 并且初始化同意
        if(!this.data && this.isInitial) {
            this.treeRequestType();
        }
    },
    methods: {
        /**
         * 对搜索的文字进行节点过滤
         * @param {String} value: 搜索的文字
         */
        filterNeedNodes(value) {
            this.$refs['tree'].filterNodes(value);
        },
        
        /**
         * 树节点图标过滤
         */
        treeIconsFilter(mess) {
            switch(mess.type) {
                case 1: return mess.iconSkin = 'company';
                case 2: return mess.iconSkin = 'organize';
                case 3: return mess.iconSkin = 'fleed';
                case 4: return mess.iconSkin = (mess.online ? 'online' : 'unline');
            }
        },
        /**
         * 点击文本以外的区域隐藏下拉树
         */
        handlerIstoggle() {
            this.isToggle = false;
        },

        /**
         * 下拉树的点击事件（只有单选有效果）
         * @param {Object} node: 点击的节点信息
         */
        handlerNodeClick(node) {
            // 单选才能走此事件 isCheck=true 不走单选事件
            if(!this.isCheck) {
                this.isToggle = false;
                this.isCheckAccordValue_findNode(node.id);  
            }   
        },
        removeNode(){
            this.treeContent='';
        },

        /**
         * 下拉树多选的勾选事件
         * @param {Object} node: 勾选的当前节点信息
         */
        handlerNodeCheck(node) {
            const { getCheckedNodes } = this.$refs['tree'];
            const condition = this.nodeFilter[0], result = this.nodeFilter[1];
            const uncondition = this.unNodeFilter[0], unresult = this.unNodeFilter[1];

            // 过滤的到符合要求的节点信息数据(Array) 过滤和非过滤不能共存
            const results = condition 
            ? getCheckedNodes().filter(node => node[condition] == result )
            : getCheckedNodes().filter(node => node[uncondition] != unresult);

            this.treeContent = results.map(result => {
                return result.text;
            }).join(',');
  
            this.isCheckAccordValue_findNodes(results.map( result => result.id ));
        },

        /**
         * 树的数据渲染完成的回调
         * @param {Array} data: 回调的所有数据
         */
        handlerTreeLoaded(data, zTree) {
            typeof this.treeLoaded === 'function' && this.treeLoaded.apply(this, arguments);

            if(this.value && this.$refs['tree']) {
                this.isCheckAccordValue(this.value);
            };
        },
        
        /**
         * 多选和单选的方式查找节点信息
         * @param {String|Array} val
         */
        isCheckAccordValue(val) {
            this.isCheck
            ? this.isCheckAccordValue_findNodes(val)
            : this.isCheckAccordValue_findNode(val);
        },

        /**
         * 根据v-model(默认id)查找已存在的节点数据(单选逻辑)
         * @param {String} key: id
         */
        isCheckAccordValue_findNode(key) {
            const { getNodeByParam, selectNode, cancelSelectedNode } = this.$refs['tree'];
            const nodes = getNodeByParam('id', key);

            if(nodes && typeof nodes === 'object') {
                // 更新当前的text显示和当前的node节点信息
                this.$emit('update:label', nodes);
                this.$emit('update:text', nodes.text);
                this.$emit('input', nodes.id);
                selectNode(nodes);
                this.treeContent = nodes.text;
            }else {
                // 当前没有选择的节点 清空所有值(默认为null)
                cancelSelectedNode();
                this.$emit('update:label', {});
                this.$emit('update:text', '');
                this.$emit('input', null);
                this.treeContent = '';
            }
        },

        /**
         * 根据v-model(默认id数组)查找已存在的节点数据(多选逻辑)
         * @param {Array} keys: [id, id ...]
         */
        isCheckAccordValue_findNodes(keys) {
            const { cancelSelectedNode, setCheckedKeys, getNodeByParam } = this.$refs['tree'];
            if(service.isArray(keys)) {
                this.$emit('input', keys);
                // 当keys数据量太大，去除此功能(影响性能)
                //setCheckedKeys(keys, true);

                // 此处为了性能只显示一个内容展示
                const nodes = getNodeByParam('id', keys[0]);
                if(nodes){
                    this.treeContent = nodes.text + (keys.length == 1 ? '' : `(${keys.length}+)`);
                }
            }else {
                setCheckedKeys([]);
                cancelSelectedNode();
                this.$emit('input', null);
                this.treeContent = '';
            }
        },

        /**
         * 树的http接口方式
         */
        async treeRequestType() {
            // 当参数为空时，不请求http
            if(!this.eachAutoParamsIsExistValue(this.autoParams)) {
                this.treeLoading = true;
                const {data, flag} = await this.$http({
                    url: this.url,
                    params: this.autoParams,
                    method: "GET"
                });
                this.treeLoading = false;

                if(flag && data) {
                    this.treeData = data;
                }else {
                    this.treeData = [];
                }
            }
        },

        /**
         * 遍历autoParams 是否存在key value值
         * @param {Object} params: {}
         * @return {Boolean} true: 存在key-value
         */
        eachAutoParamsIsExistValue(params) {
            var keys = Object.keys(params);
            
            if(keys.length === 0) return false;

            for(let i = 0, len=keys.length; i<len; i++) {
                if(params[keys[i]] === undefined) {
                     return true;
                 }
            }
            return false;
        }
    }
}
</script>

<style lang="scss" scoped>
    @mixin arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
    }
    $arrow-size: 7px;
    $arrow-position: 20px;
    .cv-arrow {
    @include arrow;
    border-width: $arrow-size;
    border-color: transparent transparent #dcdfe6 transparent;
    }

    .cv-arrowtop {
        bottom: 100%;
        &:before {
            content: '';
            @include arrow;
            border-width: $arrow-size - 2;
            border-color: transparent transparent #fff transparent;
            left: -$arrow-size + 2;
            bottom: -$arrow-size;
        }
    }
    .cv-arrowtop-start {
        @extend .cv-arrowtop;
        left: $arrow-position;
        
    }
    .cv-arrowtop-end {
        @extend .cv-arrowtop;
        right: $arrow-position;
    }
    .cv-dropdown-tree {
        .cv-dropdown-width {
            width: 100%
        }
    }
    .removeCu{
        cursor: pointer;
    }
</style>


