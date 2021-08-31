<template>
    <div class="bar-chart-box">
        <template v-if="hasCheckBtn">
            <div v-for="item,index of checkTemp" v-show="item.actived" :key="index" class="btn-check-chart" size="mini" type="text" @click="revertMap(item)">
                {{item.name}}
            </div>
        </template>
        <p ref="netBar" class="p_chart"></p>
    </div>
</template>
<script>
import commonFun from '../../../js/commonFun';
import Bus from '../bus';
const myColor1 = ['#FA7142', '#FDD658', '#30A0EE',  '#47FCE2'];
export default {
    name: "barChart",
    props: {
        type: {
            type: [Number, String]
        },
        hasCheckBtn: {
            type: Boolean,
            default: true
        },
        yType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checkTemp: [{name: '机构', value: 1, actived: true}, {name: '接口', value: 2}],
            myColor: [
                new this.$echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(250, 113, 66, .3)" }, { offset: 1, color: "rgba(250, 113, 66, 1)" }], false),
                new this.$echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(253, 214, 88, .3)" }, { offset: 1, color: "rgba(253, 214, 88, 1)" }], false),
                new this.$echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(48, 160, 238, .3)" }, { offset: 1, color: "rgba(48, 160, 238, 1)" }], false),
                new this.$echarts.graphic.LinearGradient(
                0, 0, 1, 0, [{ offset: 0, color: "rgba(71, 252, 226, .3)" }, { offset: 1, color: "rgba(71, 252, 226, 1)" }], false),
            ],
            yAxisData1: [],
            yAxisData2: [],
            seriesData: []
        };
    },
    mounted() {
        let that = this;
        Bus.$off(`initBarChart${that.type}`).$on(`initBarChart${that.type}`, arr => {
            that.yAxisData1 = [];
            that.yAxisData2 = [];
            that.seriesData = [];
            if(Object.prototype.toString.call(arr) === '[object Array]' && arr.length) {
                let maxVal = this.yType === 'parcent' ? 100 : (arr[0].number || 1);
                for (let item of arr) {
                    that.yAxisData1.push(item.name);
                    that.yAxisData2.push(item.number || 0);
                    that.seriesData.push(maxVal);
                }
                
                that.init()
            }
        });
    },
    computed: {
        option(){
            return{
                grid: {
                    top: 30,
                    left: 110,
                    right: 80,
                    bottom: 10
                },
                tooltip:{
                    formatter: param => {
                        if(param.seriesName == '框') {
                            return '';
                        }
                        let methods = 'formatterParcentByKey';
                        switch(this.yType) {
                            case 'time':
                                methods = 'formatterContinuedTimeByKey';
                                break;
                            case 'parcent':
                                methods = 'formatterParcentByKey';
                                break;
                            default: 
                                return param.name + '：' + param.data;
                            break;
                        }
                        return param.name + '：' + commonFun[methods](param, {property: 'data'});
                    }
                },
                xAxis: {
                    show: false,
                },
                yAxis: [{
                    show: true,
                    data: this.yAxisData1,
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
                    data: this.yAxisData2,
                    width: 120,
                    axisLabel: {
                        formatter: data => {
                            let methods = 'formatterParcentByKey';
                            switch(this.yType) {
                                case 'time':
                                    methods = 'formatterContinuedTimeByKey';
                                    break;
                                case 'parcent':
                                    methods = 'formatterParcentByKey';
                                    break;
                                default: 
                                    return data;
                                break;
                            }
                            return commonFun[methods]({data: data}, {property: 'data'});
                        },
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
                    data: this.seriesData,
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                            var num = params.dataIndex < 3 ? params.dataIndex : 3;
                            return myColor1[num];
                            },
                            opacity: 0.3
                        }
                    }
                },{
                    name: "条",
                    type: "bar",
                    yAxisIndex: 0,
                    data: this.yAxisData2,
                    barWidth: 8,
                    itemStyle: {
                        normal: {
                            color: (params) => {
                                var num = params.dataIndex < 3 ? params.dataIndex : 3;
                                return this.myColor[num];
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
    methods: {
        initPage() {
            this.checkTemp = [{name: '机构', value: 1, actived: true}, {name: '接口', value: 2}];
        },
        init() {
            let that = this;
            if(that.$refs.netBar) {
                that.chart = that.$echarts.init(that.$refs.netBar);
                that.chart.setOption(that.option);
            }
        },
        revertMap(item) {
            this.checkTemp.forEach((res, inx) => {
                res.actived = false;
                this.$set(this.checkTemp, inx, res);
            })

            let ins = this.checkTemp.findIndex(res => res.value === item.value);
            ins++;
            if(ins >= this.checkTemp.length) {
                ins = 0;
            }
            this.checkTemp[ins].actived = true;
            this.$set(this.checkTemp, ins, this.checkTemp[ins]);
            Bus.$emit('barChartChecked', {type: this.type, pattern: this.checkTemp[ins].value});
        },
        resize() {
            this.$echarts.init(this.$refs.netBar).resize();
        }
    }
};
</script>
<style lang="scss" scoped>
.bar-chart-box{
    height: 220px;
    width: 100%;
    position: relative;
}
.p_chart{
    height: 100%;
}
</style>