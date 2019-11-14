<template>
    <div class="cv-treelists">
        <!-- 条件下拉框搜索 -->
        <el-input
            :placeholder="placeholder"
            v-model.trim="search.model"     
            class="cv-treelists-input"
            @keyup.native.enter="handlerSearch">
            <el-select class="cv-treelists-select" v-model="selectionValue" slot="prepend" @change="selectChange">
                <el-option :label="$t(item.label)" :value="item.value" v-for="(item, index) in selection" :key="index" />
            </el-select>
        </el-input>

        <!-- checkbox选择请求 -->
        <el-checkbox-group v-model="search.onlineStatus" class="cv-treelists-checkbox">
            <slot name="checkbox" />
            <el-button class="cv-treelists-checkboxbtn"
            :loading="loading"
            circle icon="el-icon-search" @click="handlerSearch" />
        </el-checkbox-group>

        <!-- 多选(checkbox)列表选择 -->
        <el-scrollbar v-if="isCheck" class="cv-treelists-lists">
            <checkbox-lists v-loading="loading"
                :data="lists"
                :is-relation="false"
                @norelation-click="handlerNorelation"
                :checked-data="store.vehiclesArray"
                @current-change="handlerCheckChange">
                <template slot="label" slot-scope="scope">
                    <slot name="label" :row="scope.row" />
                </template>
                <template slot="operation" slot-scope="scope">
                    <slot name="operation" :row="scope.row" />
                </template>
            </checkbox-lists>
        </el-scrollbar>

        <!-- 单选(radio)列表选择 -->
        <el-scrollbar v-if="!isCheck" class="cv-treelists-lists">
            <radio-lists v-loading="loading"
                :data="lists"
                @current-change="handlerCheckChange">
                <template slot="label" slot-scope="scope">
                    <slot name="label" :row="scope.row" />
                </template>
                <template slot="operation" slot-scope="scope">
                    <slot name="operation" :row="scope.row" />
                </template>
            </radio-lists>
        </el-scrollbar>

        <!-- 分页 -->
        <div style='position: absolute;bottom:5px;'>
            <el-pagination small layout="total,slot,prev, next"
        class="cv-treelists-pagination"
        v-show="pagination.total ? true : false"
        :total="pagination.total" :current-page="pagination.current" @current-change="handlerCurrentChange">
       
        </el-pagination>
         <span  v-show="pagination.total ? true : false" class="tabspan">{{pagination.current}} / {{parseInt(Math.ceil(pagination.total/10))}}</span> 
        </div>
    </div>
</template>

<script>
import CheckboxLists from "../../checkLists/index"
import RadioLists from "../../radioLists"
export default {
    name: 'TreeLists',
    components:{
        CheckboxLists,RadioLists
    },
    props: {
        // 搜索下拉数据
        selection: {
            type: Array,
            default() {
                return [
                    {label:'components.common.plateCode', value: "plateCode" },
                    {label:'components.common.company', value: 'enterpriseName' },
                    {label:'components.common.wasName', value: 'fleetName'},
                    {label:'components.common.Terminal', value: 'terminalCode'},
                    {label:'components.common.VINNumber', value: 'carVin'},
                    {label:'components.common.SIMNumber', value: 'mobileCode'}
                ]
            }
        },
        // 搜索api接口
        searchApi: {},
        params: {
            type: Object,
            default() {
                return {
                    key: 'onlineStatus',
                    result: 2
                }
            }
        },
        otherParam: {
            default() { return {} }
        },
        isCheck: {
            type: Boolean,
            default: true
        },
        // 车辆上下线--监听
        onlineMonitor: {},
        attentionMonitor: {},
        vehicleMonitor:{}
    },
    inject: ['store'],
    data() {
        return {
            placeholder: "",
            selectionValue: '',
            lists: [],
            loading: false,
            search: {
                model: "",
                onlineStatus: [],
                current: 1,
                size: 10
            },
            pagination: {
                total: 0,
                current:1,
            }
        }
    },
    watch: {
        // 实时监听车辆上下线状态
        onlineMonitor(val) {
            if(this.lists.length > 0) {
                const { vehicleId, messageText } = val;
                const index = this.lists.findIndex(list => list.id == vehicleId);

                if(index >= 0) {
                    this.lists[index].onlineStatus = (messageText == this.$t('components.common.getLine') ? 1 : 0);
                }
            }
        },
        // 实时监听车辆关注状态
        attentionMonitor(val) {
            if(this.lists.length > 0) {
                const { vehicleId, isAttention } = val;
                const index = this.lists.findIndex(list => list.id == vehicleId);

                if(index >= 0) {
                    this.lists[index].isAttention = isAttention;
                }
            }
        },
        //实时监听车辆新增，修改，删除状态
        vehicleMonitor(val){
            if(this.lists.length > 0 ){
                let {plateCode,isAttention,vehicleId}=val;
                switch(val.operation){
                    case 'ADD':
                        this.handlerSearch(true);
                    break;
                    case 'DELETE':
                        this.handlerSearch(true);
                    break;
                    case 'UPDATE':
                    break;
                }

            }
        },
        lists(newVal){
            if(newVal.length == 0){
                if(this.search.current>1){
                    this.search.current--;
                    this.handlerSearch(false);
                }
            }
        }
    },
    created() {
        var first = this.selection[0];
        this.handlerSearch();

        if(first) {
            const {label, value} = first;
            this.selectionValue = value;
            this.placeholder = this.$t('components.common.enter')+`${this.$t(label)}`;
        };
    },
    methods: {
        /**
         * 手动搜索查询列表
         * @param {Boolean} repeat: 是否分页查询(false)还是按钮重新查询(true)
         */
        async handlerSearch(repeat = true) {
            const {onlineStatus, model, current, size} = this.search;

            this.loading = true;
            const {data, flag} = await this.$http({
                url: this.searchApi,
                method:"Get",
                params: {
                    size,
                    current: repeat ? 1 : current,
                    [this.selectionValue]: model,
                    [this.params.key]: onlineStatus.length == 1 ? onlineStatus[0] : this.params.result,
                    ...this.otherParam
                }
            })
            this.loading = false;

            if(flag && data) {
                const {total, records,current} = data;
                this.lists = records;
                this.pagination.total = total;
                this.pagination.current = current;
            }else {
                this.lists = [];
                this.pagination.total = 0;
            }
        },


        /**
         * 搜索条件中下拉框选择变化的回调事件
         * @param {Value}: value: 回调的变化值
         */
        selectChange(value) {
            if(Array.isArray(this.selection) && this.selection.length > 0) {

                // 根据条件查找对应的数据
                const { label } = this.selection.find(val => {
                    return val.value == value;
                });
                this.placeholder = this.$t('components.common.enter')+`${this.$t(label)}`;
            }
        },

        /**
         * checkbox列表单条的选择回调
         * @param {Object} mess={name(check/cancel), data[Array]: 单条信息}
         */
        handlerCheckChange(mess) {
            this.store.addOrRemoveVehicles(mess);
        },

        /**
         * currentPage 改变时会触发
         * @param {Number} currentPage: 当前页currentPage
         */
        handlerCurrentChange(currentPage) {
            this.search.current = currentPage;

            this.handlerSearch(false);
        },

        /**
         * 只有:is-relation="false" 不关联的情况下，该事件有效
         */
        handlerNorelation(value) {
            const { checked } = value;
            value.type = 4;

            if(!checked) {
                this.store.addOrRemoveVehicles({
                    name: 'check',
                    data: [value]
                });
            }
            this.$emit('node-click', value);
        }
    }
}
</script>

<style lang="scss">
    .cv-treelists {
        @mixin automargin($updown: 0) {
            width: 92%;
            margin: $updown 4%;
        }
        .cv-treelists-input {
            @include automargin(10px);
        }
        .cv-treelists-checkbox {
            text-align: right;
            @include automargin();
            .cv-treelists-checkboxbtn {
                margin-left: 10px;
            }
        }
        .cv-treelists-select {
            width: 105px;
        }
        .cv-treelists-lists {
            z-index: 2;
            width: 100%;
            top: 110px;
            left: 0;
            position: absolute;
            bottom: 40px;
        }
        .cv-treelists-pagination {
            position: absolute;
            bottom: 5px;
        }
        .tabspan{
           position: relative;
            bottom: 10px;
            left: 180px;
        }
    }
</style>

