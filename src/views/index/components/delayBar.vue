<template>
    <div id="delayBar"></div>
</template>
<script>
import Api from '../api';
export default {
    data() {
        return {
            barOption: {
                title: {
                    show: false,
                },
                grid: {
                    top: 40,
                    right: 0
                },
                xAxis: {
                    show: true,
                    type: 'category',
                    axisLabel: {
                        color: '#828E9F',
                        rotate: 35,
                        fontSize: 10,
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
                    data: ['0-3ms', '3-10ms', '10-20ms', '20-50ms', '50-75ms', '75-100ms', '100-150ms', '150-200ms', '200-300ms', '300ms以上']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#828E9F',
                        fontSize: 11,
                    },
                    splitLine: {
                        //y轴上的y轴线条相关设置
                        show: true,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#828E9F'
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                },
                series: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    type: 'bar',
                    barWidth: 10,
                    label: {
                        color: '#828E9F',
                        position: 'top',
                        show: true
                    },
                    emphasis: {
                        label:{
                            color:  "#29B3AD",
                        },
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [
                                { offset: 0, color: "#00FFD8" },
                                { offset: 1, color: "#00FFF6" },
                            ], false),
                            shadowColor: "#00FFD8",
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        barBorderRadius: [5, 5, 0, 0],
                        color: param => {
                            return this.checkIndex === param.dataIndex 
                            ? new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: "#00FFD8" },
                                { offset: 1, color: "#00FFF6" },
                            ], false) : "#29B3AD";
                        },
                        shadowColor: "#00FFD8",
                        shadowBlur: param => {
                            return this.checkIndex == param.dataIndex ? 10 : 0;
                        },
                    }
                }]
            },
            checkIndex: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        })
    },
    methods: {
        async init(param = {}) {
            param = Object.assign({eventType: 1, taskType: 1}, param);
            let that = this;
            let delayBar = this.$echarts.init(document.getElementById('delayBar'));
            let res = await Api.homeWebFaultDistribution(param);
            const dataRes = res.data;
            if(dataRes.status === 1) {
                this.barOption.series[0].data = dataRes.data;
            }
            delayBar.setOption(this.barOption);
            // delayBar.off('click');
            // delayBar.on('click', param => {
            //     if(param.componentType === 'series') {
            //         if(that.checkIndex == -1) {
            //             that.checkIndex = param.dataIndex;
            //         } else {
            //             that.checkIndex = -1;
            //         }
            //         delayBar.setOption(that.barOption);
            //     }
            // })
        },
        resize() {
            this.$echarts.init(document.getElementById('delayBar')).resize();
        }
    }
}
</script>
<style lang="scss" scoped>
#delayBar {
    width: 100%;
    height: 100%;
}
</style>