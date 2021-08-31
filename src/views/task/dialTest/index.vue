<template>
    <div class="content outerbox-pro">
        <div class="topruleform">
            <div class="topruleform-inline gapright30">
                <label>开始时间：</label>
                <el-date-picker
                    v-model="searchData.beginDate"
                    type="date"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="topruleform-inline gapright30">
                <label>结束时间：</label>
                <el-date-picker
                    v-model="searchData.endDate"
                    type="date"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="topruleform-inline gapright30">
                <label>探针IP：</label>
                <el-select class="ellipsis-elselect" collapse-tags v-model="searchData.deviceIdList" filterable multiple placeholder="选择探针" clearable>
                    <el-option v-for="item in probeDeviceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="block topruleform-inline gapright30">
                <label>组织机构：</label>
                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
            </div>
            <div class="topruleform-inline gapright30">
                <label>任务类型：</label>
                <el-select v-model="searchData.type" class="ellipsis-elselect" placeholder="拨测类型" clearable>
                    <el-option v-for="item in dialTaskTypeList" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="topruleform-inline gapright30">
                <label>任务协议：</label>
                <el-select v-model="searchData.protocolIdList" class="ellipsis-elselect" multiple collapse-tags placeholder="任务协议"
                    clearable>
                    <el-option v-for="item in taskProtocolList" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="topruleform-inline gapright30">
                <label>任务状态：</label>
                <el-select v-model="searchData.status" class="ellipsis-elselect" placeholder="任务状态" clearable>
                    <el-option v-for="item in taskStatusList" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="topruleform-inline gapright30">
                <label>模糊查询：</label>
                <el-input v-model="searchData.keyword" placeholder="请输入关键字"></el-input>
            </div>
            <div class="but popup-but-submit gapright30" @click="handleSearch"><i class="el-icon-search"></i></div>
            <div v-if="currentButtonJurisdiction.indexOf('add') > -1" class="but popup-but-submit gapright30" @click="handlerAdd">新增</div>
            <div v-if="currentButtonJurisdiction.indexOf('send') > -1" class="but popup-but-submit gapright30" @click="sendTaskFun">下发任务</div>
            <div v-if="currentButtonJurisdiction.indexOf('stop') > -1" class="but popup-but-submit gapright30" @click="batchStop">批量暂停</div>
            <div v-if="currentButtonJurisdiction.indexOf('delete') > -1" class="but popup-but-submit" @click="batchDelete">批量删除</div>
        </div>
        <div class="listbox">
            <div class="list-outer-div">
                <div class="list-content-div">
                    <el-table
                        ref="multipleTable"
                        :data="listData" 
                        height="100%" 
                        row-key="id"
                        stripe 
                        header-row-class-name="table-header-row" 
                        row-class-name="table-row" 
                        @sort-change="sortFunc" 
                        style="width: 100%">
                        <div slot="empty" class="no-data-box">
                            <img src="../../../assets/no-data-table.png"/>
                            <p>暂无数据</p>
                        </div>
                        <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
                        <el-table-column width="100" prop="probeIp" label="探针IP"></el-table-column>
                        <el-table-column width="100" prop="probeInterfaceIp" label="拨测接口"></el-table-column>
                        <el-table-column width="100" prop="targetIp" label="目标IP"></el-table-column>
                        <el-table-column width="70" prop="sourcePort" :formatter="sourcePortFormatter" label="拨测端口"></el-table-column>
                        <el-table-column width="70" prop="targetPort" :formatter="targetPortFormatter" label="目标端口" ></el-table-column>
                        <el-table-column width="150" :formatter="CommonFun.formatterCompanyName" label="组织机构" show-overflow-tooltip></el-table-column>
                        <el-table-column width="90" prop="validityCycle" label="生效日期" sortable show-overflow-tooltip></el-table-column>
                        <el-table-column width="125" prop="validityBeginTime" label="生效时间" sortable :formatter="timeFormatter"></el-table-column>
                        <el-table-column width="90" prop="dialCycle" label="拨测周期" sortable></el-table-column>
                        <el-table-column width="70" prop="minTtl" label="最小TTL"></el-table-column>
                        <el-table-column width="70" prop="maxTtl" label="最大TTL"></el-table-column>
                        <el-table-column width="90" prop="dialCount" label="每跳探测次数"></el-table-column>
                        <el-table-column width="145" prop="gmtCreate" label="创建时间" sortable show-overflow-tooltip></el-table-column>
                        <!-- <el-table-column width="70" prop="typeName" label="任务类型"></el-table-column>
                        <el-table-column width="70" prop="protocolName" label="任务协议"></el-table-column>
                        <el-table-column width="70" prop="statusName" label="任务状态"></el-table-column> -->
                        <el-table-column width="100" label="操作" align="center">
                            <template slot-scope="scope">
                                <div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="handleEdit(scope.$index, scope.row)"><i
                                        class="el-icon-edit-outline"></i></div>
                                <div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="handleDelete(scope.$index, scope.row)"><i
                                        class="el-icon-delete"></i></div>
                                <div class="btnBox" title="启用" v-if="currentButtonJurisdiction.indexOf('start')>-1" v-show="scope.row.status==0"
                                    @click="statusFun(scope.row, 1)"><i class="el-icon-video-play"></i></div>
                                <div class="btnBox" title="停用" v-if="currentButtonJurisdiction.indexOf('stop')>-1" v-show="scope.row.status==1"
                                    @click="statusFun(scope.row, 0)"><i class="el-icon-video-pause"></i></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagebox">
                    <!-- <span class="page-span">共{{totle}}条记录，当前为第{{currentPage}}页</span> -->
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :page-sizes="$store.state.pageSizes"
                        layout="sizes,total,prev, pager, next, jumper"
                        @size-change="handleSizeChange" 
                        :total="totle"
                        background />
                    <el-upload :action="uploadUrl"
                        :show-file-list='false'
                        :on-success="handleUploadSuccess"
                        :on-error='handleUploadError'
                        :before-upload='handleUploadBefore'
                        :headers="myHeaders" 
                        accept=".xlsx,.xls"
                        >
                        <span class="pageExport pageImport"><i class="pageImport-img"></i>导入</span>
                    </el-upload>
                    <div class="pageExport" @click="downExcel"><i class="pageExport-img"></i>下载模板</div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="visibleCompany" :close-on-click-modal="false" v-if="visibleCompany" width="690px">
            <div class="popup">
                <div class="title">单位选择</div> 
                <div class="hidepopup" @click="visibleCompany=!visibleCompany">×</div>
                <SelectCompanyComponent type="multiple" :checkStrictly="false" v-on:setSearchCompanyIds='setSearchCompanyIds'
                v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIdsOfSearch'
                :checkedMenuName='currenCompanyNameOfSearch'></SelectCompanyComponent>
            </div>
        </el-dialog>
        <DetailDialog
            v-if="visible" 
            :visible.sync="visible" 
            :title="title" 
            :staut="staut" 
            :detail-data="detailData"
            @closeDialog="closeDialog" />
        <el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
            <div class="popup">
                <div class="title">删除</div>
                <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
                <div class="add-info-box">
                    <p class="popop-tipinfo">确定删除该数据吗？</p>
                </div>
                <div class="popup-buts">
                    <div class="popup-but popup-but-submit" @click="submitDelete()">确定</div>
                    <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogTableVisible_delete_batch" :close-on-click-modal="false" width="21.9%">
            <div class="popup">
                <div class="title">批量删除</div>
                <div class="hidepopup" @click="dialogTableVisible_delete_batch=!dialogTableVisible_delete_batch">×</div>
                <div class="add-info-box">
                    <p class="popop-tipinfo">确定删除选中数据吗？</p>
                </div>
                <div class="popup-buts">
                    <div class="popup-but popup-but-submit" @click="batchDeleteSubmit()">确定</div>
                    <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete_batch= !dialogTableVisible_delete_batch">取消</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import baseUrl from '@/js/baseUrl.js'
import ApiTaskDiaTest from './api';
import CommonFun from '@/js/commonFun.js';
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import DetailDialog from './components/detailDialog';
import { mapState } from 'vuex';
export default {
    name: 'taskDialTest',
	components: {
		SelectCompanyComponent, DetailDialog
	},
    data() {
        return {
            loading: false,
            dialogTableVisible_down: false,
            uploadUrl: `${baseUrl.BASEURL}taskManagerDial/file/list`,
            myHeaders: {token:sessionStorage.getItem('token')},
            dialogTableVisible_delete_batch: false,
            dialogTableVisible_delete: false,
            searchData: {
                name: '',
                ip: ''
            },
            currenCompanyNameOfSearch: [],
            currenCompanyIdsOfSearch: [],
            currenCompanyName: '选择单位',
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('taskDialTest'),
            listData: [],
            currentPage: 1,
			totle: 0,
            pageSize: 20,
            
            //弹出框
            visible: false,
            title: '新增',
            staut: 1,
            detailData: { //操作行

            },
            pickerOptions: {
                disabledDate: time =>{
                    let timeOptionRange = this.searchData.beginDate;
                    let now = Date.now();
                    if(timeOptionRange){
                        return time.getTime() < new Date(timeOptionRange).getTime() || time.getTime() > now;
                    }
                    return time.getTime() > now;
                }
            },
            visibleCompany: false,
        }
    },
    created() {
        this.getList().then((res, error) => {
            //加载探针申报列表为全局缓存数据
            this.$store.dispatch('getProbeDeviceListData', {});
        })
    },
    mounted() {
        
    },
    computed: {
		...mapState({
			probeDeviceList: state => state.probeDeviceList,
            taskValidityList: state => CommonFun.getDataDictionaryChildrenListData(state.taskValidityValue),
            dialTaskTypeList: state => CommonFun.getDataDictionaryChildrenListData(state.dialTaskTypeValue),
            taskProtocolList: state => CommonFun.getDataDictionaryChildrenListData(state.taskProtocolValue),
            taskStatusList: state => CommonFun.getDataDictionaryChildrenListData(state.taskStatusValue)
		})
	},
    methods: {
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
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        sortFunc(obj) {
            let field = 0;
            switch(obj.prop) {
                case 'validityCycle':
                    field = 0;
                    break;
                case 'validityBeginTime':
                    field = 1;
                    break;
                case 'dialCycle':
                    field = 2;
                    break;
                case 'gmtCreate':
                    field = 3;
                    break;
            }
            this.searchData['field'] = field;
            if(obj.order == "ascending") {
                this.searchData.sort = 1
            }else if(obj.order == "descending") {
                this.searchData.sort = 0
            }else{
                this.searchData.sort = undefined;
                this.searchData.orderField = undefined;
            }
            this.getList();
        },
        //查询列表
        getList(page) {
            let that = this;
            let loading = CommonFun.openFullScreen(that);
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.page = page ? page : that.currentPage;
            param.pageSize = this.pageSize;
            param.companyIdList = that.currenCompanyIdsOfSearch.length > 0 ? that.currenCompanyIdsOfSearch : undefined;
            return ApiTaskDiaTest.list(param).then( res => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    that.totle = data.data.total;
                    that.listData = data.data.records;
                }
                else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        sourcePortFormatter(row, column){
            if(row.protocolName == 'ICMP'){
                return '-'
            }else{
                return row.sourcePort
            }
        },
        targetPortFormatter(row, column){
            if(row.protocolName == 'ICMP'){
                return '-'
            }else{
                return row.targetPort
            }
        },
        timeFormatter: function(row, column) {
            return row.validityBeginTime + "-" + row.validityEndTime
        },
        //格式化类型
        selectCompanyFun(type) {
            this.dealType = type
			this.visibleCompany = true
        },
        handleSearch() {
            this.currentPage = 1;
            this.getList();
        },
        getTableSelection() {
            let list = this.$refs.multipleTable.selection.map(item => {
                return item.id;
            });
            if(list.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请至少选中一条任务'
                });
                return false
            }
            return list;
        },
        //下发
        sendTaskFun() {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            let params = {idList: list};
            ApiTaskDiaTest.send(params).then( res => {
                const data = res.data;
                
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            })
        },
        //批量暂停
        batchStop(item) {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            let params = {idList: list, status: 0};

            let loading = CommonFun.openFullScreen(this)
            ApiTaskDiaTest.status(params).then((res) => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList();
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        //批量暂停
        batchDelete() {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            this.dialogTableVisible_delete_batch = true;
        },
        batchDeleteSubmit() {
            let list = this.getTableSelection();
            let params = {idList: list};
            let loading = CommonFun.openFullScreen(this);
            ApiTaskDiaTest.delete(params).then((res) => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
                this.dialogTableVisible_delete_batch = false;
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        handlerAdd() {
            this.visible = true;
            this.title = '新增';
            this.staut = 1;
            let validityCycleExArr = [];
            for(let i = 0; i < this.taskValidityList.length; i++) {
                validityCycleExArr.push(this.taskValidityList[i].value);
            }
            this.detailData = {
                dialCycle: 5,
                sourcePort: 9967,
                targetPort: 33435,
                validityCycleEx: validityCycleExArr,
                validityBeginTime: '00:00:00',
                validityEndTime: '23:59:59',
                dialCycle: 5,
                minTtl: 1, 
                maxTtl: 15, 
                dialCount: 1,
            };
        },
        handleEdit(index, row) {
            this.visible = true;
            this.title = '编辑';
            this.staut = 2;
            this.detailData = JSON.parse(JSON.stringify(row));
        },
        downExcel() {
            this.visible = true;
            this.title = '下载模板';
            this.staut = 3;
            let validityCycleExArr = [];
            for(let i = 0; i < this.taskValidityList.length; i++){
                validityCycleExArr.push(this.taskValidityList[i].value);
            }

            let protocolValue = this.taskProtocolList.find(item => item.label === 'ICMP')['value'];
            this.detailData = {
                dialCycle: 5,
                sourcePort: 9967,
                targetPort: 33435,
                validityCycleEx: validityCycleExArr,
                validityBeginTime: '00:00:00',
                validityEndTime: '23:59:59',
                dialCycle: 5,
                minTtl: 1, 
                maxTtl: 15, 
                dialCount: 1,
                deviceId: this.$store.state.probeDeviceList[0].id,
                type: this.dialTaskTypeList.find(item => item.label === 'Trace')['value'],
                protocol: protocolValue
            }
        },
        handleView(index, row) {
            this.visible = true;
            this.title = '查看';
            this.staut = 0;
            this.detailData = JSON.parse(JSON.stringify(row));
        },
        handleDelete(index, row) {
            this.dialogTableVisible_delete = true;
            this.detailData = JSON.parse(JSON.stringify(row));    
        },
        //上传相关
        handleUploadSuccess: function (response, file, fileList){
            let $this = this
            console.log("返回成功内容：")
            console.log(response)
            CommonFun.closeFullScreen($this.loading)
            if(response.status == 1){
                CommonFun.responseSuccess('导入成功', $this)
                $this.getList()
            }
            else{
                CommonFun.responseError(response, $this)
            }
        }, 
        handleUploadError: function (err, file, fileList){
            let $this = this
            console.log("返回错误内容：")
            console.log(err,file,fileList)
            CommonFun.responseError(err, $this)
            CommonFun.closeFullScreen($this.loading)
        },
        handleUploadBefore: function (file){
            let $this = this
            $this.loading = CommonFun.openFullScreen($this)
		},
        statusFun(item, status) {
            let loading = CommonFun.openFullScreen(this)
            ApiTaskDiaTest.status({id: item.id, status: status}).then((res) => {
                CommonFun.closeFullScreen(loading)
                if (res.data.status === 1) {
                    this.getList()
                }
                else {
                    CommonFun.responseError(res.data, this)
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading)
            })
        },
        submitDelete() {
            ApiTaskDiaTest.delete({id: this.detailData.id}).then( res => {
                const data = res.data;
                
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
                this.dialogTableVisible_delete = false;
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },
        closeDialog(boo) {
            this.visible = boo;
            this.getList();
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    padding: 27px;
    .topruleform {
        margin-bottom: 15px;
    }
}
.listbox{height: calc(100% - 137px);}
</style>