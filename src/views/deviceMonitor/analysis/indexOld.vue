<template>
<div style="margin-top: 27px">
    <AnalysisStatic ref="chartlist">
        <template #search>
            <div class="topruleform">
                <label>开始时间：</label>
                <div class="block gapright30 topruleform-item">
                    <el-date-picker
                        v-model="searchData.beginTime"
                        type="datetime"
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
                        type="datetime"
                        value-format="timestamp"
                        :clearable="false"
                        :picker-options="pickerOptions2"
                        :editable="false"
                        placeholder="选择日期时间">
                    </el-date-picker>
                    <i class="el-icon-arrow-down select-unit-icon"></i>
                </div>
                <label>机构：</label>
                <div class="gapright30 topruleform-width220">
                    <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
                </div>
                <!-- <label>条件查询：</label>
                <div class="gapright topruleform-width150">
                    <el-input v-model="searchData.keyWord" placeholder="搜索关键词"></el-input>
                </div> -->
                <div class="but popup-but-submit" @click="handleSearch"><i class="el-icon-search"></i></div>
                <!-- <div class="but add-but" @click="exportListFun"><i class="el-icon-circle-plus-outline"></i>导出</div> -->
            </div>
        </template>
        <template #table>
            <list-table :searchData="searchData" ref="table" style="width: calc(100% - 17px)"></list-table>
        </template>
    </AnalysisStatic>
    <el-dialog :visible.sync="dialogTableVisible_selectcompany" :close-on-click-modal="false" v-if="dialogTableVisible_selectcompany"
			 width="690px">
            <div class="popup">
                <div class="title">单位选择</div>
                <div class="hidepopup" @click="dialogTableVisible_selectcompany=!dialogTableVisible_selectcompany">×</div>
                <SelectCompanyComponent v-if='dealType==1' type='multiple' :checkStrictly='false' v-on:setSearchCompanyIds='setSearchCompanyIds'
                v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIds'
                :checkedMenuNames='currenCompanyNames'></SelectCompanyComponent>
                <SelectCompanyComponent v-if='dealType==0' type='single' v-on:setSearchCompanyId='setSearchCompanyId'
                v-on:setSearchCompanyName='setSearchCompanyName' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuId='currenCompanyId'
                :checkedMenuName='currenCompanyName'></SelectCompanyComponent>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: 'analyseNetworkDevice',
    components: {
        AnalysisStatic: () => import('@/components/AnalysisStatic/index'),
        listTable: () => import('../fault/components/table1.vue'),
        SelectCompanyComponent: () => import('@/components/selectCompanyComponent.vue'),
    },
    provide() {
        return {
            moduleName: 'analysis',
            searchParam: () => this.searchData
        }
    },
    data() {
        return {
            searchData: {
                beginTime: null,
                endTime: null,
                companyIdList: []
            },
            currenCompanyName: '选择单位',
            dealType: 0,
            dialogTableVisible_selectcompany: false,
            currenCompanyIds: [],
            currenCompanyNames: [],
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
        }
    },
    computed: {
        
    },
    activated() {
        // if(this.$store.state.menuClick) {
        //     this.initPage();
        // }
    },
    created() {
        this.getCurrentDate()
    },
    methods: {
        initPage() {
            console.log('重置');
            this.searchData = {
                beginTime: null,
                endTime: null,
                companyIdList: []
            }
            this.currenCompanyName = '选择单位';
            this.currenCompanyIds = [];
            this.currenCompanyNames = [];
            this.$refs.chartlist.initPage();
            this.getCurrentDate();
            this.handleSearch();
            this.$store.state.menuClick = false;
        },
        handleSearch() {
            //此处赋值，触发table更新
            this.currenCompanyIds.length && (this.searchData.companyIdList = JSON.parse(JSON.stringify(this.currenCompanyIds)));
            this.$refs.chartlist.handleSearch();
            this.$refs.table.handleSizeChange(20);
        },
        selectCompanyFun: function(type) {
            this.dealType = type
            this.dialogTableVisible_selectcompany = true
        },
        setSearchCompanyIds: function(data) {
            this.currenCompanyIds = data;
        },
        setSearchCompanyNames: function(data) {
            let $this = this
            $this.currenCompanyNames = data
            if (data.length > 0) {
                $this.currenCompanyName = data.join(',')
            } else {
                $this.currenCompanyName = '选择单位'
            }
        },
        closeSelectcompany: function() {
            this.dialogTableVisible_selectcompany = false
        },
        getCurrentDate() {
            let now = new Date();
            let year = now.getFullYear(); //得到年份
            let month = now.getMonth(); //得到月份
            let date = now.getDate(); //得到日期
            let hour = now.getHours(); //得到小时
            let minu = now.getMinutes(); //得到分钟
            let sec = now.getSeconds(); //得到秒
            month = month + 1;
            if (month < 10) month = '0' + month;
            if (date < 10) date = '0' + date;
            if (hour < 10) hour = '0' + hour;
            if (minu < 10) minu = '0' + minu;
            if (sec < 10) sec = '0' + sec;
            let time = year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec;
            this.searchData.endTime = +new Date(time);
        
            let yesterdaytime = new Date().getTime() - 24 * 60 * 60 * 1000;
            let yesterday = new Date(yesterdaytime); // 获取的是前一天日期
            let year1 = yesterday.getFullYear(); //得到年份
            let month1 = yesterday.getMonth() > 9 ? yesterday.getMonth() + 1 : '0' + (yesterday.getMonth() + 1); //得到月份
            let date1 = yesterday.getDate() > 9 ? yesterday.getDate() : '0' + yesterday.getDate(); //得到日期
        
            let time1 = year1 + '-' + month1 + '-' + date1 + ' ' + hour + ':' + minu + ':' + sec;
            this.searchData.beginTime = +new Date(time1);
        },
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
    watch: {
        // "searchData.endTime": {
        //     handler(newValue, oldValue) {
        //         if (newValue) {
        //             let date = new Date();
        //             let min = date.getMinutes();
        //             date.setMinutes(min + 1); 
        //             let nowDate = moment(date).format("HH:mm:ss");
        //             let st = "";
        //             if (moment(date).format("yyyy-MM-DD") === moment(newValue).format("yyyy-MM-DD")) {
        //                 let hh1 = moment(newValue).format("HH:mm:ss")
        //                 if(hh1 > nowDate) {
        //                 this.searchData.endTime = new Date();
        //                 }
        //                 st = nowDate;
        //             } else {
        //                 st = "23:59:59";
        //             }
        //             this.pickerOptions.selectableRange = "00:00:00 - " + st;
        //             this.pickerOptions = this.pickerOptions;
        //         }
        //     },
        //     deep: true,
        //     immediate: true,
        // },
    },
}
</script>
