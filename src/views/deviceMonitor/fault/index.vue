<template>
    <div class="content outerbox-pro">
        <div class="topruleform">
            <div class="gapright30 topruleform-inline">
                <label>开始时间：</label>
                <el-date-picker
                    v-model="searchData.beginTime"
                    type="datetime"
                    popper-class="begin-now"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptions1"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>结束时间：</label>
                <el-date-picker
                    v-model="searchData.endTime"
                    type="datetime"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptions2"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>故障类型：</label>
                <el-select v-model="searchData.typeList" multiple collapse-tags placeholder="故障类型">
                    <el-option
                        v-for="item in deviceFaultType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>故障等级：</label>
                <el-select v-model="searchData.gradeList" class="ellipsis-elselect" multiple collapse-tags placeholder="故障等级" clearable>
                    <el-option
                        v-for="item in faultGrade"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>组织机构：</label>
                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>模糊查询：</label>
                <el-input v-model="searchData.keyword" placeholder="请输入关键字"></el-input>
            </div>
            <div class="but popup-but-submit gapright20" @click="handleSearch"><i class="el-icon-search"></i></div>
        </div>
        <!-- table -->
        <list-table :searchData="searchData" ref="table"></list-table>
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
</template>
<script>
import CommonFun from '@/js/commonFun.js';
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import ListTable from './components/table';
import { mapState } from 'vuex'
import moment from 'moment';
export default {
    name: 'analyseFlowCongestion',
	components: {
		SelectCompanyComponent, ListTable
	},
    data() {
        return {
            pickerOptions: {
                disabledDate: time =>{
                    let timeOptionRange = this.searchData.beginTime;
                    let now = Date.now();
                    if(timeOptionRange){
                        return time.getTime() < new Date(timeOptionRange).getTime() || time.getTime() > now;
                    }
                    return time.getTime() > now;
                },
                selectableRange: "00:00:00 - 23:59:59",
            },
            searchData: {
                beginTime: null,
                endTime: null,
                gradeList: [],
                keyword: "",
                status: '',
                page: 1,
                pageSize: 20,
                typeList: [],
            },
            currenCompanyNameOfSearch: [],
            currenCompanyIdsOfSearch: [],
            currenCompanyName: '选择单位',
            
            detailData: { //操作行

            },
            visibleCompany: false
        }
    },
    activated() {
        // if(this.$store.state.menuClick) {
        //    this.initPage();
        // }
    },
    created() {
        const queryData = this.$route.query;
        const paramData = this.$route.params;
        this.searchData.keyword = queryData.taskName;
        this.searchData.endTime = new Date().getTime();
        this.searchData.beginTime = this.searchData.endTime - 24*60*60*1000;
        if(paramData.typeList) {
            this.searchData.typeList = paramData.typeList;
            this.searchData.beginTime = 1000;
        }
        if(paramData.status) {
            this.searchData.status = paramData.status;
        }
        if(paramData.companyId) {
            this.searchData.companyIdList = [paramData.companyId];
            this.currenCompanyName = paramData.companyName;
        }
    },
    methods: {
        initPage() {
             this.searchData = {
                beginTime: null,
                endTime: null,
                gradeList: [],
                keyword: "",
                page: 1,
                pageSize: 20,
                typeList: [],
            };
            this.currenCompanyNameOfSearch = [];
            this.currenCompanyIdsOfSearch = [];
            this.currenCompanyName = '选择单位';
            this.handleSearch();
            this.$store.state.menuClick = false;
        },
        /* 多 设置id */
		setSearchCompanyIds(data) {
			let that = this;
			that.currenCompanyIdsOfSearch = data;
		},
        setSearchCompanyNames(data) {
            let that = this;
            that.currenCompanyNameOfSearch = data;
            if (data.length > 0) {
                that.currenCompanyName = data.join(',')
            } else {
                that.currenCompanyName = '选择单位'
            }
        },
        closeSelectcompany() {
			this.visibleCompany = false;
		},
        //格式化类型
        selectCompanyFun(type) {
            this.dealType = type
			this.visibleCompany = true
        },
        handleSearch() {
            this.searchData.companyIdList = this.currenCompanyIdsOfSearch.length > 0 ? this.currenCompanyIdsOfSearch : undefined;
            this.currentPage = 1;
            this.$refs.table.getList(1, this.searchData);
        }
    },
    computed: {
        ...mapState({
            deviceFaultType: state => CommonFun.getDataDictionaryChildrenListData(state.deviceFaultTypeValue),
            faultGrade: state => CommonFun.getDataDictionaryChildrenListData(state.faultGradeValue),
        }),
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
}
</script>
<style lang="scss" scoped>
.content{
    padding: 27px;
}
</style>