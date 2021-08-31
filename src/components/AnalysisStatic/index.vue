<template>
	<div class="content" id="indexPanel">
        <slot name="search"></slot>
        <div style="padding-bottom: 50px; background-color: #020C0C" id="pdfDom">
            <div style="height: auto">
            <div class="panel-item">
                <div class="panel-title">故障类型</div>
                <el-row v-loading="loading1">
                    <el-col :span="8" class="border-right">
                        <radar-chart :defaultData="faultType[0]" ref="chart1"></radar-chart>
                    </el-col>
                    <el-col :span="8" class="border-right">
                        <radar-chart :defaultData="faultType[1]" ref="chart2"></radar-chart>
                    </el-col>
                    <el-col :span="8">
                        <radar-chart :defaultData="faultType[2]" ref="chart3"></radar-chart>
                    </el-col>
                </el-row>
            </div>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">故障等级</div>
                <el-row v-loading="loading2">
                    <el-col :span="8" class="border-right">
                        <radar-chart :defaultData="faultGrade[0]" theme="green" ref="chart4"></radar-chart>
                    </el-col>
                    <el-col :span="8" class="border-right">
                        <radar-chart :defaultData="faultGrade[1]" theme="green" ref="chart5"></radar-chart>
                    </el-col>
                    <el-col :span="8">
                        <radar-chart :defaultData="faultGrade[2]" theme="green" ref="chart6"></radar-chart>
                    </el-col>
                </el-row>
            </div>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">故障趋势</div>
                <mulitiple-line ref="mulitiple" :searchData="searchData" :moduleName="moduleName"></mulitiple-line>
            </div>
            <el-row :gutter="20">
                <el-col :span="hasOnline?8:12">
                    <div class="panel-item">
                        <div class="panel-title">故障任务TOP8</div>
                        <bar-chart class="bar-chart" v-loading="barLoading1" :type="1" :hasCheckBtn="false" ref="chart7"></bar-chart>
                    </div>
                </el-col>
                <el-col :span="hasOnline?8:12">
                    <div class="panel-item">
                        <div class="panel-title">故障次数TOP8</div>
                        <bar-chart class="bar-chart" v-loading="barLoading2" :type="2" :hasCheckBtn="!hasOnline" ref="bar1"></bar-chart>
                    </div>
                </el-col>
                <el-col :span="hasOnline?8:12">
                    <div class="panel-item">
                        <div class="panel-title">故障时长TOP8</div>
                        <bar-chart class="bar-chart" v-loading="barLoading3" :type="3" :hasCheckBtn="!hasOnline" ref="bar2" yType="time"></bar-chart>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="panel-item">
                        <div class="panel-title">健康度TOP8</div>
                        <bar-chart class="bar-chart" v-loading="barLoading4" :type="4" :hasCheckBtn="!hasOnline" ref="bar3" yType="parcent"></bar-chart>
                    </div>
                </el-col>
                <el-col :span="12" v-if="hasOnline">
                    <div class="panel-item">
                        <div class="panel-title">在线率TOP8</div>
                        <bar-chart class="bar-chart" v-loading="barLoading5" :type="5" :hasCheckBtn="!hasOnline" ref="bar4" yType="parcent"></bar-chart>
                    </div>
                </el-col>
            </el-row>
            </div>
            <slot name="table"></slot>
        </div>
    </div>
</template>

<script>
import Bus from './bus';
import Api from './api/index';
import CommonFun from '@/js/commonFun.js';
import { mapState } from 'vuex';

var elementResizeDetectorMaker = require('element-resize-detector');
export default {
    name: 'analysisStatic',
    components: {
        RadarChart: () => import('./components/radarChart.vue'),
        MulitipleLine: () => import('./components/mulitipleLine.vue'),
        BarChart: () => import('./components/barChart.vue'),
    },
    props: {},
    inject: ['moduleName', 'searchParam'],
    // {
    //     moduleName: { default: 'analysis' },
    //     searchParam
    // },
    data() {
        return {
            loading1: false,
            loading2: false,
            barLoading1: false,
            barLoading2: false,
            barLoading3: false,
            barLoading4: false,
            barLoading5: false,
            hasOnline: this.moduleName !== 'analysis',
            faultType: [
                {
                    name: 'CPU利用率偏高', 
                    data: []
                },{
                    name: '内存利用率偏高', 
                    data: []
                },{
                    name: '流量拥塞', 
                    data: []
                },
            ],
            faultGrade: [
                {
                    name: '高', 
                    data: []
                },{
                    name: '中', 
                    data: []
                },{
                    name: '低', 
                    data: []
                },
            ],
            faultTaskTop: [],
            faultCountTop: [],
            faultTimeTop: [],
            healthTop: [],
            onlineRateTop: [],
            faultEventList: [
                {value: 1, name: '时延劣化'},
                {value: 2, name: '丢包劣化'},
                {value: 3, name: '中断'},
            ],
            timer1: null,
            timer2: null,
            timer3: null,
            timer4: null,
            timer5: null
        }
    },
    computed: {
        ...mapState({
            faultTypeList: state => CommonFun.getDataDictionaryChildrenListData(state.deviceFaultTypeValue),
            faultGradeList: state => CommonFun.getDataDictionaryChildrenListData(state.faultGradeValue),
        }),
        searchData() {
            return this.searchParam()
        }
    },
    beforeCreate() {
        
    },
    created() {
    },
    beforeDestroy() {
        this.timer1 && clearTimeout(this.timer1);
        this.timer2 && clearTimeout(this.timer2);
        this.timer3 && clearTimeout(this.timer3);
        this.timer4 && clearTimeout(this.timer4);
        this.timer5 && clearTimeout(this.timer5);
        Bus.$off(`initBarChart1`);
        Bus.$off(`initBarChart2`);
        Bus.$off(`initBarChart3`);
        Bus.$off(`initBarChart4`);
        Bus.$off(`initBarChart5`);
    },
    mounted() {
        Bus.$off('barChartChecked').$on('barChartChecked', obj => {
            this.getTopStatic(obj.type, obj.pattern);
        })
        if(this.hasOnline) {
            this.faultType[0].name = '时延劣化';
            this.faultType[1].name = '丢包劣化';
            this.faultType[2].name = '中断';
        }
        this.handleSearch(true);
        let erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById("indexPanel"), this.CommonFun.debounce(this.resizeFunc));
    },
    methods: {
        initParam() {
            let params = {...this.searchData};
            //更新
            params.beginTime = this.searchData.beginTime ? parseInt(this.searchData.beginTime / 1000): '';
            params.endTime = this.searchData.endTime ? parseInt(this.searchData.endTime / 1000): '';
            params.companyIdList = this.searchData.companyIdList;
            params.taskType = this.searchData.taskType;
            params.sourceType = this.searchData.sourceType;
            return params;
        },
        handleSearch(isInit) {
            let params = this.initParam();
            
            this.getType(params);
            this.getGrade(params);
            if(!isInit) {
                this.$refs.mulitiple && this.$refs.mulitiple.init(params);
            }
            this.getTopStatic();
        },
        
        async getTopStatic(type, pattern) {
            let params = this.initParam();

            params.statisticalPattern = pattern || 1;
            if(!type){
                CommonFun.asyncForEach((this.hasOnline ? 5 : 4), async x => {
                    await this.getFaultTaskTop(params, x + 1)
                })
            } else {
                this.getFaultTaskTop(params, type);
            }
        },
        //故障类型统计
        getType(params) {
            let that = this;
            that.loading1 = true;
            Api[this.hasOnline ? 'typeTask' : 'type'](params).then(res => {
                const data = res.data;
                that.loading1 = false;
                if (data.status === 1) {
                    const list = this.hasOnline ? this.faultEventList : this.faultTypeList;
                    for (const item of data.data) {
                        const typeObj = list.find(obj => obj.value === item.eventType);
                        for (let itemType of that.faultType) {
                            if(itemType.name === typeObj.name) {
                                itemType.data = item.typeStatisticByCompanies;
                                break;
                            }
                        }
                    }
                } else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                that.loading1 = false;
            })
        },
        //故障等级统计
        getGrade(params) {
            let that = this;
            that.loading2 = true;
            Api[this.hasOnline ? 'gradeTask' : 'grade'](params).then( res => {
                const data = res.data;
                that.loading2 = false;
                if (data.status === 1) {
                    for (const item of data.data) {
                        const gradeObj = this.faultGradeList.find(obj => obj.value === item.type);
                        for (let itemGrade of that.faultGrade) {
                            if(itemGrade.name === gradeObj.name) {
                                itemGrade.data = item.gradeStatistics;
                                break;
                            }
                        }
                    }
                } else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                that.loading2 = false;
            })
        },
        //故障任务TOP8
        getFaultTaskTop(params, type) {
            let that = this;
            that['barLoading' + type] = true;
            params['statisticsType'] = type;
            Api[this.hasOnline ? 'exportTop' : 'faultTaskTop'](params).then( res => {
                const data = res.data;
                that['barLoading' + type] = false;
                if (data.status === 1) {
                    this[`timer${type}`] = setTimeout(() => {
                        Bus.$emit(`initBarChart${type}`, data.data);
                    }, 100)
                    // switch(type) {
                    //     case 0:
                    //         that.faultTaskTop = data.data;
                    //         break;
                    //     case 1:
                    //         that.faultTaskTop = data.data;
                    //         break;
                    //     case 2:
                    //         that.faultTaskTop = data.data;
                    //         break;
                    //     case 3: 
                    //         that.faultTaskTop = data.data;
                    //         break;
                    // }
                    
                } else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                that['barLoading' + type] = false;
            })
        },
        
        resizeFunc() {
            this.$nextTick(() => {
                //使echarts尺寸重置
                this.$refs.chart1.resize();
                this.$refs.chart2.resize();
                this.$refs.chart3.resize();
                this.$refs.chart4.resize();
                this.$refs.chart5.resize();
                this.$refs.chart6.resize();
                this.$refs.chart7.resize();
                this.$refs.mulitiple.resize();
                this.$refs.bar1.resize();
                this.$refs.bar2.resize();
                this.$refs.bar3.resize();
                this.$refs.bar4 && this.$refs.bar4.resize();
            })
        },
        
    },
    
}
</script>
<style lang="scss" scoped>
	.content{
        height: 100%;
        box-sizing: border-box;
        padding: 0 27px;
        
        .bar-chart{
            height: 260px;
        }
    }
    .topruleform-item{position: relative;}
    .select-unit-icon{
        position: absolute;
        right: 8px;
        top: 50%;
        margin-top: -5px;
        color: #0d8cac;
    }
    .border-right{
        position: relative;
    }
    .border-right::after{
        content: '';
        position: absolute;
        top: 74px;
        right: 0;
        width: 2px;
        height: 106px;
        background-color: #22C3FF;
        opacity: .3;
    }
</style>