<template>
    <div >
          <el-badge class="iconBtn" >
                   <i class="el-icon-truck" @click='iconBtn'>点击</i>
                </el-badge>
<vehicle-message :data='data' :options='dialog'></vehicle-message>
<Tabs :titles="titles" :type="type" :closeTab="closeTab" @tag-click="tagClick" ref="tabs" :tab-position="tabPosition">
    <div>dddd</div>
    <div>444</div>
</Tabs>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                data:{},
                dialog:{
                    visible:false
                },
                 titles:["用户管理","配置管理"],
            type:"",
            closeTab:true,
            tabPosition:"top",
            inputText:"",
            cardType:["card","border-card"]
            }
        },
        mounted () {
        },
        methods: {
            iconBtn() {
                this.dialog.visible=!this.dialog.visible
                console.log(9)
            },
            tagClick(){
                
            }
        },
    }
</script>

<style scoped>

</style>