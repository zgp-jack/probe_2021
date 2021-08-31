<template>
    <div class="pathTogologyDefault">
        <div class="pathTogologyDefault-change btn-check-chart" @click="isChange=!isChange">{{isChange ? 'IP地址' : '设备名称'}}</div>
        <div class="path-togology" v-if="nodeResult.length">
            <div class="togology-item">
                <div :class="['togology-img', nodeList[0] && 'togology-img-pointer']" @click="nodeList[0] && showTrend(nodeList[0], faultData.anode)">
                    <el-popover
                        popper-class="tableSearch-popover"
                        :disabled="nodeResult[0].id ? false : true"
                        placement="top"
                        width="400"
                        trigger="hover">
                        <div class="pathTogology-popover">
                            <p class="popover-item">IP地址：{{nodeResult[0].ip}}</p>
                            <p class="popover-item">管理地址：{{nodeResult[0].managerAddress}}</p>
                            <p class="popover-item">接口名称：{{nodeResult[0].interfaceName}}</p>
                            <p class="popover-item">别名：{{nodeResult[0].name}}</p>
                            <p class="popover-item">设备类型：{{nodeResult[0].deviceType}}</p>
                            <p class="popover-item">位置：{{(nodeResult[0].computerRoom?(nodeResult[0].computerRoom+'-'): '')+(nodeResult[0].cabinet?(nodeResult[0].cabinet+'-'):'')+nodeResult[0].number}}</p>
                        </div>
                        <div slot="reference">
                            <img class="togology-probe-route"  src="../../assets/togology-probe-route.png" />
                            <p class="togology-text">{{isChange?faultData.anode:(nodeResult[0].name?nodeResult[0].name:faultData.anode)}}</p>
                            <img v-if="nodeList[0]" class="togology-interface" src="../../assets/togology-interface.png" alt="">
                        </div>
                    </el-popover>
                </div>
                <div class="togology-line">
                    <div class="togology-line-route"></div>
                </div>
            </div>
            <div class="togology-item">
                <div :class="['togology-img', nodeList[1] && 'togology-img-pointer']" @click="nodeList[1] && showTrend(nodeList[1], faultData.bnode)">
                    <el-popover
                        popper-class="tableSearch-popover"
                        :disabled="nodeResult[1].id ? false : true"
                        placement="top"
                        width="400"
                        trigger="hover">
                        <div class="pathTogology-popover">
                            <p class="popover-item">IP地址：{{nodeResult[1].ip}}</p>
                            <p class="popover-item">管理地址：{{nodeResult[1].managerAddress}}</p>
                            <p class="popover-item">接口名称：{{nodeResult[1].interfaceName}}</p>
                            <p class="popover-item">别名：{{nodeResult[1].name}}</p>
                            <p class="popover-item">设备类型：{{nodeResult[1].deviceType}}</p>
                            <p class="popover-item">位置：{{(nodeResult[1].computerRoom?(nodeResult[1].computerRoom+'-'): '')+(nodeResult[1].cabinet?(nodeResult[1].cabinet+'-'):'')+nodeResult[1].number}}</p>
                        </div>
                        <div slot="reference">
                            <img class="togology-probe-route" src="../../assets/togology-probe-route.png" />
                            <p class="togology-text">{{isChange?faultData.bnode:(nodeResult[1].name?nodeResult[1].name:faultData.bnode)}}</p>
                            <img v-if="nodeList[1]" class="togology-interface" src="../../assets/togology-interface.png" alt="">
                        </div>
                    </el-popover>
                </div>
                <div class="togology-line"></div>
            </div>
        </div>
        <trendChart />
    </div>
</template>
<script>
import Bus from '../vue-simple-upload-js/bus'
import trendChart from './trendChart'
export default {
    name: 'pathTogologyDefault',
    data(){
        return {
            nodeList: [],
            nodeResult: [],
            isChange: true
        }
    },
    props: ['faultData', 'routeListIp'],
    components: {
        trendChart,
    },
    methods: {
        showTrend(id, nodeIp){
            this.faultData.deviceId = id
            this.faultData.FdeviceIp = nodeIp
            Bus.$emit('changeDialogVisible', this.faultData)
        }
    },
    watch: {
        routeListIp: {
            handler(newV) {
                let $this = this;
                let isnodeList = [];
                let isnodeResult = [];
                newV.length && newV.forEach((item, index) => {
                    if(item.ip == $this.faultData.anode) {
                        isnodeList[0] = item.deviceId;
                        isnodeResult[0] = item;
                    }else if(item.ip == $this.faultData.bnode){
                        isnodeList[1] = item.deviceId
                        isnodeResult[1] = item;
                    }
                })
                $this.nodeResult = isnodeResult;
                this.nodeList = isnodeList;
            },
            deep: true
        }
    },
}
</script>
<style lang="scss" scoped>
.pathTogologyDefault {
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
.path-togology {
  display: flex;
  width: 90%;
//   height: 100px;
  margin: 0 auto 30px;
  justify-content: center;
  overflow-y: auto;
}
.togology-item {
  display: flex;
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
.togology-probe-route {
  width: 85px;
  height: 45px;
}
.togology-text {
  font-size: 14px;
  color: #fff;
  margin-top: 10px;
  text-align: center;
}
.togology-interface {
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 22px;
  right: 0;
}
.togology-img-pointer {
    cursor: pointer;
}
.togology-line {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.togology-line-route {
  width: 110px;
  height: 4px;
  margin: 20px 15px 0;
  border: none;
  background-color: #20A8A2;
}
</style>