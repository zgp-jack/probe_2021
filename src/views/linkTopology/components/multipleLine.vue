<template>
    <div style="position: relative">
        <div class="multipleTitle">
            <!-- <p>设备故障</p> -->
            <p>网络故障</p>
        </div>
        <p id="lineChart1" ref="lineChart1" class="p_chart"></p>
        <div class="multipleContain">
            <p class="multiple-item">
                <span>网络故障状态</span>
                <span><b style="color: #43D782">{{trendTotalData.recovery || 0 }}</b> 已恢复</span>
                <span><b style="color: #FF5454">{{trendTotalData.error || 0}}</b> 未恢复</span>    
            </p>
        </div>
    </div>
</template>
<script>
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";
import CommonFun from "@/js/commonFun.js";
export default {
    name: "multipleLine",
    data() {
        return {
            trendStatistics: 'topography/trend',
            trendStatisticsData: {
                link: [],
                video: []
            },
            trendTotalData: {
                error: 0,
                recovery: 0
            },
            beginTime: 0,
            endTime: 0
        };
    },
    mounted() {
        let $this = this;
        
    },
    methods: {
        //manager-ipc video-fault video-ipc-online-history
        echartsFun() {
            let $this = this;
            let lineChart1 = $this.$echarts.init($this.$refs.lineChart1);
            lineChart1.setOption({
                tooltip: {
                    trigger: "axis",
                    formatter: "{a}<br/>{c}个",
                },
                grid: {
                    left: 25,
                    right: 20,
                    top: 30,
                    bottom: 0,
                    containLabel: true,
                },
                calculable: true,
                xAxis: [
                {
                    type: "time",
                    inverse: true,
                    min: $this.beginTime,
                    max: $this.endTime,
                    interval: 600000,
                    splitNumber: 6,
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#828E9F", //y轴颜色
                            opacity: .5
                        },
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        formatter: (value, index) => {
                            return (6 - (index < 0 ? 0 : index)) * 10;
                        },
                        textStyle: {
                            color: "#CCCCCC",
                            fontSize: 13,
                        },
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: "#828E9F", //y轴颜色
                            opacity: .5
                        }
                    },
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
                        //y轴上的y轴线条相关设置
                        show: true,
                        lineStyle: {
                            color: "#828E9F",
                            opacity: .5
                        },
                    },
                    axisLine: {
                        //y轴的相关设置
                        lineStyle: {
                            color: "#828E9F", //y轴颜色
                            opacity: .5
                        },
                    },
                    axisLabel: {
                        //y轴的标签相关设置
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
                    smooth: true,
                    showSymbol: $this.trendStatisticsData.link < 2,
                    itemStyle: { normal: { color: "#22C3FF" } },
                    areaStyle: {
                        normal: {
                            color: new $this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [
                                { offset: 0, color: "rgba(34, 195, 255, 0.3)" },
                                { offset: 1, color: "rgba(34, 195, 255, 0.1)" },
                            ], false)
                        }
                    },
                    data: $this.trendStatisticsData.link,
                },{
                    name: "设备故障",
                    type: "line",
                    smooth: true,
                    showSymbol: $this.trendStatisticsData.video < 2,
                    itemStyle: { normal: { color: "#FDD658" } },
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
                            { offset: 0, color: "rgba(253, 214, 88, 0.3)" },
                            { offset: 1, color: "rgba(253, 214, 88, 0.1)" },
                        ],
                        false
                        )
                    },
                    },
                    data: $this.trendStatisticsData.video,
                }],
            });
        },
        init(params = {}) {
            let $this = this;
            $this.endTime = +new Date();
            $this.beginTime = $this.endTime - 60*60*1000;
            
            let param = JSON.parse(JSON.stringify(params));
            param.beginTime = parseInt($this.beginTime / 1000);
            param.endTime = parseInt($this.endTime / 1000);

            axiosHttp.post(baseUrl.BASEURL + $this.trendStatistics, param).then((res) => {
                const data = res.data;
                if(data.status == 1){
                    if (!data.data) {
                        return;
                    }
                    let count = 0;
                    $this.trendStatisticsData.link = data.data.linkTrend.map(item => {
                        count += item.count;
                        return {value: [item.minute, item.count]}
                    });
                    this.trendTotalData.recovery = data.data.linkRecovery;
                    this.trendTotalData.error = data.data.linkError;
                    // this.trendTotalData.error = count;
                    // $this.trendStatisticsData.video = data.data.devcieTrend.map(item => {
                    //     return {value: [item.minute, item.count]}
                    // });
                    $this.echartsFun();
                } else {
                    CommonFun.responseError(data, $this);
                }
            })
        }
    },
    beforeDestroy() {
        let $this = this;
    }
};
</script>
<style lang="scss" scoped>
@mixin before-content {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
}
.p_chart {
  height: 170px;
  margin-top: 10px;
}
.multipleTitle {
    font-size: 12px;
    color: #ccc;
    text-align: right;
    margin:10px 20px 0 0;
    position: absolute;
    right: 0;
    top: 0;
    p{
        display: inline-block;
        margin-left: 20px;
    }
    &>p::before{
        @include before-content;
        margin-right: 10px;
        background-color: #FDD658;
    }
    &>p:last-child::before {
        background-color: #22C3FF;
    }
}
.multipleContain {
    font-size: 12px;
    color: #666666;
    margin-left: 0;
    margin-top: 10px;
    .multiple-item {
        display: flex;
        justify-content: space-between;
    }
    .multiple-item span {
        display: inline-block;
        width: 90px;
        color: #fff;
        // flex: 1;
    }
    // .multiple-item span:nth-child(2n)::before {
    //     @include before-content;
    //     margin-right: 10px;
    //     background-color: #15B4FE;
    // }
    // .multiple-item span:nth-child(3n)::before {
    //     @include before-content;
    //     margin-right: 10px;
    //     background-color: #FF2E2E;
    // }
}
</style>