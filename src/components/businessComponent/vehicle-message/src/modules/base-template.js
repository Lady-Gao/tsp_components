
export default {
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        render: Function
    },

   

    methods: {
        /**
         * 对多个filter过滤方法的解析
         * @param {value}: 需要处理的value原始值
         * @param {String}: ep: a|b|c 这些都必须存在于filter方法中
         * @return 
         */
        filterGenerator(value, rules) {
            // filter: 'format('value', "yyyy-MM-dd HH:mm:ss")', 'isValue(value)'
            let next = value;
            const ruleLists = rules.split('|');   
            // [format("yyyy-MM-dd HH:mm:ss"), isValue]
            for(let i = 0; i < ruleLists.length; i++) {
                const rule = ruleLists[i]; //format("yyyy-MM-dd HH:mm:ss",'a','b')
                const results = rule.match(/([a-zA-Z]+)[(]([^()]+)[)]/);
                // null
                // [format("yyyy-MM-dd HH:mm:ss"), format, 'yyyy-MM-dd HH:mm:ss,a','b']
                next = results 
                    ? this.$filter[results[1]].apply(this.$filter, [next].concat([results[2]]))
                    : this.$filter[rule].call(this.$filter, next);
            };
            return next;    
        }
    }
}