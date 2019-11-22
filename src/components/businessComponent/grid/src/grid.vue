<template>
    <div class='Grid'>
<!-- v-if render入参表格 -->
       <el-table ref='table' v-if='render' header-align='left'  height='100%' 
       @row-click="tableRowClick"
       @select='tableHandlerSelect'
       @select-all='tableHandlerSelectAll'
       @selection-change='tableSelectionChange'
       :row-class-name="tableRowClassName"
      :data="tableData">
      <!-- 是否启用多选表格 -->
        <el-table-column v-if='selection' type="selection"  width="55">
        </el-table-column>
        <el-table-column  align="left" showOverflowTooltip v-for="item in render" :key='item.prop'    :label="item.label"     :min-width="item.width||100">
                <template v-slot="scope" >
                    <!-- 没有按钮 -->
                    <span v-if='!item.scope'>
                         <icon v-if='item.icon' :name="item.icon(scope.row)" style='color:#57b64a;width:15px;'></icon>
                        {{item.formatter?item.formatter(scope.row):scope.row[item.prop]}}
                        </span>
                    <!-- 有按钮 -->
                    <div v-else style='display: flex;'>
                        <el-button  v-for='(btn,idx) in item.scope' :key='idx' size='mini' :type='btnType(btn.type)' @click.native='btn.click(scope.row)' v-show='btn.v_show?btn.v_show(scope.row):true'>
                            <!-- 按钮显示名称 -->
                            {{typeof(btn.name)=='string'?btn.name:btn.name(scope.row)}} 
                        </el-button>
                    </div>
                </template>
            </el-table-column>
       </el-table>




<!-- v-if slot自定义表格内容 -->
        <el-table  height='100%'   ref='table' v-else header-align='left' :data="tableData"   @row-click="tableRowClick"
       @select='tableHandlerSelect'
       @select-all='tableHandlerSelectAll'
       @selection-change='tableSelectionChange'
       :row-class-name="tableRowClassName"
         style="width: 100%">
            <slot></slot>
        </el-table>

<!-- 分页 -->
  <el-pagination background v-if='currentPage&&data.total>10' class='pagination'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30,40, 50]"
      :page-size="data.size||0"
      layout="total,prev, pager, next,sizes, jumper"
      :total="data.total||0">
    </el-pagination>
    </div> 
</template>

<script>
/**render参数
 * [
 *   {prop:'roleName',label:this.$t('role.roleName'),formatter:Fun},
 *   {label:'String',scope:[ //内部按钮写法
 *                  { 
 *                      type:String,//按钮类型
 *                      name:String||Function,//按钮名字
 *                      click:Function,//按钮点击事件
 *                      v_show:Function，//按钮显隐
 *                  },
 *     },
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
            render:Array,//入参模板
            selection:false,//是否启用复选表格
        },
       data(){
           return {
               currentPage:0,
               tableData:[]
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
    }
}
</style>