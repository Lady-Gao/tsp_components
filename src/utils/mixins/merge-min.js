export default {
    methods: {
        /**
         * 以最小的对象合并赋值
         * @param {Object} min
         * @param {Object} max
         */
        mixins_mergeMin(min={}, max={}) {
            Object.keys(min).forEach(key => {
                min[key] = max[key];
            })
        }
    }
}