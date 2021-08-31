<template>
    <p ref="netBar" class="p_chart"></p>
</template>
<script>
import Api from '../api';
import CommonFun from "@/js/commonFun.js";
import echarts from 'echarts';
export default {
    name: "barChart",
    data() {
        return {
            companyData: {
                companyNameList: [], companyNum: [], companyPercent: []
            }
        };
    },
    computed: {
        option() {
            //['#4d2a1c', '#423f1f', '#0c4355', '#0c4941']
            const myColor1 = ['#FA7142', '#FDD658', '#30A0EE', '#47FCE2'];
            const myColor = [
                new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(250, 113, 66, .3)" }, { offset: 1, color: "rgba(250, 113, 66, 1)" }], false),
                new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(253, 214, 88, .3)" }, { offset: 1, color: "rgba(253, 214, 88, 1)" }], false),
                new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(48, 160, 238, .3)" }, { offset: 1, color: "rgba(48, 160, 238, 1)" }], false),
                new echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(71, 252, 226, .3)" }, { offset: 1, color: "rgba(71, 252, 226, 1)" }], false),
            ]
            return {
                grid: {
                    top: 10,
                    left: 110,
                    bottom: 10,
                    right: 50
                },
                tooltip:{
                    show: false,
                    formatter: '{b}:{c}'
                },
                xAxis: {
                    show: false,
                },
                yAxis: [{
                    show: true,
                    data: this.companyData.companyNameList,
                    inverse: true,
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: "#fff",
                        width: 80,
                        formatter: (value, index) => {
                            let val = value;
                            if(value.length > 4){
                                val = value.slice(0, 4) + "..."
                            } else {
                                switch(value.length) {
                                    case 1:
                                        val += "            ";
                                    break;
                                    case 2:
                                        val += "         ";
                                    break;
                                    case 3: 
                                        val += "      ";
                                    break;
                                    case 4:
                                        val += "   ";
                                    break;
                                    default: break;
                                }
                            }
                            return [`{lg|0${index + 1}}  ` + "{title|" + val + "} "].join('');
                        },
                        rich: {
                            lg: {
                                color: "#fff",
                                fontSize: "12",
                                align: "left",
                                width: 15,
                                height: 15,
                            },
                            title: {
                                align: 'left'
                            }
                        }
                    }
                }, {
                    show: true,
                    inverse: true,
                    data: this.companyData.companyPercent,
                    axisLabel: {
                        textStyle: {
                            fontSize: 12,
                            color: "#fff",
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                }],
                series: [{
                    name: "框",
                    type: "bar",
                    yAxisIndex: 1,
                    barGap: "-100%",
                    data: this.companyData.companyNum,
                    barWidth: 8,
                    itemStyle: {
                    normal: {
                        color: function (params) {
                        var num = params.dataIndex < 3 ? params.dataIndex : 3;
                        return myColor1[num];
                        },
                        opacity: 0.3
                    },
                    },
                },{
                    name: "条",
                    type: "bar",
                    yAxisIndex: 0,
                    data: this.companyData.companyPercent,
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: (params) => {
                                var num = params.dataIndex < 3 ? params.dataIndex : 3;
                                return myColor[num];
                            }
                        },
                    },
                    label: {
                        normal: {
                            show: false,
                            position: "inside",
                            formatter: "{c}%",
                        }
                    }
                }]
            }
        }
    },
    mounted() {
        let that = this;
        // that.init();
        // that.barChartTimer1 = setInterval(that.getList, 60000)
    },
    methods: {
        toPage(params) {
            let toPage = 'analyseDelayDegradation';
            // this.$store.commit('pushIncludeList', 'index');
            sessionStorage.setItem('defaultActive', toPage);
            this.$store.dispatch('setDefaultActive', toPage);
            sessionStorage.setItem('openlist', JSON.stringify(['iconfont icon-zhuanjia']))
            this.$store.dispatch('setOpenList', ['iconfont icon-zhuanjia'])
            
            setTimeout(() => this.$router.push({name: toPage, params: params}))
        },
        clearTimers() {
            clearInterval(this.barChartTimer1)
        },
        init(data) {
            let that = this;
            that.$nextTick(() => {
                that.chart = that.$echarts.init(that.$refs.netBar);
                // const res = await Api.homeDataStatistics({});
                // const data = res.data;
                that.companyData = {companyNameList: [], companyNum: [], companyPercent: []};
                for (const item of data) {
                    that.companyData.companyNameList.push(item.companyName);
                    that.companyData.companyNum.push({value: data[0].eventCount || 1, companyId: item.companyId, companyName: item.companyName});
                    that.companyData.companyPercent.push({value: item.eventCount, companyId: item.companyId, companyName: item.companyName});
                }

                that.chart.setOption(that.option);
                that.chart.off('click');
                that.chart.on('click', param => {
                    that.toPage({status: '0', companyId: param.data.companyId, companyName: param.data.companyName});
                })
            })
        },
        resize() {
            this.$echarts.init(this.$refs.netBar).resize();
        }
    }
};
</script>
<style lang="scss" scoped>
.p_chart{
    height: calc(100% - 10px);
}
</style>