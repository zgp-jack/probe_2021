<template>
    <div style="height: 260px; position: relative">
        <p id="multipleChart" ref="multipleChart" class="p_chart"></p>
        <div class="legend-box">
            <div class="legend-item" v-for="item,index in typeList" :key="index">{{item}}</div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: "multipleLine",
    props: {
        chartData: {
            type: Array
        },
        typeList: {
            type: Array,
            default: () => { 
                return ['时延劣化', '丢包劣化', '链路中断', '故障趋势']
            }
        }
    },
    data() {
        return {
            loading: false,
            xAxisData: [],
            seriesData: [],
            endTime: null,
            beginTime1: null,
            beginTime2: null,
        };
    },
    computed: {
        option() {
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: param => {
                        let str = `${param[0].axisValueLabel}<br/>`;
                        param.forEach((item,index) => {
                            if(item.seriesName === '堆叠') {
                                return
                            }
                            //str += `${index < 5 ? param[index + 1].marker : item.marker} ${item.seriesName}: ${item.value}个<br/>`;
                            if(item.seriesName === '故障趋势') {
                                str += `${item.seriesName}: ${item.value > 0 ? '+'+item.value : item.value}%<br/>`;
                            } else {
                                str += `${item.seriesName}: ${item.value}个<br/>`;
                            }
                        })
                        return str
                    },
                },
                grid: {
                    top: 30,
                    bottom: 40,
                    left: 64,
                    right: 64
                },
                legend: {
                    show: false,
                    icon: 'circle',
                    itemWidth: 7,
                    textStyle: {
                        lineHeight: 14,
                        color: '#fff'
                    },
                    bottom: 20,
                    data: this.typeList,
                    selectedMode: false
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            color: '#828E9F',
                            rotate: 0,
                            fontSize: 11,
                            fontWeight: 'normal'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#828E9F',
                                opacity: .5
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '故障数量/个',
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
                    },
                    {
                        type: 'value',
                        name: '故障趋势',
                        splitNumber: 5,
                        axisLabel: {
                            formatter: '{value}%',
                            textStyle: {
                                color: "#828E9F",
                            },
                        },
                        splitLine: {
                            show: false,
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
                        axisTick: { show: false }
                    }
                ],
                series: this.seriesData
            }
        }
    },
    created() {
    },
    mounted() {
        this.echartsFun();
    },
    beforeDestroy() {
        
    },
    methods: {
        echartsFun() {
            let that = this;
            let multipleChart = that.$echarts.init(that.$refs.multipleChart);
            multipleChart.setOption(that.option);
            multipleChart.on('legendselectchanged', params => {
                for (const key in params.selected) {
                    let index = this.typeList.findIndex(item => item === key);
                    if(index >= 0) {
                        index = 2 * index + 1;
                    }
                    if(index > 5) {
                        return;
                    }
                    if(!params.selected[key]) {   
                        this.seriesData[index].data = this.seriesData[index].data.map(item => {
                            return 0;
                        })
                    } else {
                        this.seriesData[index].data = this.seriesData[index].data.map(item => {
                            return 0;
                        })
                    }
                    multipleChart.setOption(that.option);
                }
            })
        },
        getData(data) {
            let that = this;
            this.loading = true;
            this.xAxisData = [];
            this.seriesData = [];
            //最大值
            let max = 0;
            for (const item of data) {
                for (const list of item.data) {
                    if(list.faultNum > max) {
                        max = list.faultNum;
                    }
                }
            }

            let colorList = [
                {r: '48', g: '227', b: '238'},
                {r: '253', g: '214', b: '88'},
                {r: '61', g: '145', b: '238'},
                {r: '69', g: '241', b: '186'}
            ]
            let index = 0;
            for (const item of this.typeList) {
                if(item != '故障趋势') {
                    this.seriesData.push({
                        name: item,
                        type: 'bar',
                        data: Array.apply(null, Array(data.length)).map(() => 0),
                        stack: item+'堆叠',
                        itemStyle: {
                            normal: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                                [
                                    { offset: 0, color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 0.3)` },
                                    { offset: 1, color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 0.1)`  },
                                ], false),
                            }
                        }
                    })
                    this.seriesData.push({
                        name: '堆叠',
                        type: 'bar',
                        barWidth: 10,
                        stack: item+'堆叠',
                        data: Array.apply(null, Array(data.length)).map(() => max / 100 * 1),
                        color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 1)` 
                    })
                } else {
                    this.seriesData.push({
                        name: item,
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 12,
                        yAxisIndex: 1,
                        data: Array.apply(null, Array(data.length)).map(() => 0),
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 1)`,
                            color: new this.$echarts.graphic.RadialGradient(0, 0, .7,
                                [{
                                    offset: 0, color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 1)` // 100% 处的颜色
                                }, {
                                    offset: .85, color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 1)` // 90% 处的颜色
                                }, {
                                    offset: 1, color: `rgba(0,0,0,0)` // 100% 处的颜色
                                }], true),
                        },
                        lineStyle: {
                            color: `rgba(${colorList[index].r}, ${colorList[index].g}, ${colorList[index].b}, 1)`
                        },
                    })
                }
                index++;
            }
            let dataIndex = 0;
            for (const item of data) {
                that.xAxisData.push(moment(item.time * 1000).format('MM-DD HH:mm'));
                let total = 0;
                for(const listItem of item.data) {
                    total += (listItem.faultNum || 0);
                    that.seriesData[(listItem.type - 1)*2].data[dataIndex] = listItem.faultNum || 0
                }
                that.seriesData[6].data[dataIndex] = item.faultTrendNum;
                dataIndex++;
            };
            that.echartsFun();
            
        },
        resize() {
            this.$echarts.init(this.$refs.multipleChart).resize();
        }
    },
    watch: {
        chartData: {
            handler: function(val) {
                this.getData(val);
            },
            deep: true
        }
    }
};
</script>
<style lang="scss" scoped>
.p_chart {
    margin-top: 10px;
    height: calc(100% - 40px);
}
.btn-check-chart{
    top: 0;
}
.legend-box{
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    .legend-item{
        width: 120px;
        color: #fff;
        position: relative;
    }
    .legend-item::before{
        content: '';
        width: 10px;
        height: 10px;
        display: inline-block;
        
        background-color: #fff;
        margin-right: 8px;
        vertical-align: middle;
    }    
    .legend-item:nth-child(1)::before {
        background-color: rgb(48,227,238);
    }
    .legend-item:nth-child(2)::before {
        background-color: rgb(253, 214, 88);
    }
    .legend-item:nth-child(3)::before {
        background-color: rgb(61,145,238);
    }
    .legend-item:nth-child(4)::before {
        border-radius: 50%;
        border: 1px solid rgb(69, 241, 186);
        background-image: radial-gradient(rgb(69, 241, 186) 3px, #021919 1px);
    }
    .legend-item:nth-child(4)::after {
        content: '';
        width: 20px;
        height: 2px;
        display: inline-block;
        background-color: rgb(69, 241, 186);
        position: absolute;
        top: 9px;
        left: 22px;
    }
}
</style>