<template>

         <el-tabs 
                :type='this.type'
                :class='this.isScrollbar ? "cv-tabs" : ""'
                :value='this._activeName'
                :tab-position='this.tabPosition'
                @input='handlerChange'>
                <div v-for='(item,index) in titles' :key='index'>
                 <el-tab-pane :name="'tabs' + index" >
                    <span slot="label">{{item}} </span>
                    <div v-if='!isScrollbar'>
                        {{this.$slots.default[index] }}
                    </div>
                    <div v-if='this.isScrollbar'>
                    <scrollbar class="cv-tabs-scrollbar">
                                {{ this.$slots.default[index] }}
                            </scrollbar>
                    </div>
                </el-tab-pane>
                </div>
            </el-tabs>
</template>

<script>
import '../css/index.scss'
import Scrollbar from "../../../component-utils/scrollbar/index"
    export default {
         name: 'Tabs',
        components:{
            Scrollbar
        },
         props: {
        titles: {
            type: [Function, Array],
            default() { return [] }
        },
        value: {},
        // 默认只渲染当前tab页
        forceRender: {
            type: [Boolean],
            default: true
        },
        // 默认不使用滚动条功能
        isScrollbar: {
            type: Boolean,
            default: false
        },
        type: {
            Type: String,
            default: '' //(border-card)
        },
        tabPosition:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            defaultValue: 'tabs0',
            tabsCache: {}
        }
    },
     created() {
        // this.tabsCache = this.detailCache(this.defaultValue, this.forceRender);
    },
    computed: {
        _activeName() {
            return 'tabs0'
        },
        childs(){
            return this.$slots.default && this.$slots.default.filter(child => {
            return child.tag;
        });
        }
        
    },
     methods: {
        handlerChange(value) {
            this.tabsCache[value] = true;
            this.$emit('input', value);
            this.$emit('tab-click', value);
        },
       
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>