export default{
    name:'Grid',
     props: {
         data: { //后台数据 包括表格和分页
             type: Object,
             default () {
                 return {
                     size: 0,
                     total: 0,
                 }
             }
         },
         rowClass: "defaultRow",
         renderArr: {
             type: Array,
             default(){
                 return []
             }
         }, //入参模板
         selection: false, //是否启用复选表格
     },
    render(h){
     return <div class='Grid'>
       <el-table ref='table'  header-align='left' 
       highlight-current-row
       on-current-change={this.handleCurrent}
       on-row-click={this.tableRowClick}
       on-select={this.tableHandlerSelect}
       on-select-all={this.tableHandlerSelectAll}
       on-selection-change={this.tableSelectionChange}
       row-class-name={this.tableRowClassName}
       max-height="440"
      data={this.tableData}>
        <slot ></slot>
        {
            this.renderArr ? this.rendercolumn(h):null

        // 
        }
       
        <slot name='opertion'></slot>
       </el-table>

{
    this.currentPage && this.data.total > 10?

    <el-pagination total={this.data.total||0}  background
        class="pagination"
        layout="total, jumper,sizes,  prev,slot, next" 
        on-size-change={this.handleSizeChange}
        on-current-change={this.handleCurrentChange}
        page-size={this.data.size||0}
        current-page={this.currentPage}
        page-sizes={[10, 20, 30,40, 50]}>
            <span style = 'line-height: 30px' > {this.currentPage}/ {this.data.pages}</span >
        </el-pagination>
        :
        null
    }
     </div>
    },
    mounted () {
        console.log(this, 'mounted')
    },
         data() {
             return {
                 currentPage: 0,
                 tableData: [],
                 currentRow: ''
             }
         },
         watch: {
            
             data(val) {

                 //有分页
                 if (val && val.records) {
                     this.tableData = val.records;
                     this.currentPage = val.current
                 } else {
                     if (val && val.data) {
                         this.tableData = val.data;
                     } else {
                         this.tableData = [];
                     }
                     this.currentPage = 0

                 }
             }
         },
          methods: {
              rendercolumn(h){
                    // this.renderArr.map(item => {
                                //         return  <el-table-column  align="left" showOverflowTooltip    label={item.label}  prop={item.prop}   min-width={item.width||100} formatter={item.formatter||null}>
                                //     </el-table-column>
                                //     })
                    return this.renderArr.map(child => {
                        const props = {
                            ...child,
                            align: 'center',
                            showOverflowTooltip: true
                        }
                        console.log(h('el-table-column', {
                            props
                        }),'pop')
                            return h('el-table-column', {
                                props
                            });
                    })
              },
              tableRowClassName({
                  row,
                  rowIndex
              }) {
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
              handleSizeChange(val) {
                  this.$emit('loadTable', {
                      size: val
                  })
              },
              handleCurrentChange(val) {
                  this.$emit('loadTable', {
                      current: val
                  })
              }
          },
}