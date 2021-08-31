<template>
    <div style="height: 300px; position: relative">
        <p id="multipleChart" ref="multipleChart" class="p_chart"></p>
    </div>
</template>
<script>
import CommonFun from "@/js/commonFun.js";
export default {
    name: "multipleLine",
    props: {
        data1: {
            type: Array,
            default: []
        },
        data2: {
            type: Array,
            default: []
        },
        
    },
    data() {
        return {
            yAxisData1: [],
            yAxisData2: []
        };
    },
    computed: {
        option() {
            return {
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
            }
        }
    },
    mounted() {

    },
    beforeDestroy() {
        
    },
    methods: {
        init(data1, data2) {
            let that = this;
            this.yAxisData1 = data1;
            this.yAxisData2 = data2;
            let multipleChart = that.$echarts.init(that.$refs.multipleChart);
            multipleChart.setOption(that.option);
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