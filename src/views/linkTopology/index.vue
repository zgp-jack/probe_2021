<template>
    <div class="topology-content">
        <div class="content-box" style="margin-right: 12px; flex-grow: 1; width: calc(100% - 724px)">
            
            <div class="content-item panel-item" style="flex-grow: 1; margin-bottom: 0">
                <div class="content-item-title panel-title">
                    拓扑图
                    <i class="el-icon-full-screen" @click="setFullScreen"></i>
                    <i class="el-icon-view" @click="showNodeLable"></i>
                </div>
                <div id="chart-checked-list" v-show="!!checkedRouteList">
                    <div v-for="(item,index) of checkedRouteList" :key="index" class="route-list">
                        <span class="route-item">
                            <i class="route-item-cricle" style="background-color: #E4DB65" />{{device[0].ip}}
                        </span>
                        <span v-for="item1,index1 of item" :key="index1" class="route-item">
                            <i class="route-item-cricle" :style="{backgroundColor: getColor(item1, index1, item.length)}"/>{{item1.name}}
                        </span>
                    </div>
                </div>
                <v-chart ref="chart" @getCheckedRoute="getCheckedRoute" v-show="this.searchClick && this.search.deviceId"></v-chart>
                <div class="no-data-box" v-show="!this.searchClick || !this.search.deviceId">
                    <img src="../../assets/no-data-task.png" />
                    <p>请选显示任务</p>
                </div>
                <div id="fullscreenTable">
                    <v-table ref="fullTable" :isfullscreen="fullscreen" v-if="!fullscreen"></v-table>
                </div>
            </div>
        </div>
        <div class="content-box" style="background-color: transparent; width: 700px; flex-grow: 1" v-show="fullscreen">
            <div class="content-item panel-item" style="padding-bottom:0">
                <div class="content-item-title panel-title">
                    筛选条件
                    <div style="float: right; cursor: pointer; color: #00D7CE;" @click="searchAction()"><i style=" font-size: 16px" class="el-icon-search"></i></div>
                </div>
                <el-form label-position="left" label-width="80px" :model="search" size="small" style="margin-top: 20px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="组织机构">
                                <div
									:class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]"
									@click="showCompany"
								>{{ currenCompanyName }}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="探针IP">
                                <el-select v-model="search.deviceId" class="add-item-input" @change="selectChanged">
									<el-option v-for="item in probeDeviceList" :key="item.id" :label="item.ip" :value="item.id"></el-option>
								</el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="拨测接口">
                                <el-select v-model="search.deviceDetailId" class="add-item-input">
									<el-option v-for="item in probeDeviceDetailList" :key="item.id" :label="item.ip" :value="item.id"></el-option>
								</el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="任务集">
                                <div
                                    :class="['search-div',{'search-div-placeholder': taskCollect == '选择任务集'}]"
                                    @click="visibleTask=true"
                                >{{taskCollect}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="目标集">
                                <div 
                                    :class="['search-div',{'search-div-placeholder': targetCollect == '选择目标集'}]"
                                    @click="visibleTarget=true"
                                >{{targetCollect}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="content-item panel-item">
                <div class="content-item-title panel-title">故障趋势</div>
                <div style="height: 200px">
                    <MultipleLine ref="multipleLine"></MultipleLine>
                </div>
                
            </div>
            <div class="content-item panel-item" style="flex-grow: 1; margin-bottom: 0">
                <div class="content-item-title panel-title">故障提示</div>
                <v-table ref="table" v-if="fullscreen"></v-table>
            </div>
        </div>
        <el-dialog :visible.sync="visibleCompany" :close-on-click-modal="false" v-if="visibleCompany" width="690px">
            <div class="popup">
                <div class="title">单位选择</div> 
                <div class="hidepopup" @click="visibleCompany = !visibleCompany">×</div>
                <SelectCompanyComponent
                    type='single' 
                    @setSearchCompanyId='setSearchCompanyId'
                    @setSearchCompanyName='setSearchCompanyName' 
                    @closeSelectcompany='closeSelectcompany' 
                    :checkedMenuId='currenCompanyIdsOfEdit'
                    :checkedMenuName='currenCompanyName'
                ></SelectCompanyComponent>
            </div>
        </el-dialog>
        <TargetCollect :visible.sync="visibleTarget" @setFormData="setFormData"></TargetCollect>
        <TaskCollect v-if="visibleTask" :params="search" :defaultData="search.taskIds" :visible.sync="visibleTask" @setFormData="setFormData"></TaskCollect>
    </div>
</template>
<script>

import CommonFun from '../../js/commonFun';
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";

import vChart from './components/chart';
import MultipleLine from './components/multipleLine';
import SelectCompanyComponent from '../../components/selectCompanyComponent';
import TargetCollect from './components/targetCollect.vue';
import TaskCollect from './components/taskCollect.vue';
import vTable from './components/table.vue';
export default {
    name: "TopologyChart",
    components: {
        vChart,
        MultipleLine,
        SelectCompanyComponent,
        TargetCollect,
        TaskCollect,
        vTable
    },
    data() {
        return {
            searchClick: false,
            search:  {
                companyId: '',
                deviceId: '',
                deviceDetailId: '',
                taskIds: [],
                targetIpList: []
            },
            visibleTarget: false,
            visibleTask: false,
            visibleCompany: false,
            currenCompanyName: '选择单位',
			currenCompanyIdsOfEdit: null,
            probeDeviceDetailList: [],
            checkedRouteList: null,
            currtPointAlarm: false,
            gridData: [],
            nodeShow: true,
            taskCollect: '选择任务集',
            targetCollect: '选择目标集',
            device: {ip: '10.10.10.10', id: 9},
            fullscreen: true,
            timer: null,
            needSelectTask: false
        };
    },
    computed: {
        probeDeviceList () {
            return this.$store.state.probeDeviceListAndTask;
        }
    },
    created() {
        this.$store.dispatch('getProbeDeviceListAndTaskNumberData', {});
    },
    mounted() {
        //this.init();
        if(!!this.timer) {
            clearInterval(this.timer);
        }
    },
    beforeDestroy() {
        if(!!this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        init() {
            let beginTime = parseInt(+new Date(2021, 3, 16) / 1000) - 3600;
            let endTime = parseInt(+new Date(2021, 3, 20) / 1000);

            // this.search.deviceId = 9;
            // this.selectChanged(9);

            this.$nextTick(() => {
                //故障趋势
                this.$refs.multipleLine.init(this.search);
                //故障提示
                this.$refs.table && this.$refs.table.init(this.search);
                this.$refs.fullTable && this.$refs.fullTable.init(this.search);
                //拓扑图
                this.$refs.chart.init(this.search, this.device);
            })
            if(!this.timer) {
                this.timer = setInterval(() => {
                    this.$refs.chart.init(this.search, this.device);
                    this.$refs.multipleLine.init(this.search);

                    //故障提示
                    // this.$refs.table && this.$refs.table.init(this.search);
                    // this.$refs.fullTable && this.$refs.fullTable.init(this.search);
                }, 60000)
            }
        },
        searchAction() {
            console.log(this.needSelectTask, 'needSelectTask');
            if(this.needSelectTask && this.search.taskIds.length === 0 && this.search.targetIpList.length === 0) {
                CommonFun.responseError({message: '该探针下任务过多，将优先展示故障的节点'}, this);
                //return;
            }
            this.searchClick = true;
            this.init();
        },
        //开关label显示
        showNodeLable() {
            this.nodeShow = !this.nodeShow;
            this.$refs.chart.showNodeLable(this.nodeShow);
        },
        setFullScreen() {
            this.fullscreen = !this.fullscreen;
            this.$nextTick(() => {
                if(this.$refs.table) {
                    this.$refs.table.height = 160;
                    this.$refs.table.param.pageSize = 5;
                    this.$refs.table.param.page = 0;
                    this.$refs.table.isfullscreens = false;
                    this.$nextTick(() => {
                        this.$refs.table && this.$refs.table.init(this.search);
                    })
                }
                if(this.$refs.fullTable) {
                    this.$refs.fullTable.height = 96;
                    this.$refs.fullTable.param.pageSize = 3;
                    this.$refs.fullTable.param.page = 0;
                    this.$refs.fullTable.isfullscreens = true;
                    this.$nextTick(() => {
                        this.$refs.fullTable && this.$refs.fullTable.init(this.search);
                    })
                }
                this.$refs.chart.resetSize();
            })
        },
        getColor(item, index, len) {
            if(index === 0) {
                return '#49FFE7';
            } else if (index === len - 1) {
                if(!item.taskStatus) {
                    return '#ccc';
                }
                if(item.status) {
                    return '#FF2E2E';
                } else {
                    return '#00A8FF';
                }
            }
            return '#49FFE7';
        },
        getCheckedRoute(routeList) {
            this.checkedRouteList = routeList;
        },
        setSearchCompanyId(data) {
			this.currenCompanyIdsOfEdit = data;
			this.search['companyId'] = data;
		},
        setSearchCompanyName(data) {
			let that = this;
			if(CommonFun.ifNall(data)){
				that.currenCompanyName = '选择单位';
			}else{
				that.currenCompanyName = data;
			}
		},
        showCompany() {
			this.visibleCompany = true;
		},
		closeSelectcompany() {
			this.visibleCompany = false;
		},
        selectChanged: function(value, type) {
            let $this = this
            this.device = this.probeDeviceList.filter(item => item.id === value);
            this.checkedRouteList = null;
            this.needSelectTask = this.device[0].taskNumber > 150;
            console.log(this.device, 'device');
            // let loading = CommonFun.openFullScreen($this)
            axiosHttp.post(baseUrl.BASEURL + 'probeDeviceDetail/list', {
                deviceId: value
            }).then(function(res) {
                // CommonFun.closeFullScreen(loading)
                if (res.data.status === 1) {
                    // if (CommonFun.ifNall(type)) {
                    //     $this.$set($this.currentItem, 'deviceDetailId', null)
                    // }
                    $this.probeDeviceDetailList = res.data.data;
                } else {
                    CommonFun.responseError(res.data, $this);
                }
            }).catch(function(err) {
                // CommonFun.closeFullScreen(loading)
            })
        },
        setFormData(key, val) {
            switch(key) {
                case 'targetIp':
                    //
                    this.search.targetIpList = [];
                    this.targetCollect = val.map(item => {
                        this.search.targetIpList.push(item.name);
                        return item.name;
                    }).toString() || '选择目标集';
                    break;
                case 'taskId':
                    //
                    this.search.taskIds = [];
                    this.taskCollect = val.map(item => {
                        this.search.taskIds.push(item.id);
                        return item.targetIp;
                    }).join('/') || '选择任务集';
                    break;
            }
        },
    },
    watch: {
        probeDeviceList (newVal, oldVal) {
            // const device = newVal[0];
            // this.search.deviceId = device.id;
            // this.selectChanged(device.id);
            // this.init();
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label{
    color: #fff;
}
.no-data-box{
    height: calc(100% - 50px);
    padding-top: 250px;
    font-size: 16px;
}
.route-list{
    .route-item{
        display: inline-block;
        position: relative;
        padding-left: 20px;
        margin-right: 15px;
        .route-item-cricle {
            content: '';
            width: 10px;
            height: 10px;
            top: 3px;
            left: 5px;
            background-color: #fff;
            position: absolute;
            border-radius: 50%;
        }
    }
    .route-item::after {
        content: '';
        width: 8px;
        height: 2px;
        background: #fff;
        position: absolute;
        right: -16px;
        top: 7px;
    }
    .route-item:last-child::after{
        display: none;
    }
}
#chart-checked-list{
    position: absolute;
    padding: 12px;
    right: 20px;
    top: 54px;
    max-width: calc(100% - 40px);
    width: auto;
    height: auto;
    color: #fff;
    span{
        z-index: 11;
        position: relative;
        display: inline-block;
        margin: 0 20px 0 0;
        vertical-align: middle;
    }
}
#chart-checked-list::after{
    content: '';
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    border: 1px solid #29B3AD;
    opacity: .5;
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.popover-task-list::v-deep th.is-leaf{
    background-color: transparent !important;
    border: none;
}
.popover-task-list::v-deep .el-table-column--selection .cell{
    display: none;
}
#fullscreenTable{
    position: absolute;
    bottom: 20px;
    left: 20%;
}
.topology-content{
    display: flex;
    padding: 27px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    .content-box{
        height: 100%;
        display: flex;
        flex-direction: column;
        .content-item{
            position: relative;
            height: calc(100% - 20px);
            width: calc(100% - 6px);
            flex-grow: 0;
            box-sizing: border-box;
            padding: 0 20px 20px 20px;
            margin-bottom: 20px;
            .content-item-title{
                font-size: 16px;
                width: 100%;
                >i{
                    font-size: 20px;
                    float: right;
                    color: #00D7CE;
                    margin-left: 15px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            }
        }
    }
    
}

</style>