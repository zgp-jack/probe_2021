<template>
    <div class="content outerbox-pro" id="indexPanel">
        <div class="topruleform">
            <label>组织机构：</label>
            <div class="gapright30 topruleform-width220">
                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
            </div>
            <label>开始时间：</label>
            <div class="block gapright30 topruleform-item">
                <el-date-picker
                    v-model="searchData.beginTime"
                    type="date"
                    popper-class="begin-now"
                    value-format="timestamp"
                    :clearable="false"
                    :picker-options="pickerOptions1"
                    :editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <label>结束时间：</label>
            <div class="block gapright30 topruleform-item">
                <el-date-picker
                    v-model="searchData.endTime"
                    type="date"
                    value-format="timestamp"
                    :clearable="false"
                    :picker-options="pickerOptions2"
                    :editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="block gapright30 topruleform-item">
                <ul class="check-radio-list">
                    <li :class="{'actived': item.actived}" v-for="item,index in radioList" :key="index" @click="searchByTime(item, index)">{{item.label}}</li>
                </ul>
            </div>
            <div class="but popup-but-submit" @click="handleSearch"><i class="el-icon-search"></i></div>
            <div class="exportPDF" @click="exportPDF">导出PDF</div>
        </div>
        <div id="pdfDom" style="background-color: #020C0C">
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">链路故障趋势与分布</div>
                <MulitipleLine ref="chart1" :chartData="webTendency"></MulitipleLine>
            </div>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">设备故障趋势与分布</div>
                <MulitipleLine ref="chart2" :chartData="deivceTendency" :typeList="['流量拥塞', 'CPU利用率偏高', '内存利用率偏高', '故障趋势']"></MulitipleLine>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="panel-item">
                        <div class="panel-title">链路在线率排名</div>
                        <BarRank :chartData="webOnLineByCompany"></BarRank>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="panel-item">
                        <div class="panel-title">链路健康度排名</div>
                        <BarRank :chartData="webHealthByCompany" type="health"></BarRank>
                    </div>
                </el-col>
            </el-row>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">设备健康度</div>
                <el-row class="panel-body">
                    <el-col :span="10">
                        <p>健康度排名</p>
                        <BarRank1 type="health" :chartData="deviceHealthByCompany" theme="blue"></BarRank1>
                    </el-col>
                    <el-col :span="14" class="has-split-line">
                        <p>健康度区间分布</p>
                        <LineRang type="health" :chartData="deviceHealthByCompanyPie"></LineRang>
                    </el-col>
                </el-row>
            </div>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">运营商健康度</div>
                <el-row class="panel-body">
                    <el-col :span="10">
                        <p>健康度排名</p>
                        <BarRank1 type="health" :chartData="operatorHealthList" theme="yellow"></BarRank1>
                    </el-col>
                    <el-col :span="14" class="has-split-line split-health">
                        <p>健康度区间分布</p>
                        <LineRang type="health" :chartData="operatorHealthListPie"></LineRang>
                    </el-col>
                </el-row>
            </div>
            <div class="panel-item" style="flex-grow: 1;">
                <div class="panel-title">运营商故障类型分布</div>
                <el-row class="panel-body">
                    <el-col :span="15">
                        <p>故障类型</p>
                        <MulitipleBar :chartData="operatorFaultList"></MulitipleBar>
                    </el-col>
                    <el-col :span="9">
                        <p>故障比例</p>
                        <Pie :chartData="operatorFaultList"></Pie>
                    </el-col>
                </el-row>
            </div>
            <list-table :searchData="searchData" ref="table" style="width: calc(100% - 17px)"></list-table>
            <el-dialog :visible.sync="visibleCompany" :close-on-click-modal="false" v-if="visibleCompany" width="690px">
                <div class="popup">
                    <div class="title">单位选择</div> 
                    <div class="hidepopup" @click="visibleCompany=!visibleCompany">×</div>
                    <SelectCompanyComponent type="multiple" :checkStrictly="false" v-on:setSearchCompanyIds='setSearchCompanyIds'
                    v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIdsOfSearch'
                    :checkedMenuName='currenCompanyNameOfSearch'></SelectCompanyComponent>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import Api from './api';
import CommonFun from '@/js/commonFun'
var elementResizeDetectorMaker = require('element-resize-detector');
export default {
    name: 'analyseNetworkDevice',
    components: {
        MulitipleLine: () => import('./mulitipleLine.vue'),
        BarRank: () => import('./barRank.vue'),
        BarRank1: () => import('./barRank1.vue'),
        LineRang: () => import('./lineRang.vue'),
        Pie: () => import('./pie.vue'),
        MulitipleBar: () => import('./mulitipleBar.vue'),
        listTable: () => import('./table.vue'),
        SelectCompanyComponent: () => import('@/components/selectCompanyComponent.vue'),
    },
    data() {
        return {
            webTendency: [],
            deivceTendency: [],
            webOnLineByCompany: [],
            webHealthByCompany: [],
            deviceHealthByCompany: [],
            deviceHealthByCompanyPie: [0, 0, 0, 0],
            operatorHealthList: [],
            operatorHealthListPie: [0, 0, 0, 0],
            operatorFaultList: null,
            visibleCompany: false,
            currenCompanyNames: [],
            currenCompanyIds: [],
            currenCompanyName: '选择单位',
            searchData: {
                beginTime: null,
                endTime: null,
                companyIdList: []
            },
            radioVal: '今天',
            radioList: [
                {label: '今天', value: 1, actived: true},
                {label: '昨天', value: 2, actived: false},
                {label: '近7天', value: 3, actived: false},
                {label: '近1个月', value: 4, actived: false},
                {label: '近3个月', value: 5, actived: false}
            ],
            dealType: 0,
            pickerOptions: {
                disabledDate: time =>{
                    let timeOptionRange = this.searchData.beginTime;
                    let now = Date.now();
                    // if(timeOptionRange){
                    //     return time.getTime() < new Date(timeOptionRange).getTime() || time.getTime() > now;
                    // }
                    return time.getTime() > now;
                },
                selectableRange: "00:00:00 - 23:59:59",
            },
            loadData: null
        }
    },
    created() {
        this.getCurrentDate();
    },
    mounted() {
        setTimeout(() => {
            this.getData();
        }, 100);
        let erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById("indexPanel"), this.CommonFun.debounce(this.resizeFunc));
    },
    computed: {
        pickerOptions1() {
            let st = '';
            if(this.searchData.endTime && this.searchData.beginTime){
                let startDate = moment(this.searchData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                let endDate = moment(this.searchData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                if(startDate[0] == endDate[0]){
                    st = endDate[1];
                    if(this.searchData.beginTime >= this.searchData.endTime){
                        this.searchData.beginTime = this.searchData.endTime;
                    }
                }else{
                    st = '23:59:59';
                }
            }else{
                let startDate = moment(this.searchData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
                if(startDate[0] == nowDate[0]){
                    st =  nowDate[1];
                }else{
                    st = '23:59:59';
                }
            }
            return {
                disabledDate: time => {
                    let timeOptionRange = this.searchData.endTime;
                    let now = Date.now();
                    if(timeOptionRange) {
                        return time.getTime() > (new Date(timeOptionRange).getTime()) || time.getTime() > now;
                    }
                    return time.getTime() > now;
                },
                selectableRange: '00:00:00 - ' + st
            }
        },
        pickerOptions2() {
            let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
            let nt = nowDate[1];
            let et = '00:00:00';
            if(this.searchData.endTime && this.searchData.beginTime) {
                let startDate = moment(this.searchData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                let endDate = moment(this.searchData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                if(startDate[0] == endDate[0]){
                    et = startDate[1]
                }else{
                    et = '00:00:00'
                }
                if(endDate[0] != nowDate[0]) {
                    nt = '23:59:59'
                }
            }else {
                let endDate = moment(this.searchData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                if(endDate[0] == nowDate[0]){
                    nt =  nowDate[1];
                }else{
                    nt = '23:59:59';
                }
            }
            return {
                disabledDate: time =>{
                    let timeOptionRange = this.searchData.beginTime;
                    let now = Date.now();
                    if(timeOptionRange){
                        return time.getTime() < (new Date(timeOptionRange).getTime() - 24*60*60*1000) || time.getTime() > now;
                    }
                    return time.getTime() > now;
                },
                // selectableRange: et + ' - ' + nt
            }
        },
    },
    methods: {
        /* 多 设置id */
		setSearchCompanyIds(data) {
			let that = this;
			that.currenCompanyIds = data;
		},
        setSearchCompanyNames(data) {
            let that = this;
            that.currenCompanyNames = data;
            if (data.length > 0) {
                that.currenCompanyName = data.join(',')
            } else {
                that.currenCompanyName = '选择单位'
            }
        },
        closeSelectcompany() {
			this.visibleCompany = false;
		},
        selectCompanyFun(type) {
            this.dealType = type
			this.visibleCompany = true
        },
        exportPDF() {
            this.getPdf('pdfDom', '统计报表');
        },
        setDeviceHealthByCompany() {
            this.deviceHealthByCompany = this.loadData['deviceHealthByCompany'];
            this.deviceHealthByCompanyPie = [0, 0, 0, 0];
            for (const item of this.deviceHealthByCompany) {
                if(item.value < 60) {
                    this.deviceHealthByCompanyPie[0]++;
                } else if(item.value >= 60 && item.value < 80) {
                    this.deviceHealthByCompanyPie[1]++;
                } else if(item.value >= 80 && item.value < 90) {
                    this.deviceHealthByCompanyPie[2]++;
                } else {
                    this.deviceHealthByCompanyPie[3]++;
                }
            }
        },
        setOperatorHealthList() {
            this.operatorHealthList = this.loadData['operatorHealthList'];
            this.operatorHealthListPie = [0, 0, 0, 0];
            for (const item of this.operatorHealthList) {
                if(item.value < 60) {
                    this.operatorHealthListPie[0]++;
                } else if(item.value >= 60 && item.value < 80) {
                    this.operatorHealthListPie[1]++;
                } else if(item.value >= 80 && item.value < 90) {
                    this.operatorHealthListPie[2]++;
                } else {
                    this.operatorHealthListPie[3]++;
                }
            }
        },
        setOperatorFaultList() {
            this.operatorFaultList = this.loadData['operatorFaultList'];
        },
        getData() {
            let param = {
                beginTime: parseInt(this.searchData.beginTime / 1000),
                endTime: parseInt(this.searchData.endTime / 1000),
            }
            let loading = CommonFun.openFullScreen(this)
            Api.statis(param).then(res => {
                const data = res.data;
                this.loadData = data.data;
                if(data.status === 1) {
                    this.webTendency = data.data.webTendency;
                    this.deivceTendency = data.data.deivceTendency;
                    this.webOnLineByCompany = data.data.webOnLineByCompany;
                    this.webHealthByCompany = data.data.webHealthByCompany;

                    this.setDeviceHealthByCompany();
                    this.setOperatorHealthList();

                    this.setOperatorFaultList();
                    this.loading = false;
                } else {
                    CommonFun.responseError(data, this)
                }
                CommonFun.closeFullScreen(loading)
            })
        },
        handleSearch() {
            //此处赋值，触发table更新
            this.getData();
            this.$refs.table.handleSizeChange(20);
        },
        searchByTime(obj, index) {
            for (const item of this.radioList) {
               item.actived = false; 
            }
            this.radioList[index].actived = true;

            let now = new Date();
            let year = now.getFullYear(); //得到年份
            let month = now.getMonth(); //得到月份
            let date = now.getDate(); //得到日期
            let hour = now.getHours(); //得到小时
            let minu = now.getMinutes(); //得到分钟
            let sec = now.getSeconds(); //得到秒
            switch(obj.value) {
                case 1:
                    this.searchData.beginTime = new Date(year, month, date, 0, 0, 0);
                    this.searchData.endTime = now;
                    break;
                case 2: 
                    this.searchData.beginTime = new Date(year, month, date - 1, 0, 0, 0);
                    this.searchData.endTime = new Date(year, month, date - 1, 23, 59, 59);
                    break;
                case 3: 
                    this.searchData.beginTime = new Date(year, month, date - 7, hour, minu, sec);
                    this.searchData.endTime = now;
                    break;
                case 4: 
                    this.searchData.beginTime = new Date(year, month - 1, date, hour, minu, sec);
                    this.searchData.endTime = now;
                    break;
                case 5: 
                    this.searchData.beginTime = new Date(year, month - 3, date, hour, minu, sec);
                    this.searchData.endTime = now;
                    break;
            }
            this.handleSearch();
        },
        getCurrentDate() {
            let now = new Date();
            let year = now.getFullYear(); //得到年份
            let month = now.getMonth(); //得到月份
            let date = now.getDate(); //得到日期
            let hour = now.getHours(); //得到小时
            let minu = now.getMinutes(); //得到分钟
            let sec = now.getSeconds(); //得到秒

            this.searchData.endTime = +now;
        
            this.searchData.beginTime = +new Date(year, month, date, 0, 0, 0);

        },
        resizeFunc(element) {
			let that = this;
			that.$nextTick(() => {
				that.$refs['chart1'].resize();
                that.$refs['chart2'].resize();
                // that.$refs['chart3'].resize();
                // that.$refs['chart4'].resize();
			})
		},
    },
    watch: {
        
    },
}
</script>
<style lang="scss" scoped>
.content {
    padding: 27px;
}
.panel-body{
    color:#fff;
    p{
        text-align: center;
        font-size: 14px;
        padding-top: 20px;
    }
    .has-split-line{
        position: relative;
    }
    .has-split-line::after{
        content: '';
        position: absolute;
        left: 0;
        top: 60px;
        width: 1px;
        height: 180px;
        background-color: #327087;
    }
    .split-health::after{
        background-color: #A59665;
    }
}
.check-radio-list {
    display: flex;
    list-style: none;
    border: 1px solid #0AB3AC;
    border-radius: 1px;
    background: rgba(10, 179, 172, 0.08);
    li {
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-color: #0AB3AC;
        border-width: 0 1px 0 0;
        border-style: solid;
        cursor: pointer;
    }
    li.actived{
        background: rgba(1, 242, 232, 0.12);
    }
    li:last-child{
        border: none;
    }
}
.exportPDF{
    position: absolute;
    right: 0;
    width: 70px;
    height: 30px;
    color: #fff;
    line-height: 30px;
    text-align: center;
    background-image: linear-gradient(to bottom right , #018983, #00E9DF);
    border-radius: 2px;
    cursor: pointer;
}
.btn-check-chart{
    right: 0;
}
</style>
