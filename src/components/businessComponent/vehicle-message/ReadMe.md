#### 替換
```JS
import vehicleMessage from "@bComponents/vehicle-message/vehicle-message.js";
//引入代替的組件  
import car from "./modules/1.vue";
import basic from "./modules/2.vue";
    export default {
        extends: vehicleMessage,
        components: { //替換組件
            basic,
            car
        },
       data(){
           return {
                //中间信息列表
          baseTable: "basic",
           //下部tabs name页面组件名字 label选项名
          activeName: 'car', //底部tab选中
          bottomTabLists:[//底部tab組件數組
                {name:'car',label:this.$t('components.common.vehicleInfo')},
                {name:'sensor',label:this.$t('components.common.sensor')},
                {name:'electric',label:this.$t('components.common.Electricalsigna')},
                {name:'canInfo',label:this.$t('components.common.CANinformation')},
                ]
           }
       }
  }
```