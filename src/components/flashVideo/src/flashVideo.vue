<template>
         <ul ref="videoArea" class="video-area">
             <li v-for="(item, index) in data.array" :key="index" :class="[data.current == index ? 'currentVideo': '', 'videoArea-item', 'col-xs-'+data.num]" @click="currentVideo(index,item)">

                 <videos ref="video" :src="item.url" :title="item.title"   type="rtmp/flv"  ></videos>
                 
             </li>
         </ul>
</template>

<script>
import videos from "../../videoJs/index";
    export default {
         name:"FlashVideo",
        components:{
            videos
        },
        props: {
            data: {
                default () {
                    return {
                    };
                }
            }
        },
        computed: {
          //返回当前选中的video对象
            videoGroup(){
                return this.$refs["video"]
            },  
        },
        mounted () {
           this.eachNum()
        },
        data(){
            return {
                current:0,//当前选中
                array:[]
            }
        },
        methods: {
            currentVideo(idx,val) {
                this.data.current=idx
                console.log(idx,val)
                if(val.url){
                    this.videoGroup[this.data.current].play(val.url)
                }
            },
             closeVideo(){
                this.videoGroup.forEach(_ =>{
                    _.reLoad();
                });
          
            },
            rePlay(){
         
                let url=this.data.array[this.data.current].url
                this.videoGroup[this.data.current].play(url)
            },
            /**
             * 播放全部
             */
            playAll(){
                this.data.array.forEach((item,idx) =>{
                    this.videoGroup[idx].play(item.url)
                });
            },
            /**
             * 生成array数组（对应的每个video信息）
             */
            eachNum(){
                //当array 4 num 6
                if(this.data.num>this.data.array.length){
                     while(this.data.num>this.data.array.length) {
                         this.data.array.push(
                             {
                                num:'',
                                title:{
                                    plateCode:'',text:''
                                    },
                                url:""
                            }
                         )
                     }
                }
                //当array 4 num 6
                else if(this.data.num<this.data.array.length){
                          this.data.array=this.data.array.splice(0,this.data.num)
                }
                         console.log(this.data.array)
           }
        },
        watch:{
            'data.num'(val){
                this.eachNum()
            },
            'data.array'(val){
            }
        }
    }
</script>

<style lang="scss" >
.video-area{
    width:100%;
    height: calc(100% - 55px);
}
  .videoArea-item {
    display: inline-block;
    box-sizing: border-box;
    padding: 5px 5px 0 5px;
   
  }
  .currentVideo {
    border: 2px solid rgb(42, 132, 206);
  }
  .col-xs-1 {
    width: 100%;
    height: 100%;
  }
  .col-xs-4 {
    width: 50%;
    height: 49.5%;
  }
  .col-xs-6 {
    width: 33.333332%;
    height: 49.5%;
  }
  .col-xs-9 {
    width: 33.3333332%;
    height: 33%;
  }
  .col-xs-16 {
    width: 25%;
    height: 24.5%;
  }
</style>