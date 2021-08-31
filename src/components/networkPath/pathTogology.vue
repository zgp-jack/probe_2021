<template>
<div class="pathTogology">
  <div class="pathTogologyDefault-change btn-check-chart" @click="isChange=!isChange">{{isChange ? 'IP地址' : '设备名称'}}</div>
  <div class="path-togology menu-scroll">
    <el-scrollbar>
        <div class="togology-item" v-for="(item, index) in routeListData" :key="index">
            <div :class="['togology-img', routeDetailData[index].id && 'togology-probe-route-pointer']"  @click="routeDetailData[index].id && showTrend(routeDetailData[index])">
                <el-popover
                  popper-class="tableSearch-popover"
                  :disabled="nodeResult[index].id ? false : true"
                  placement="top"
                  width="400"
                  trigger="hover">
                  <div class="pathTogology-popover">
                    <p class="popover-item">IP地址：{{nodeResult[index].ip}}</p>
                    <p class="popover-item">管理地址：{{nodeResult[index].managerAddress}}</p>
                    <p class="popover-item">接口名称：{{nodeResult[index].interfaceName}}</p>
                    <p class="popover-item">别名：{{nodeResult[index].name}}</p>
                    <p class="popover-item">设备类型：{{nodeResult[index].deviceType}}</p>
                    <p class="popover-item">位置：{{(nodeResult[index].computerRoom?(nodeResult[index].computerRoom+'-'): '')+(nodeResult[index].cabinet?(nodeResult[index].cabinet+'-'):'')+nodeResult[index].number}}</p>
                  </div>
                  <div slot="reference">
                      <img v-if="index == 0" class="togology-probe" src="../../assets/togology-probe.png" />
                      <img v-else-if="index == (routeListData.length-1)" class="togology-probe-route" :src="isInterrupt?require('../../assets/togology-server-dotted.png'):require('../../assets/togology-server.png')" />
                      <img v-else class="togology-probe-route" src="../../assets/togology-probe-route.png" />
                      <p class="togology-text">{{isChange?item:(nodeResult[index].name?nodeResult[index].name:item)}}</p>
                      <img v-if="routeDetailData[index].id" class="togology-interface" src="../../assets/togology-interface.png" alt="">
                  </div>
                </el-popover>
            </div>
            <div class="togology-line" v-if="index == (routeListData.length-1)"></div>
            <div class="togology-line" v-else-if="isInterrupt && (index == (routeListData.length-2))">
                <img class="togology-dotted-line" src="../../assets/dotted-line.png" alt="">
            </div>
            <div class="togology-line" v-else>
                <div :class="['togology-line-route', weightlineIndex.indexOf(index) > -1 && 'weightline', (faultList[0]<= index) && (index < faultList[1]) && (faultData.eventType == 3?'fault-line':faultData.eventType == 2?'fault-line2':'fault-line1')]" @click="getNodeChange(index)"></div>
            </div>
        </div>
    </el-scrollbar>
    <trendChart></trendChart>
  </div>
</div>
</template>
<script>
import Bus from '../vue-simple-upload-js/bus'
import trendChart from './trendChart'
export default {
  name: "pathTogology",
  data() {
    return {
          routeListData: [],
          weightlineIndex: [],
          getNodeInfo: {startCount: 0},
          isInterrupt: false,
          routeDetailData: [],
          faultList: [],
          nodeResult: [],
          isChange: true
      }
  },
  components:{trendChart},
  props: ['routeListDefault', "faultData", "clickIndex"],
  methods: {
      getNodeChange(index) {
          this.weightlineIndex = [];
          this.getNodeInfo = {};
          this.getNodeInfo.startCount = 0;
          for(let i=index;i>=0;i--){
              if(this.routeListData[i] != '*'){
                  this.weightlineIndex.push(i);
                  this.getNodeInfo.anode = this.routeListData[i];
                  break;
              }else {
                  this.getNodeInfo.startCount++;
                  this.weightlineIndex.push(i);
              }
          }
          for(let i=index;i<this.routeListData.length-1;i++){
              if(this.routeListData[i+1] != '*'){
                  this.getNodeInfo.bnode = this.routeListData[i+1];
                  break;
              }else {
                  this.getNodeInfo.startCount++;
                  this.weightlineIndex.push(i+1);
              }
          }
          Bus.$emit('getNodeInfoFun', this.getNodeInfo);
      },
      showTrend(item){
        this.faultData.deviceId = item.id;
        this.faultData.FdeviceIp = item.ip
        Bus.$emit('changeDialogVisible', this.faultData)
      }
  },
  watch: {
      routeListDefault: {
          handler(newV, oldV) {
              let $this = this;
              let spliceIndex = 0;
              this.isInterrupt = false;
              this.routeListData = (newV.routeInfo && newV.routeInfo.split('-')) || [];
              this.nodeResult = JSON.parse(JSON.stringify(newV.nodeResults));
              this.routeDetailData = JSON.parse(JSON.stringify(newV.routeDetails));
              this.routeDetailData.unshift({id: null, ip: this.faultData.probeIp});
              this.routeListData.unshift(this.faultData.probeIp);
              if(this.routeListData.length && (this.routeListData[this.routeListData.length-1] != this.faultData.targetIp)) {
                this.isInterrupt = true;
                this.routeListData.push(this.faultData.targetIp);
                this.routeDetailData.push({id: null, ip: this.faultData.targetIp});
              }
              if(this.routeListData[this.routeListData.length-2] == '*'){
                for(let i = this.routeListData.length-2;i>=0;i--){
                  if(this.routeListData[i] != '*') {
                    spliceIndex = i;
                    break;
                  }
                }
                this.nodeResult.splice(spliceIndex+1,this.routeListData.length-3-spliceIndex)
                this.routeListData.splice(spliceIndex+1,this.routeListData.length-3-spliceIndex);
                this.routeDetailData.splice(spliceIndex+1,this.routeListData.length-3-spliceIndex)
              }
              if(this.faultData.anode && this.faultData.bnode){
                let anodeindex = this.routeListData.indexOf($this.faultData.anode);
                let bnodeindex = this.routeListData.lastIndexOf($this.faultData.bnode);
                if((anodeindex != -1) && (bnodeindex != -1)) {
                  $this.faultList = [anodeindex, bnodeindex]
                }
              }
          },
          deep: true,
          immediate: true,
      },
      clickIndex: {
          handler(newV) {
              // if(newV != -1) {
                 this.weightlineIndex = [];
              // }
          }
      }
  },
  created() {
    //   this.routeListData = this.routeListDefault.routeInfo && this.routeListDefault.routeInfo.split('-');
  }
};
</script>
<style lang="scss" scoped>
.pathTogology {
  position: relative;
}
.pathTogologyDefault-change {
    font-size: 16px;
    right: 0;
    top: -25px;
    background-size: 16px 16px;
}
.pathTogology-popover {
  display: flex;
  flex-wrap: wrap;
  padding-left: 20px;
}
.popover-item {
  width: 50%;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.menu-scroll>>>.el-scrollbar__wrap {
    overflow-x: hidden;
}
.path-togology {
  position: relative;
  display: flex;
  width: 90%;
  height: 100px;
  margin: 0 auto 30px;
  overflow-y: auto;
}
.togology-item {
  display: flex;
}
.togology-text {
  font-size: 14px;
  color: #fff;
  margin-top: 10px;
  text-align: center;
}
.togology-img {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.togology-img .togology-probe {
  width: 110px;
  height: 40px;
}
.togology-line-route.weightline {
    height: 6px;
    background-image: linear-gradient(to bottom right, #00FFD8, #00CABD);
    box-shadow: 0 0 5px rgb(36 252 255);
}
.togology-line-route.weightline.fault-line,
.togology-line-route.weightline.fault-line2,
.togology-line-route.weightline.fault-line1 {
  background-image: none;
  box-shadow: none;
}
.togology-line {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.togology-line-timedelay .togology-line-route {
  background-color: #c63008;
}
.togology-line-interrupt .togology-line-route {
  background-color: #777777;
}
.togology-line-route-text {
  position: absolute;
}
.togology-line-timedelay .togology-line-route-text {
  color: #c63008;
}
.togology-line-interrupt .togology-line-route {
  color: #777777;
}
.togology-line-img {
  width: 140px;
  height: 20px;
  margin: 10px 15px 0;
}
.togology-probe-route {
  width: 85px;
  height: 45px;
}
.togology-probe-route-pointer{
  cursor: pointer;
}
.togology-dotted-line {
  margin: 20px 15px 0;
}
.togology-line-route {
  width: 110px;
  height: 4px;
  margin: 20px 15px 0;
  border: none;
  background-color: #20A8A2;
  cursor: pointer;
}
.togology-line-route.fault-line{
  background-color: #c63008;
}
.togology-line-route.fault-line2{
  background-color: #ff7113;
}
.togology-line-route.fault-line1{
  background-color: #ffd83a;
}
.togology-interface {
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 22px;
  right: 0;
  cursor: pointer;
}
</style>