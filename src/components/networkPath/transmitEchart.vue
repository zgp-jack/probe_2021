<template>
  <div v-loading="isLoading" class="echartsBox" ref="histogramChart2"></div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
import baseUrl from '@/js/baseUrl.js'
import axiosHttp from '@/js/axiosHttp.js'
import Bus from '../vue-simple-upload-js/bus'
export default {
  name: "transmitEchart",
  data() {
    return {
      xAxisData: [],
      yAxisData1: [],
      yAxisData2: [],
      timeS: '',
      timeE: '',
      startVal: '',
      startIndex: 1,
      isLoading: false,
    };
  },
  props: ['faultData', 'clickIndex', 'routeList'],
  computed: {
    option() {
      let $this = this;
      return {
        color: ["#29B3AD", "#FDD658"],
        tooltip: {
          axisPointer: { type: "cross", show: true },
          //formatter:'{b}<br/>{a0}:{c0}<br/>{a1}：{c1}', //b为数据名；a0,a1为系列名，c0为y轴左侧数据，c1为右侧
          formatter: function(item) {
            if(item.seriesName == '时延'){
              return item.seriesName + ': ' + item.data +  'ms' + '<br/> ' + item.name
            }else{
              return item.seriesName + ': ' + item.data + '<br/> ' + item.name
            }
          }
        },
        legend: {
          type: 'scroll',
          itemWidth: 7,
          data: [
              {
                  name: '时延',
                  icon: 'circle',
                  textStyle: {
                      color: '#ccc',
                  }
              },
              {
                  name: '丢包',
                  icon: 'circle',
                  textStyle: {
                      color: '#ccc'
                  }
              },
          ],
          // right: 200
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            backgroundColor: "#082C2B",
            fillerColor: '#145B58',
            borderColor: 'none',
            textStyle: {
                color: '#ccc'
            }
          },
        ],
        xAxis: [
          {
            type: "category",
            data: $this.xAxisData,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
                color: '#ccc'
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "时延/ms",
            splitLine: {
              //y轴上的y轴线条相关设置
              show: true,
              lineStyle: {
                color: "#828E9F",
                opacity: .5
              },
            },
            axisLabel: {
                color: '#ccc'
            },
            nameTextStyle: {
                color: '#ccc',
            }
          },
          {
            type: "value",
            name: "丢包/个数",
            show: true,
            axisLabel: {
                color: '#ccc'
            },
            nameTextStyle: {
                color: '#ccc'
            }
          },
        ],
        series: [
            
          {
            name: "时延",
            type: "line",
            // markPoint: {
            //   data: [{ name: "开始点", value: '开始值', xAxis: $this.startVal }],
            //   label: {
            //     formatter: '开始点'
            //   }
            // },
            yAxisIndex: 0,
            symbol:'circle',
            symbolSize: 6,
            showSymbol: this.yAxisData2.length<3,
            data: $this.yAxisData2,
            itemStyle: {
              // color: '#fff',
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 5,
              shadowColor: '#29B3AD'
            },
            lineStyle: {
              normal: {
                color: "#29B3AD",
              },
            },
            areaStyle: {
              normal: {
                color: new $this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    { offset: 0, color: "#29B3AD" },
                    { offset: 0.8, color: "#082C2B" },
                  ],
                  false
                ),
              },
            },
          },
          {
            name: "丢包",
            type: "scatter",
            yAxisIndex: 1,
            data: $this.yAxisData1,
            itemStyle: {
                color: '#FDD658'
            }
          },
        ],
      };
    },
  },
  methods: {
    echartsFun() {
      let $this = this;
      $this.chart = $this.$echarts.init($this.$refs.histogramChart2);
      $this.chart.setOption(this.option);
    },
    echartsData1(res){
      let $this = this;
      if (res.data.status == 1) {
          let data = res.data.data
          let iSpace = 1;
          if(data.length <= 1000) {
              iSpace = 1;
          }else if(data.length>1000 && data.length<=10000) {
              iSpace = 9;
          }else {
              iSpace = 19;
          }
          // $this.startVal = CommonFun.formatterTimeConversion({beginTime: (res.data.data[0].taskTime + 15*60)},{label:'开始时间'})
          for(let i=0;i<data.length;i+=iSpace){
              $this.xAxisData.push(CommonFun.formatterTimeConversion({beginTime:data[i].taskTime},{label:'开始时间'}))
              if((data[i].sendCount - data[i].receiveCount) > 0){
                  $this.yAxisData1.push((data[i].sendCount - data[i].receiveCount).toFixed(2))
              }else{
                  $this.yAxisData1.push('-')
              }
              if(data[i].receiveCount == 0){
                  $this.yAxisData2.push('-')
              }else{
                  $this.yAxisData2.push((data[i].averageDelay).toFixed(2))
              }
          }
          $this.echartsFun()
      }else{
          CommonFun.responseError(res.data, $this);
      }
    },
    getEchartsData1(beginTime,endTime){
        let $this = this;
        $this.xAxisData = []
        $this.yAxisData1 = []
        $this.yAxisData2 = []
        let sendingData = {
            beginTime: beginTime,
            endTime: endTime,
            taskId: this.faultData.taskId,
            taskType: 1,
        }
        if(baseUrl.WSSOURCE === 'true') {
          $this.$store.dispatch('setUpdateEchartsBoxDataTask', [])
          $this.$store.dispatch('setUpdateEchartsBoxDataNode', [])
        }else{
          this.isLoading = true
        }
        axiosHttp.post(baseUrl.BASEURL + 'analyseTask/queryTaskDatum', sendingData)
        .then(function(res) {
          if(baseUrl.WSSOURCE === 'false') {
              $this.isLoading = false
              $this.echartsData1(res);
          }
        })
        .catch(function(err) {
            // CommonFun.responseError(err, $this);
        });
    },
    echartsData2(res){
      let $this = this;
      if (res.data.status == 1) {
          let data = res.data.data
          let iSpace = 1;
          if(data.length <= 1000) {
              iSpace = 1;
          }else if(data.length>1000 && data.length<=10000) {
              iSpace = 9;
          }else {
              iSpace = 19;
          }
          if($this.faultData.taskType && $this.faultData.taskType == 2){
              for(let i=0;i<data.length;i+=iSpace){
                  $this.xAxisData.push(CommonFun.formatterTimeConversion({beginTime:data[i].taskTime},{label:'开始时间'}))
                  if(data[i].loss>0){
                      $this.yAxisData1.push(data[i].loss.toFixed(2))
                  }else{
                      $this.yAxisData1.push('-')
                  }
                  if(data[i].loss==100){
                      $this.yAxisData2.push('-')
                  }else{
                      $this.yAxisData2.push((data[i].delay || 0).toFixed(2))
                  }
              }
          }else{
              for(let i=0;i<data.length;i++){
                  $this.xAxisData.push(CommonFun.formatterTimeConversion({beginTime:data[i].taskTime},{label:'开始时间'}))
                  if(data[i].delay < 0){
                      $this.yAxisData1.push(Math.abs(data[i].delay).toFixed(2))
                      $this.yAxisData2.push('-')
                  }else{
                      $this.yAxisData1.push('-')
                      $this.yAxisData2.push((data[i].delay || 0).toFixed(2))
                  }
              }
          }
          $this.echartsFun()
      }
      if (res.data.status == 0) {
          CommonFun.responseError(res.data, $this);
      }
    },
    getEchartsData2(getNodeInfo) {
        let $this = this;
        let sendingData = {
            beginTime: '',
            endTime: '',
            taskId: this.faultData.taskId,
            taskType: getNodeInfo.taskType || 1,
            anode: getNodeInfo.anode,
            bnode: getNodeInfo.bnode,
            startCount: getNodeInfo.startCount || 0
        }
        if(this.clickIndex == -1) {
            sendingData.beginTime = this.faultData.beginTime;
            sendingData.endTime = this.faultData.endTime;
        }else {
            sendingData.beginTime = this.routeList[this.clickIndex].entryTime;
            sendingData.endTime = this.routeList[this.clickIndex].lastTime;
        }
        $this.xAxisData = []
        $this.yAxisData1 = []
        $this.yAxisData2 = []
        if(baseUrl.WSSOURCE === 'true') {
          $this.$store.dispatch('setUpdateEchartsBoxDataTask', [])
          $this.$store.dispatch('setUpdateEchartsBoxDataNode', [])
        }else{
          this.isLoading = true
        }
        axiosHttp
        .post(baseUrl.BASEURL + 'analyseTask/queryNodeDatum', sendingData)
        .then(function(res) {
          if(baseUrl.WSSOURCE === 'false') {
              $this.isLoading = false
              $this.echartsData2(res);
          }
        })
        .catch(function(err) {
            CommonFun.responseError(err, $this);
        });
    }
  },
  mounted() {
    let $this = this;
    // $this.echartsFun();
    if(this.faultData.taskType == 1){
      this.getEchartsData1(this.faultData.beginTime,this.faultData.endTime);
    }else{
      this.getEchartsData2(this.faultData);
    }
    Bus.$on('getNodeInfoFun',this.getEchartsData2)
  },
  beforeDestroy() {
      Bus.$off('getNodeInfoFun',this.getEchartsData2)
  },
  watch: {
      clickIndex(newindex, oldindex) {
        if(newindex == -1){
          this.timeS = this.routeList[oldindex].entryTime
          this.timeE = this.routeList[oldindex].lastTime
        }else {
          this.timeS = this.routeList[newindex].entryTime
          this.timeE = this.routeList[newindex].lastTime
        }
        this.getEchartsData1(this.timeS, this.timeE)
      },
      'faultData': {
        handler(newName, oldName) {
          if(this.faultData.taskType == 1){
            this.getEchartsData1(this.faultData.beginTime,this.faultData.endTime);
          }else{
            this.getEchartsData2(this.faultData);
          }
        },
        // immediate: true,
        deep: true
      },
      '$store.state.echartsBoxDataTask': {
        handler(newName, oldName) {
          let $this = this;
          $this.xAxisData = []
          $this.yAxisData1 = []
          $this.yAxisData2 = []
          if (this.$store.state.echartsBoxDataTask.length) {
              let iSpace = 1;
              let data = this.$store.state.echartsBoxDataTask;
              this.startIndex++;
              for (let i = 0; i < data.length; i += iSpace) {
                $this.xAxisData.push(
                  CommonFun.formatterTimeConversion(
                    { beginTime: data[i].taskTime },
                    { label: "开始时间" }
                  )
                );
                if (data[i].sendCount - data[i].receiveCount > 0) {
                  $this.yAxisData1.push(
                    (data[i].sendCount - data[i].receiveCount).toFixed(2)
                  );
                } else {
                  $this.yAxisData1.push("-");
                }
                if (data[i].receiveCount == 0) {
                  $this.yAxisData2.push("-");
                } else {
                  $this.yAxisData2.push(data[i].averageDelay.toFixed(2));
                }
              }
              if($this.$refs && $this.$refs.histogramChart2) {
                $this.chart = $this.$echarts.init($this.$refs.histogramChart2);
                data.length && $this.chart.setOption(this.option);
              }
          }
          if(this.startIndex == 1 && !this.$store.state.echartsBoxDataTask.length && !this.$store.state.echartsBoxDataNode.length && this.routeList.length){
            this.startIndex++;
            if(baseUrl.WSSOURCE === 'true') {
              this.getEchartsData1(this.routeList[this.routeList.length-1].entryTime, this.routeList[this.routeList.length-1].lastTime);
            }
          }else if(!this.$store.state.echartsBoxDataTask.length && !this.$store.state.echartsBoxDataNode.length) {
            if($this.$refs && $this.$refs.histogramChart2) {
                $this.chart = $this.$echarts.init($this.$refs.histogramChart2);
                $this.chart.setOption(this.option);
              }
          }
        },
      },
      '$store.state.echartsBoxDataNode': function () {
          let $this = this;
          if(this.$store.state.echartsBoxDataNode.length) {
          let iSpace = 1;
          let data = this.$store.state.echartsBoxDataNode;
          $this.xAxisData = []
          $this.yAxisData1 = []
          $this.yAxisData2 = []
          if ($this.faultData.taskType && $this.faultData.taskType == 2) {
            for (let i = 0; i < data.length; i += iSpace) {
              $this.xAxisData.push(
                CommonFun.formatterTimeConversion(
                  { beginTime: data[i].taskTime },
                  { label: "开始时间" }
                )
              );
              if (data[i].loss > 0) {
                $this.yAxisData1.push(data[i].loss.toFixed(2));
              } else {
                $this.yAxisData1.push("-");
              }
              if (data[i].loss == 100) {
                $this.yAxisData2.push("-");
              } else {
                $this.yAxisData2.push((data[i].delay || 0).toFixed(2));
              }
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              $this.xAxisData.push(
                CommonFun.formatterTimeConversion(
                  { beginTime: data[i].taskTime },
                  { label: "开始时间" }
                )
              );
              if (data[i].delay < 0) {
                $this.yAxisData1.push(Math.abs(data[i].delay).toFixed(2));
                $this.yAxisData2.push("-");
              } else {
                $this.yAxisData1.push("-");
                $this.yAxisData2.push((data[i].delay || 0).toFixed(2));
              }
            }
          }
          if($this.$refs && $this.$refs.histogramChart2) {
              $this.chart = $this.$echarts.init($this.$refs.histogramChart2);
              data.length && $this.chart.setOption(this.option);
            }
        }
        if(!this.$store.state.echartsBoxDataTask.length && !this.$store.state.echartsBoxDataNode.length) {
          $this.xAxisData = []
          $this.yAxisData1 = []
          $this.yAxisData2 = []
          if($this.$refs && $this.$refs.histogramChart2) {
              $this.chart = $this.$echarts.init($this.$refs.histogramChart2);
              $this.chart.setOption(this.option);
            }
        }
      }
  }
};
</script>