export default {
    methods: {
        // 提示用户是否确定要进行此次操作
        mixins_confirm(content) {
            let message = content || this.$t('cvtsp.isDelted');
            return new Promise((resolve, reject) => {
                this.$confirm(message,this.$t('action.tip'), {
                    confirmButtonText:this.$t('action.confirm'),
                    cancelButtonText: this.$t('action.cancel'),
                    type: 'warning'
                }).then(() => {
                    resolve()
                }).catch(() => {
                    return false
                })
            })
        }
    }
}