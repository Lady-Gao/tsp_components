<template>
    <ul class="cv-radiogroup">
        <div class="emptytext" v-show="data.length > 0 ? false : true">{{$t('components.common.empty')}}</div>

        <!-- 列表区域 -->
        <li :class="['cv-radiogroup-item', activeName==item[props.label]?'radiogroup-active':'']"
        v-for="(item, index) in data" :key="index" @click="handlerClick(item)">
            <slot name="label" :row="item" />
            <div class="radiogroup-item-operation">
                <slot name="operation" :row="item" />
            </div> 
        </li>
    </ul>
</template>

<script>
export default {
    name: 'RadioLists',
    props: {
        //内容为空的时候展示的文本
        emptyText: {
            type: String,
            default: ''
        },
        // 配置选项
        props: {
            type: Object,
            default() {
                return {
                    label: 'id' 
                }
            }
        },
        // 接受的数据
        data: {
            type: Array,
            default() { return [] }
        },
        value: {}
    },
    data() {
        return {
            radio: '',
            activeName: ''
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.activeName = val;
            }
        },
        activeName(val) {
            this.$emit('input', val);
        }
    },
    methods: {
        handlerClick(row) {
            this.activeName = row[this.props.label];
            this.$emit('current-change', {
                name: 'check',
                data: [row]
            });
        }
    }
}
</script>

<style lang="scss" >
    .cv-radiogroup {
        $height: 36px;
        $font: 14px;
        list-style: none;
        padding: 0;
        margin: 0;
        .emptytext {
            text-align: center;
            color: #ccc;
            height: $height;
            font-size: 16px;
        }
        .cv-radiogroup-item {
            height: $height;
            line-height: $height;
            border-bottom: 1px solid #dcdfe6;
            font-size: $font;
            padding-left: 10px;
            position: relative;
            .radiogroup-item-operation {
                position: absolute;
                right: 5px;
                top: 0;
            }
        }
        .radiogroup-active {
            background: #87CEFA;
        }
    }
</style>


