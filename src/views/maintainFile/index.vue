<template>
	<div class="boxStyle">
		<div class="outerbox-pro" style="height: calc(100% - 105px)">
            <div class="fun-box">
				<div class="topruleform">
					<div class="topruleform-item">
						<p class="topruleform-margin">开始时间：</p>
						 <el-date-picker
							v-model="searchData.beginTime"
							type="datetime"
                            popper-class="begin-now"
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
						<p class="topruleform-margin">机构名称：</p>
						<div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyNames == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyNames }}</div>
                    </div>
					<div class="topruleform-item">
						<p class="topruleform-margin">模糊查询：</p>
						<el-input class="topruleform-width200" v-model="searchData.keyword" placeholder="搜索名称/地址"></el-input>
					</div>
					<div class="topruleform-item">
						<div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
                        <div v-if="currentButtonJurisdiction.indexOf('add') > -1" class="but popup-but-submit" style="margin-left: 20px" @click="addFun">新增</div>
					</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" @sort-change='sortChangeFun' @filter-change="filterData" height="100%" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column prop="name" label="描述" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column :formatter="CommonFun.formatterCompanyName" label="单位名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column prop="beginTime" sortable='custom' :formatter="CommonFun.formatterTime" label="开始时间"></el-table-column>
								<el-table-column :formatter="CommonFun.formatterTime" prop="endTime" sortable='custom' label="结束时间"></el-table-column>
								<el-table-column label="影响数目" prop="count" sortable='custom'>
                                    <template slot-scope="scope">
                                        <span class="targetCount" @click="targetShow(scope.$index, scope.row)">{{scope.row.count}}</span>
                                    </template>
                                </el-table-column>
								<el-table-column prop="accendant" label="维护人员" ></el-table-column>
								<el-table-column prop="phone" label="联系方式"></el-table-column>
								<el-table-column prop="status" label="状态"
                                    column-key="status"
									:filters="statusOption"
                                    :filter-multiple="false"
									filter-placement="bottom">
                                    <template slot-scope="scope">
										<span>{{scope.row.status == 0 ? '计划' : scope.row.status == 1 ? '开始' : '结束' }}</span>
									</template>
                                </el-table-column>
								<el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <div class="btnBox" v-if="currentButtonJurisdiction.indexOf('edit') > -1" title="编辑" @click="editFun(scope.$index, scope.row)"><i
                                                class="el-icon-edit-outline"></i></div>
                                        <div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete') > -1" @click="deleteFun(scope.$index, scope.row)"><i
                                                class="el-icon-delete"></i></div>
                                    </template>
                                </el-table-column>
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
                        <el-upload :action="uploadUrl"
                            :show-file-list='false'
                            :on-success="handleUploadSuccess"
                            :on-error='handleUploadError'
                            :before-upload='handleUploadBefore'
                            :headers="myHeaders" 
                            accept=".xlsx,.xls"
                            >
                            <span class="pageExport pageImport" style="right: 168px !important"><i class="pageImport-img"></i>导入</span>
                        </el-upload>
                        <div class="pageExport" @click="downExcel"><i class="pageExport-img pageImport-img-template"></i>下载模板</div>
                        <!-- <div class="but export-but" @click="exportAnalyseDegradation()">导出</div> -->
                        <div class="pageExport" style="right: 95px" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
					</div>
				</div>
			</div>
            <el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
                <div class="popup">
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
                    <div class="add-info-box">
                        <p class="popop-tipinfo">确定删除该数据吗？</p>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
                    </div>
                </div>
            </el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" v-if="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="846px">
                <el-form class="popup" :model="addTaskData" ref="addTaskData" :rules="addTaskDatarules">
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
                    <div class="add-info-box popupruleform">
                        <div class="alignBoth">
                            <el-form-item prop="name" label="描述" class="flex1">
                                <el-input v-model="addTaskData.name" class="add-item-input" type="text" maxlength="64" placeholder="请输入描述"></el-input>
                            </el-form-item>
                            <el-form-item label="组织机构" class="flex1 marginLeft10">
                                <div :class="['search-div',{'search-div-placeholder':currenCompanyNameOfItem == '选择单位'}]" @click="selectCompanyFun(0)">{{ currenCompanyNameOfItem }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
                            </el-form-item>
                            <el-form-item prop="accendant" label="维护人员" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.accendant" class="add-item-input" type="text" maxlength="11" placeholder="请输入维护人员"></el-input>
                            </el-form-item>
                        </div>
                        <div class="alignBoth">
                            <el-form-item prop="beginTime" label="开始时间" class="flex1 is-required">
                                <el-date-picker
                                    v-model="addTaskData.beginTime"
                                    type="datetime"
                                    popper-class="begin-now"
                                    :clearable="false"
                                    placeholder="请输入开始时间"
                                    :editable="false"
                                    :picker-options="pickerOptions3"
                                    default-time="00:00:00">
                                </el-date-picker>
                                <!-- <el-input v-model="addTaskData.beginTime" class="add-item-input" type="text" placeholder="请输入开始时间"></el-input> -->
                            </el-form-item>
                            <el-form-item prop="endTime" label="结束时间" class="flex1 marginLeft10 is-required">
                                <el-date-picker
                                    v-model="addTaskData.endTime"
                                    type="datetime"
                                    :clearable="false"
                                    placeholder="请输入结束时间"
                                    :editable="false"
                                    :picker-options="pickerOptions4"
                                    default-time="00:00:00">
                                </el-date-picker>
                                <!-- <el-input v-model="addTaskData.endTime" class="add-item-input" type="text" maxlength="16" placeholder="请输入结束时间"></el-input> -->
                            </el-form-item>
                            <el-form-item prop="phone" label="联系方式" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.phone" class="add-item-input" type="text" maxlength="15" placeholder="请输入联系方式"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
                    </div>
                </el-form>
            </el-dialog>
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
            <el-dialog :visible.sync="visibleTarget" append-to-body width="600px">
                <div class="popup">
                    <div class="title">影响节点</div>
                    <div class="hidepopup" @click="handleClose">×</div>
                    <div class="add-info-box">
                        <div class="popup-but popup-but-submit" style="width: 60px; height: 24px; line-height: 24px; margin: 0 0 10px 0" @click="handleEdit">添加</div>
                        <el-table :data="targetList" border :cell-style="{textAlign: 'center'}" :header-cell-style="{background:'#f2f2f2',textAlign:'center'}" class="target-list">
                            <el-table-column type="index" width="55" label="序号"></el-table-column>
                            <el-table-column property="anode" label="节点A">
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.edit">{{scope.row.anode}}</span>
                                    <el-input v-else size="mini" v-model="scope.row.anode" @blur="scope.row.anode && scope.row.bnode && (scope.row.edit = false)"/>
                                </template>
                            </el-table-column>
                            <el-table-column property="bnode" label="节点B">
                                <template slot-scope="scope">
                                    <span v-if="!scope.row.edit">{{scope.row.bnode}}</span>
                                    <el-input v-else size="mini" v-model="scope.row.bnode" @blur="scope.row.anode && scope.row.bnode && (scope.row.edit = false)"/>
                                </template>
                            </el-table-column>
                            <el-table-column width="100" label="">
                                <template slot-scope="scope">
                                    <div class="btnBox" title="编辑" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
                                    <div class="btnBox" title="删除" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="submitTarget">确定</div>
                        <div class="popup-but popup-but-cancel" @click="handleClose">取消</div>
                    </div>
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
    import moment from 'moment';
	export default {
		name: 'maintainFile',
		components: {
			SelectCompanyComponent
		},
		data() {
			return {
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_selectcompany: false,
                dialogTableVisible_delete: false,
				currentPage: 1,
				totle: 0,
				pageSize: this.$store.state.pageSize,
				popupTitle: '新增',
				currentItem: {},
				searchData: {},
				getListUrl: 'analyseTask/listPage',
				listData: [],
                targetList: [],
                addTaskData: {},
                visibleTarget: false,
                maintenanceId: '',
                exportAnalyseDegradationUrl:'analyseTask/exportAnalyseDegradation',
                dealType: 0,
				currenCompanyName: '选择单位',
                currenCompanyNameOfItem: '选择单位',
				currenCompanyIds: [],
				currenCompanyNames: '选择单位',
                currenCompanyId: null,
				getAlarmInfoUrl: 'analyseDevice/listFaultReason',
				getLogInfoUrl: 'taskManagerMaintainLine/listMaintainLine',
				dialogTableVisible_alarmReason: false,
				dialogTableVisible_maintenanceLog: false,
				alarmInfoArr:[],
				LogInfoArr:[],
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('maintainFile'),
				taskOptionsArr: [{
					value: 1,
					label: '拨测任务'
				}, {
					value: 2,
					label: '接口任务'
				}, {
					value: 3,
					label: '专线任务'
				}],
				currentOrder:'',
				currentSort:'',
                statusOption: [
                    {text: '计划', value: 0},
                    {text: '开始', value: 1},
                    {text: '结束', value: 2},
                ],
                addTaskDatarules: {
                    beginTime: [{
                        required: true,
                        message: '开始时间不能为空',
                        trigger: 'change'
                    }],
                    endTime: [{
                        required: true,
                        message: '结束时间不能为空',
                        trigger: 'change'
                    }]
                },
                uploadUrl: `${baseUrl.BASEURL}resource/maintenance/management/importData`,
                myHeaders: {token:sessionStorage.getItem('token')}
			}
		},
		methods: {
            targetShow(index, row) {
                let $this = this;
                this.maintenanceId = row.id
                this.targetList = [];
                let params = {
                    maintenanceId: row.id
                }
                axiosHttp.post(baseUrl.BASEURL + 'resource/maintenanceNode/management/maintenanceNodeResultList', params)
                    .then((res) => {
                        if(res.data.status == 1){
                            res.data.data.forEach((item,index) => {
                                item.edit = false
                                $this.$set($this.targetList, index, item);
                            })
                            this.visibleTarget = !this.visibleTarget;
                        }else{
                            CommonFun.responseError(res.data, this)
                        }
                    })
                    .catch((err) => {
                        CommonFun.responseError(err, this);
                    })
            },
            filterData(value) {
				if(value.status){
                    this.searchData.status = parseInt(value.status);
					this.getList();
				}
			},
            handleDelete(index, row) {
                let $this = this;
                let params = {
                    id: row.id
                }
                axiosHttp.delete(baseUrl.BASEURL + 'resource/maintenanceNode/management/delete', {
                        data: params
                    })
                    .then((res) => {
                        if(res.data.status == 1){
                            this.targetList.splice(index, 1);
                            this.getList();
                        }else{
                            CommonFun.responseError(res.data, this)
                        }
                    })
                    .catch((err) => {
                        CommonFun.responseError(err, this);
                    })
            },
            submitTarget() {
                let $this = this;
                this.targetList = this.targetList.filter((item) => {
                    item.maintenanceId = this.maintenanceId;
                    return item.anode && item.bnode
                })
                let params = [
                    ...this.targetList,
                ]
                axiosHttp.post(baseUrl.BASEURL + 'resource/maintenanceNode/management/save', params)
                    .then((res) => {
                        if(res.data.status == 1){
                            CommonFun.responseSuccess(res.data.message, $this)
                            this.visibleTarget = false;
                            this.getList();
                        }else{
                            CommonFun.responseError(res.data, this)
                        }
                    })
                    .catch((err) => {
                        CommonFun.responseError(err, this);
                    })
            },
            handleEdit(index, row) {
                if(row) {
                    row.edit = true;
                    this.$set(this.targetList, index, row);
                } else {
                    this.targetList.push({id: '', anode: '', bnode: '', edit: true});
                }
            },
            handleClose(){
                this.visibleTarget = false;
            },
			searchAction: function() {
				let $this = this
				$this.currentPage = 1
				$this.searchData.companyIdList = $this.currenCompanyIds
				$this.getList()
			},
            /* 导出列表 */
            exportAnalyseDegradation() {
                let $this = this
                let params = {
                    ...this.searchData,
                    beginTime: this.searchData.beginTime / 1000,
                    endTime: this.searchData.endTime / 1000
                }
                let loading = CommonFun.openFullScreen($this)
                axiosHttp
                    .post(baseUrl.BASEURL + 'resource/maintenance/management/exportData', params)
                    .then(function(res) {
                        CommonFun.closeFullScreen(loading);
                        console.log('导出::');
                        console.log(res);
                        if (res.data.status === 1) {
                            window.open(res.data.data);
                        }
                        if (res.data.status === 0) {
                            CommonFun.responseError(res.data, $this);
                        }
                    })
                    .catch(function(err) {
                        CommonFun.closeFullScreen(loading);
                    });
            },
			getList: function() {
				let $this = this
                let params = {
                    ...this.searchData,
                    page: $this.currentPage,
                    pageSize: $this.pageSize,
                    beginTime: $this.searchData.beginTime / 1000,
                    endTime: $this.searchData.endTime / 1000,
                    keyword: $this.searchData.keyword,
                    companyIdList: $this.searchData.companyIdList,
                    sort: $this.currentSort,
                    order: $this.currentOrder
                }
				let loading = CommonFun.openFullScreen($this)
				return axiosHttp
					.post(baseUrl.BASEURL + 'resource/maintenance/management/maintenanceResultList', params)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							$this.totle = res.data.data.total
							$this.listData = res.data.data.records
							sessionStorage.setItem('currentEndTime',res.data.responseTime)
						}
						else {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			sortChangeFun(column, prop, order){
                let $this = this;
				if(column.prop == 'count'){
                    $this.currentSort = 'count';
                }else if(column.prop == 'beginTime'){
                    $this.currentSort = 'begin_time';
                }else if(column.prop == 'endTime'){
                    $this.currentSort = 'end_time';
                }
				if(column.order == 'ascending'){
					$this.currentOrder = 'ASC'
				}else if(column.order == 'descending'){
					$this.currentOrder = 'DESC'
				}else{
                    $this.currentOrder = ''
                }
                if(!$this.currentOrder) {
                    $this.currentSort = ''
                }
                $this.getList()
			},
			showFun(index,row,type){
				let $this = this
				if(type == 'show'){
					sessionStorage.setItem('currentAramDetailType',row.taskType)
					sessionStorage.setItem('currentAramItem',JSON.stringify(row))
					sessionStorage.setItem('colorStatus','green')//alarmDetailInfo页面中 红色线后保持绿色
					sessionStorage.setItem('changeTime','t')
					$this.$router.push('/alarmDetailInfo')
				}
			},
			showAlarm(index, row, type) {
			    let $this = this;
			    $this.getAlarmInfo(row);
			    $this.popupTitle = '告警原因';
			    $this.dialogTableVisible_alarmReason = true;
			},
			showLog(index, row, type) {
			    let $this = this;
			    $this.getLogInfo(row);
			    $this.popupTitle = '维护日志';
			    $this.dialogTableVisible_maintenanceLog = true;
			},
			getAlarmInfo(item) {
			    let $this = this;
			    let sendingData = {
			        beginTime:item.beginTime,
					endTime:item.endTime,
					anode:item.anode,
					bnode:item.bnode,
			    };
			    let loading = CommonFun.openFullScreen($this);
			    axiosHttp
			        .post(baseUrl.BASEURL + $this.getAlarmInfoUrl, sendingData)
			        .then(function(res) {
			            CommonFun.closeFullScreen(loading);
			            console.log('告警原因 res::');
			            console.log(res);
			            if (res.data.status == 1) {
			                $this.alarmInfoArr = res.data.data;
			            }
			            if (res.data.status == 0) {
			                CommonFun.responseError(res.data, $this);
			            }
			        })
			        .catch(function(err) {
			            CommonFun.closeFullScreen(loading);
			        });
			},
			getLogInfo(item) {
			    let $this = this;
			    let sendingData = {
			        beginTime:item.beginTime,
					endTime:item.endTime,
					anode:item.anode,
					bnode:item.bnode,
			    };
			    let loading = CommonFun.openFullScreen($this);
			    axiosHttp
			        .post(baseUrl.BASEURL + $this.getLogInfoUrl, sendingData)
			        .then(function(res) {
			            CommonFun.closeFullScreen(loading);
			            console.log('维护日志 res::');
			            console.log(res);
			            if (res.data.status == 1) {
			                $this.LogInfoArr = res.data.data;
			            }
			            if (res.data.status == 0) {
			                CommonFun.responseError(res.data, $this);
			            }
			        })
			        .catch(function(err) {
			            CommonFun.closeFullScreen(loading);
			        });
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
			selectCompanyFun: function(type) {
                this.dealType = type
				this.dialogTableVisible_selectcompany = true
			},
			setSearchCompanyIds: function(data) {
				this.currenCompanyIds = data
			},
            setSearchCompanyName: function(data) {
				let $this = this;
                $this.currenCompanyName = data;
				if(CommonFun.ifNall(data)){
					$this.currenCompanyNameOfItem = '选择单位'
				}else{
					$this.currenCompanyNameOfItem = data
				}
			},
            setSearchCompanyId: function(data) {
                this.addTaskData.companyId = data;
				this.currenCompanyId = data
				this.$set(this.currentItem, 'companyId', data)
			},
			setSearchCompanyNames: function(data) {
				let $this = this
				// $this.currenCompanyNames = data
				if (data.length > 0) {
					$this.currenCompanyNames = ''
					for (let i = 0; i < data.length; i++) {
						$this.currenCompanyNames += (data[i] + ',')
					}
				} else {
					$this.currenCompanyNames = '选择单位'
				}
			},
			closeSelectcompany: function() {
				this.dialogTableVisible_selectcompany = false
			},
            addFun() {
                this.dialogTableVisible_addAndedit = true;
                this.popupTitle = '新增';
                this.addTaskData = {};
                // this.$nextTick(() => {
                    // this.$refs.addTaskData.resetFields();
                // })
                this.currentItem = {}
				this.currenCompanyNameOfItem = '选择单位'
                this.currenCompanyId = null;
            },
            editFun: function(index, item) {
                let $this = this
                this.dialogTableVisible_addAndedit = true
                this.popupTitle = '编辑'
                this.addTaskData = {}
                $this.addTaskData = JSON.parse(JSON.stringify(item));
				$this.currentItem = JSON.parse(JSON.stringify(item))
				$this.currenCompanyId = $this.currentItem.companyId
				$this.currenCompanyNameOfItem = $this.currentItem.companyName
            },
            deleteFun: function(index, item) {
                this.dialogTableVisible_delete = true
                this.popupTitle = '删除'
                this.currentItem = JSON.parse(JSON.stringify(item))
            },
            submitDelete: function() {
                let $this = this
                axiosHttp
                    .delete(baseUrl.BASEURL + 'resource/maintenance/management/delete', {
                        data: {
                            id: $this.currentItem.id
                        }
                    })
                    .then(function(res) {
                        if (res.data.status === 1) {
                            CommonFun.responseSuccess(res.data.message, $this)
                            // 判断当前页是不是最后一条数据，如果是且当前页大于1，则当前页减1刷新列表
                            let page = $this.currentPage
                            if (page > 1 && $this.listData.length === 1) {
                                $this.currentPage = page - 1
                            }
                            $this.getList()
                        }else{
                            CommonFun.responseError(res.data, $this)
                        }
                        $this.dialogTableVisible_delete = false
                    }).catch(function(err) {
                        CommonFun.closeFullScreen(loading)
                    })
            },
            addAndEditSubmit: function() {
                let $this = this
                this.$refs.addTaskData.validate((valid) => {
                    if(valid) {
                        let params = {
                            ...this.addTaskData,
                            beginTime: this.addTaskData.beginTime / 1000,
                            endTime: this.addTaskData.endTime / 1000,
                            id: this.currentItem.id
                        }
                        axiosHttp
                            .post(baseUrl.BASEURL + 'resource/maintenance/management/save', params)
                            .then(function(res) {
                                if (res.data.status === 1) {
                                    CommonFun.responseSuccess(res.data.message, $this)
                                    $this.getList()
                                    $this.dialogTableVisible_addAndedit = false
                                }else{
                                    CommonFun.responseError(res.data, $this)
                                }
                            }).catch(function(err) {
                                CommonFun.closeFullScreen(loading)
                            })
                    }else {
                        return false
                    }
                })
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
            downExcel() {
                let $this = this
                let loading = CommonFun.openFullScreen($this)
                axiosHttp
                    .post(baseUrl.BASEURL + 'resource/maintenance/management/downExportTemp', {})
                    .then(function(res) {
                        CommonFun.closeFullScreen(loading);
                        if (res.data.status === 1) {
                            window.open(res.data.data);
                        }
                        if (res.data.status === 0) {
                            CommonFun.responseError(res.data, $this);
                        }
                    })
                    .catch(function(err) {
                        CommonFun.closeFullScreen(loading);
                    });
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
                            return time.getTime() < (new Date(timeOptionRange).getTime()) || time.getTime() > now;
                        }
                        return time.getTime() > now;
                    },
                    // selectableRange: et + ' - ' + nt
                }
            },
            pickerOptions3() {
                let st = '';
                if(this.addTaskData.endTime && this.addTaskData.beginTime){
                    let startDate = moment(this.addTaskData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let endDate = moment(this.addTaskData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == endDate[0]){
                        st = endDate[1];
                        if(this.addTaskData.beginTime >= this.addTaskData.endTime){
                            this.addTaskData.beginTime = this.addTaskData.endTime;
                        }
                    }else{
                        st = '23:59:59';
                    }
                }else{
                    let startDate = moment(this.addTaskData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == nowDate[0]){
                        st =  nowDate[1];
                    }else{
                        st = '23:59:59';
                    }
                }
                return {
                    disabledDate: time => {
                        let timeOptionRange = this.addTaskData.endTime;
                        let now = Date.now();
                        if(timeOptionRange) {
                            return time.getTime() > (new Date(timeOptionRange).getTime());
                        }
                        // return time.getTime() > now;
                    },
                    selectableRange: '00:00:00 - ' + st
                }
            },
            pickerOptions4() {
                let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
                let nt = nowDate[1];
                let et = '00:00:00';
                if(this.addTaskData.endTime && this.addTaskData.beginTime) {
                    let startDate = moment(this.addTaskData.beginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let endDate = moment(this.addTaskData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == endDate[0]){
                        et = startDate[1]
                    }else{
                        et = '00:00:00'
                    }
                    if(endDate[0] != nowDate[0]) {
                        nt = '23:59:59'
                    }
                }else {
                    let endDate = moment(this.addTaskData.endTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(endDate[0] == nowDate[0]){
                        nt =  nowDate[1];
                    }else{
                        nt = '23:59:59';
                    }
                }
                return {
                    disabledDate: time =>{
                        let timeOptionRange = this.addTaskData.beginTime;
                        let now = Date.now();
                        if(timeOptionRange){
                            return time.getTime() < (new Date(timeOptionRange).getTime());
                        }
                        // return time.getTime() > now;
                    },
                    // selectableRange: et + ' - ' + nt
                }
            },
        },
		created: function() {
			let $this = this
			let loading = CommonFun.openFullScreen($this)
			$this.getList().then((res, error) => {
				CommonFun.closeFullScreen(loading)
			})
		},
		
	}
</script>

<style scoped>
.targetCount {
    color: #00D7CE;
    cursor: pointer;
}
.boxStyle {
    height: calc(100% - 47px);
}
	.imgDetail {
		width: 100%;
		height: auto;
		display: inline-block;
	}
.search-div{position: relative;padding-left: 8px;padding-right: 16px;}
.select-unit-icon{position: absolute;right: 8px;top: 50%;margin-top: -5px;color: rgb(13, 140, 172);}
.search-but{border: 1px solid rgb(0,77,149);background-color: rgb(6,24,46);}
/* .search-but .el-icon-search{color: rgb(13, 140, 172);} */
.pageExport-img{width: 18px;height: 15px;margin-right: 10px;background-image: url('../../assets/pageExport.png');background-size: cover;}
.date-time-select:hover{border-color: rgb(0,77,149);}
.pagebox{display: flex;justify-content: center;position: relative;}
.topruleform{display: flex;}
.pageExport{display: flex;position: absolute;right: 0;color: #00D8CF;align-items: center;cursor: pointer;}
.topruleform-item{position: relative;display: flex;align-items: center;color: #ccc;margin-right: 30px;margin-bottom: 15px;}
.radioitem{height: 30px;line-height: 30px;}
.searchipbox{display: flex;}
.searchipbox{height: 30px;margin-bottom: 10px;}
.parenttitle{position: relative;}
.addbutOftd{position: absolute;left: 60px;top: -6px;font-size: 20px; font-weight: bold;cursor: pointer;}
.deletebutOftd{position: absolute;left: 0;top: 22px;font-size: 20px; font-weight: bold;cursor: pointer;}
.ipArrtopruleform{margin-bottom: 10px;}
.add-but{text-decoration:none ;}
.contentbox{width: 100%;padding: 5px;}
.contentbox .imgclass{width: 100%;height: auto;}
.contentbox .videoclass{width: 100%;height: auto;}
</style>
