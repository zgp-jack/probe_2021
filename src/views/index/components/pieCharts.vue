<template>
    <div class="panel-box">
        <div id="pieChart1" ref="pieChart1"></div>
        <div id="pieChart2" ref="pieChart2"></div>
    </div>
</template>
<script>
import Api from '../api';
import CommonFun from '@/js/commonFun';
export default {
    name: 'pieCharts',
    data() {
        return {
            pieOption: {
                title: {
                    text: 0,
                    subtext: '故障总数',
                    left:'70',
                    top:'45%',
                    // textAlign: 'center',
                    textStyle:{
                        width: 120,
                        fontSize: 18,
                        color: '#16E6C9',
                        align: 'center'
                    },
                    subtextStyle:{
                        fontFamily: "微软雅黑",
                        fontSize: 12,
                        color: '#fff',
                    }
                    // text: '网络故障',
                    // left: 70,
                    // top: 10,
                    // textStyle: {
                    //     color: '#fff',
                    //     fontSize: 14
                    // }
                },
                legend: {
                    icon: 'circle',
                    x: '65%',
                    itemWidth: 7,
                    data: ['时延', '丢包', '中断'],
                    top: '35%',
                    type: 'scroll',
                    orient: 'vertical',
                    textStyle: {
                        color: '#ccc',
                        lineHeight: 15,
                    }
                },
                color: ['#ECAF2D', '#24D5BC', '#0F7AFF'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                xAxis: {
                    show: false
                },
                series: [
                    {
                        name: '故障个数',
                        type: 'pie',
                        radius: ['45%', '65%'],
                        center: ['100px', '58%'],
                        data: [
                            {name: '丢包', value: 0},
                            {name: '中断', value: 0},
                            {name: '时延', value: 0}
                        ],
                        labelLine: {
                            show: false
                        },
                        label: {
                            show: true,
                            position: 'inside',
                            formatter: '{d}%'
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        
    },
    methods: {
        toPage(url, icon, params) {
			// this.$store.commit('pushIncludeList', 'index');
            sessionStorage.setItem('defaultActive', url);
            this.$store.dispatch('setDefaultActive', url);
            sessionStorage.setItem('openlist', JSON.stringify([url]))
            this.$store.dispatch('setOpenList', [icon])
            setTimeout(() => this.$router.push({name: url, params: params}))
        },
        async init(data1, data2) {
            let that = this;
            let pieChart1 = that.$echarts.init(document.getElementById('pieChart1'));
            let pieChart2 = that.$echarts.init(document.getElementById('pieChart2'));


            let total1 = 0;
            const eventTypeList1 = ['时延', '丢包', '中断'];
            data1 = data1.splice(0, 3);
            that.pieOption.series[0].data = data1.map(item => {
                total1 += item.count;
                return {
                    eventType: item.eventType,
                    name: eventTypeList1[item.eventType - 1],
                    value: item.count
                }
            })
            total1 = total1.toString();
            that.pieOption.title.text = '';
            for(let i = total1.length; i < 5; i++) {
                that.pieOption.title.text += ' ';
            }
            that.pieOption.title.text += total1;
            that.pieOption.legend.data = eventTypeList1;
            pieChart1.setOption(that.pieOption);

            let total2 = 0;
            const eventTypeList2 = ['流量拥塞', 'CPU利用率偏高', '内存利用率偏高'];
            that.pieOption.series[0].data = data2.map(item => {
                total2 += item.count;
                if(item.type < 4) {
                    return {
                        type: item.type,
                        name: eventTypeList2[item.type - 1],
                        value: item.count
                    }
                }
            })
            total2 = total2.toString();
            that.pieOption.title.text = '';
            for(let i = total2.length; i < 5; i++) {
                that.pieOption.title.text += ' ';
            }
            that.pieOption.title.text += total2;
            that.pieOption.legend.data = eventTypeList2;
            pieChart2.setOption(that.pieOption);
            pieChart1.off('click');
            pieChart1.on('click', param => {
                if(param.componentType === 'series') {
                    that.toPage('analyseDelayDegradation', '', {eventType: [param.data.eventType], status: '0'})
                }
            })
            pieChart2.off('click');
            pieChart2.on('click', param => {
                if(param.componentType === 'series') {
                    that.toPage('analyseFlowCongestion', 'iconfont icon-jiankong', {typeList: [param.data.type], status: '0'})
                }
            })
        },
        resize() {
            this.$echarts.init(this.$refs.pieChart1).resize();
            this.$echarts.init(this.$refs.pieChart2).resize();
        }
    }
}
</script>
<style lang="scss" scoped>
#pieChart1 {
    width: 50%;
    height: 100%;
}
#pieChart2 {
    width: 50%;
    height: 100%;
}
.panel-box{
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
}
</style>