<template>
	<div class="boxStyle">
		<div class="outerbox-pro" style="height: calc(100% - 105px)">
            <div class="fun-box">
				<div class="topruleform">
					<div class="topruleform-item">
						<p class="topruleform-margin">开始时间：</p>
						 <el-date-picker
							v-model="searchData.beginTime"
							popper-class="begin-now"
                            @change="showPage = false"
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
                            @change="showPage = false"
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
						<p class="topruleform-margin">节点A：</p>
						<el-input class="topruleform-width300" v-model="searchData.anodeIp" @change="showPage = false" placeholder="请输入节点"></el-input>
					</div>
                    <div class="topruleform-item">
						<p class="topruleform-margin">节点B：</p>
						<el-input class="topruleform-width300" v-model="searchData.bnodeIp" @change="showPage = false" placeholder="请输入节点"></el-input>
					</div>
					<div class="topruleform-item">
						<p class="topruleform-margin">机构名称：</p>
						<div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun">{{ currenCompanyName }}</div>
                    </div>
					<div class="topruleform-item">
						<p class="topruleform-margin">模糊查询：</p>
						<el-input class="topruleform-width300" v-model="searchData.keyword" @change="showPage = false" placeholder="搜索名称/地址"></el-input>
					</div>
					<div class="topruleform-item">
						<!-- <div class="search-but" @click="searchAction"><i class="el-icon-search"></i></div> -->
						<div class="but popup-but-submit" v-loading="tableLoading" @click="searchAction"><i class="el-icon-search"></i></div>
					</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" @sort-change='sortChangeFun' border ref="table"  @filter-change="filterData" height="100%" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column prop="taskName" label="任务名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="120" prop="probeIp" label="拨测接口"></el-table-column>
								<el-table-column width="120" prop="targetIp" label="目的地址"></el-table-column>
								<el-table-column width="120"  prop="taskTypeName" label="任务类型" 
                                    column-key="taskTypeName"
									:filters="taskTypeOption"
									filter-placement="bottom">
                                </el-table-column>
								<el-table-column prop="companyName" label="机构名称"></el-table-column>
                                <el-table-column prop="eventTypeName" label="故障类型" 
                                    column-key="eventTypeName"
									:filters="falutTypeOption"
									filter-placement="bottom"></el-table-column>
								<!-- <el-table-column width="150" :formatter="CommonFun.formatterCompanyName" label="单位名称" :show-overflow-tooltip="true"></el-table-column> -->
								<el-table-column prop="reason" label="故障原因" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column width="120" prop="anode" label="节点A"></el-table-column>
								<el-table-column width="120" prop="bnode" label="节点B"></el-table-column>
								<el-table-column width="80" prop="gradeName" label="等级"
                                    column-key="gradeName"
									:filters="falutGradeOption"
									filter-placement="bottom">
                                    <template slot-scope="scope">
										<span>{{scope.row.gradeName}}</span>
									</template>    
                                </el-table-column>
								<el-table-column width="140" prop="beginTime" sortable='custom' :formatter="CommonFun.formatterTime" label="发生时间"></el-table-column>
								<el-table-column width="140" prop="endTime" :formatter="CommonFun.formatterTime" sortable='custom' label="恢复时间"></el-table-column>
								<el-table-column width="100" prop="duration" sortable='custom' :show-overflow-tooltip="true" :formatter="CommonFun.formatterContinuedTime" label="故障时长"></el-table-column>
								<el-table-column width="80" prop="statusName" label="状态"
                                    column-key="statusName"
                                    :filter-multiple="false"
									:filters="statusOption"
									filter-placement="bottom"></el-table-column>
								<el-table-column width="70" label="详情" align="center">
                                    <template slot-scope="scope">
                                        <div class="btnBox" title="查看" @click="showFun(scope.$index, scope.row, 'show')"><i class="el-icon-view"></i></div>
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
                        <!-- <div class="but export-but" @click="exportAnalyseDegradation()">导出</div> -->
                        <div class="pageExport" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
					</div>
				</div>
			</div>
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
			<!-- 弹出框  告警原因-->
			<el-dialog :visible.sync="dialogTableVisible_alarmReason" :close-on-click-modal="false" width="1200px">
			    <div class="popup">
			        <div class="title">{{ popupTitle }}</div>
			        <div class="hidepopup" @click="dialogTableVisible_alarmReason = !dialogTableVisible_alarmReason"></div>
			        <div class="add-info-box">
			            <template>
			                <el-table :data="alarmInfoArr" border :header-cell-style="{ background: '#f2f2f2' }" style="width: 100%">
			                    <el-table-column width="50" prop="" label="序号" type="index" align="center"></el-table-column>
			                    <el-table-column width="180" :formatter="CommonFun.formatterTime" label="开始时间" :show-overflow-tooltip="true"></el-table-column>
			                    <el-table-column width="180" :formatter="CommonFun.formatterTime" label="结束时间"></el-table-column>
			                    <el-table-column width="100" prop="targetIp" label="目标IP"></el-table-column>
			                    <el-table-column width="100" prop="interfaceIp" label="接口IP"></el-table-column>
			                    <el-table-column width="140" prop="manufactor" label="厂家"></el-table-column>
			                    <el-table-column width="140" prop="model" label="型号"></el-table-column>
			                    <el-table-column prop="reason" label="故障原因"></el-table-column>
			                </el-table>
			            </template>
			        </div>
			        <div class="popup-buts"><div class="popup-but popup-but-cancel" @click="dialogTableVisible_alarmReason = !dialogTableVisible_alarmReason">取消</div></div>
			    </div>
			</el-dialog>
			<!-- 弹出框  维护日志-->
			<el-dialog :visible.sync="dialogTableVisible_maintenanceLog" :close-on-click-modal="false" width="1000px">
			    <div class="popup">
			        <div class="title">{{ popupTitle }}</div>
			        <div class="hidepopup" @click="dialogTableVisible_maintenanceLog = !dialogTableVisible_maintenanceLog"></div>
			        <div class="add-info-box">
			            <template>
			                <el-table :data="LogInfoArr" border :header-cell-style="{ background: '#f2f2f2' }" style="width: 100%">
			                    <el-table-column width="50" prop="" label="序号" type="index" align="center"></el-table-column>
			                    <el-table-column width="180" prop="beginTime" label="开始时间" :show-overflow-tooltip="true"></el-table-column>
			                    <el-table-column width="180" prop="endTime" label="结束时间"></el-table-column>
			                    <el-table-column width="" prop="message" label="任务描述"></el-table-column>
			                    <el-table-column width="200" prop="rangeName" label="影响范围"></el-table-column>
			                </el-table>
			            </template>
			        </div>
			        <div class="popup-buts"><div class="popup-but popup-but-cancel" @click="dialogTableVisible_maintenanceLog = !dialogTableVisible_maintenanceLog">取消</div></div>
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
		name: 'analyseDelayDegradation',
		components: {
			SelectCompanyComponent
		},
		data() {
			return {
				tableLoading: false,
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_selectcompany: false,

				currentPage: 1,
                showPage: true,
				totle: 0,
				pageSize: this.$store.state.pageSize,
				popupTitle: '新增',
				currentItem: {},
				searchData: {beginTime: '', endTime: '', keyword: ''},
				getListUrl: 'analyseTask/listPage',
				listData: [],

                exportAnalyseDegradationUrl:'analyseTask/exportAnalyseDegradation',

				currenCompanyName: '选择单位',
				currenCompanyIds: [],
				currenCompanyNames: [],
				
				getAlarmInfoUrl: 'analyseDevice/listFaultReason',
				getLogInfoUrl: 'taskManagerMaintainLine/listMaintainLine',
				dialogTableVisible_alarmReason: false,
				dialogTableVisible_maintenanceLog: false,
				alarmInfoArr:[],
				LogInfoArr:[],
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('analyseDelayDegradation'),
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
                taskTypeOption: [
                    {text: '拨测任务', value: 1},
                    {text: '接口任务', value: 2},
                ],
                falutTypeOption: [],
                falutGradeOption: [],
                statusOption: [
                    {text: '未恢复', value: 0},
                    {text: '恢复', value: 1},
                ]
			}
		},
		methods: {
			setDefaultFilter(col, val) {
				const column = this.$refs.table.columns[4]
				column.filteredValue = val
				this.$refs.table.store.commit('filterChange', {
					column,
					values: column.filteredValue,
					silent: true
				})
			},
            filterData(value) {
				if(value.taskTypeName){
                    this.searchData.taskTypeList = value.taskTypeName;
				}else if(value.eventTypeName){
					this.searchData.eventTypeList = value.eventTypeName;
				}else if(value.gradeName) {
					this.searchData.gradeList = value.gradeName;
				}else if(value.statusName) {
					this.searchData.status = value.statusName.toString();
				}
				this.currentPage = 1;
				this.getList()
			},
			searchAction: function() {
				let $this = this
                this.showPage = true
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
                    .post(baseUrl.BASEURL + 'analyseTask/exportAnalyseDegradation', params)
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
            },
			getList: function(taskType) {
				let $this = this
                let params = {
                    ...this.searchData,
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    beginTime: new Date($this.searchData.beginTime).getTime() / 1000,
                    endTime: new Date($this.searchData.endTime).getTime() / 1000,
                    sort: $this.currentSort,
                    order: $this.currentOrder
                }
				let loading = CommonFun.openFullScreen($this)
				// $this.tableLoading = true
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrl, params)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						// $this.tableLoading = false
						if(taskType){
							// $this.searchData = {
							// 	beginTime: $this.searchData.beginTime,
							// 	endTime: $this.searchData.endTime,

							// }
						}
						$this.searchData.id = undefined;
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
						// $this.tableLoading = false
					})
			},
			sortChangeFun(column, prop, order){
				let $this = this
                if(column.prop == 'beginTime'){
                    $this.currentSort = 'begin_time';
                }else if(column.prop == 'endTime'){
                    $this.currentSort = 'end_time';
                }else{
                    $this.currentSort = column.prop
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
			showFun(index,row,type){
				let $this = this
                this.$store.commit('pushIncludeList', 'analyseDelayDegradation');
                sessionStorage.setItem('currentAramItem',JSON.stringify(row))
                setTimeout(() => $this.$router.push('/alarmDetailInfo'))
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
				this.showPage ? ($this.currentPage = val) : (this.currentPage = 1);
				$this.getList()
                this.showPage = true;
			},
			handleSizeChange: function(val) {
				this.currentPage = 1
				this.pageSize = val
				this.getList()
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
		},
		mounted() {
			let $this = this
            let faultdataList = JSON.parse(sessionStorage.getItem('dataDictionaryList'));
            let falutTypeOption = []
            let falutGradeOption = []
			this.searchData.endTime = new Date().getTime();
			this.searchData.beginTime = this.searchData.endTime - 24*60*60*1000;
            if(faultdataList[0].children){
                faultdataList[0].children.forEach((item, index) => {
                    if(item.name == '事件类型') {
                        falutTypeOption = item.children
                    }else if(item.name == '故障等级') {
                        falutGradeOption = item.children
                    }
                })
            }
            for(let i=0;i<falutTypeOption.length;i++){
                $this.falutTypeOption.push({text:falutTypeOption[i].name,value: falutTypeOption[i].value});
            }
            for(let i=0;i<falutGradeOption.length;i++){
                $this.falutGradeOption.push({text:falutGradeOption[i].name,value: falutGradeOption[i].value});
            }
			if(this.$route.params.taskType && this.$route.params.beginTime){
				this.searchData.beginTime =  this.$route.params.beginTime || '';
				this.searchData.endTime = this.$route.params.endTime || '';
				this.searchData.taskId = this.$route.params.taskId;
				this.searchData.taskType = this.$route.params.taskType;
				this.searchData.anode = this.$route.params.anode;
				this.searchData.bnode = this.$route.params.bnode;
			}
			if(this.$route.params.grade) {
				this.searchData.gradeList = [this.$route.params.grade];
			}
			if(this.$route.params.taskType) {
				this.searchData.taskType = this.$route.params.taskType;
			}
			if(this.$route.params.eventType) {
				this.searchData.eventTypeList = this.$route.params.eventType;
			}
			if(this.$route.params.status) {
				this.searchData.status = this.$route.params.status;
			}
			if(this.$route.params.taskId) {
				this.searchData.taskId = this.$route.params.taskId;
			}
			if(this.$route.params.companyId) {
				this.searchData.companyIdList = [this.$route.params.companyId];
				this.currenCompanyName = this.$route.params.companyName;
			}
			if(this.$route.params.id){
				this.searchData.id = this.$route.params.id;
				this.searchData.beginTime = this.$route.params.beginTime*1000;
				this.searchData.endTime = new Date().getTime();
			}
			let loading = CommonFun.openFullScreen($this)
			$this.getList(this.$route.params.taskType, this.$route.params.eventType).then((res, error) => {
				CommonFun.closeFullScreen(loading)
			})
		},
		watch: {
			'$store.state.exportViewId':{
				handler(val){
					this.searchData.id = val.split(',')[0];
					this.searchData.beginTime = val.split(',')[1]*1000;
					this.searchData.endTime = new Date().getTime();
					this.getList();
				}
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
	}
</script>

<style scoped>
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
