<template>
    <div class="boxStyle">
		<div class="outerbox-pro">
            <analysisStatic ref="chartlist">
                <template #search>
                    <div class="fun-box">
                        <div class="topruleform">
                            <div class="topruleform-item">
                                <p class="topruleform-margin">开始时间：</p>
                                    <el-date-picker
                                    v-model="searchData.beginTime"
                                    popper-class="begin-now"
                                    type="datetime"
                                    :clearable="false"
                                    placeholder="选择开始时间"
                                    :editable="false"
                                    :picker-options="pickerOptions1"
                                    default-time="00:00:00">
                                </el-date-picker>
                                <i class="el-icon-arrow-down select-unit-icon"></i>
                            </div>
                            <div class="topruleform-item">
                                <p class="topruleform-margin">结束时间：</p>
                                    <el-date-picker
                                    v-model="searchData.endTime"
                                    :clearable="false"
                                    type="datetime"
                                    placeholder="选择结束时间"
                                    :editable="false"
                                    :picker-options="pickerOptions2"
                                    default-time="00:00:00">
                                </el-date-picker>
                                <i class="el-icon-arrow-down select-unit-icon"></i>
                            </div>
                            <div class="topruleform-item">
                                <p class="topruleform-margin">营运商：</p>
                                <el-select class="topruleform-width300" v-model="searchData.operators" placeholder="请选择营运商">
                                    <el-option
                                    v-for="(item,index) in operatorsOption"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label"
                                    >
                                    </el-option>
                                </el-select>
                                <!-- <el-input class="topruleform-width300" v-model="searchData.operators" placeholder="请选择营运商"></el-input> -->
                            </div>
                            <div class="topruleform-item">
                                <p class="topruleform-margin">数据源：</p>
                                <el-select class="topruleform-width300" v-model="searchData.sourceType" placeholder="输入数据源">
                                    <el-option
                                    v-for="(item,index) in sourceTypeOption"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label"
                                    >
                                    </el-option>
                                </el-select>
                                <!-- <el-input class="topruleform-width300" v-model="searchData.taskType" placeholder="输入数据源"></el-input> -->
                            </div>
                            <div class="topruleform-item">
                                <p class="topruleform-margin">机构名称：</p>
                                <div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun">{{ currenCompanyName }}</div>
                                <div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
                            </div>
                            <div class="topruleform-item">
                                <!-- <div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div> -->
                                <div class="exportPDF" @click="exportPDF">导出PDF</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #table>
                    <div :searchData="{}" class="listbox">
                        <div class="list-outer-div">
                            <div class="list-content-div">
                                <template>
                                    <el-table v-loading="isLoading" border :data="listData" @sort-change='sortChangeFun' stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                                        <el-table-column prop="taskName" label="专线名称" :show-overflow-tooltip="true">
                                            <template slot="header">
                                                <el-popover
                                                    popper-class="tableSearch-popover"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-input placeholder="请输入内容" v-model="tableSearchData.taskName">
                                                        <el-button slot="append" icon="el-icon-search" @click="tableSearchAction"></el-button>
                                                    </el-input>
                                                    <span slot="reference" class="tableSearchItem">专线名称<i v-if="tableSearchData.taskName" @click="tableSearchClear('taskName')" class="el-icon-refresh-left"></i></span>
                                                </el-popover>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="160" :formatter="CommonFun.dataSource" label="数据源"></el-table-column>
                                        <el-table-column width="120" prop="anode" label="A端地址">
                                            <template slot="header">
                                                <el-popover
                                                    popper-class="tableSearch-popover"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-input placeholder="请输入内容" v-model="tableSearchData.anode">
                                                        <el-button slot="append" icon="el-icon-search" @click="tableSearchAction"></el-button>
                                                    </el-input>
                                                    <span slot="reference" class="tableSearchItem">A端地址<i v-if="tableSearchData.anode" @click="tableSearchClear('anode')" class="el-icon-refresh-left"></i></span>
                                                </el-popover>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="120" prop="bnode" label="Z端地址">
                                            <template slot="header">
                                                <el-popover
                                                    popper-class="tableSearch-popover"
                                                    placement="top"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-input placeholder="请输入内容" v-model="tableSearchData.bnode">
                                                        <el-button slot="append" icon="el-icon-search" @click="tableSearchAction"></el-button>
                                                    </el-input>
                                                    <span slot="reference" class="tableSearchItem">Z端地址<i v-if="tableSearchData.bnode" @click="tableSearchClear('bnode')" class="el-icon-refresh-left"></i></span>
                                                </el-popover>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="180" prop="duration" sortable='custom' :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障总时长"></el-table-column>
                                        <el-table-column width="120" prop="count" sortable='custom' label="故障总次数" >
                                            <template slot-scope="scope">
                                                <span title="查看" @click="toPage(scope.row)" style="cursor: pointer; color: #00E9DF">{{scope.row.count}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="180" prop="avgDuration" sortable='custom' :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障平均时长"></el-table-column>
                                        <el-table-column width="120" prop="healthRate" sortable='custom' :formatter="CommonFun.formatterParcentByKey" label="健康度"></el-table-column>
                                        <el-table-column width="100" prop="nowRate" sortable='custom' :formatter="CommonFun.formatterParcentByKey" label="在线率"></el-table-column>
                                        <el-table-column width="100" prop="statusName" label="当前状态"></el-table-column>
                                        <el-table-column width="100" label="详情" align="center">
                                            <template slot-scope="scope">
                                                <div class="btnBox" title="查看" v-if="currentButtonJurisdiction.indexOf('view') > -1" @click="scope.row.taskType && showFun(scope.$index, scope.row, 'show')"><i :class="['el-icon-view', !scope.row.taskType && 'el-icon-view-defult']"></i></div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </div>
                        </div>
                        <div class="pagebox">
                            <el-pagination 
                            @current-change="handleCurrentChange" 
                            :current-page.sync="currentPage" 
                            :page-size="pageSize"
                            :page-sizes="$store.state.pageSizeS"
                            @size-change="handleSizeChange"
                            layout="sizes,total,prev, pager, next, jumper" 
                            :total="totle">
                            </el-pagination>
                            <div class="pageExport" v-if="currentButtonJurisdiction.indexOf('export') > -1" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
                        </div>
                    </div>
                </template>
            </analysisStatic>
            <el-dialog :visible.sync="dialogTableVisible_selectcompany" :close-on-click-modal="false" v-if="dialogTableVisible_selectcompany"
                width="690px">
                <div class="popup">
                    <div class="title">单位选择</div>
                    <div class="hidepopup" @click="dialogTableVisible_selectcompany=!dialogTableVisible_selectcompany">×</div>
                    <SelectCompanyComponent type='multiple' :checkStrictly='false' v-on:setSearchCompanyIds='setSearchCompanyIds'
                        v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIds'
                        :checkedMenuNames='currenCompanyNames'></SelectCompanyComponent>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
import CommonFun from '../../js/commonFun.js'
import SelectCompanyComponent from '../../components/selectCompanyComponent.vue'
import analysisStatic from '@/components/AnalysisStatic/index'
import moment from 'moment';
export default {
    name: 'analyseSpecialLine',
    data() {
        return {
            searchData: {beginTime: '', endTime: '', taskType: 3},
            currenCompanyName: '选择单位',
            currenCompanyIds: [],
            currenCompanyNames: [],
            dialogTableVisible_selectcompany: false,
            currentPage: 1,
            pageSize: this.$store.state.pageSize,
            totle: 0,
            listData: [],
            sourceTypeOption: [
                {label: '拨测任务', value: 1},
                {label: '接口任务', value: 2}
            ],
            operatorsOption: [],
            isLoading: false,
            Btime: '',
            Etime: '',
            tableSearchData: {taskName: '', anode: '', bnode: ''},
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('analyseSpecialLine')
        }
    },
    provide() {
        return {
            moduleName: 'analysisSpecialLine',
            searchParam: () => this.searchData,
            taskType: 3
        }
    },
    components: {
        SelectCompanyComponent,
        analysisStatic
    },
    methods: {
        tableSearchClear(name) {
             this.tableSearchData[name] = '';
             this.getList();
        },
        tableSearchAction() {
            this.currentPage = 1;
            this.getList();
        },
        toPage(row) {
            if(row.count){
                let toPage = 'analyseDelayDegradation';
                this.$store.commit('pushIncludeList', 'analyseSpecialLine');
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                // sessionStorage.setItem('openlist', JSON.stringify([toPage]))
		        this.$store.dispatch('setOpenList', [toPage])
                setTimeout(() => this.$router.push({name: toPage, params: {taskId: row.id, taskType: row.taskType, beginTime: this.Btime, endTime: this.Etime}}))
            }
        },
        exportPDF() {
            this.getPdf('pdfDom', '专线分析');
        },
        getList: function() {
            let $this = this
            let params = {
                ...this.searchData,
                page: this.currentPage,
                pageSize: this.pageSize,
                beginTime: new Date($this.searchData.beginTime) / 1000 || undefined,
                endTime: new Date($this.searchData.endTime) / 1000  || undefined,
                companyIdList: $this.currenCompanyIds,
                sort: $this.currentSort,
                order: $this.currentOrder,
                nameKeyword: $this.tableSearchData.taskName,
                anodeKeyword: $this.tableSearchData.anode,
                bnodeKeyword: $this.tableSearchData.bnode
            }
            $this.isLoading = true;
            return axiosHttp
                .post(baseUrl.BASEURL + 'analyseTask/specialTaskStatisticsPage', params)
                .then(function(res) {
                    $this.isLoading = false
                    if (res.data.status === 1) {
                        $this.totle = res.data.data.total
                        $this.listData = res.data.data.records
                        sessionStorage.setItem('currentEndTime',res.data.responseTime)
                    }
                    else {
                        CommonFun.responseError(res.data, $this)
                    }
                }).catch(function(err) {
                    $this.isLoading = false
                })
        },
        sortChangeFun(column, prop, order){
            let $this = this
            if(column.prop == 'count'){
                $this.currentSort = 'count';
            }else if(column.prop == "duration"){
                $this.currentSort = 'duration';
            }else if(column.prop == 'avgDuration'){
                $this.currentSort = "avg_duration"
            }else if(column.prop == 'healthRate'){
                $this.currentSort = 'health_rate'
            }else {
                $this.currentSort = 'now_rate'
            }
            if(column.order == 'ascending'){
                $this.currentOrder = 'ASC'
            }else if(column.order == 'descending'){
                $this.currentOrder = 'DESC'
            }else {
                $this.currentOrder = ''
            }
            if(!$this.currentOrder) {
                $this.currentSort = ''
            }
            $this.getList()
        },
        selectCompanyFun: function(type) {
            this.dialogTableVisible_selectcompany = true
        },
        setSearchCompanyIds: function(data) {
            this.currenCompanyIds = data
        },
        setSearchCompanyNames: function(data) {
            let $this = this
            $this.currenCompanyNames = data
            if (data.length > 0) {
                $this.currenCompanyName = ''
                for (let i = 0; i < data.length; i++) {
                    $this.currenCompanyName += (data[i] + ',')
                }
            } else {
                $this.currenCompanyName = '选择单位'
            }
        },
        closeSelectcompany: function() {
            this.dialogTableVisible_selectcompany = false
        },
        searchAction() {
            this.currentPage = 1;
            this.Btime = this.searchData.beginTime;
            this.Etime = this.searchData.endTime;
            this.searchData.companyIdList = this.currenCompanyIds
            this.getList();
            this.$refs.chartlist.handleSearch();
        },
        showFun(index,row,type) {
            let $this = this
			if(type == 'show'){
				let data = Object.assign(row,{
					beginTime:new Date($this.searchData.beginTime).getTime() / 1000,
					endTime:new Date($this.searchData.endTime).getTime() / 1000,
					taskType: row.taskType,
					taskId:row.id,
                    dataSource: row.taskType == 1 ? '拨测任务' : row.taskType == 2 ? '接口任务' : row.taskType == 3 ? '专线任务' : ''
				})
                this.$store.commit('pushIncludeList', 'analyseSpecialLine');
				sessionStorage.setItem('currentAramItem',JSON.stringify(data)) 
                setTimeout(() => $this.$router.push('/alarmDetailInfo'))
			}
        },
        handleCurrentChange: function(val) {
            let $this = this
            $this.currentPage = val
            $this.getList()
        },
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        exportAnalyseDegradation() {
            let $this = this
            let params = {
                ...this.searchData,
                beginTime: this.searchData.beginTime / 1000,
                endTime: this.searchData.endTime / 1000
            }
            let loading = CommonFun.openFullScreen($this)
            axiosHttp
                .post(baseUrl.BASEURL + 'analyseTask/exportSpecialTaskStatisticsFile', params)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading);
                    if (res.data.status === 1) {
                        window.open(res.data.data);
                    }else{
                        CommonFun.responseError(res.data, $this);
                    }
                })
                .catch(function(err) {
                    CommonFun.closeFullScreen(loading);
                });
        },
        getNowTime() {
            this.searchData.beginTime = new Date().getTime() - 24*60*60*1000
            this.searchData.endTime = new Date().getTime()
            this.Btime = this.searchData.beginTime;
            this.Etime = this.searchData.endTime;
        }
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
    created() {
        let $this = this
        let faultdataList = JSON.parse(sessionStorage.getItem('dataDictionaryList'));
        if(faultdataList[0].children){
            faultdataList[0].children.forEach((item, index) => {
                if(item.name == '运营商') {
                    $this.operatorsOption = item.children
                }
            })
        }
        this.getNowTime();
    },
    mounted() {
        this.getList();
    }
}
</script>
<style lang="scss" scoped>
.topruleform {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
}
.topruleform-item {
    margin-right: 0;
}
.popup-but-submit {
    margin-left: 50px;
}
.el-icon-view-defult{
    color: #999;
    cursor: not-allowed;
}
.list-outer-div, .listbox {
    height: initial;
}
.exportPDF{
    // position: absolute;
    // right: 0;
    // top: 45px;
    width: 70px;
    height: 30px;
    color: #fff;
    line-height: 30px;
    text-align: center;
    background-image: linear-gradient(to bottom right , #018983, #00E9DF);
    border-radius: 2px;
    cursor: pointer;
}
.pagebox{display: flex;justify-content: center;position: relative;}
.pageExport{display: flex;position: absolute;right: 0;color: #00D8CF;align-items: center;cursor: pointer;}
.pageExport-img{width: 18px;height: 15px;margin-right: 10px;background-image: url('../../assets/pageExport.png');background-size: cover;}
</style>