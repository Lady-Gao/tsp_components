<template>
    <div class='Grid' >
<!-- v-if render入参表格 -->
       <el-table ref='table'  header-align='left' 
       highlight-current-row
        @current-change="handleCurrent"
       @row-click="tableRowClick"
       @select='tableHandlerSelect'
       @select-all='tableHandlerSelectAll'
       @selection-change='tableSelectionChange'
       :row-class-name="tableRowClassName"
       :max-height="440"
      :data="tableData">

        <!-- 表格前部 -->
        <slot ></slot>
        <!-- render模板 -->
        <el-table-column  align="left" showOverflowTooltip v-for="item in renderArr" :key='item.prop'    :label="item.label"  :prop='item.prop'   :min-width="item.width||100" :formatter='item.formatter||null'>
            </el-table-column>
        <!-- 表格后部 -->
        <slot name='opertion'></slot>

       </el-table>


<!-- 分页 -->
    <el-pagination :total="data.total||0"  background
        class="pagination"
        layout="total, jumper,sizes,  prev,slot, next" 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-if='currentPage&&data.total>10'
        :page-size="data.size||0"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30,40, 50]">
            <span style = 'line-height: 30px' > {{this.currentPage}}/ {{data.pages}}</span >
        </el-pagination>
    </div> 
</template>

<script>
/**renderArr
 * [
 *   {prop:'roleName',label:this.$t('role.roleName'),formatter:Fun},
 *   ]
 */
    export default { 
        name: 'Grid',
        props: {
            data: {//后台数据 包括表格和分页
            type: Object,
            default() { return {
                size:0,
                total:0,
            } }
            },
            rowClass:"defaultRow",
            renderArr:Array,//入参模板
            selection:false,//是否启用复选表格
        },
       data(){
           return {
               currentPage:0,
               tableData:[],
               currentRow:'',
               loading:false
           }
       },
       watch:{
           data(val) {
               //有分页
               if(val&&val.records){
                   this.tableData = val.records;
                   this.currentPage=val.current
               }else{
                   if(val&&val.data){
                       this.tableData = val.data;
                   }else{
                       this.tableData = [];
                   }
                   this.currentPage=0

               }
           }
       },
       methods: {
           tableRowClassName({row, rowIndex}) {
                return this.rowClass;
            },
            handleCurrent(val) {
                this.currentRow = val;
            },
           /**
            * 根据类型修改按钮type
            */
           btnType(type) {
               switch (type) {
                   case 'add':
                       return 'success'
                       break;
                   case 'delete':
                        return 'danger'
                       break;
                   case 'modify':
                        return 'warning'
                       break;
                   case 'text':
                        return 'text'
                       break;
                   default:
                        return 'text'
                       break;
               }
           },
             /**
         * 当某一行被点击时会触发该事件
         * @param {*} row 
         * @param {*} event 
         * @param {*} column 
         */
         tableRowClick(row, event, column) {
           this.$emit.apply(this, ['row-click', ...arguments]);
         },
           /**
         * 当用户手动勾选数据行的 Checkbox 时触发的事件
         * @param {*} selection: 当前所有勾选的数组 
         * @param {*} row 
         */
        tableHandlerSelect(selection, row) {
            this.$emit.apply(this, ['select', ...arguments]);
        },

        /**
         * 当用户手动勾选全选 Checkbox 时触发的事件
         * @param {*} selection: 当前所有勾选的数组 
         */
        tableHandlerSelectAll(selection) {
            this.$emit.apply(this, ['selet-all', ...arguments]);
        },

        /**
         * 当选择项发生变化时会触发该事件
         * @param {*} selection 
         */
        tableSelectionChange(selection) {
            this.$emit.apply(this, ['selection-change', ...arguments]);
        },
        handleSizeChange(val){
            this.$emit('loadTable',{size:val})
        }, 
        handleCurrentChange(val){
            this.$emit('loadTable',{current:val})
        }
       },
        mounted(){
            console.log(this.renderArr)
        }
    }
</script>

<style lang='scss'>
.Grid{
    height:100%;
    width:100%;
    .el-table {
        th{
            background: #FAFAFA;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: rgba(0,0,0,0.85);
        }
        td{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0,0,0,0.65);
            .cell{
                span{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -o-text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
            }
        }
        .defaultRow{
            padding: 12px;
        }
    }
    .pagination{
        float: right;
        margin-top:20px;
        .el-pagination__jump{
            height: 30px;
            line-height: 30px;
        }
    }
}
</style>