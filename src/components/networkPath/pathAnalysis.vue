<template>
    <div class="pathAnalysis">
        <div class="path-content">
            <div class="bg-line">
                <p class="line-100">
                    <span class="line-text">100%</span>
                    <span class="line"></span>
                </p>
                <p class="line-100">
                    <span class="line-text">75%</span>
                    <span class="line"></span>
                </p>
                <p class="line-100">
                    <span class="line-text">50%</span>
                    <span class="line"></span>
                </p>
                <p class="line-100">
                    <span class="line-text">25%</span>
                    <span class="line"></span>
                </p>
                <p class="line-100">
                    <span class="line-text">0%</span>
                    <span class="line"></span>
                </p>
            </div>
            <div ref="pathWidth">
                <div class="path" v-if="totalWidth">
                    <div v-for="(item, index) in routeList" 
                        :key="index"
                        :class="['pathItem', 'bottomitem' + routeIndexList[index]%12, (index == clickIndex) && 'active']"
                        :style="{width: getWidth(item) + 'px', height: getHeight(item) + 'px', color: randomColor2[routeIndexList[index]%12], minWidth: '130px'}"
                        @click="changePath(item, index)"
                        >
                        <el-tooltip :popper-class="'tipItem' + routeIndexList[index]%12" effect="light" placement="top">
                            <template slot="content">
                                <div>
                                    <p>开始时间：{{CommonFun.formatterTimeConversion({beginTime:item.entryTime},{label:'开始时间'})}}</p>
                                    <p>结束时间：{{CommonFun.formatterTimeConversion({beginTime:item.lastTime},{label:'开始时间'})}}</p>
                                </div>
                            </template>
                            <div class="pathBorder">
                                <div class="pathBorder-top"></div>
                                <div class="pathBorder-right"></div>
                                <div class="pathBorder-bottom"></div>
                                <div class="pathBorder-left"></div>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div class="path-time" v-if="routeList && routeList.length">
            <p>{{CommonFun.formatterTimeConversion({beginTime:routeList[0].entryTime},{label:'开始时间'})}}</p>
            <p>{{CommonFun.formatterTimeConversion({beginTime:routeList[routeList.length-1].lastTime},{label:'开始时间'})}}</p>
        </div>
    </div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
import baseUrl from '@/js/baseUrl.js'
import axiosHttp from '@/js/axiosHttp.js'
export default {
  name: "pathAnalysis",
  data() {
      return {
        randomColor:['#3fcb98','#4c84ff','#fab15a','#62c1ed','#7976f8','#8ecb7e','#3fcbc3','#ffd557','#ff9b58','#fb7293','#ff6868','#ae86ff'],
        randomColor2:['#4cd9a6','#6192ff','#febe73','#79d1f9','#8b88ff','#99dc87','#4cd9d1','#ffdd78','#ffa86d','#ff82a0','#ff7e7e','#b895ff'],
        totalWidth: 0,
        totalDuration: 0,
        routeIndexList: []
      }
  },
  props: ["routeList", 'clickIndex'],
  methods: {
    changePath(item, index) {
        this.$emit('getPathInfo', item, index);
    },
    getHeight(item) {
        let starNum = 0;
        let routeInfoArr = item.routeInfo && item.routeInfo.split('-');
        routeInfoArr.forEach((item) => {
            item != '*' && starNum ++;
        })
        return (starNum/routeInfoArr.length*150).toFixed(2)
    },
    getWidth(item) {
        if(this.routeList && this.routeList.length == 0){
            return 0
        }else {
            return ((item.lastTime - item.entryTime)/this.totalDuration * this.totalWidth).toFixed(2)
        }
    },
    getInfo() {
        this.totalDuration = 0;
        this.routeList && this.routeList.forEach((item) => {
            this.totalDuration += item.lastTime-item.entryTime;
        })
    }
  },
  mounted() {
        this.totalWidth =  this.$refs.pathWidth.clientWidth -1;
    },
    watch: {
        routeList: {
            handler(newV){
                if(newV.length){
                    let routeIndex = []
                    for(let i=newV.length-1;i>=0;i--){
                        for(let j=0;j<newV.length;j++){
                            if(newV[i].routeInfo == newV[j].routeInfo){
                                routeIndex[i] = j;
                                break
                            }
                        }
                        if(!routeIndex[i]){
                            routeIndex[i] = i;
                        }
                    }
                    this.routeIndexList = routeIndex;
                }
                this.getInfo()
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.pathAnalysis {
    position: relative;
    width: 100%;
    padding: 0 50px;
    overflow-x: auto;
}
.path-content {
    position: relative;
    overflow-x: auto;
}
.bg-line {
    position: relative;
    width: 100%;
    height: 165px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.line-100 {
    display: flex;
    align-items: center;
}
.line-text {
    display: inline-block;
    width: 50px;
    color: #ccc;
    font-size: 12px;
}
.line {
    display: inline-block;
    width: calc(100% - 50px);
    height: 1px;
    border: none;
    background-color: rgba(204, 204, 204, 0.2);
}
.path {
    display: flex;
    align-items: flex-end;
    position: absolute;
    bottom: 7px;
    left: 50px;
    width: calc(100% - 50px);
    padding-right: 10px;
}
.path-time {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.pathItem {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    margin-bottom: 1px;
}
.pathItem>div {
    display: none;
}
.pathItem:hover>div {
    display: block;
}
.pathItem .pathBorder {
    outline: 0;
}
.pathItem.active .pathBorder{
    display: block;
}
.pathBorder {
    position: absolute;
    top: -12px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 1px solid;
    z-index: 1;
}
.pathBorder-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-top: 3px solid;
    border-left: 3px solid;
}
.pathBorder-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-right: 3px solid;
    border-top: 3px solid;
}
.pathBorder-bottom {
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 0;
    height: 0;
    border-right: 5px solid;
    border-bottom: 5px solid;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
}
.pathBorder-left {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-left: 3px solid;
    border-bottom: 3px solid;
}
.bottomitem0{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(63, 203, 152,0.5));border-top:5px solid #3fcb98 ;}
.bottomitem1{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(76, 132, 255,0.5));border-top:5px solid #4c84ff ;}
.bottomitem2{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(250, 177, 90,0.5));border-top:5px solid #fab15a ;}
.bottomitem3{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(98, 193, 237,0.5));border-top:5px solid #62c1ed ;}
.bottomitem4{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(121, 118, 248,0.5));border-top:5px solid #7976f8 ;}
.bottomitem5{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(142, 203, 126,0.5));border-top:5px solid #8ecb7e ;}
.bottomitem6{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(63, 203, 195,0.5));border-top:5px solid #3fcbc3 ;}
.bottomitem7{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(255, 213, 87,0.5));border-top:5px solid #ffd557 ;}
.bottomitem8{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(255, 155, 88,0.5));border-top:5px solid #ff9b58 ;}
.bottomitem9{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(251, 114, 147,0.5));border-top:5px solid #fb7293 ;}
.bottomitem10{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(255, 104, 104,0.5));border-top:5px solid #ff6868 ;}
.bottomitem11{background-image: linear-gradient(to top, rgba(255,255,255,0), rgba(174, 134, 255,0.5));border-top:5px solid #ae86ff ;}
</style>