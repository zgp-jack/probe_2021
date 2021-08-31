<template>
	<div class="boxStyle">
		<div class="outerbox-pro">
			<div class="fun-box">
				<div class="topruleform">
					<div class="topruleform-item">
						<p class="topruleform-margin">探针名称：</p>
						<el-input class="gapright topruleform-width300" v-model="searchData.name" placeholder="探针名称"></el-input>
					</div>
					<div class="topruleform-item">
						<p class="topruleform-margin">探针IP：</p>
						<el-input class="gapright topruleform-width300" v-model="searchData.ip" placeholder="探针IP"></el-input>
					</div>
					<div class="topruleform-item">
						<p class="topruleform-margin">机构名称：</p>
						<div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyNameOfSearch == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyNameOfSearch }}</div>
                    </div>
					<div class="popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
					<div class="but add-but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增</div>
				</div>
				<p class="probeNumber">探针总数:<span class="probeNum">{{totle}}</span> 在线总数:<span class="probeLine">{{onlineCount}}</span></p>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<el-scrollbar>
						<template>
							<el-table :data="listData" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column prop="name" label="探针名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column prop="ip" label="探针IP"></el-table-column>
								<el-table-column prop="companyName" label="单位"></el-table-column>
								<!-- <el-table-column width="90" prop="statusName" label="状态"></el-table-column> -->
								<el-table-column prop="licenseStatusName" label="License状态"></el-table-column>
								<el-table-column prop="licenseBeginTime" label="License开始时间"></el-table-column>
								<el-table-column prop="licenseEndTime" label="License结束时间"></el-table-column>
								<!-- <el-table-column :formatter="CommonFun.statusFun" prop="status" label="状态"></el-table-column> -->
								<el-table-column label="操作" align="center">
									<template slot-scope="scope">
										<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFun(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
										<div class="btnBox" title="详细" v-if="currentButtonJurisdiction.indexOf('detail')>-1" @click="showFun(scope.$index, scope.row)"><i class="el-icon-tickets"></i></div>
										<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteFun(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
									</template>
								</el-table-column>
							</el-table>
						</template>
						</el-scrollbar>
					</div>
					<div class="pagebox">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="$store.state.pageSize"
						 layout="total,prev, pager, next, jumper" :total="totle">
						</el-pagination>
					</div>
				</div>
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="860px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<el-form :model="currentItem" :rules="ruleAddEdit" ref="formAddEdit" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="name" label="探针名称" class="flex1">
									<el-input class="add-item-input" type="text" v-model="currentItem.name" maxlength="64"></el-input>
								</el-form-item>
								<el-form-item prop="ip" label="探针IP" class="flex1 marginLeft10">
									<el-input class="add-item-input" type="text" v-model="currentItem.ip" maxlength="15"></el-input>
								</el-form-item>
								<el-form-item prop="licenseBeginTime" label="License开始时间" class="flex1 marginLeft10">
									<el-date-picker class="add-item-input" :editable="false" :picker-options="pickerOptions1" v-model="currentItem.licenseBeginTime" type="date" value-format='yyyy-MM-dd'></el-date-picker>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="licenseEndTime" label="License结束时间" class="flex1">
									<el-date-picker class="add-item-input" :editable="false" :picker-options="pickerOptions2" v-model="currentItem.licenseEndTime" type="date" value-format='yyyy-MM-dd'></el-date-picker>
								</el-form-item>
								<el-form-item prop="identifier" label="探针标识符" class="flex1 marginLeft10">
									<el-input class="add-item-input" type="text" v-model="currentItem.identifier" :disabled="selectCompanyType == 'edit'"  maxlength="32"></el-input>
								</el-form-item>
								<el-form-item prop="licenseEndTime" label="选择单位" class="flex1 marginLeft10">
									<div class="block">
										<div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(0)">{{ currenCompanyName }}</div>
									</div>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="userId" label="绑定用户" class="flex1 is-required">
                                    <el-select v-model="currentItem.userId" :disabled="selectCompanyType == 'edit'" placeholder="请选择绑定用户">
                                        <el-option
                                            v-for="item in userNameOption"
                                            :key="item.id"
                                            :label="item.username"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
								<el-form-item  class="flex1 marginLeft10"></el-form-item>
								<el-form-item  class="flex1 marginLeft10"></el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmit">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
					</div>
				</div>
			</el-dialog>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_detail" :close-on-click-modal="false" width="800px">
				<div class="popup">
					<div class="title">详细列表</div>
					<div class="hidepopup" @click="dialogTableVisible_detail=!dialogTableVisible_detail">×</div>
					<div class="add-info-box">
						<div class="topruleform marginBottom10">
							<el-input class="gapright topruleform-width150" v-model="searchDataDetail.name" placeholder="接口名称"></el-input>
							<el-input class="gapright topruleform-width150" v-model="searchDataDetail.ip" placeholder="接口IP"></el-input>
							<div style="margin-left: 20px;" class="popup-but-submit" @click="searchActionDetail"><i class="el-icon-search"></i></div>
							<div class="but add-but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFunDetail">新增</div>
						</div>
						<div class="list-content-div">
							<template>
								<el-table :data="listDataDetail" border :cell-style="{textAlign: 'center'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',textAlign:'center'}" style="width: 100%">
									<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
									<el-table-column prop="name" label="接口名称"></el-table-column>
									<el-table-column prop="ip" label="接口IP"></el-table-column>
									<el-table-column prop="statusName" label="可用状态"></el-table-column>
									<el-table-column prop="taskCount" label="任务总数"></el-table-column>
									<el-table-column label="操作" align="center">
										<template slot-scope="scope">
											<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFunDetail(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
											<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteFunDetail(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</div>
						<div class="pagebox">
							<el-pagination @current-change="handleCurrentChangeDetail()" :current-page.sync="currentPageDetail" :page-size="$store.state.pageSize"
							 layout="total,prev, pager, next, jumper" :total="totleDetail">
							</el-pagination>
						</div>
					</div>
					<!-- <div class="popup-buts">
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_detail= !dialogTableVisible_detail">取消</div>
					</div> -->
				</div>
			</el-dialog>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndeditDetail" :close-on-click-modal="false" width="400px">
				<div class="popup">
					<div class="title">{{ popupTitleDetail }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndeditDetail=!dialogTableVisible_addAndeditDetail">×</div>
					<div class="add-info-box">
						<el-form :model="currentItemDetail" :rules="ruleAddEditDetail" ref="formAddEditDetail" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="name" label="接口名称" class="flex1">
									<el-input class="add-item-input" type="text" v-model="currentItemDetail.name" maxlength="50"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="ip" label="接口IP" class="flex1">
									<el-input class="add-item-input" type="text" v-model="currentItemDetail.ip" maxlength="50"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="status" label="可用状态" class="flex1">
									<el-select v-model="currentItemDetail.status" class="add-item-input" placeholder="">
										<el-option v-for="item in CommonFun.getDataDictionaryChildrenListData($store.state.deviceInterfaceValue)" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmitDetail()">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndeditDetail= !dialogTableVisible_addAndeditDetail">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
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
			<!-- 弹出框  选择单位 搜索-->
			<el-dialog :visible.sync="dialogTableVisible_selectcompany" :close-on-click-modal="false" v-if="dialogTableVisible_selectcompany"
			 width="690px">
				<div class="popup">
					<div class="title">单位选择</div> 
					<div class="hidepopup" @click="dialogTableVisible_selectcompany=!dialogTableVisible_selectcompany">×</div>
				</div>
				<SelectCompanyComponent v-if='dealType==0' type='single' v-on:setSearchCompanyId='setSearchCompanyId'
				 v-on:setSearchCompanyName='setSearchCompanyName' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuId='currenCompanyIdsOfEdit'
				 :checkedMenuName='currenCompanyName'></SelectCompanyComponent>
				<SelectCompanyComponent v-if='dealType==1' type='multiple' :checkStrictly='false' v-on:setSearchCompanyIds='setSearchCompanyIds'
				 v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIdsOfSearch'
				 :checkedMenuNames='currenCompanyNames'></SelectCompanyComponent>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import baseUrl from '../js/baseUrl.js'
	import axiosHttp from '../js/axiosHttp.js'
	import CommonFun from '../js/commonFun.js'
	import Validation from '../js/validation.js'
	import SelectCompanyComponent from '../components/selectCompanyComponent.vue'
	import moment from 'moment';
	export default {
		name: 'probeManager',
		components: {
			SelectCompanyComponent
		},
		data() {
			
			return {
				dealType:0,
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_detail: false,
				dialogTableVisible_addAndeditDetail: false,
				dialogTableVisible_delete: false,
				
				popupTitle: '新增',
				searchData: {},
				currentPage: 1,
				totle: 0,
				currentItem: {},
				listData: [],
				
				userNameOption: [],
				popupTitleDetail: '详细列表',
				searchDataDetail: {},
				currentPageDetail: 1,
				totleDetail: 0,
				currentItemDetail: {},
				listDataDetail: [],
				/* 选择单位 start */
				/* 组件中展示的数据 */
				dialogTableVisible_selectcompany:false,
				currenCompanyNameOfSearch:'选择单位',
				currenCompanyIdsOfSearch:[],
				currenCompanyName: '选择单位',
				currenCompanyNames: [],
				currenCompanyIdsOfEdit:null,
				selectCompanyType:'',//类型
				/* 选择单位 end */
				getListUrl: 'probeDevice/listPage',
				saveListUrl: 'probeDevice/save',
				deleteListUrl: 'probeDevice/delete',
				getOnlineCountUrl: 'probeDevice/onlineCount',
				getDetailListUrl: 'probeDeviceDetail/listPage',
				saveDetailListUrl: 'probeDeviceDetail/save',
				deleteDetailListUrl: 'probeDeviceDetail/delete',
				operateType: 0,
				onlineCount: 0,
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('probeManager'),
				ruleAddEdit: {
					name: [{
						required: true,
						message: '请填写探针名称',
						trigger: 'blur'
					}],
					ip: [{
						required: true,
						message: '请填写探针IP',
						trigger: 'blur'
					}],
					licenseBeginTime: [{
						required: true,
						message: '请选择License开始时间',
						trigger: 'change'
					}],
					licenseEndTime: [{
						required: true,
						message: '请选择License结束时间',
						trigger: 'change'
					}],
					identifier:[{
						required: true,
						message: '请填写探针标识符',
						trigger: 'blur'
					}],
					userId: [{
						required: true,
						message: '请绑定用户',
						trigger: 'change'
					}],
				},
				ruleAddEditDetail: {
					name: [{
						required: true,
						message: '请填写接口名称',
						trigger: 'blur'
					}],
					ip: [{
						required: true,
						message: '请填写接口IP',
						trigger: 'blur'
					}],
					status: [{
						required: true,
						message: '请选择可用状态',
						trigger: 'change'
					}],
				},
			}
		},
		methods: {
			getProbeUserList() {
				let $this = this
				axiosHttp.get(baseUrl.BASEURL + 'system/user/notBindingProbeUserList')
				.then(function(res) {
					if (res.data.status === 1) {
						$this.userNameOption = res.data.data;
					}
					else {
						CommonFun.responseError(res.data, $this)
					}
				}).catch(function(err) {
					CommonFun.responseError(err, $this)
				})
			},
			searchAction: function() {
				let $this = this
				$this.currentPage = 1
				$this.getList()
			},
			selectCompanyFun(type) {
				let $this = this
				$this.dealType = type
				$this.dialogTableVisible_selectcompany = true
			},
			/* 多 设置ids */
			setSearchCompanyIds(data) {
				let $this = this
				$this.currenCompanyIdsOfSearch= data
			},
			/* 单 设置id */
			setSearchCompanyId(data) {
				let $this = this
				$this.currenCompanyIdsOfEdit = data
			},
			/* 多 设置names */
			setSearchCompanyNames(data) {
				let $this = this
				if (data.length > 0) {
					$this.currenCompanyNameOfSearch = ''
					for (let i = 0; i < data.length; i++) {
						$this.currenCompanyNameOfSearch += (data[i] + ',')
					}
				} else {
					$this.currenCompanyNameOfSearch = '选择单位'
				}
			},
			/* 单 设置name */
			setSearchCompanyName(data) {
				let $this = this
				if(CommonFun.ifNall(data)){
					$this.currenCompanyName = '选择单位'
				}else{
					$this.currenCompanyName = data
				}
			},
			closeSelectcompany() {
				this.dialogTableVisible_selectcompany = false
			},
			searchActionDetail: function() {
				let $this = this
				$this.currentPageDetail = 1
				$this.getListDetail()
			},
			getOnlineCount: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.post(baseUrl.BASEURL + $this.getOnlineCountUrl, {})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						console.log('列表::')
						console.log(res)
						if (res.data.status === 1) {
							$this.onlineCount = res.data.data
						}
						else {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			getList: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				$this.searchData.page = $this.currentPage
				$this.searchData.pageSize = $this.$store.state.pageSize
				$this.searchData.companyIdList = $this.currenCompanyIdsOfSearch 
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrl, $this.searchData)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						console.log('列表::')
						console.log(res)
						if (res.data.status === 1) {
							$this.totle = res.data.data.total
							$this.listData = res.data.data.records
						}
						else {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			addFun: function() {
				let $this = this
				if ($this.$refs.formAddEdit) {
					$this.$refs.formAddEdit.resetFields();
				}
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '新增'
				$this.selectCompanyType = 'add'
				$this.currenCompanyIdsOfEdit = null
				$this.currenCompanyName = '选择单位'
				$this.currentItem = {}
				$this.getProbeUserList()
			},
			editFun: function(index, item) {
				let $this = this
				if ($this.$refs.formAddEdit) {
					$this.$refs.formAddEdit.resetFields(); 
				}
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '编辑'
				$this.selectCompanyType = 'edit'
				$this.currenCompanyIdsOfEdit = item.companyId
				$this.currenCompanyName = item.companyName
				$this.currentItem = JSON.parse(JSON.stringify(item))
				if($this.currentItem.userId && $this.currentItem.username){
					$this.currentItem.userIdDefault = $this.currentItem.userId
					$this.currentItem.userId = $this.currentItem.username
				}
				$this.getProbeUserList()
			},
			showFun: function(index, item) {
				let $this = this
				$this.currentItem = JSON.parse(JSON.stringify(item))
				$this.getListDetail()
				$this.dialogTableVisible_detail = true
			},
			deleteFun: function(index, item) {
				let $this = this
				$this.dialogTableVisible_delete = true
				$this.popupTitle = '删除'
				$this.operateType = 1
				$this.currentItem = JSON.parse(JSON.stringify(item))
			},
			addAndEditSubmit: function() {
				let $this = this
				if(CommonFun.ifNall($this.currenCompanyIdsOfEdit)){
					CommonFun.responseError({message:'请选择单位'}, $this)
					return
				}
				$this.$refs.formAddEdit.validate((valid) => {
					if (valid) {
						let loading = CommonFun.openFullScreen($this)
						if($this.currentItem.userIdDefault) {
							$this.currentItem.userId = $this.currentItem.userIdDefault
							$this.currentItem.userIdDefault = undefined
						}
						$this.currentItem.companyId = $this.currenCompanyIdsOfEdit
						axiosHttp
							.post(baseUrl.BASEURL + $this.saveListUrl, $this.currentItem)
							.then(function(res) {
								CommonFun.closeFullScreen(loading)
								if (res.data.status === 1) {
									CommonFun.responseSuccess(res.data.message, $this)
									$this.getList()
									$this.dialogTableVisible_addAndedit = false
								} else {
									CommonFun.responseError(res.data, $this)
								}
							}).catch(function(err) {
								CommonFun.closeFullScreen(loading)
							})
					}
				})
			},
			submitDelete: function() {
				let $this = this
				let obj
				let sUrl
				if($this.operateType == 1){
					obj = {id: $this.currentItem.id}
					sUrl = $this.deleteListUrl
				}
				else{
					obj = {id: $this.currentItemDetail.id},
					sUrl = $this.deleteDetailListUrl
				}
				
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.delete(baseUrl.BASEURL + sUrl, {
						data: obj
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							if($this.operateType == 1){
								$this.getList()
							}
							else{
								$this.getListDetail()
							}
							$this.dialogTableVisible_delete = false
						} else {
							CommonFun.responseError(res.data, $this)
						}
					})
					.catch(function(error) {
						CommonFun.closeFullScreen(loading)
						CommonFun.responseError(error, $this)
					})
			},
			handleCurrentChange: function(val) {
				let $this = this
				$this.currentPage = val
				$this.getList()
			},
			getListDetail: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				$this.searchDataDetail.page = $this.currentPageDetail
				$this.searchDataDetail.pageSize = $this.$store.state.pageSize
				$this.searchDataDetail.deviceId = $this.currentItem.id
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getDetailListUrl, $this.searchDataDetail)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						console.log('列表::')
						console.log(res)
						if (res.data.status === 1) {
							$this.totleDetail = res.data.data.total
							$this.listDataDetail = res.data.data.records
						}
						else {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},			
			addFunDetail: function() {
				let $this = this
				if ($this.$refs.formAddEditDetail) {
					$this.$refs.formAddEditDetail.resetFields();
				}
				$this.dialogTableVisible_addAndeditDetail = true
				$this.popupTitleDetail = '新增详细'
				$this.currentItemDetail = {deviceId: $this.currentItem.id}
			},
			editFunDetail: function(index, item) {
				let $this = this
				if ($this.$refs.formAddEditDetail) {
					$this.$refs.formAddEditDetail.resetFields();
				}
				$this.dialogTableVisible_addAndeditDetail = true
				$this.popupTitleDetail = '编辑详细'
				$this.currentItemDetail = JSON.parse(JSON.stringify(item))
			},
			deleteFunDetail: function(index, item) {
				let $this = this
				$this.dialogTableVisible_delete = true
				$this.popupTitle = '删除'
				$this.operateType = 2
				$this.currentItemDetail = JSON.parse(JSON.stringify(item))
			},
			addAndEditSubmitDetail: function() {
				let $this = this
				$this.$refs.formAddEditDetail.validate((valid) => {
					if (valid) {
						let loading = CommonFun.openFullScreen($this)
						axiosHttp
							.post(baseUrl.BASEURL + $this.saveDetailListUrl, $this.currentItemDetail)
							.then(function(res) {
								CommonFun.closeFullScreen(loading)
								if (res.data.status === 1) {
									CommonFun.responseSuccess(res.data.message, $this)
									$this.getListDetail()
									$this.dialogTableVisible_addAndeditDetail = false
								} else {
									CommonFun.responseError(res.data, $this)
								}
							}).catch(function(err) {
								CommonFun.closeFullScreen(loading)
							})
					}
				})
			},
			handleCurrentChangeDetail: function(val) {
				let $this = this
				$this.currentPageDetail = val
				$this.getListDetail()
			},
		},
		computed: {
            pickerOptions1() {
                let st = '';
                if(this.currentItem.licenseEndTime && this.currentItem.licenseBeginTime){
                    let startDate = moment(this.currentItem.licenseBeginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let endDate = moment(this.currentItem.licenseEndTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == endDate[0]){
                        st = endDate[1];
                        if(this.currentItem.licenseBeginTime >= this.currentItem.licenseEndTime){
                            this.currentItem.licenseBeginTime = this.currentItem.licenseEndTime;
                        }
                    }else{
                        st = '23:59:59';
                    }
                }else{
                    let startDate = moment(this.currentItem.licenseBeginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == nowDate[0]){
                        st =  nowDate[1];
                    }else{
                        st = '23:59:59';
                    }
                }
                return {
                    disabledDate: time => {
                        let timeOptionRange = this.currentItem.licenseEndTime;
                        let now = Date.now();
                        if(timeOptionRange) {
                            return time.getTime() > (new Date(timeOptionRange).getTime());
                        }
                        // return time.getTime() > now;
                    },
                    selectableRange: '00:00:00 - ' + st
                }
            },
            pickerOptions2() {
                let nowDate = moment().format('YYYY-MM-DD HH:mm:ss').split(" ");
                let nt = nowDate[1];
                let et = '00:00:00';
                if(this.currentItem.licenseEndTime && this.currentItem.licenseBeginTime) {
                    let startDate = moment(this.currentItem.licenseBeginTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    let endDate = moment(this.currentItem.licenseEndTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(startDate[0] == endDate[0]){
                        et = startDate[1]
                    }else{
                        et = '00:00:00'
                    }
                    if(endDate[0] != nowDate[0]) {
                        nt = '23:59:59'
                    }
                }else {
                    let endDate = moment(this.currentItem.licenseEndTime).format('YYYY-MM-DD HH:mm:ss').split(" ");
                    if(endDate[0] == nowDate[0]){
                        nt =  nowDate[1];
                    }else{
                        nt = '23:59:59';
                    }
                }
                return {
                    disabledDate: time =>{
                        let timeOptionRange = this.currentItem.licenseBeginTime;
                        let now = Date.now();
                        if(timeOptionRange){
                            return time.getTime() < (new Date(timeOptionRange).getTime() - 24*60*60*1000);
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
				$this.getOnlineCount()
			})
		}
	}
</script>

<style scoped>
	.popup-but-submit {
		height: 30px;
		line-height: 30px;
		margin-right: 5px;
	}
	.listbox {
		height: calc(100% - 47px);
	}
	.probeNumber {
		width: 200px;
		text-align: right;
		line-height: 30px;
		font-weight: bolder;
		color: #fff;
	}
	.probeNumber .probeNum {
		margin-right: 20px;
	}
	.probeNumber span {
		margin-left: 5px;
	}

	.probeNumber span.probeLine {
		color: #00D7CE;
	}
</style>
