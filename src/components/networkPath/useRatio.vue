<template>
    <div class="use-ratio">
        <h5 class="use-ratio-title">利用率趋势图</h5>
        <p id="lineChart1" ref="lineChart1" class="p_chart"></p>
    </div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
import baseUrl from '@/js/baseUrl.js'
import axiosHttp from '@/js/axiosHttp.js'
import {mapState} from 'vuex'
export default {
    name: 'useRatio',
    data(){
        return {
            xAxisData: [],
            yAxisData: [],
            yAxisData1: [],
            yAxisData2: [],
        }
    },
    props: ['trendData'],
    computed: {
        ...mapState({
            cpuMemoryUseList: state => state.cpuMemoryUseList
        })
    },
    methods: {
        echartsFun() {
            let $this = this;
            let lineChart1 = $this.$echarts.init($this.$refs.lineChart1);
            lineChart1.setOption({
                color: ["#29B3AD", "#FDD658"],
                tooltip: {
                    trigger: "axis",
                    formatter: param => {
                        console.log(param)
                        let str = `${CommonFun.dateFormat(param[0].value[0], 'YYYY-MM-DD HH:mm:ss')}<br/>`;
                        for (const item of param) {
                            str += `${item.seriesName}: ${item.value[1]}%<br/>`;
                        }
                        return str
                    },
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 7,
                    textStyle: {
                        lineHeight: 14,
                        color: '#fff'
                    },
                    data:['CPU利用率', '内存利用率']
                },
                grid: {
                    left: 30,
                    right: 40,
                    top: 30,
                    bottom: 40,
                    containLabel: true,
                },
                dataZoom: [{
                    type: "slider",
                    show: true,
                    xAxisIndex: [0],
                    backgroundColor: "#082C2B",
                    fillerColor: '#145B58',
                    borderColor: 'none',
                    textStyle: {
                        color: '#ccc'
                    }
                }],
                calculable: true,
                xAxis: [
                {
                    type: "time",
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        textStyle: {
                            color: "#828E9F",
                            fontSize: 13,
                        },
                    },
                    axisTick: { show: false }
                }],
                yAxis: [
                {
                    type: "value",
                    name: '单位/%',
                    nameTextStyle: {
                        color: '#ccc'
                    },
                    splitNumber: 5,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#828E9F",
                        },
                    },
                    axisTick: { show: false }
                }],
                series: [
                {
                    name: "CPU利用率",
                    type: "line",
                    symbolSize: 6,
                    showSymbol: this.yAxisData1.length < 2,
                    itemStyle: { normal: { color: "#29B3AD" } },
                    areaStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [
                                { offset: 0, color: "rgba(41, 179, 173, 0.3)" },
                                { offset: 1, color: "rgba(41, 179, 173, 0.1)" },
                            ], false),
                            shadowColor: "rgba(21, 180, 254, 0.9)",
                            shadowBlur: 20,
                        }
                    },
                    data: this.yAxisData1,
                },{
                    name: "内存利用率",
                    type: "line",
                    symbolSize: 6,
                    showSymbol: this.yAxisData2.length < 2,
                    itemStyle: { normal: { color: "#FDD658" } },
                    areaStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [
                                { offset: 0, color: "rgba(253, 214, 88, 0.3)" },
                                { offset: 1, color: "rgba(253, 214, 88, 0.1)" },
                            ], false),
                            shadowColor: "rgba(21, 180, 254, 0.9)",
                            shadowBlur: 20,
                        }
                    },
                    data: this.yAxisData2,
                }],
            });
        },
        setData(list) {
            this.yAxisData1 = list.map(item => {
                return [item.taskTime * 1000, item.cpuUsePercent];
            });
            this.yAxisData2 = list.map(item => {
                return [item.taskTime * 1000, item.memoryUsePercent];
            })
            this.echartsFun()
        },
        getList() {
            let params = {
                beginTime: this.trendData.beginTime,
                endTime: this.trendData.endTime,
                deviceId: this.trendData.deviceId
            }
            axiosHttp.post(baseUrl.BASEURL + 'analyseDevice/queryDeviceDatum',params)
                .then((res) => {
                    if (res.data.status == 1) {
                        if(baseUrl.WSSOURCE === 'false') {
                            this.setData(res.data.data);
                        }
                        // let data = res.data.data
                        // let iSpace = 1;
                        // let xData = [];
                        // let yData = [];
                        // for(let i=0;i<data.length;i+=iSpace){
                        //     xData.push([data[i].taskTime * 1000, data[i].cpuUsePercent]);
                        //     yData.push([data[i].taskTime * 1000, data[i].memoryUsePercent]);
                        // }
                        // this.yAxisData1 = xData;
                        // this.yAxisData2 = yData;
                        // this.echartsFun()
                    }
                })
        },
    },
    watch: {
        cpuMemoryUseList: {
            handler: function(val) {
                this.setData(val);
            },
            deep: true
        }
    },
    mounted() {
        // this.echartsFun();
        this.getList();
    }
}
</script>
<style scoped>
.p_chart {
  width: 100%;
  height: 250px;
}
.use-ratio {
    width: 100%;
}
</style>