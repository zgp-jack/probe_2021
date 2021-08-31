<template>
    <div class="analyseRelaySpecialLineDetail faultAnalysisDetail">
        <div class="but popup-but-submit btn-back" @click="routerBack"><i class="btn-return-icon-white"></i> 返回</div>
        <div class="fun-box">
            <div class="topruleform">
                <div class="topruleform-item">
                    <p class="topruleform-margin">开始时间：</p>
                        <el-date-picker
                        v-model="searchData.beginTime"
                        type="datetime"
                        :clearable="false"
                        placeholder="选择开始时间"
                        :editable="false"
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
                        default-time="00:00:00">
                    </el-date-picker>
                    <i class="el-icon-arrow-down select-unit-icon"></i>
                </div>
                <div class="topruleform-item">
                    <div class="but popup-but-submit" @click="searchAction" ><i class="el-icon-search"></i></div>
                </div>
            </div>
        </div>
        <viewAnalysis v-if="basicInfo.length" :viewAnalysisData="basicInfo"></viewAnalysis>
        <div v-if="faultData && faultData.changeTable" class="faultAnalysisDetail-view">
            <p class="faultAnalysisDetail-title">故障列表</p>
            <hr class="faultAnalysisDetail-title-line" />
            <div class="list-content-div">
                <template>
                    <el-table :data="listData" @sort-change='sortChangeFun' stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                        <el-table-column :formatter="CommonFun.faultTypeFun" label="故障类型" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="reason" label="故障原因"></el-table-column>
                        <el-table-column prop="beginTime" sortable='custom' :formatter="CommonFun.formatterTime" label="开始时间"></el-table-column>
                        <el-table-column prop="endTime" :formatter="CommonFun.formatterTime" sortable='custom' label="结束时间"></el-table-column>
                        <el-table-column prop="duration" sortable='custom' :formatter="CommonFun.formatterContinuedTime" :show-overflow-tooltip="true" label="持续时间"></el-table-column>
                    </el-table>
                </template>
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
            </div>
        </div>
        <div v-if="faultData && !faultData.changeTable" class="faultAnalysisDetail-view">
            <p class="faultAnalysisDetail-title">接口列表</p>
            <hr class="faultAnalysisDetail-title-line" />
            <div class="list-content-div">
                <template>
                    <el-table :data="taskInterfaceListData" @sort-change='sortChangeFunInterface' ref="interfaceListTable" @current-change="handleCurrentSelectChange" highlight-current-row stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="userName" label="用户名" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="falg" label="标签"></el-table-column>
                        <el-table-column prop="anode" label="节点A"></el-table-column>
                        <el-table-column prop="bnode" label="节点B"></el-table-column>
                        <el-table-column prop="duration" sortable='custom' :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障总时长"></el-table-column>
                        <el-table-column prop="count" sortable='custom' label="故障总次数"></el-table-column>
                        <el-table-column prop="avgDuration" sortable='custom' :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障平均时长"></el-table-column>
                        <el-table-column prop="statusName" label="当前状态"></el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="pagebox">
                <el-pagination 
                    @current-change="handleCurrentChange1" 
                    :current-page.sync="currentPage" 
                    :page-size="pageSize"
                    :page-sizes="$store.state.pageSizeS"
                    @size-change="handleSizeChange1"
                    layout="sizes,total,prev, pager, next, jumper" 
                    :total="listTotle">
                </el-pagination>
            </div>
        </div>
        <div v-if="faultData && !faultData.changeTable" class="faultAnalysisDetail-view">
            <p class="faultAnalysisDetail-title">故障列表</p>
            <hr class="faultAnalysisDetail-title-line" />
            <div class="list-content-div">
                <template>
                    <el-table :data="listData" @sort-change='sortChangeFun' stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="eventType" label="故障类型" :formatter="CommonFun.faultTypeFun" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="reason" label="故障原因"></el-table-column>
                        <el-table-column prop="beginTime" sortable='custom' :formatter="CommonFun.formatterTime" label="开始时间"></el-table-column>
                        <el-table-column prop="endTime" :formatter="CommonFun.formatterTime" sortable='custom' label="结束时间"></el-table-column>
                        <el-table-column prop="duration" sortable='custom' :formatter="CommonFun.formatterContinuedTime" :show-overflow-tooltip="true" label="持续时间"></el-table-column>
                    </el-table>
                </template>
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
            </div>
        </div>
        <div class="faultAnalysisDetail-view">
            <p class="faultAnalysisDetail-title">网络分析</p>
            <hr class="faultAnalysisDetail-title-line" />
            <p class="faultAnalysisDetail-text">路径拓扑</p>
            <pathTogologyDefault :faultData="faultData" :routeListIp="routeListIp"></pathTogologyDefault>
            <p class="faultAnalysisDetail-text">时延/丢包</p>
            <div v-if="faultData && faultData.changeTable">
                <transmitEchart v-if="faultData && faultData.beginTime" :faultData="faultData" :clickIndex="clickIndex" :routeList="routeList"></transmitEchart>
            </div>
            <div v-else>
                <transmitEchart v-if="faultData && faultData.beginTime && faultData.changeTransmitEchart" :faultData="faultData" :clickIndex="clickIndex" :routeList="routeList"></transmitEchart>
            </div>
        </div>
  </div>
</template>
<script>
import viewAnalysis from '@/components/networkPath/viewAnalysis'
import pathTogologyDefault from '@/components/networkPath/pathTogologyDefault'
import transmitEchart from '@/components/networkPath/transmitEchart'
import CommonFun from '@/js/commonFun'
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
export default {
    name: 'analyseRelaySpecialLineDetail',
    data() {
        return {
            faultData: JSON.parse(sessionStorage.getItem('currentAramItem')),
            clickIndex: -1,
            searchData: {beginTime: '', endTime: ''},
            basicInfo: [],
            routeListDefault: [],
            routeList: [],
            currentPage: 1,
            currentPage1: 1,
            pageSize: this.$store.state.pageSize,
            pageSize1: this.$store.state.pageSize,
            totle: 0,
            listTotle: 0,
            // InterfaceFaultListData: [],
            listData: [],
            // taskFaultListData: [],
            taskInterfaceListData: [],
            routeListIp: [],
            currentSort: '',
            currentSort: ''
        }
    },
    components: {
        viewAnalysis,
        pathTogologyDefault,
        transmitEchart
    },
    methods: {
        getList() {
            let params;
            let analyseUrl = '';
            params = [ this.faultData.anode, this.faultData.bnode ]
            analyseUrl = 'analyseDevice/analyseIpHaveDevice';
            axiosHttp.post(baseUrl.BASEURL + analyseUrl,params)
                .then((res) => {
                    if(res.data.status == 1){
                        this.routeListIp = res.data.data;
                    }else {
                        CommonFun.responseError(res.data, this);
                    }
                })
        },
        getFaultList() {
            let params = {
                beginTime: this.searchData.beginTime/1000,
                endTime: this.searchData.endTime/1000,
                page: this.currentPage,
                pageSize: this.pageSize,
                interfaceId: this.faultData.interfaceId,
                sort: this.currentSort,
                order: this.currentOrder,
            }
            let faultUrl = '';
            if(this.faultData.changeTable){
                faultUrl = 'analyseTask/relayTaskFaultListPageByInterfaceId'
            }else {
                faultUrl = 'analyseTask/relayTaskFaultListPageByTask'
            }
            axiosHttp.post(baseUrl.BASEURL + faultUrl, params)
                .then((res) => {
                    if(res.data.status == 1){
                        this.listData = res.data.data.records;
                        this.totle = res.data.data.total
                    }else{
                        CommonFun.responseError(res.data, this);
                    }
                })
                .catch((res) => {
                    CommonFun.responseError(res, this);
                })
        },
        searchAction() {
           this.faultData.beginTime = '';
           this.faultData.beginTime = this.searchData.beginTime/1000;
           this.faultData.endTime = this.searchData.endTime/1000;
           if(this.faultData.changeTable){
                this.getFaultList();
            }else{
                this.getTaskInterfaceList()
            }
        },
        sortChangeFun(column, prop, order){
            let $this = this
            if(column.prop == 'beginTime'){
                $this.currentSort = 'begin_time';
            }else if(column.prop == "duration"){
                $this.currentSort = 'duration';
            }else if(column.prop == 'endTime'){
                $this.currentSort = "end_time"
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
            this.getFaultList();
        },
        sortChangeFunInterface(column){
            let $this = this
            if(column.prop == 'count'){
                $this.currentSort = 'count';
            }else if(column.prop == "duration"){
                $this.currentSort = 'duration';
            }else if(column.prop == 'avgDuration'){
                $this.currentSort = "avg_duration"
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
            this.getTaskInterfaceList();
        },
        getTaskInterfaceList() {
            let params = {
                beginTime: this.searchData.beginTime/1000,
                endTime: this.searchData.endTime/1000,
                page: this.currentPage,
                pageSize: this.pageSize,
                taskId: this.faultData.taskId,
                sort: this.currentSort,
                order: this.currentOrder,
            }
            axiosHttp.post(baseUrl.BASEURL + 'analyseTask/relayTaskListPageByTask', params)
                .then((res) => {
                    if(res.data.status == 1){
                        this.taskInterfaceListData = res.data.data.records;
                        this.listTotle = res.data.data.total
                        if(res.data.data.records.length){
                            this.$refs.interfaceListTable.setCurrentRow(this.taskInterfaceListData[0]);
                            this.faultData = {...this.faultData, ...res.data.data.records[0], interfaceId: res.data.data.records[0].interfaceId,taskType: 2, changeTransmitEchart: true}
                            this.getFaultList()
                            this.getList();
                        }
                    }else{
                        CommonFun.responseError(res.data, this);
                    }
                })
                .catch((res) => {
                    CommonFun.responseError(res, this);
                })
        },
        handleCurrentSelectChange(nVal, oVal) {
            if(oVal){
                this.faultData = {...this.faultData, ...nVal, interfaceId: nVal.interfaceId,taskType: 2, changeTransmitEchart: true}
                this.getFaultList()
                this.getList();
            }
        },
        handleCurrentChange: function(val) {
            let $this = this
            $this.currentPage = val
            $this.getFaultList()
        },
        handleCurrentChange1(val) {
            this.currentPage1 = val
            this.getTaskInterfaceList();
        },
        handleSizeChange1(val) {
            this.currentPage1 = 1
            this.pageSize1 = val
            this.getTaskInterfaceList()
        },
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getFaultList()
        },
        routerBack() {
            this.$router.back();
        },
        getBasicInfo() {
            if(this.faultData.changeTable) {
                this.basicInfo = [
                    ['任务名称', this.faultData.taskName],
                    ['拨测接口', this.faultData.probeIp],
                    ['目的地址', this.faultData.targetIp],
                    ['机构名称', this.faultData.companyName],
                    ['用户名', this.faultData.userName],
                    ['标签', this.faultData.falg],
                    ['节点A', this.faultData.anode],
                    ['节点B', this.faultData.bnode],
                    ['故障总时长', this.faultData.duration],
                    ['故障总次数', this.faultData.count],
                    ['故障平均时长', this.faultData.avgDuration],
                    ['当前状态', this.faultData.statusName]
                ]
            }else {
                this.basicInfo = [
                    ['任务名称', this.faultData.taskName],
                    ['拨测接口', this.faultData.probeIp],
                    ['目的地址', this.faultData.targetIp],
                    ['机构名称', this.faultData.companyName]
                ]
            }
            let TimeEnd = this.faultData.endTime*1000 || new Date().getTime();
            this.faultData.beginTime = (this.faultData.beginTime - 15*60);
            this.faultData.endTime = ((TimeEnd <= (new Date().getTime() - 15*60*1000)) ? (TimeEnd+15*60*1000) : new Date().getTime())/1000;
            this.searchData = {beginTime: this.faultData.beginTime*1000, endTime: this.faultData.endTime*1000}
      }
    },
    created() {
        this.getBasicInfo();
        if(this.faultData.changeTable){
            this.getFaultList();
            this.getList();
        }else{
            this.getTaskInterfaceList()
        }
    }
}
</script>