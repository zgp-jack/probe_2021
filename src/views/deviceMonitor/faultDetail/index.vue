<template>
	<div class="content" id="indexPanel">
        <div class="topruleform">
            <div class="but popup-but-submit btn-back" @click="$router.back()"><i class="btn-return-icon-white"></i> 返回</div>
            <label>开始时间：</label>
            <div class="block gapright30 topruleform-item">
                <el-date-picker
                    v-model="searchData.beginTime"
                    type="datetime"
                    value-format="timestamp"
                    :clearable="false"
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
                    :editable="false"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <!-- <label>机构：</label>
            <div class="gapright30 topruleform-width220">
                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
            </div> -->
            <!-- <label>条件查询：</label>
            <div class="gapright topruleform-width150">
                <el-input v-model="searchData.keyWord" placeholder="搜索关键词"></el-input>
            </div> -->
            <div class="but popup-but-submit" @click="handleSearch"><i class="el-icon-search"></i></div>
            <!-- <div class="but add-but" @click="exportListFun"><i class="el-icon-circle-plus-outline"></i>导出</div> -->
        </div>
        <el-scrollbar style="height: calc(100% - 45px)">
            <div style="width: calc(100% - 17px); height: auto">
                <div class="panel-item" style="flex-grow: 1;">
                    <div class="panel-title">CPU/内存利用率</div>
                    <mulitiple-line-one ref="cpuMemory" :data1="cpuUseList" :data2="memoryUseList"></mulitiple-line-one>
                </div>
                <div class="panel-item lineChart" style="flex-grow: 1;">
                    <div class="panel-title">接口流量趋势</div>
                    <el-checkbox v-if="listDataDefalut.length > 1"  @change="setChecked">仅看有流量</el-checkbox>
                    <template v-if="deviceIFDatum.length > 0">
                        <mulitiple-line v-for="item,index in deviceIFDatum" :key="index" :defaultData="item"></mulitiple-line>
                    </template>
                </div>
            </div>
            <slot name="table"></slot>
        </el-scrollbar>
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
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";
import CommonFun from "@/js/commonFun.js";
import MulitipleLine from './components/mulitipleLine.vue';
import MulitipleLineOne from './components/mulitipleLine1.vue';
import SelectCompanyComponent from '@/components/selectCompanyComponent.vue';
var elementResizeDetectorMaker = require('element-resize-detector');
import moment from 'moment'
import {mapState} from 'vuex'
export default {
    name: 'faultDetail',
    components: {
        SelectCompanyComponent,
        MulitipleLine,
        MulitipleLineOne
    },
    data() {
        return {
            listDataDefalut: [],
            searchData: {
                deviceId: '',
                keyWord: '',
                beginTime: null,
                endTime: null
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
                    if(timeOptionRange){
                        return time.getTime() < new Date(timeOptionRange).getTime() || time.getTime() > now;
                    }
                    return time.getTime() > now;
                },
                selectableRange: "00:00:00 - 23:59:59",
            },  

            deviceIFDatum: [],
            cpuUseList: [],
            memoryUseList: []
        }
    },
    created() {
        this.searchData.deviceId = this.$route.query.id;
        // this.searchData.deviceId = this.$route.query.deviceId;
        this.searchData.beginTime = this.$route.query.beginTime * 1000;
        this.searchData.endTime = this.$route.query.endTime * 1000;
    },
    mounted() {
        this.handleSearch();
        // let erd = elementResizeDetectorMaker();
        // erd.listenTo(document.getElementById("indexPanel"), this.CommonFun.debounce(this.resizeFunc));
    },
    computed: {
        ...mapState({
            cpuMemoryUseList: state => state.cpuMemoryUseList
        })
    },
    methods: {
        setChecked(bool){
            let $this = this;
            if(bool){
                let listArr = [];
                $this.listDataDefalut.forEach(item => {
                    if(item.fluxData.length){
                        listArr.push(item);
                    }
                })
                $this.deviceIFDatum = listArr;
            }else{
                $this.deviceIFDatum = $this.listDataDefalut;
            }
        },
        handleSearch() {
            let params = {
                beginTime: '',
                endTime: ''
            };
            //更新
            params.beginTime = this.searchData.beginTime ? this.searchData.beginTime / 1000: '';
            params.endTime = this.searchData.endTime ? this.searchData.endTime / 1000: '';
            params.deviceId = this.searchData.deviceId;
            this.getDeviceDatum(params);
            this.getDeviceInterfaceDatum(params);
            // this.currenCompanyIds.length && (params.companyIdList = this.currenCompanyIds.toString());
        },
        setData(list) {
            this.cpuUseList = list.map(item => {
                return [item.taskTime * 1000, item.cpuUsePercent];
            });
            this.memoryUseList = list.map(item => {
                return [item.taskTime * 1000, item.memoryUsePercent];
            })
            this.$refs.cpuMemory.init(this.cpuUseList, this.memoryUseList);
        },
        getDeviceDatum(param = {}) {
            let loading = CommonFun.openFullScreen(this);
            let params = JSON.parse(JSON.stringify(param));
            axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/queryDeviceDatum`, params).then(res => {
                const data = res.data;
                if(data.status === 1) {
                    if(baseUrl.WSSOURCE === 'false') {
                        this.setData(data.data);
                    }
                    // this.cpuUseList = data.data.map(item => {
                    //     return [item.taskTime * 1000, item.cpuUsePercent];
                    // });
                    // this.memoryUseList = data.data.map(item => {
                    //     return [item.taskTime * 1000, item.memoryUsePercent];
                    // })
                    // this.$refs.cpuMemory.init(this.cpuUseList, this.memoryUseList);
                    CommonFun.closeFullScreen(loading);
                }else {
                    CommonFun.responseError(data, this);
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        getDeviceInterfaceDatum(param = {}) {
            let params = JSON.parse(JSON.stringify(param))
            params.ids = [
                {deviceId: param.deviceId}
            ]
            delete params.deviceId;
            delete params.id;
            let loading = CommonFun.openFullScreen(this);
            axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/queryDeviceInterfaceDatumNew`, params).then(res => {
                const data = res.data;
                if(data.status === 1) {
                    this.deviceIFDatum = data.data;
                    this.listDataDefalut = data.data;
                    CommonFun.closeFullScreen(loading);
                }else {
                    CommonFun.responseError(data, this);
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        selectCompanyFun: function(type) {
            this.dealType = type
            this.dialogTableVisible_selectcompany = true
        },
        setSearchCompanyIds: function(data) {
            this.currenCompanyIds = data
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
    },
    watch: {
        "searchData.endTime": {
            handler(newValue, oldValue) {
                if (newValue) {
                    let date = new Date();
                    let min = date.getMinutes();
                    date.setMinutes(min + 1); 
                    let nowDate = moment(date).format("HH:mm:ss");
                    let st = "";
                    if (moment(date).format("yyyy-MM-DD") === moment(newValue).format("yyyy-MM-DD")) {
                        let hh1 = moment(newValue).format("HH:mm:ss")
                        if(hh1 > nowDate) {
                        this.searchData.endTime = new Date();
                        }
                        st = nowDate;
                    } else {
                        st = "23:59:59";
                    }
                    this.pickerOptions.selectableRange = "00:00:00 - " + st;
                    this.pickerOptions = this.pickerOptions;
                }
            },
            deep: true,
            immediate: true,
        },
        cpuMemoryUseList: {
            handler: function(val) {
                this.setData(val);
            },
            deep: true
        }
    },
}
</script>
<style lang="scss" scoped>
	.content{
        height: 100%;
        box-sizing: border-box;
        padding: 27px;
        
        .bar-chart{
            height: 220px;
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