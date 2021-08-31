<template>
    <div class="lineChart">
      <div class="lineChart-top">
        <p class="lineChart-unit">单位：{{unit}}</p>
        <h5 class="lineChart-title">{{unitName + ': ' + unitIp}}</h5>
        <span></span>
      </div>
      <div class="tu" id="tu6" ref="flowTreendtu6"></div>
    </div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
export default {
    name: 'flowTrendChart',
    data() {
        return {
            defaultData: [],
            unit: 'bps',
            unitIp: '',
            unitName: ''
        }
    },
    props:['echarData'],
    methods: {
        echartsFun() {
            let $this = this;
            $this.chart = $this.$echarts.init($this.$refs.flowTreendtu6);
            let option6 = {
                // backgroundColor:'#050d19',
                title: {
                textStyle: {
                    color: "#6a9cd5",
                },
                // text:'量表测评',
                left: "center",
                },

                tooltip: {
                //鼠标悬浮弹出提示框
                trigger: "axis", //提示框弹出的触发时间，折线图和柱状图为axis
                // formatter: "{a}<br/>{c}", //提示框提示的信息，{a}series内的名字，{b}为块状的名字，{c}为数值
                formatter: param => {
                        let str = `${CommonFun.dateFormat(param[0].value[0], 'YYYY-MM-DD HH:mm:ss')}<br/>`;
                        for (const item of param) {
                            str += `${item.seriesName}: ${item.value[1]}${this.unit}<br/>`;
                        }
                        return str
                    },
                },
                dataZoom: [
                    {
                        type: "slider",
                        show: true,
                        xAxisIndex: [0],
                        backgroundColor: "#082C2B",
                        fillerColor: '#145B58',
                        borderColor: 'none',
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                ],
                grid: {
                //统计图距离边缘的距离
                top: "50px",
                left: "8%",
                right: "5%",
                bottom: "60px",
                },
                xAxis: [
                {
                    //x轴
                    type: "time", //数据类型为不连续数据
                    boundaryGap: false, //坐标轴两边是否留白
                    // interval: 120000,
                    splitLine: {
                    show: false,
                    },
                    axisLine: {
                    //坐标轴轴线相关设置。数学上的x轴
                    show: false,
                    lineStyle: {
                        color: "#ccc", //x轴颜色
                        // opacity: .5
                    },
                    },
                    axisLabel: {
                    //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: "#ccc",
                    },
                    formatter: (value, index) => {
                      return CommonFun.formatterTimeConversion( {beginTime: value/1000} , {label:'开始时间'});
                    }
                    },
                    axisTick: { show: false }, //刻度点数轴
                },
                ],
                yAxis: [
                {
                    //y轴的相关设置
                    type: "value", //y轴数据类型为连续的数据
                    // name: '速率/Bps', // this.unit
                    nameTextStyle: {
                    color: '#ccc',
                    align: 'center'
                    },
                    splitNumber: 5, //y轴上的刻度段数
                    splitLine: {
                    //y轴上的y轴线条相关设置
                    show: true,
                    lineStyle: {
                        color: "#828E9F",
                        opacity: .5
                    },
                    },
                    axisLine: {
                    //y轴的相关设置
                    show: false,
                    lineStyle: {
                        color: "#828E9F", //y轴颜色
                        opacity: .5
                    },
                    },
                    axisLabel: {
                    //y轴的标签相关设置
                    textStyle: {
                        color: "#ccc",
                    },
                    },
                    axisTick: { show: false }, //刻度点数轴
                },
                ],
                series: [
                {
                    name: "流量",
                    type: "line", //统计图类型为折线图
                    // smooth: true, //是否平滑曲线显示
                    symbolSize: 4, //数据点的大小，[0,0]//b表示宽度和高度
                    symbol: 'circle',
                    showSymbol: this.defaultData.length<3,
                    showSymbol: false,
                    itemStyle: {
                    color: '#fff',
                    borderColor: '#17C6E1',
                    borderWidth: 2,
                    // shadowBlur: 10,
                    // shadowColor: '#17C6E1'
                    },
                    lineStyle: {
                    //线条的相关设置
                    normal: {
                        color: "RGBA(34, 195, 255, 1)", // 线条颜色
                    },
                    },
                    areaStyle: {
                    //区域填充样式
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new $this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            { offset: 0, color: "RGBA(34, 195, 255, 1)" },
                            { offset: 0.8, color: "RGBA(8, 42, 53, .2)" },
                        ],
                        false
                        ),

                        //shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                        //shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    },
                    },
                    data: this.defaultData,
                },
                ],
            };
            $this.chart.setOption(option6);
        },
        initData(defaultD) {
            let data = defaultD.fluxData
            let maxVal = 0;
            let unitNum = 1;
            let iSpace = 1;
            this.unitIp = defaultD.ip;
            this.unitName = defaultD.name;
            for(let i=0;i<data.length;i+=iSpace){
                if(data[i].inputSize + data[i].outputSize > maxVal) {
                    maxVal = data[i].inputSize + data[i].outputSize;
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
            for(let i=0;i<data.length;i+=iSpace){
                let item = {name: '流量', value: [data[i].taskTime*1000, ((data[i].inputSize + data[i].outputSize)/unitNum || 0).toFixed(2), this.unit]};
                this.defaultData.push(item);
            }
            this.echartsFun()
        }
    },
    mounted() {
        this.initData(this.echarData);
    }
}
</script>
<style scoped>
.lineChart-top {
  position: absolute;
  top: 15px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  padding: 0 5%;
  z-index: 10;
}
.lineChart {
    position: relative;
    width: 100%;
    /* padding: 20px 0; */
}
.tu{
  height: 250px;
  width: 100%;
}
.lineChart-unit{
  color: #ccc;
}
.lineChart-title {
  color: #fff;
}
.lineChart-icon {
  color: #00D9D2;
  cursor: pointer;
}
.lineChart-icon .el-icon-view{
  vertical-align: bottom;
  margin-right: 7px;
}
</style>