<template>
    <div class="content">
        <p id="pieChart" ref="chart" class="chart"></p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            legendList: [],
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
                color: ['#ECAF2D', '#FF953F', '#24D5BC', '#2D7EE3', '#22BEFF', '#4465D0'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    textStyle: {
                        color: '#fff'
                    },
                    itemWidth: 10,
                    icon: 'circle',
                    left: 'center',
                    bottom: 0,
                    data: this.legendList
                },
                grid: {
                    bottom: 50,
                },
                series: [
                    {
                        name: '故障比例',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'inner'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.seriesData
                    }
                ]
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
                this.seriesData = [];
                this.legendList = [];
                for (const key in val) {
                    this.legendList.push(key);
                    let total = 0;
                    if (Object.hasOwnProperty.call(val, key)) {
                        const arr = val[key];
                        for (const item of arr) {
                            total += item.value
                        }
                    }
                    this.seriesData.push({name: key, value: total})
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