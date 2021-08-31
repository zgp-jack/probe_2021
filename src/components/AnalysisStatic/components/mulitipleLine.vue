<template>
    <div style="height: 260px; position: relative" v-loading="loading">
        <template v-if="hasCheckBtn">
            <div v-for="item,index of checkTemp" v-show="item.actived" :key="index" class="btn-check-chart" size="mini" type="text" @click="revertMap(item)">
                {{item.name}}
            </div>
        </template>
        <p id="multipleChart" ref="multipleChart" class="p_chart"></p>
    </div>
</template>
<script>
import Api from './../api'
import CommonFun from "@/js/commonFun.js";
export default {
    name: "multipleLine",
    props: {
        searchData: {
            type: Object
        },
        hasCheckBtn: {
            type: Boolean,
            default: true
        },
        moduleName: {
            type: String,
            default: 'analysis'
        }
    },
    data() {
        return {
            isTask: this.moduleName !== 'analysis',
            loading: false,
            checkTemp: [{name: '流量拥塞', value: 1, actived: false}, {name: 'CPU利用率偏高', value: 2, actived: true}, {name: '内存利用率偏高', value: 3, actived: false}],
            eventType: 1,
            trendStatisticsData: {
                link: [],
                video: []
            },
            yAxisData1: [],
            yAxisData2: [],
            xAxisData: [],
            endTime: null,
            beginTime1: null,
            beginTime2: null,
            allData1: [],
            allData2: []
        };
    },
    computed: {
        option() {
            return {
                tooltip: {
                    trigger: "axis",
                    formatter: param => {
                        let str = `${param[0].value[0]}小时前<br/>`; //`${CommonFun.dateFormat(this.endTime - param[0].value[0] * 3600000, 'YYYY-MM-DD HH:mm:ss')}<br/>`;
                        console.log(param);
                        for (const item of param) {
                            str += `${item.seriesName}: ${item.value[1]}个<br/>`;
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
                    data:['当前趋势']
                },
                grid: {
                    left: 30,
                    right: 40,
                    top: 30,
                    bottom: 0,
                    containLabel: true,
                },
                calculable: true,
                xAxis: [
                {
                    type: "value",
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
                    data: this.xAxisData,
                    axisTick: { show: false }
                }],
                yAxis: [
                {
                    type: "value",
                    name: '单位/个',
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
                    name: "当前趋势",
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
                }
                // ,{
                //     name: "环比",
                //     type: "line",
                //     symbolSize: 6,
                //     showSymbol: this.yAxisData2.length < 2,
                //     itemStyle: { normal: { color: "#FDD658" } },
                //     areaStyle: {
                //         normal: {
                //             color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                //             [
                //                 { offset: 0, color: "rgba(253, 214, 88, 0.3)" },
                //                 { offset: 1, color: "rgba(253, 214, 88, 0.1)" },
                //             ], false),
                //             shadowColor: "rgba(21, 180, 254, 0.9)",
                //             shadowBlur: 20,
                //         }
                //     },
                //     data: this.yAxisData2,
                // }
                ],
            }
        }
    },
    created() {
        if(this.isTask) {
            this.checkTemp = [{name: '时延劣化', value: 1, actived: true}, {name: '丢包劣化', value: 2, actived: false}, {name: '中断', value: 3, actived: false}]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init(this.searchData, true);
        })
    },
    beforeDestroy() {
        
    },
    methods: {
        revertMap(item) {
            this.checkTemp.forEach((res, inx) => {
                res.actived = false;
                this.$set(this.checkTemp, inx, res);
            })

            let ins = this.checkTemp.findIndex(res => res.value === item.value);
            ins++;
            if(ins >= this.checkTemp.length) {
                ins = 0;
            }
            this.checkTemp[ins].actived = true;
            this.$set(this.checkTemp, ins, this.checkTemp[ins]);
            this.eventType = this.checkTemp[ins].value;
            this.yAxisData1 = [];
            this.xAxisData = [];
            this.allData1.map(item => {
                if(item.eventType === this.eventType) {
                    this.xAxisData.push(item.time);
                    this.yAxisData1.push({name: '当前趋势', value: [item.time, item.count]})
                }
            })
            // this.yAxisData2 = [];
            // this.allData2.map(item => {
            //     if(item.eventType === this.eventType) {
            //         this.yAxisData2.push({name: '环比', value: [item.time, item.count]})
            //     }
            // })
            this.echartsFun();
        },
        echartsFun() {
            let that = this;
            let multipleChart = that.$echarts.init(that.$refs.multipleChart);
            // that.option.series[0].data = [
            //     {value: [1, 1]},
            //     {value: [2, 3]},
            //     {value: [3, 1]},
            //     {value: [4, 1]},
            //     {value: [5, 4]},
            // ];
            // that.option.series[1].data = [{value: [2, 10]}];
            multipleChart.setOption(that.option);
        },
        getData(methodName, params, key) {
            this.loading = true;
            this[`yAxisData${key}`] = [];
            if(key === 1) {
                this.xAxisData = [];
            }
            this[`beginTime${key}`] = params['beginTime'];
            return Api[methodName](params).then((res) => {
                const data = res.data;
                this.loading = false;
                if(data.status == 1){
                    if (!!data.data) {
                        this[`allData${key}`] = data.data.map(item => {
                            let time = parseInt(item.hours);
                            let count = item.count;
                            let eventType = this.isTask ? item.eventType : item.type;
                            if(eventType === this.eventType) {
                                if(key === 1) {
                                    this.xAxisData.push(time);
                                }
                                this[`yAxisData${key}`].push({name: key === 1?'当前趋势':'环比', value: [time, count]})
                            }
                            return {
                                eventType: eventType,
                                time: time,
                                count: count
                            }
                        });
                        console.log(this[`yAxisData${key}`]);
                    }
                } else {
                    CommonFun.responseError(data, this);
                }
            }).catch(err => {
                this.loading = false;
            })    
        },
        async init(params = {}, temp) {
            let param = JSON.parse(JSON.stringify(params));
            if(temp) {
                this.endTime = param['endTime'];
                param['beginTime'] = parseInt(param['beginTime'] / 1000);
                param['endTime'] = parseInt(param['endTime'] / 1000);
            } else {
                this.endTime = param['endTime'] * 1000;
            }
            let methodName = this.moduleName === 'analysis' ? 'typeTrend' : 'faultTrend';
            await this.getData(methodName, param, 1);
            
            let params1 = JSON.parse(JSON.stringify(params));
            let unitTime = params['endTime'] - params['beginTime'];
            if(temp) {
                params1['beginTime'] = (params['beginTime'] - unitTime) / 1000;
                params1['endTime'] = (params['endTime'] - unitTime) / 1000;
            } else {
                params1['beginTime'] = (params['beginTime'] - unitTime);
                params1['endTime'] = (params['endTime'] - unitTime);
            }
            
            await this.getData(methodName, params1, 2);

            this.echartsFun();
        },
        resize() {
            this.$echarts.init(this.$refs.multipleChart).resize();
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin before-content {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
}
.p_chart {
    margin-top: 10px;
  height: calc(100% - 30px);
}
.btn-check-chart{
    top: 0;
}
</style>