<template>
	<div class="boxStyle">
		<div class="outerbox-pro" style="height: calc(100% - 105px)">
            <div class="fun-box">
				<div class="topruleform">
					<div class="topruleform-item">
						<p class="topruleform-margin">机构名称：</p>
						<div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyNames == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyNames }}</div>
                    </div>
					<div class="topruleform-item">
						<!-- <div class="search-but" @click="searchAction"><i class="el-icon-search"></i></div> -->
						<div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
                        <div v-if="currentButtonJurisdiction.indexOf('add') > -1" class="but popup-but-submit" style="margin-left: 20px" @click="addFun">新增</div>
					</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" @sort-change='sortChangeFun' height="100%" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column :formatter="CommonFun.formatterCompanyName" label="单位名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column prop="deviceCpu" label="CPU阈值"></el-table-column>
								<el-table-column prop="deviceFlow" label="流量阈值" ></el-table-column>
								<el-table-column prop="deviceMemory" label="内存阈值"></el-table-column>
								<el-table-column prop="deviceTemperature" label="温度阈值"></el-table-column>
								<el-table-column prop="bufferPeriod" label="缓冲周期"></el-table-column>
								<el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <div class="btnBox" v-if="currentButtonJurisdiction.indexOf('edit') > -1" title="编辑" @click="editFun(scope.$index, scope.row)"><i
                                                class="el-icon-edit-outline"></i></div>
                                        <div class="btnBox" v-if="currentButtonJurisdiction.indexOf('delete') > -1" title="删除" @click="deleteFun(scope.$index, scope.row)"><i
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
                        <!-- <div class="but export-but" @click="exportAnalyseDegradation()">导出</div> -->
                        <div class="pageExport" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
					</div>
				</div>
			</div>
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" v-if="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="846px">
                <el-form class="popup" :model="addTaskData" ref="addTaskData" :rules="addTaskDatarules">
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
                    <div class="add-info-box popupruleform">
                        <div class="alignBoth">
                            <el-form-item label="组织机构" class="flex1 is-required">
                                <div :class="['search-div',{'search-div-placeholder':currenCompanyNameOfItem == '选择单位'}]" @click="selectCompanyFun(0)">{{ currenCompanyNameOfItem }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
                            </el-form-item>
                            <el-form-item prop="bufferPeriod" label="缓冲周期" class="flex1 marginLeft10 is-required">
                                <el-input v-model="addTaskData.bufferPeriod" class="add-item-input" type="text" maxlength="16" placeholder="请输入缓冲周期"></el-input>
                            </el-form-item>
                            <el-form-item prop="deviceCpu" label="设备cpu阈值(%)" class="flex1 marginLeft10 is-required">
                                <el-input v-model="addTaskData.deviceCpu" class="add-item-input" type="text" maxlength="64" placeholder="请输入cpu阈值"></el-input>
                            </el-form-item>
                        </div>
                        <div class="alignBoth">
                            <el-form-item prop="deviceMemory" label="设备内存阈值(%)" class="flex1 is-required">
                                <el-input v-model="addTaskData.deviceMemory" class="add-item-input" type="text" maxlength="8" placeholder="请输入内存阈值"></el-input>
                            </el-form-item>
                            <el-form-item prop="deviceFlow" label="设备流量阈值(%)" class="flex1 marginLeft10 is-required">
                                <el-input v-model="addTaskData.deviceFlow" class="add-item-input" type="text" maxlength="16" placeholder="请输入流量阈值"></el-input>
                            </el-form-item>
                            <el-form-item prop="deviceTemperature" class="flex1 marginLeft10 is-required">
                                <!-- <el-input v-model="addTaskData.deviceTemperature" class="add-item-input" type="text" maxlength="16" placeholder="请输入流量阈值"></el-input> -->
                            </el-form-item>
                        </div>
                        <div class="class-rule">
                            <p class="class-rule-title">拨测任务</p>
                            <sliderThree :sliderVal="sliderVal1" v-if="sliderVisible1" @changeShow="changeShow1" />
                        </div>
                        <div class="class-rule">
                            <p class="class-rule-title">接口任务</p>
                            <sliderThree :sliderVal="sliderVal2" v-if="sliderVisible2" @changeShow="changeShow2" />
                        </div>
                        <div class="class-rule">
                            <p class="class-rule-title">专线任务</p>
                            <sliderThree :sliderVal="sliderVal3" v-if="sliderVisible3" @changeShow="changeShow3" />
                        </div>
                        <div class="class-rule">
                            <p class="class-rule-title">设备任务</p>
                            <sliderThree :sliderVal="sliderVal4" v-if="sliderVisible4" @changeShow="changeShow4" />
                        </div>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
                    </div>
                </el-form>
            </el-dialog>
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
	</div>
</template>

<script>
	import baseUrl from '../../js/baseUrl.js'
	import axiosHttp from '../../js/axiosHttp.js'
	import CommonFun from '../../js/commonFun.js'
	import SelectCompanyComponent from '../../components/selectCompanyComponent.vue'
    import sliderThree from '../../components/sliderThree.vue'
	export default {
		name: 'classRule',
		components: {
			SelectCompanyComponent,
            sliderThree
		},
		data() {
			return {
                sliderVal1: {val1: 180, val2: 180, val3: 240, valTotal: 600},
                sliderVal2: {val1: 180, val2: 180, val3: 240, valTotal: 600},
                sliderVal3: {val1: 180, val2: 180, val3: 240, valTotal: 600},
                sliderVal4: {val1: 180, val2: 180, val3: 240, valTotal: 600},
                sliderVisible1: true,
                sliderVisible2: true,
                sliderVisible3: true,
                sliderVisible4: true,
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
                addTaskData: {},
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
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('classRule'),
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
                addTaskDatarules: {
                    bufferPeriod: [{
                        required: true,
                        message: '缓冲周期不能为空',
                        trigger: 'blur'
                    }],
                    deviceCpu: [{
                        required: true,
                        message: 'cpu阈值不能为空',
                        trigger: 'blur'
                    }],
                    deviceMemory: [{
                        required: true,
                        message: '内存阈值不能为空',
                        trigger: 'blur'
                    }],
                    deviceFlow: [{
                        required: true,
                        message: '流量阈值不能为空',
                        trigger: 'blur'
                    }]
                },
			}
		},
		methods: {
            changeShow1() {
                this.sliderVisible1 = false;
                this.$nextTick(() => {
                    this.sliderVisible1 = true;
                })
            },
            changeShow2() {
                this.sliderVisible2 = false;
                this.$nextTick(() => {
                    this.sliderVisible2 = true;
                })
            },
            changeShow3() {
                this.sliderVisible3 = false;
                this.$nextTick(() => {
                    this.sliderVisible3 = true;
                })
            },
            changeShow4() {
                this.sliderVisible4 = false;
                this.$nextTick(() => {
                    this.sliderVisible4 = true;
                })
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
                    .post(baseUrl.BASEURL + 'taskAlarmRule/exportList', params)
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
			getList: function() {
				let $this = this
				$this.searchData.page = $this.currentPage
				$this.searchData.pageSize = $this.pageSize
				let loading = CommonFun.openFullScreen($this)
				return axiosHttp
					.post(baseUrl.BASEURL + 'taskAlarmRule/listPage', $this.searchData)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						console.log('列表::')
						console.log(res)
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
				console.log(column)
				let $this = this
				$this.currentSort = column.prop
				if(column.order == 'ascending'){
					$this.currentOrder = 'ASC'
				}
				if(column.order == 'descending'){
					$this.currentOrder = 'DESC'
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
            setSearchCompanyId: function(data) {
                this.addTaskData.companyId = data;
				this.currenCompanyId = data
				this.$set(this.currentItem, 'companyId', data)
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
			setSearchCompanyNames: function(data) {
				let $this = this
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
                this.sliderVal1 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                this.sliderVal2 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                this.sliderVal3 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                this.sliderVal4 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                this.dialogTableVisible_addAndedit = true;
                this.popupTitle = '新增';
                this.addTaskData = {};
                this.currentItem = {}
				this.currenCompanyNameOfItem = '选择单位'
                this.currenCompanyId = null;
            },
            editFun: function(index, item) {
                let $this = this
                this.dialogTableVisible_addAndedit = true
                this.popupTitle = '编辑'
                $this.addTaskData = JSON.parse(JSON.stringify(item));
				$this.currentItem = JSON.parse(JSON.stringify(item));
                if(item.dialLowDuration && item.dialMiddleDuration && item.dialHighDuration){
                    this.sliderVal1 = {val1: item.dialLowDuration, val2: item.dialMiddleDuration, val3: item.dialHighDuration, valTotal: item.dialLowDuration + item.dialMiddleDuration + item.dialHighDuration }
                }else{
                    this.sliderVal1 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                }
                if(item.relayLowDuration && item.relayMiddleDuration && item.relayHighDuration){
                    this.sliderVal2 = {val1: item.relayLowDuration, val2: item.relayMiddleDuration, val3: item.relayHighDuration, valTotal: item.relayLowDuration + item.relayMiddleDuration + item.relayHighDuration }
                }else{
                    this.sliderVal2 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                }
                if(item.specialLowDuration && item.specialMiddleDuration && item.specialHighDuration){
                    this.sliderVal3 = {val1: item.specialLowDuration, val2: item.specialMiddleDuration, val3: item.specialHighDuration, valTotal: item.specialLowDuration + item.specialMiddleDuration + item.specialHighDuration }
                }
                if(item.deviceLowDuration && item.deviceMiddleDuration && item.deviceHighDuration) {
                    this.sliderVal4 = {val1: item.deviceLowDuration, val2: item.deviceMiddleDuration, val3: item.deviceHighDuration, valTotal: item.deviceLowDuration + item.deviceMiddleDuration + item.deviceHighDuration }
                }else{
                    this.sliderVal4 = {val1: 180, val2: 180, val3: 240, valTotal: 600}
                }
                $this.currenCompanyId = $this.currentItem.companyId
				$this.currenCompanyNameOfItem = $this.currentItem.companyName
            },
            deleteFun: function(index, item) {
                let $this = this
                this.dialogTableVisible_delete = true
                this.popupTitle = '删除'
                this.currentItem = JSON.parse(JSON.stringify(item))
            },
            submitDelete: function() {
                let $this = this
                axiosHttp
                    .delete(baseUrl.BASEURL + 'taskAlarmRule/delete', {
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
                if(!this.currenCompanyId) {
                    CommonFun.responseWarning('组织机构不能为空', $this)
                    return
                }
                this.$refs.addTaskData.validate((valid) => {
                    if(valid){
                        let params = {
                            ...this.addTaskData,
                            dialLowDuration: this.sliderVal1.val1,
                            dialMiddleDuration: this.sliderVal1.val2,
                            dialHighDuration: this.sliderVal1.val3,
                            relayLowDuration: this.sliderVal2.val1,
                            relayMiddleDuration: this.sliderVal2.val2,
                            relayHighDuration: this.sliderVal2.val3,
                            specialLowDuration: this.sliderVal3.val1,
                            specialMiddleDuration: this.sliderVal3.val2,
                            specialHighDuration: this.sliderVal3.val3,
                            deviceLowDuration: this.sliderVal4.val1,
                            deviceMiddleDuration: this.sliderVal4.val2,
                            deviceHighDuration: this.sliderVal4.val3,
                            id: this.currentItem.id,
                            companyId: this.currenCompanyId,
                        }
                        axiosHttp
                            .post(baseUrl.BASEURL + 'taskAlarmRule/save', params)
                            .then(function(res) {
                                if (res.data.status === 1) {
                                    CommonFun.responseSuccess(res.data.message, $this)
                                    $this.dialogTableVisible_addAndedit = false
                                    $this.getList()
                                }else{
                                    CommonFun.responseError(res.data, $this)
                                }
                            }).catch(function(err) {
                                CommonFun.closeFullScreen(loading)
                            })
                    }else{
                        return false
                    }
                })
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
.class-rule {
    width: 100%;
    margin-bottom: 25px;
}
.class-rule-slide {
    display: block;
    width: 100%;
}
.class-rule-title {
    padding: 0 25px;
    color: #fff;
    font-size: 16px;
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
