<template>
  <div class="lineChart">
    <h5 class="use-ratio-title">流量趋势图</h5>
    <el-checkbox v-if="checked" @change="setChecked">仅看有流量</el-checkbox>
    <span v-if="defaultData.fluxData && (listData.length != 1)" class="lineChart-more" @click="moreEchartFun"><i class="el-icon-view"></i>更多接口</span>
    <div v-if="defaultData.fluxData">
      <flowTrendChart :echarData="defaultData"></flowTrendChart>
    </div>
    <div v-if="listData.length && (!defaultData.fluxData)">
      <flowTrendChart v-for="(item, index ) in listData" :key="index" :echarData="item"></flowTrendChart>
    </div>
  </div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
import baseUrl from '@/js/baseUrl.js'
import axiosHttp from '@/js/axiosHttp.js'
import flowTrendChart from './flowTrendChart'
export default {
  name: "lineChart",
  data() {
    return {
      listDataDefalut: [],
      listData: [],
      defaultData: [],
      checked: false,
    };
  },
  props: ['viewAnalysis'],
  components: {
    flowTrendChart
  },
  methods: {
    getList() {
        let $this = this;
        let params = {
          beginTime: this.viewAnalysis.beginTime,
          endTime: this.viewAnalysis.endTime,
          ids: [
            { 
              deviceId: this.viewAnalysis.deviceId
            }
          ]
        }
        let loading = CommonFun.openFullScreen(this)
        axiosHttp.post(baseUrl.BASEURL + 'analyseDevice/queryDeviceInterfaceDatumNew',params)
            .then((res) => {
              if (res.data.status == 1 && res.data.data.length) {
                  $this.listData = res.data.data;
                  $this.listDataDefalut = res.data.data;
                  res.data.data.forEach((item) => {
                    if(item.ip == $this.viewAnalysis.FdeviceIp){
                      $this.defaultData = item;
                    }
                  })
                  $this.defaultData = $this.defaultData.ip ? $this.defaultData : res.data.data[0];
              }
              CommonFun.closeFullScreen(loading);
            })
    },
    moreEchartFun(){
      this.defaultData = []
      this.checked = true;
    },
    setChecked(bool){
      let $this = this;
      if(bool){
        let listArr = [];
        $this.listDataDefalut.forEach(item => {
          if(item.fluxData.length){
            listArr.push(item);
          }
        })
        $this.listData = listArr;
      }else{
        $this.listData = $this.listDataDefalut;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style scoped>
.lineChart {
    position: relative;
    width: 100%;
    /* padding: 20px 0; */
}
.lineChart-more {
  color: #00D9D2;
  cursor: pointer;
  position: absolute;
  top: 50px;
  right: 40px;
  z-index: 11;
}
.lineChart-more .el-icon-view{
  vertical-align: bottom;
  margin-right: 7px;
}
</style>