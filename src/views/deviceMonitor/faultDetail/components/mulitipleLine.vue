<template>
    <div style="height: 260px; position: relative">
        <p ref="multipleChart" class="p_chart"></p>
    </div>
</template>
<script>
import CommonFun from "@/js/commonFun.js";
export default {
    name: "multipleLine",
    props: {
        defaultData: {
            type: [Array, Object]
        }
    },
    computed: {
        option() {
            return{
                title: {
                    text: this.data.name,
                    show: true,
                    left: 'center',
                    top: 15,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 'lighter'
                    }
                },
                tooltip: {
                    trigger: "axis",
                    formatter: param => {
                        let unit = this.unit;
                        return `${param[0].seriesName}: ${param[0].value[1]}${unit}<br/>${CommonFun.formatterTimeConversion({beginTime:param[0].value[0]/1000}, {label:'开始时间'})}`
                    },
                },
                grid: {
                    left: 30,
                    right: 40,
                    top: 50,
                    bottom: 10,
                    containLabel: true,
                },
                calculable: true,
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
                    axisTick: { show: false },
                    formatter: (value, index) => {
                        return CommonFun.formatterTimeConversion( {beginTime: value/1000} , {label:'开始时间'});
                    }
                }],
                yAxis: [
                {
                    type: "value",
                    name: '单位：' + this.unit,
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
                series: [{
                    name: "传输速率",
                    type: "line",
                    symbolSize: 6,
                    showSymbol: this.data.fluxData.length < 2,
                    itemStyle: { normal: { color: "#22C3FF" } },
                    areaStyle: {
                        normal: {
                            color: new this.$echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                { offset: 0, color: "rgba(34, 195, 255, 0.3)" },
                                { offset: 1, color: "rgba(34, 195, 255, 0.1)" },
                            ],
                            false
                            )
                        }
                    },
                    data: this.data.fluxData,
                }],
            }
        }
    },
    data() {
        return {
            data: {
                name: 'name',
                fluxData: []
            },
            
        };
    },
    mounted() {
        this.data.name = `${this.defaultData.name} ${this.defaultData.ip}`;

        const list = this.defaultData.fluxData;

        let maxVal = 0;
        let unitNum = 1;
        let iSpace = 1;
        for(let i = 0; i < list.length; i += iSpace) {
            const size = list[i].inputSize + list[i].outputSize;
            if(size > maxVal) {
                maxVal = size;
            }
        }
        if(maxVal > 1024 * 1024 * 1024){
            this.unit = 'Gbps';unitNum = 1024*1024*1024;
        }else if(maxVal > 1024 * 1024){
            this.unit = 'Mbps';unitNum = 1024*1024;
        }else if(maxVal >1024){
            this.unit = 'Kbps';unitNum=1024;
        }else{
            this.unit = 'bps'
        }
        for(let i = 0; i < list.length; i += iSpace) {
            const size = (list[i].inputSize || 0) + (list[i].outputSize || 0);
            let item = {name: '速率', value: [list[i].taskTime * 1000, Math.floor((size/unitNum).toFixed(2))]};
            this.data.fluxData.push(item);
        }
        this.$nextTick(() => {
            this.init();
        })
    },
    beforeDestroy() {
        
    },
    methods: {
        init() {
            let multipleChart = this.$echarts.init(this.$refs.multipleChart);
            multipleChart.setOption(this.option);
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
  height: calc(100% - 20px);
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