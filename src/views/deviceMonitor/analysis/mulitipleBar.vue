<template>
    <div class="content">
        <p id="mulitipleBarChart" ref="chart" class="chart"></p>
    </div>
</template>
<script>
import commonFun from '@/js/commonFun';
export default {
    data() {
        return {
            yCategoryData: [],
            legendList: ['时延劣化', '丢包劣化', '中断劣化'],
                        // commonFun.getDataDictionaryChildrenListData(10).map(item => {
                        //     return item.name;
                        // }),//['条纹噪声', '雪花噪声', '画面遮挡', '亮度异常', '画面模糊', '视频断流', '色度异常', '花屏异常'],
            seriesData1: [],
            seriesData2: [],
            seriesData3: [],
            seriesData4: [],
            seriesData5: [],
            seriesData6: [],
            seriesData7: [],
            seriesData8: [],
            seriesData: []
        }
    },
    props: {
        chartData: {
            type: Object
        }
    },
    computed: {
        option() {
            return {
                color: ['#3AC5D5', '#FDD658', '#FFA73F', '#E9DF8C', '#FFA73F', '#6DA95D', '#28A6FF', '#29897A'], //, '#269AAB', '#F4C433', '#E16724'
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { 
                        type: 'shadow'
                    }
                },
                legend: {
                    orient: 'horizontal',
                    textStyle: {
                        color: '#fff',
                        lineHeight: 20
                    },
                    itemWidth: 10,
                    itemHeight: 10,
                    itemGap: 25,
                    icon: 'rect',
                    left: 'center',
                    bottom: 0,
                    data: this.legendList,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: 20,
                    bottom: 50,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .2
                        },
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
                },
                yAxis: {
                    type: 'category',
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisLine: {
                        show: true,
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
                    axisTick: { show: false },
                    data: this.yCategoryData
                },
                series: this.seriesData
                // [
                //     { name: '条纹噪声', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData1
                //     },
                //     { name: '雪花噪声', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData2
                //     },
                //     { name: '画面遮挡', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData3
                //     },
                //     { name: '亮度异常', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData4
                //     },
                //     { name: '画面模糊', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData5
                //     },
                //     { name: '视频断流', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData6
                //     },
                //     { name: '色度异常', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData7
                //     },
                //     { name: '花屏异常', type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                //         label: {
                //             show: true,
                //             position: 'insideRight'
                //         },
                //         data: this.seriesData8
                //     }
                // ]
            }
        }
    },
    mounted() {
    },
    methods: {
        echartsFun() {
            let that = this;
            let chart = that.$echarts.init(that.$refs.chart);
            chart.setOption(that.option);
        },
        getData() {

        },
    },
    watch: {
        chartData: {
            handler: function(val) {
                this.yCategoryData = [];
                this.seriesData = [];
                this.legendList.map(item => {
                    this.seriesData.push({
                        name: item, type: 'bar', stack: '总量', barWidth: 7, barGap: 2, barCategoryGap: 2,
                        label: {
                            show: false,
                            position: 'insideRight'
                        },
                        data: [0, 0, 0, 0, 0]
                    })
                })
                for (const key in val) {
                    this.yCategoryData.push(key);
                }
                for (const key in val) {
                    if (Object.hasOwnProperty.call(val, key)) {
                        const arr = val[key];
                        for (const item of arr) {
                            if(!item.value) {
                                continue;
                            }
                            let ketIndex = this.seriesData.findIndex(legend => legend.name === item.key);
                            let dataIndex = this.yCategoryData.findIndex(cate => cate === key);
                            
                            if(ketIndex >= 0) {
                                this.seriesData[ketIndex].data[dataIndex] = item.value;
                            }
                        }
                    }
                }
                this.echartsFun();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    height: 360px;
    width: 100%;
}
.chart {
    margin-top: 10px;
    height: calc(100% - 30px);
}
</style>
