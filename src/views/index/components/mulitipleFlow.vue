<template>
    <div style="height: 100%; position: relative" v-loading="loading">
        <el-popover
            ref="popover"
            placement="bottom"
            width="360"
            trigger="click">
            <el-table :data="gridData" row-key="interfaceId" ref="table" height="200" @select="selectAddOrEdit">
                <el-table-column type="selection" reserve-selection width="55"></el-table-column>
                <el-table-column width="80" property="ip" label="IP"></el-table-column>
                <el-table-column property="name" label="名称" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="popup-buts">
                <el-button class="popup-but popup-but-submit" @click="handleSubmit">确定</el-button>
                <el-button class="popup-but popup-but-cancel" @click="handleClose">重置</el-button>
            </div>
            <span slot="reference" class="check-interface">{{checkStr || '请选择'}}</span>
        </el-popover>
        <p id="multipleChart" ref="multipleChart" class="p_chart"></p>
    </div>
</template>
<script>
import Api from '../api'
import CommonFun from "@/js/commonFun.js";
export default {
    name: "multipleLine",
    data() {
        return {
            loading: false,
            maxVal: 0,
            unitNum: 0,
            gridData: [],
            checkItem: [],
            checkStr: '请选择',
            trendStatisticsData: {
                link: [],
                video: []
            },
            unit: 'Kbps',
            rgbaList: [{r: 67, g: 215, b: 130}, {r: 27, g: 153, b: 241}, {r: 253, g: 214, b: 88}],
            seriesData: {
                name: "",
                type: "line",
                symbolSize: 6,
                showSymbol: false,
                itemStyle: { normal: { color: "#29B3AD" } },
                areaStyle: {
                    normal: {
                        color: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            { offset: 0, color: "rgba(41, 179, 173, 0.3)" },
                            { offset: 1, color: "rgba(41, 179, 173, 0.1)" },
                        ],
                        false
                        )
                    },
                },
                data: [],
            },
            seriesList: []
        };
    },
    computed: {
        option() {
            return {
                color: ["#15B4FE"],
                tooltip: {
                    trigger: "axis",
                    appendToBody: true,
                    formatter: param => {
                        let str = `${CommonFun.dateFormat(param[0].value[0], 'YYYY-MM-DD HH:mm:ss')}<br/>`;
                        for (const item of param) {
                            str += `${item.marker}${item.seriesName}: ${item.value[1]}${this.unit}<br/>`;
                        }
                        return str
                    },
                },
                grid: {
                    left: 30,
                    right: 30,
                    top: 40,
                    bottom: 20,
                    containLabel: true,
                },
                calculable: true,
                xAxis: [
                {
                    type: "time",
                    min: new Date() - 3600000,
                    max: new Date(),
                    interval: 300000,
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
                        formatter: (value, index) => {
                            return (12 - (index < 0 ? 0 : index)) * 5;
                        },
                    },
                    axisTick: { show: false }
                }],
                yAxis: [
                {
                    type: "value",
                    name: '单位/' + this.unit,
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
                series: this.seriesList,
            }
        }
    },
    mounted() {
        this.getList();
    },
    beforeDestroy() {
        
    },
    methods: {
        init() {
            let multipleChart = this.$echarts.init(this.$refs.multipleChart);
            multipleChart.clear();
            // that.option.series = JSON.parse(JSON.stringify(that.seriesList));

            multipleChart.setOption(this.option);
        },
        getList(params = {}) {
            let $this = this;
            let param = {};
            let check = sessionStorage.getItem('interfaceRowSelection');
            Api.interfaceDropDown(param).then((res) => {
                const data = res.data;
                if(data.status == 1){
                    this.gridData = data.data;
                    this.$nextTick(() => {
                        if(check) {
                            check = JSON.parse(check);
                        } else {
                            check = [this.gridData[0]];
                        }
                        for (let item of check) {
                            for(let item1 of this.gridData) {
                                if(item.interfaceId === item1.interfaceId) {
                                    $this.$refs.table.toggleRowSelection(item1, true);
                                }
                            }
                        }
                        $this.handleSubmit();
                    })
                    
                } else {
                    CommonFun.responseError(data, $this);
                }
            })
        },
        handleClose() {
            this.$refs.table.clearSelection();
            this.seriesList = [];
            this.checkStr = '请选择';
            sessionStorage.interfaceRowSelection = '[]';
            this.init();
            this.$refs.popover.doClose();
        },
        handleSubmit() {
            this.loading = true;
            let checkd = this.$refs.table.selection;
            sessionStorage.interfaceRowSelection = JSON.stringify(checkd);
            this.checkStr = checkd.map(item => {
                return item.name;
            }).toString();
            let param = {
                beginTime: (new Date() - 3600000) / 1000,
                endTime: new Date() / 1000,
                ids: checkd.map(item => {
                    return {deviceId: item.deviceId, interfaceId: item.interfaceId}
                })
            }
            this.$refs.popover.doClose();
            Api.queryDeviceInterfaceDatumNew(param).then((res) => {
                const data = res.data;
                if(data.status == 1) {
                    this.loading = false;
                    this.seriesList = [];
                    let indexNum = 0;
                    //最大值
                    this.maxVal = 0;
                    this.unitNum = 1;
                    for (const item of data.data) {
                        for (const flux of item.fluxData) {
                            let size = flux.inputSize + flux.outputSize;
                            if(size > this.maxVal) {
                                this.maxVal = size;
                            }
                        }
                    }
                    //根据最大值计算单位及换算比例
                    if(this.maxVal > 1024 * 1024 * 1024){
                        this.unit = 'Gbps';
                        this.unitNum = 1024*1024*1024;
                    }else if(this.maxVal > 1024 * 1024){
                        this.unit = 'Mbps';
                        this.unitNum = 1024*1024;
                    }else if(this.maxVal >1024){
                        this.unit = 'Kbps';
                        this.unitNum=1024;
                    }else{
                        this.unit = 'bps'
                    }
                    for (let item of data.data) {
                        this.initChartsData(item.fluxData, item.name, indexNum);
                        indexNum++;
                    }
                    
                }
                this.init();
            })
        },
        initChartsData(list, name, indexNum) {
            let obj = JSON.parse(JSON.stringify(this.seriesData));
            obj.name = name;
            let iSpace = 1;
            let rbg = this.rgbaList[indexNum];
            obj.itemStyle.normal.color = `rgba(${rbg.r}, ${rbg.g}, ${rbg.b}, 1)`;
            obj.areaStyle.normal.color = new this.$echarts.graphic.LinearGradient(0,0,0,1,
            [
                { offset: 0, color: `rgba(${rbg.r}, ${rbg.g}, ${rbg.b}, 0.3)` },
                { offset: 1, color: `rgba(${rbg.r}, ${rbg.g}, ${rbg.b}, 0.1)` },
            ],false)
            
            obj.data = [];
            for(let i = 0; i < list.length; i += iSpace) {
                let size = list[i].inputSize + list[i].outputSize;
                let item = {name: '速率', value: [list[i].taskTime * 1000, Math.floor((size/this.unitNum).toFixed(2))]};
                obj.data.push(item);
            }
            // this.option.series.push(obj);
            this.seriesList.push(obj);
        },
        selectAddOrEdit(selection, row){
            if (selection.length > 3) {
                let del_row = selection.shift()
                this.$refs.table.toggleRowSelection(del_row, false)
            }
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
  height: 100%;
}
.check-interface{
    display: block;
    color: #29B3AD;
    max-width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    right: 10px;
    z-index: 99;
    cursor: pointer;
    white-space:nowrap
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