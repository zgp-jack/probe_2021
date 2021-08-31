<template>
  <div class="faultAnalysisDetail">
    <div class="but popup-but-submit btn-back" @click="routerBack"><i class="btn-return-icon-white"></i> 返回</div>
    <div class="fun-box">
        <div class="topruleform">
            <div class="topruleform-item">
                <p class="topruleform-margin">开始时间：</p>
                    <el-date-picker
                    v-model="searchData.beginTime"
                    type="datetime"
                    :clearable="false"
                    placeholder="选择开始时间"
                    :editable="false"
                    default-time="00:00:00">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="topruleform-item">
                <p class="topruleform-margin">结束时间：</p>
                    <el-date-picker
                    v-model="searchData.endTime"
                    :clearable="false"
                    type="datetime"
                    placeholder="选择结束时间"
                    :editable="false"
                    default-time="00:00:00">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="topruleform-item">
                <div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
            </div>
        </div>
    </div>
    <viewAnalysis v-if="basicInfo.length" :viewAnalysisData="basicInfo"></viewAnalysis>
    <div class="faultAnalysisDetail-view">
        <p class="faultAnalysisDetail-title">网络分析</p>
        <hr class="faultAnalysisDetail-title-line" />
        <p class="faultAnalysisDetail-text">路径拓扑</p>
        <div v-if="faultData.taskType == 1">
            <pathTogology v-if="routeListDefault && routeListDefault.routeInfo" :routeListDefault="routeListDefault" :clickIndex="pathIndex" :faultData="faultData"></pathTogology>
        </div>
        <div v-else>
            <pathTogologyDefault :faultData="faultData" :routeListIp="routeListIp"></pathTogologyDefault>
        </div>
        <p class="faultAnalysisDetail-text">时延/丢包</p>
        <transmitEchart v-if="faultData && faultData.beginTime" :faultData="faultData" :clickIndex="clickIndex" :routeList="routeList"></transmitEchart>
        <div v-if="faultData.taskType == 1">
            <p class="faultAnalysisDetail-text">路径分析</p>
            <pathAnalysis :routeList="routeList" :clickIndex="defaultIndex" @getPathInfo="getPath"></pathAnalysis>
        </div>
    </div>
  </div>
</template>
<script>
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
import CommonFun from '../../js/commonFun.js'
import transmitEchart from '@/components/networkPath/transmitEchart'
import pathTogology from '@/components/networkPath/pathTogology'
import pathAnalysis from '@/components/networkPath/pathAnalysis'
import viewAnalysis from '@/components/networkPath/viewAnalysis'
import pathTogologyDefault from '@/components/networkPath/pathTogologyDefault'
export default {
  name: "expertAnalysisDetail",
  data() {
    return {
        faultData: JSON.parse(sessionStorage.getItem('currentAramItem')),
        routeListDefault: {},
        routeList: [],
        clickIndex: -1,
        defaultIndex: -1,
        pathIndex: -1,
        searchData: {beginTime: '', endTime: ''},
        basicInfo: [],
        routeListIp: []
    };
  },
  components: {
      transmitEchart,
      pathTogology,
      pathAnalysis,
      viewAnalysis,
      pathTogologyDefault
  },
  methods: {
      getList(isSearch) {
          let params;
          let analyseUrl = '';
          let $this = this;
          if(this.faultData.taskType == 1) {
              params = {
                  beginTime: this.faultData.beginTime,
                  endTime: this.faultData.endTime,
                  taskId: this.faultData.taskId,
                  probeIp: this.faultData.probeIp,
                  targetIp: this.faultData.targetIp
              }
              analyseUrl = 'analyseRoute/routeList';
          }else{
              params = [ this.faultData.anode, this.faultData.bnode ]
              analyseUrl = 'analyseDevice/analyseIpHaveDevice';
          }
          axiosHttp.post(baseUrl.BASEURL + analyseUrl,params)
            .then((res) => {
                if(res.data.status == 1){
                    // if(res.data.data.length == 0){
                    //     this.faultData.taskId = null;
                    // }else{
                        if($this.faultData.taskType == 1){
                          if(isSearch && res.data.data.length && ($this.faultData.endTime > res.data.data[res.data.data.length-1].lastTime)){
                            res.data.data[res.data.data.length-1].lastTime = ($this.faultData.endTime > new Date().getTime()/1000 ? new Date().getTime()/1000 : $this.faultData.endTime)
                          }
                            $this.routeList = res.data.data;
                            $this.routeListDefault = $this.routeList[$this.routeList.length-1]
                        }else{
                            $this.routeListIp = res.data.data;
                        }
                    // }
                }else {
                    CommonFun.responseError(res.data, this);
                }
            })
      },
      getPath(item, index) {
          this.defaultIndex = index;
          if(this.pathIndex == -1){
            this.pathIndex = -2;
          }else{
            this.pathIndex = -1
          }
          if(this.clickIndex == index){
              this.clickIndex = -1;
          }else {
              this.clickIndex = index;
          }
          this.routeListDefault = this.routeList[index]
      },
      routerBack() {
          this.$router.back();
      },
      searchAction() {
           if(this.defaultIndex == -1) {
             this.defaultIndex = -2;
           }else {
             this.defaultIndex = -1;
           }
           if(this.pathIndex == -1){
            this.pathIndex = -2;
            }else{
              this.pathIndex = -1
            }
           this.faultData.beginTime = '';
           this.faultData.beginTime = this.searchData.beginTime/1000;
           this.faultData.endTime = this.searchData.endTime/1000;
           this.getList(true);
      },
      getBasicInfo() {
            if(this.faultData.specialLineFalg && this.faultData.specialLineFalg == 1){
                this.basicInfo = [
                    ['专线名称', this.faultData.taskName],
                    ['数据源', this.faultData.dataSource],
                    ['A端地址', this.faultData.anode],
                    ['Z端地址', this.faultData.bnode]
                ]
            }else if(this.faultData.taskType == 1){
                if(this.faultData.dialTestType == 'special') {
                    this.basicInfo = [
                        ['机构名称', this.faultData.companyName],
                        ['拨测接口', this.faultData.probeIp],
                        ['目的地址', this.faultData.targetIp],
                    ]
                }else {
                    this.basicInfo = [
                        ['机构名称', this.faultData.companyName],
                        ['拨测接口', this.faultData.probeIp],
                        ['目的地址', this.faultData.targetIp],
                        ['故障类型', this.faultData.eventTypeName],
                        ['任务类型', this.faultData.taskTypeName],
                        ['故障节点对', this.faultData.anode && this.faultData.bnode && (this.faultData.anode + '-' + this.faultData.bnode)],
                        ['故障原因', this.faultData.reason]
                    ];
                }
            }else if(this.faultData.taskType == 2){
                this.basicInfo = [
                    ['任务名称', this.faultData.taskName],
                    ['拨测接口', this.faultData.probeIp],
                    ['目的地址', this.faultData.targetIp],
                    ['机构名称', this.faultData.companyName],
                    ['用户名', this.faultData.userName],
                    ['标签', this.faultData.flag],
                    ['节点A', this.faultData.anode],
                    ['节点Z', this.faultData.bnode],
                    ['故障类型', this.faultData.eventTypeName],
                    ['故障原因', this.faultData.reason]
                ]
            }else if(this.faultData.taskType == 3) {
                this.basicInfo = [
                    ['专线名称', this.faultData.taskName],
                    ['数据源', this.faultData.dataSource],
                    ['A端地址', this.faultData.anode],
                    ['Z端地址', this.faultData.bnode]
                ]
            }
            let TimeEnd = this.faultData.endTime*1000 || new Date().getTime();
            this.faultData.beginTime = (this.faultData.beginTime - 15*60);
            this.faultData.endTime = ((TimeEnd <= (new Date().getTime() - 15*60*1000)) ? (TimeEnd+15*60*1000) : new Date().getTime())/1000;
            this.searchData = {beginTime: this.faultData.beginTime*1000, endTime: this.faultData.endTime*1000}
      }
  },
  created() {
    if(this.faultData && this.faultData.taskId){
      this.getBasicInfo();
      this.getList();
    }
  },
};
</script>
<style lang="scss">
@mixin title-line {
  content: "";
  position: absolute;
  display: block;
  width: 10px;
  height: 2px;
  background-color: rgba(41, 179, 173, 1);
}
.echartsBox {
  width: 100%;
  min-height: 400px;
  margin-bottom: 30px;
}
.btn-back{
    width: 80px;
    position: fixed !important;
    top: 70px;
    right: 90px;
    z-index: 1000;
}
.faultAnalysisDetail {
  width: 90%;
  margin: 30px auto 0;
  font-size: 14px;
  color: #ccc;
  .faultAnalysisDetail-title {
    color: #fff;
    height: 30px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    font-size: 15px;
    text-shadow: 0px 0px 10px rgb(1 242 232);
  }
  .faultAnalysisDetail-view {
    padding: 0 30px 30px;
    margin-bottom: 30px;
    background-color: RGBA(2, 20, 20, 1);
    border: 1px solid rgba(1, 242, 232, .6);
    box-shadow: 0 0 0 1px rgb(5, 25, 49);
    .faultAnalysisDetail-view-container {
      display: flex;
    }
    .faultAnalysisDetail-video {
      width: 50%;
      padding-right: 40px;
      padding-bottom: 30px;
    }
    .faultAnalysisDetail-video video {
      width: 100%;
      height: 380px;
    }
    .faultAnalysisDetail-content {
      width: 50%;
      height: 380px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .content-top {
      display: flex;
      justify-content: space-between;
    }
    .content-top .content-span {
      width: 250px;
    }
    .content-span {
      display: inline-block;
      width: calc(100% - 72px);
      height: 30px;
      line-height: 28px;
      margin-left: 10px;
      padding-left: 20px;
      border: 1px solid rgb(6, 72, 157);
      box-shadow: inset 0px 0px 8px 0px #025494, 0px 0px 4px 0px #025494;
    }
  }
  .faultAnalysisDetail-text {
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
  }
  .faultAnalysisDetail-text::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 20px;
      border-radius: 50%;
      border: none;
      background-color: rgb(254, 225, 145);
  }
  .faultAnalysisDetail-title-line {
    position: relative;
    display: block;
    width: 100%;
    height: 2px;
    margin-bottom: 30px;
    border: none;
    background-color: rgba(41, 179, 173, .5);
  }
  .faultAnalysisDetail-title-line::before {
    @include title-line;
    left: 0;
  }
  .faultAnalysisDetail-title-line::after {
    @include title-line;
    right: 0;
  }
}
.topruleform{display: flex;}
.topruleform-item{position: relative;display: flex;align-items: center;color: #ccc;margin-right: 30px;margin-bottom: 15px;}
</style>