<template>
    <div class="pie-content">
        <div class="chart-box">
            <div ref="chart" class="radar-chart"></div>
        </div>
        <div class="chart-legend">
            <p class="fault-type" v-if="this.theme!=='blue'">
                故障等级：
                <span :style="{color: defaultData.name === '高'?'#FC3601':defaultData.name === '中'?'#FFA800':'#00A9F4'}">{{defaultData.name}}</span>
            </p>
            <p class="fault-type" v-else>{{defaultData.name}}</p>
            <p class="fault-total" :style="{color: this.theme==='blue'?'#22C3FF':'#00D4CB'}">{{total}}</p>
            <p class="fault-total-title">故障总数</p>
        </div>
    </div>
</template>
<script>
    import CommonFun from '@/js/commonFun.js';
    export default {
        name: 'radarChart',
        props: {
            defaultData: {
                type: Object,
                default: function() {
                    return {
                        name: 'CPU利用率偏高', 
                        data: [
                            {companyName: '双流政法委', count: 10},
                            {companyName: '综治办公式', count: 20},
                            {companyName: '永乐社区', count: 30},
                        ]
                    }
                }
            },
            theme: {
                type: String,
                default: 'blue'
            }
        },
        data() {
            return {
                total: 0,
                color1: '#083843',
                color2: '#26b3e8',
                color3: ['rgba(34, 195, 255, .5)', 'rgba(34, 195, 255, .4)', 'rgba(34, 195, 255, .3)', 'rgba(34, 195, 255, .2)', 'rgba(34, 195, 255, .1)'],
            }
        },
        computed: {
            option() {
                let that = this;
                return {
                    title: {
                        text: '',
                        show: false
                    },
                    tooltip: {},
                    grid: {
                        top: 40
                    },
                    radar: {
                        shape: 'circle',
                        radius: '65%',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: 'transparent'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: this.color1
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: this.color1
                            }
                        },
                        splitArea: {
                            show: true,
                            areaStyle: {
                                color: this.color3
                            }
                        },
                        indicator: []
                    },
                    series: [{
                        name: '故障占比',
                        type: 'radar',
                        label:{
                            show: true,
                            verticalAlign: 'middle',
                            color: '#fff',
                            formatter: param => {
                                if(param.value === 0) {
                                    return ''
                                }
                                return `${(param.value / this.total * 100).toFixed(0)}%`
                            }
                        },
                        itemStyle: {
                            borderWidth: 0,
                            borderColor: this.color2,
                            color: this.color2,
                        },
                        lineStyle: {
                            color: this.color2
                        },
                        areaStyle: {
                            color: this.color2,
                            opacity: 1
                        },
                        data: [
                            {
                                value: [],
                                name: '故障占比'
                            }
                        ]
                    }]
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(param = {}) {
                let max = 1;
                this.total = 0;

                if(this.defaultData.data.length <= 0) {
                    this.defaultData.data = [{companyName: '', count: 0}]
                }

                this.defaultData.data.map(item => {
                    if(item.count > max) {
                        max = item.count;
                    }
                })
                // max += 5;
                this.option.radar.indicator = this.defaultData.data.map(item => {
                    return {name: item.companyName, max: max};
                })
                this.option.series[0].data[0].value = this.defaultData.data.map(item => {
                    this.total += item.count;
                    return item.count;
                })
                this.$nextTick(() => {
                    let myChart = this.$echarts.init(this.$refs.chart);
                    //使用制定的配置项和数据显示图表
                    if(this.defaultData.data.length > 0) {
                        myChart.setOption(this.option);
                    }
                })
            },
            resize() {
                this.$echarts.init(this.$refs.chart).resize();
            }
        },
        watch: {
            theme: {
                handler: function(val) {
                    if(val === 'blue') {
                        this.color1 = '#083843';
                        this.color2 = '#26b3e8';
                        this.color3 = ['rgba(34, 195, 255, .5)', 'rgba(34, 195, 255, .4)', 'rgba(34, 195, 255, .3)', 'rgba(34, 195, 255, .2)', 'rgba(34, 195, 255, .1)'];
                    } else {
                        this.color1 = '#083843';
                        this.color2 = '#29B3AD';
                        this.color3 = ['rgba(0, 212, 203, .5)', 'rgba(0, 212, 203, .4)', 'rgba(0, 212, 203, .3)', 'rgba(0, 212, 203, .2)', 'rgba(0, 212, 203, .1)'];
                    }
                },
                immediate: true
            },
            'defaultData.data': {
                handler: function(val) {
                    this.init();
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss" scoped>
.pie-content{
    display: flex;
    .chart-legend{
        margin: 30px 0 0 40px;
        width: 40%;
        height: 220px;
        flex-grow: 0;
        line-height: 24px;
        .fault-type{
            color: #fff;
            font-size: 14px;
            font-weight: medium;
            margin-top: 60px;
            span{
                font-size: 14px;
            }
        }
        .fault-total{
            color: #22C3FF;
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
        .fault-total-title{
            color: #ccc;
            font-size: 12px;
            font-weight: normal;
        }
    }
    .chart-box{
        margin: 20px 0 20px 20px;
        width: 60%;
        height: 220px;
        flex-grow: 1;
        .radar-chart{
            width: 100%;
            height: 220px;
        }
    }
}

</style>
