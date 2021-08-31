<template>
    <div style="height: 100%; position: relative" ref="multipBox">
        <!-- <div class="multipleTitle">
            <p>视图故障</p>
            <p>链路故障</p>
        </div> -->
        <!-- :list="faultList" -->
        <!-- <DragBox :list="faultList" :box="box" @clickEvent="toPage"></DragBox> -->
        <p id="multipleChart" ref="multipleChart" class="p_chart"></p>
    </div>
</template>
<script>
import Api from '../api'
import CommonFun from "@/js/commonFun.js";
import DragBox from '@/components/dragBox.vue';
export default {
  components: { DragBox },
    name: "multipleLine",
    data() {
        return {
            faultList: [],
            box: {
                width: 0,
                height: 0
            },
            option: {
                color: ["#15B4FE"],
                tooltip: {
                    trigger: "axis",
                    formatter: param => {
                        //<br/>${param[0].dataIndex}
                        let str = '';
                        for (const item of param) {
                            str += `${item.seriesName}: ${item.value}个<br/>`;
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
                    data:['网络故障', '设备故障']
                },
                grid: {
                    left: 30,
                    right: 0,
                    top: 40,
                    bottom: 10,
                    containLabel: true,
                },
                calculable: true,
                xAxis: [
                {
                    type: "category",
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
                    axisTick: { show: false },
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
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
                        show: false,
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
                    name: "网络故障",
                    type: "line",
                    symbolSize: 6,
                    showSymbol: false,
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
                    data: [],
                },{
                    name: "设备故障",
                    type: "line",
                    symbolSize: 6,
                    showSymbol: false,
                    itemStyle: { normal: { color: "#FDD658" } },
                    areaStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            { offset: 0, color: "rgba(253, 214, 88, 0.3)" },
                            { offset: 1, color: "rgba(253, 214, 88, 0.1)" },
                        ],
                        false
                        )
                    },
                    },
                    data: [],
                }],
            }
        };
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        
    },
    methods: {
        toPage(item) {
            if(item.error && item.typeName === '网络故障') {
                let toPage = 'analyseDelayDegradation';
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                sessionStorage.setItem('openlist', JSON.stringify(['iconfont icon-zhuanjia']))
                this.$store.dispatch('setOpenList', ['iconfont icon-zhuanjia'])
                setTimeout(() => this.$router.push({name: toPage, params: {status: '0'}}))
            }
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
            multipleChart.setOption(that.option);
        },
        async init(params = {}) {
            this.box = {
                width: this.$refs.multipBox.offsetWidth,
                height: this.$refs.multipBox.offsetHeight
            }
            params = Object.assign({eventType: 3, taskType: 1}, params);
            this.faultList = [];
            let $this = this;
            const res = await Api.homeWebFaultDistribution(params);
            const data = res.data;
            if(data.status == 1) {
                const obj = data.data;
                this.option.series[0].data = obj.data;
                this.faultList.push({typeName: '网络故障', recovery: obj.hadRecovered, error: obj.unRecovered});
            }
            const resDevice = await Api.deviceDayFaultStatistics({});
            const dataDevice = resDevice.data;
            if(dataDevice.status == 1){
                const obj = dataDevice.data;
                this.option.series[1].data = obj.data;
                this.faultList.push({typeName: '设备故障', recovery: obj.hadRecovered, error: obj.unRecovered});
            }
            $this.echartsFun();
        },
        resize() {
            this.box = {
                width: this.$refs.multipBox.offsetWidth,
                height: this.$refs.multipBox.offsetHeight
            }
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
  height: 100%;
}
.multipleTitle {
    font-size: 12px;
    color: #ccc;
    text-align: right;
    margin: 10px 20px 0 0;
    position: absolute;
    right: 0;
    p{
        display: inline-block;
        margin-left: 20px;
    }
    &>p::before{
        @include before-content;
        margin-right: 10px;
        background-color: #FA7142;
    }
    &>p:last-child::before {
        background-color: rgb(21, 180, 254);
    }
}
</style>