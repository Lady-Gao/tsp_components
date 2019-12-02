<template>
    <div class="cv-lazy-load" :style="{height: height+'px'}" ref="lazy">
        <transition :name="transition">
            <slot v-if="show"></slot>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'LazyRender',
    data() {
        return {
            timer: null,
            show: false // 是否渲染组件
        }
    },
    props: {
        height: {
            type: [String, Number],
            default: 50
        },
        transition: {
            type: String,
            default: 'fade'
        },
        time: { // 延迟渲染的时间
            type: [Number, String],
            default() {
                return 10
            }
        },
        immediate: {
            type: Boolean,
            default: true
        } // 是否立即重新渲染
    },
    computed: {
        _lazy() {
            return this.$refs['lazy'];
        }
    },
    watch: {
        // 立即重新变为true时,重新渲染
        immediate: {
            immediate: true,
            handler(val) {
                val && this.syncLoader();
            }
        }
    },
    methods: {
        /**
         * 延迟渲染
         */
        syncLoader() {
            this.show = false;
            this.timer = setTimeout( ()  => {
                clearTimeout(this.timer);
                this.timer = null;

                if(this._lazy) {
                    this._lazy.style.height = null;
                };
                this.show = true;
                this.$emit('loaded');
            },this.time);
        }
    }
}

</script>

<style lang="scss">
    .cv-lazy-load {
        background: #fff;
    }
    @mixin transition($name: opacity) {
        transition: $name .5s;
    }
    .fade-enter-active, .fade-leave-active {
        @include transition();
     }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .left-enter-active, .left-leave-active {
        @include transition(transform);
    }
    .left-enter, .left-leave-to {
        transform: translateX(-100%);
    }

    .right-enter-active, .right-leave-active {
        @include transition(transform);
    }
    .right-enter, .right-leave-to {
        transform: translateX(100%);
    }

    .top-enter-active, .top-leave-active {
        @include transition(transform)
    }
    .top-enter, .top-leave-to {
        transform: translateY(-100%);
    }

    .bottom-enter-active, .bottom-leave-active {
        @include transition(transform)
    }
    .bottom-enter, .bottom-leave-to {
        transform: translateY(100%);
    }
</style>