import '../style/index.scss'
import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

export default {
    name: 'Grid1',
    props: {
        // 表格的api接口--异步
        url: String,
        // 表格传递的参数--异步
        params: [Object],
        // 静态表格数据--同步(暂无分页)
        data: Array,
        // 是否初始化加载表格
        isInitial: {
            type: Boolean,
            default: true
        },
        // 是否用默认固定高度
        defaultHeight: {
            type: Number,
            default: 0
        },
        // 自适应高度(当设置autoHeight属性，所有高度无效)
        autoHeight: {
            type: Boolean,
            default: false
        },
        // false: params方式 true: data方式
        bodyParser: {
            type: Boolean,
            default: false
        },
        // 是否显示阴影
        isShadow: {
            type: Boolean,
            default: true
        },
        loadFlg:false,
        renderContent: [Function, Array],
       expandrowkeys:String,
    },
    data() {
        return {
            tableData: [],
            loading: false,
            total: 0,
            pages: 1,
            current: 1,
            size: 10,
            maxHeight: 440,
            tableBody: null,
            tableHeader: null,
            // 是否重置pagination
            repeat: false,
            slotChilds: [],
            serveData:{}
        }
    },
    computed: {
        _grid() {
            return this.$refs['grid'];
        },
        table() {
            return this.$refs['table'];
        }
    },
    watch: {
        loadFlg(val){
            this.loading=val;
        },
        data: {
            immediate: true,
            handler(val) {
                if(Array.isArray(val)) {
                    console.log(val,'val')
                    this.tableData = val;
                }
            }
        },
        tableData(newVal){
            if(newVal.length == 0){
                if(this.pages<this.current && this.current !=1){
                    this.current--;
                    debugger
                    if(!this.data){
                        this.sendHttp(false);
                    }
                }
            }
        }
    },

    render(h) {
        return (
            <div 
                ref="grid" 
                v-loading={this.loading}
                class={['cv-grid', this.isShadow ? 'cv-grid-shadow':''].join(' ') } >
                <el-table ref="table"
                data={this.tableData} 
                expand-row-keys={this.expandrowkeys}
                 on-expand-change={this.expand}
                highlight-current-row={true}
                header-cell-class-name="cv-grid-header" 
                row-class-name="cv-grid-row"
                on-select={this.tableHandlerSelect}
                on-select-all={this.tableHandlerSelectAll}
                on-selection-change={this.tableSelectionChange}
                on-row-click={this.tableRowClick}
                on-current-change={this.tableCurrentChange}>
                    {this.renderContent ? this.renderContentParse(h) : this.renderSlotParse()}
                    <div slot="append">{this.$slots.append}</div>
                </el-table>
                {
                    this.repeat 
                    ? ''
                    : 
                       < div class = 'paginationbox'
                    v-show = { this.total == 0 ? false : true} >
                    <el-pagination total={this.total} small 
                        class="cv-grid-pagination"
                        layout="total, jumper,sizes,  prev,slot, next" 
                        on-current-change={this.handlerCurrentChange.bind(this)}
                        on-size-change={this.handlerSizeChange.bind(this)}
                        page-sizes={[10,20,30,40,50]}>
                         < span style = 'line-height: 30px' > {
                             this.current
                         }
                         / {this.pages}</span >
                        </el-pagination>
                    </div>
                }
            </div>
        )
    },
    beforeDestory() {
        removeResizeListener(this._grid, this.realCalcTableBody);
    },
    mounted() {
        // this.isInitial && !this.data && this.tableInitial();
console.log(this.data, 'data')
        this.calcTableInitialSize();
        addResizeListener(this._grid, this.realCalcTableBody);
    },
    methods: {
        /**
         * 1.简单模板
         * [
         *   {prop:'percentage',label:'renderContent'},
         *   {prop:'plateCode',label:'renderContent'},
         *   {prop:'plateColor',label:'renderContent',formatter:this.getcolor},
         * ]
         * 2.多层模板scopedSlots：
         *  @params {String} template 标签名 
         *  @params {Object} 内部属性 attribute：{
         *      class：{}， // foo: true,
         *      props：{}， //a:1
         *      style：{}， //color: 'red'
         *      on：{       //事件
         *          'click':()=>{}
         *       }
         *  }
         * [
         *   {template:'cv-span',attribute:{},html:'hello'},
         *   {template:'span',attribute:{},html:'hello'},
         *    ...
         * ]
         *
         */
        renderContentParse(h) {
            const renderContent = this.renderContent.call(this, h);
            return renderContent.map(child => {
                const props = {
                    ...child,
                    align: 'center',
                    showOverflowTooltip: true
                }
                if(child.prop) {
                   
                    return h('el-table-column', { props });
                }else {
                    return h('el-table-column', {
                        props,
                        scopedSlots: {
                            default: (props) => {
                               
                                return this.childRender(h, child.template && child.template(props))
                               
                            }
                        }
                    })
                }
            })
           
        },
        childRender(h, child) {
           if (child instanceof Array){
                return child.map(item => {
                    return this.childRender(h, item)
                })
           }else{
               return (child.tag) && h(
                                            child.tag, 
                                            child.attribute || {},
                                            child.children && this.childRender(h, child.children) || child.html || null
                                       )
           }

        },
        renderSlotParse() {
            const slotContents = this.$slots.default ? this.$slots.default : [];
            return slotContents.map(child => {
                if(child.componentOptions) { 
                    const { propsData } = child.componentOptions;
                    propsData.align = 'center';    
                    propsData.showOverflowTooltip = true;
                }
               
                return child;
            })
        },

        /**
         * 初始化表格的尺寸
         */
        calcTableInitialSize() {
            this.tableBody = this._grid.querySelector('.el-table__body-wrapper');
            this.tableHeader = this._grid.querySelector('.el-table__header-wrapper');
        },

        /**
         * 实时计算表格的body最大高度
         */
        realCalcTableBody() {
            if(this.autoHeight) return;
            
            if(!this.defaultHeight) {
                this.maxHeight = (window.innerHeight - this._grid.getBoundingClientRect().top - 65);
                // 实时减去当前的头部高度（默认为40）
                this.tableBody.style.maxHeight 
                = (this.maxHeight - (this.tableHeader ? this.tableHeader.offsetHeight : 40)) + 'px'; 
            }else {
                this.tableBody.style.height 
                = (this.defaultHeight - (this.tableHeader ? this.tableHeader.offsetHeight : 40)) + 'px'; 
            }

            this.tableBody.style.overflowY = 'auto';
        },
        //传data调用次此方法
         tablefind(obj) {
             this.serveData=obj
             const params = {
                 ...obj,
                 params: {
                     ...obj.params,
                     current: this.current,
                     size: this.size,
                 }

             };
            
            return this.sendHttp(params)
         },
         
         /**
          * 表格的加载方法
          * @param {Boolean} repeat true:表格重新加载，size重置10，current重置1
          */
        tableInitial(url,repeat = true) {
             if (repeat) {
                 this.current = 1;
                 this.size = 10;
                 this.repeat = true;

                 var timer = setTimeout(_ => {
                     clearTimeout(timer);
                     timer = null;
                     this.repeat = false;
                 })
             }
             const params = {
                 current: this.current,
                 size: this.size,
                 ...this.params
             };
            console.log(url)

            this.serveData = this.bodyParser ?
              {
                  url: url,
                  data: JSON.stringify(params)
              } :
              {
                  url: url,
                  params
              };
              this.sendHttp()
            
         },
         /**
          * 请求数据
          */
       sendHttp(){
            this.loading = true
            let params = {
                url: this.serveData.url,
                params: {
                    ...this.serveData.params,
                    current: this.current,
                    size: this.size,
                }

            }
                try {
                    this.loading = true;
                    return new Promise((reslove, reject) => {
                        this.$http(params).then(res => {
                            const {
                            data,
                            flag
                        } =res

                        const {
                            records,
                            total,
                            pages
                        } = data;
                        reslove(data)
                        this.loading = false;
                        if (flag && (typeof data === 'object') && Array.isArray(records)) {
                            this.setLoadedData(records, total, pages);
                        } else {
                            this.setLoadedData();
                        }
                    })
                 });

                } catch (e) {
                    this.setLoadedData();
                    this.loading = false;
                }
        },
        /**
         * 设置table加载完成后的数据
         * @param {*} data 
         * @param {*} total 
         * @param {*} pages 
         */
        setLoadedData(data=[], total=0, pages=1) {
            this.tableData = data;
            this.total = total;
            this.pages = pages;
        },

        /**
         * currentPage 改变时会触发
         * @param {Number} page: 当前页currentPage
         */
        handlerCurrentChange(page) {
            this.current = page;
            if(this.data){

                this.sendHttp();
            }else{

                this.sendHttp(false);
            }
        },  

        /**
         * pageSize 改变时会触发
         * @param {Number} size: 页条数size
         */
        handlerSizeChange(size) {
            this.size = size;
             if (this.data) {

                 this.sendHttp();
             } else {

                 this.sendHttp(false);
             }
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
         * 当表格的当前行发生变化的时候会触发该事件
         * @param {*} currentRow 
         * @param {*} oldCurrentRow 
         */
        tableCurrentChange(currentRow, oldCurrentRow) {
            this.$emit.apply(this, ['current-change', ...arguments]);
        },
        /**
         * 当用户对某一行展开或者关闭的时候会触发该事件
         * @param {*} currentRow 
         * @param {*} oldCurrentRow 
         */
        expand(currentRow, oldCurrentRow) {
            this.$emit.apply(this, ['expand-change', ...arguments]);
        },
    }
}