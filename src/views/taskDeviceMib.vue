<template>
	<div class="boxStyle m-dialog">
		<div class="outerbox-pro">
			<div class="fun-box">
				<div class="topruleform">
					<div class="gapright30 topruleform-inline">
						<label>厂家</label>
						<el-select v-model="searchData.manufactor" placeholder="厂家" clearable>
							<el-option v-for="item in CommonFun.getDataDictionaryChildrenListData($store.state.deviceManufactorValue)" :key="item.value"
							 :label="item.label" :value="item.label"></el-option>
						</el-select>
					</div>
					<div class="gapright30 topruleform-inline">
						<label>型号</label>
						<el-input v-model="searchData.model" placeholder="型号"></el-input>
					</div>
					<div class="but popup-but-submit gapright30" @click="searchAction()"><i class="el-icon-search"></i></div>
					<div class="but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add') > -1" @click="addFun">
						新增
					</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" stripe header-row-class-name="table-header-row" row-class-name="table-row" style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column prop="manufactorName" label="厂家" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="120" prop="model" label="型号" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidCpuRate" label="CPU利用率" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidMemorySize" label="内存大小" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidMemoryRate" label="内存利用率" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidMemoryUse" label="使用内存" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidMemoryFree" label="空闲内存" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" prop="oidTemperature" label="温度" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="120" prop="oidInterface" label="接口列表" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidInterfaceIp" label="接口IP" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" prop="oidBandWidth" label="标准带宽" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" prop="oidOutByte" label="出字节" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" prop="oidInByte" label="入字节" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidOutMessageCount" label="出报文个数" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" prop="oidInMessageCount" label="入报文个数" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="100" label="操作" align="center">
									<template slot-scope="scope">
										<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit') > -1" @click="editFun(scope.$index, scope.row)">
											<i class="el-icon-edit-outline"></i>
										</div>
										<!-- <div class="btnBox" title="接口" v-if="currentButtonJurisdiction.indexOf('detail')>-1" @click="detailFun(scope.$index, scope.row)"><i
											 class="el-icon-tickets"></i></div> -->
										<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete') > -1" @click="deleteFun(scope.$index, scope.row)">
											<i class="el-icon-delete"></i>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</div>
					<div class="pagebox">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
						 @size-change="handleSizeChange" layout="sizes,total,prev, pager, next, jumper" :total="totle" background></el-pagination>
					</div>
				</div>
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="690px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit = !dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<el-form :model="currentItem" :rules="ruleAddEdit" ref="formAddEdit" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="manufactor" label="厂家" class="flex1">
									<el-select v-model="currentItem.manufactor" class="add-item-input">
										<el-option v-for="item in CommonFun.getDataDictionaryChildrenListData($store.state.deviceManufactorValue)" :key="item.value"
										 :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop="model" label="型号" class="flex1 marginLeft10">
									<el-input v-model="currentItem.model" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="oidCpuRate" label="CPU利用率" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidCpuRate" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="oidTemperature" label="温度" class="flex1">
									<el-input v-model="currentItem.oidTemperature" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item v-if="currentItem.manufactor!=3" prop="oidMemorySize" label="内存大小" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidMemorySize" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item v-if="currentItem.manufactor!=3" prop="oidMemoryRate" label="内存利用率" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidMemoryRate" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item v-if="currentItem.manufactor==3" prop="oidMemoryUse" label="使用内存" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidMemoryUse" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item v-if="currentItem.manufactor==3" prop="oidMemoryFree" label="空闲内存" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidMemoryFree" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="oidInterface" label="接口列表" class="flex1">
									<el-input v-model="currentItem.oidInterface" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="oidInterfaceIp" label="接口IP" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidInterfaceIp" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="oidBandWidth" label="标准带宽" class="flex1">
									<el-input v-model="currentItem.oidBandWidth" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="oidOutByte" label="出字节" class="flex1  marginLeft10">
									<el-input v-model="currentItem.oidOutByte" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="oidInByte" label="入字节" class="flex1 marginLeft10">
									<el-input v-model="currentItem.oidInByte" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="oidOutMessageCount" label="出报文个数" class="flex1">
									<el-input v-model="currentItem.oidOutMessageCount" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="oidInMessageCount" label="入报文个数" class="flex1  marginLeft10">
									<el-input v-model="currentItem.oidInMessageCount" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</el-button>
						<!-- <el-button type="danger" @click="addAndEditSubmit()">确定</el-button> -->
						<el-button class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit = !dialogTableVisible_addAndedit">取消</el-button>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_detail" :close-on-click-modal="false">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_detail = !dialogTableVisible_detail">×</div>
					<div class="add-info-box">
						<div class="fun-box">
							<div class="topruleform">
								<el-input class="gapright topruleform-width120" v-model="searchDataDetail.name" placeholder="名称"></el-input>
								<el-input class="gapright topruleform-width120" v-model="searchDataDetail.ip" placeholder="IP"></el-input>
								<div class="search-but" @click="searchActionDetail"><i class="el-icon-search"></i></div>
								<div class="but add-but" v-if="currentButtonJurisdiction.indexOf('add') > -1" @click="addFunDetail">
									<i class="el-icon-circle-plus-outline"></i>
									新增
								</div>
							</div>
						</div>
						<div class="listbox">
							<div class="list-outer-div">
								<div class="list-content-div">
									<template>
										<el-table :data="listDataDetail" border :header-cell-style="{ background: '#f2f2f2' }" style="width: 910px">
											<el-table-column prop="index" label="序号" type="index" align="center" fixed></el-table-column>
											<el-table-column width="150" prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="ip" label="IP" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="bandWidth" label="标准带宽" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="outByte" label="出字节" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="inByte" label="入字节" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="outMessageCount" label="出报文个数" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="150" prop="inMessageCount" label="入报文个数" :show-overflow-tooltip="true"></el-table-column>
											<el-table-column width="80" label="操作" fixed="right" align="center">
												<template slot-scope="scope">
													<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit') > -1" @click="editFunDetail(scope.$index, scope.row, 'edit')">
														<i class="el-icon-edit-outline"></i>
													</div>
													<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete') > -1" @click="deleteFunDetail(scope.$index, scope.row)">
														<i class="el-icon-delete"></i>
													</div>
												</template>
											</el-table-column>
										</el-table>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="popup-buts">
					<div class="popup-but popup-but-cancel" @click="dialogTableVisible_detail = !dialogTableVisible_detail">关闭</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_addAndeditDetail" :close-on-click-modal="false" width="690px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndeditDetail = !dialogTableVisible_addAndeditDetail"></div>
					<div class="add-info-box add-info-box-esp">
						<el-form :model="currentItemDetail" :rules="ruleAddEditDetail" ref="formAddEditDetail" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="name" label="名称" class="flex1">
									<el-input v-model="currentItemDetail.name" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="ip" label="IP" class="flex1 marginLeft10">
									<el-input v-model="currentItemDetail.ip" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="bandWidth" label="标准带宽" class="flex1 marginLeft10">
									<el-input v-model="currentItemDetail.bandWidth" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="outByte" label="出字节" class="flex1">
									<el-input v-model="currentItemDetail.outByte" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="inByte" label="入字节" class="flex1 marginLeft10">
									<el-input v-model="currentItemDetail.inByte" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="outMessageCount" label="出报文个数" class="flex1 marginLeft10">
									<el-input v-model="currentItemDetail.outMessageCount" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="inMessageCount" label="入报文个数" class="flex1">
									<el-input v-model="currentItemDetail.inMessageCount" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
								<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmitDetail">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndeditDetail = !dialogTableVisible_addAndeditDetail">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_delete = !dialogTableVisible_delete">×</div>
					<div class="add-info-box">
						<p class="popop-tipinfo">确定删除该数据吗？</p>
					</div>
					<div class="popup-buts">
						<div class="popup-but popup-but-submit" @click="submitDelete()">确定</div>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete = !dialogTableVisible_delete">取消</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import baseUrl from '../js/baseUrl.js';
	import axiosHttp from '../js/axiosHttp.js';
	import CommonFun from '../js/commonFun.js';
	import Validation from '../js/validation.js';
	export default {
		name: 'taskDeviceMib',
		data() {
			return {
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_delete: false,
				dialogTableVisible_detail: false,
				dialogTableVisible_addAndeditDetail: false,

				searchData: {},
				listData: [],
				currentItem: {},
				currentPage: 1,
				totle: 0,
				pageSize: this.$store.state.pageSize,
				popupTitle: '新增',
				getListUrl: 'taskManagerDeviceMib/listPage',
				saveListUrl: 'taskManagerDeviceMib/save',
				deleteListUrl: 'taskManagerDeviceMib/delete',

				searchDataDetail: {},
				listDataDetail: [],
				currentItemDetail: {},
				currentPageDetail: 1,
				totleDetail: 0,
				getListUrlDetail: 'taskManagerDeviceMibInterface/listPage',
				saveListUrlDetail: 'taskManagerDeviceMibInterface/save',
				deleteListUrlDetail: 'taskManagerDeviceMibInterface/delete',

				operateType: 1,
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('taskDeviceMib'),
				ruleAddEdit: {
					manufactor: [{
						required: true,
						message: '请输入厂家',
						trigger: 'blur'
					}],
					model: [{
						required: true,
						message: '请输入型号',
						trigger: 'blur'
					}],
					oidInterface: [{
						required: true,
						message: '请输入接口列表',
						trigger: 'blur'
					}],
					oidInterfaceIp: [{
						required: true,
						message: '请输入接口IP',
						trigger: 'blur'
					}],
					oidBandWidth: [{
						required: true,
						message: '请输入标准带宽',
						trigger: 'blur'
					}],
					oidInByte: [{
						required: true,
						message: '请输入入字节',
						trigger: 'blur'
					}],
					oidOutByte: [{
						required: true,
						message: '请输入出字节',
						trigger: 'blur'
					}],
					oidInMessageCount: [{
						required: true,
						message: '请输入入报文个数',
						trigger: 'blur'
					}],
					oidOutMessageCount: [{
						required: true,
						message: '请输入出报文个数',
						trigger: 'blur'
					}]
				},
				ruleAddEditDetail: {}
			};
		},
		methods: {
			searchAction: function() {
				let $this = this;
				$this.currentPage = 1;
				$this.getList();
			},
			getList: function() {
				let $this = this;
				let loading = CommonFun.openFullScreen($this);
				$this.searchData.page = $this.currentPage;
				$this.searchData.pageSize = $this.pageSize;
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrl, $this.searchData)
					.then(function(res) {
						CommonFun.closeFullScreen(loading);
						console.log('列表::');
						console.log(res);
						if (res.data.status === 1) {
							$this.totle = res.data.data.total;
							$this.listData = res.data.data.records;
						} else {
							CommonFun.responseError(res.data, $this);
						}
					})
					.catch(function(err) {
						CommonFun.closeFullScreen(loading);
					});
			},
			addFun: function() {
				let $this = this;
				if ($this.$refs.formAddEdit) {
					$this.$refs.formAddEdit.resetFields();
				}
				$this.dialogTableVisible_addAndedit = true;
				$this.popupTitle = '新增';
				$this.currentItem = {};
			},
			editFun: function(index, item) {
				let $this = this;
				if ($this.$refs.formAddEdit) {
					$this.$refs.formAddEdit.resetFields();
				}
				$this.dialogTableVisible_addAndedit = true;
				$this.popupTitle = '编辑';
				$this.currentItem = JSON.parse(JSON.stringify(item));
			},
			detailFun: function(index, item) {
				let $this = this;
				$this.currentItem = JSON.parse(JSON.stringify(item));
				$this.popupTitle = '接口';
				$this.searchDataDetail = {
					mibId: item.id
				};
				$this.getListDetail();
				$this.dialogTableVisible_detail = true;
			},
			deleteFun: function(index, item) {
				let $this = this;
				$this.dialogTableVisible_delete = true;
				$this.popupTitle = '删除';
				$this.operateType = 1;
				$this.currentItem = JSON.parse(JSON.stringify(item));
			},
			addAndEditSubmit: function() {
				let $this = this;
				$this.$refs.formAddEdit.validate(valid => {
					if (valid) {
						let loading = CommonFun.openFullScreen($this);
						axiosHttp
							.post(baseUrl.BASEURL + $this.saveListUrl, $this.currentItem)
							.then(function(res) {
								CommonFun.closeFullScreen(loading);
								if (res.data.status === 1) {
									CommonFun.responseSuccess(res.data.message, $this);
									$this.getList();
									$this.dialogTableVisible_addAndedit = false;
								} else {
									CommonFun.responseError(res.data, $this);
								}
							})
							.catch(function(err) {
								CommonFun.closeFullScreen(loading);
							});
					}
				});
			},
			submitDelete: function() {
				let $this = this;
				let obj;
				let sUrl;
				if ($this.operateType == 1) {
					obj = {
						id: $this.currentItem.id
					};
					sUrl = $this.deleteListUrl;
				} else {
					obj = {
						id: $this.currentItemDetail.id
					};
					sUrl = $this.deleteListUrlDetail;
				}
				let loading = CommonFun.openFullScreen($this);
				axiosHttp
					.delete(baseUrl.BASEURL + sUrl, {
						data: obj
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading);
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this);

							$this.dialogTableVisible_delete = false;
							if ($this.operateType == 1) {
								$this.getList();
							} else {
								$this.getListDetail();
							}
						} else {
							CommonFun.responseError(res.data, $this);
						}
					})
					.catch(function(error) {
						CommonFun.closeFullScreen(loading);
						CommonFun.responseError(error, $this);
					});
			},
			handleCurrentChange: function(val) {
				let $this = this;
				$this.currentPage = val;
				$this.getList();
			},
			handleSizeChange(val) {
				this.currentPage = 1
				this.pageSize = val
				this.getList()
			},
			searchActionDetail: function() {
				let $this = this;
				$this.searchDataDetail.currentPageDetail = 1;
				$this.searchDataDetail.mibId = $this.currentItem.id;
				$this.getListDetail();
			},
			getListDetail: function() {
				let $this = this;
				$this.searchDataDetail.page = $this.currentPageDetail;
				$this.searchDataDetail.pageSize = $this.$store.state.pageSize;
				let loading = CommonFun.openFullScreen($this);
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrlDetail, $this.searchDataDetail)
					.then(function(res) {
						CommonFun.closeFullScreen(loading);
						console.log('弹出框列表========');
						console.log(res);
						if (res.data.status === 1) {
							$this.listDataDetail = res.data.data.records;
							$this.totleDetail = res.data.data.total;
						} else {
							CommonFun.responseError(res.data, $this);
						}
					})
					.catch(function(err) {
						CommonFun.closeFullScreen(loading);
					});
			},
			addFunDetail: function() {
				let $this = this;
				if ($this.$refs.formAddEditDetail) {
					$this.$refs.formAddEditDetail.resetFields();
				}
				$this.popupTitle = '新增';
				$this.operateType = 1;
				($this.currentItemDetail = {
					mibId: $this.currentItem.id
				}),
				($this.dialogTableVisible_addAndeditDetail = true);
			},
			editFunDetail: function(index, item) {
				let $this = this;
				if ($this.$refs.formAddEditDetail) {
					$this.$refs.formAddEditDetail.resetFields();
				}
				$this.popupTitle = '编辑';
				$this.operateType = 2;
				$this.currentItemDetail = JSON.parse(JSON.stringify(item));
				$this.dialogTableVisible_addAndeditDetail = true;
			},
			deleteFunDetail: function(index, item) {
				let $this = this;
				$this.currentItemDetail = JSON.parse(JSON.stringify(item));
				$this.operateType = 2;
				$this.dialogTableVisible_delete = true;
			},
			addAndEditSubmitDetail: function() {
				// 提交新增 编辑
				let $this = this;
				console.log('提交数据内容');
				console.log($this.currentItemDetail);
				$this.$refs.formAddEditDetail.validate(valid => {
					if (valid) {
						let loading = CommonFun.openFullScreen($this);
						axiosHttp
							.post(baseUrl.BASEURL + $this.saveListUrlDetail, $this.currentItemDetail)
							.then(function(res) {
								CommonFun.closeFullScreen(loading);
								if (res.data.status === 1) {
									CommonFun.responseSuccess(res.data.message, $this);
									$this.getListDetail();
									$this.dialogTableVisible_addAndeditDetail = false;
								} else {
									CommonFun.responseError(res.data, $this);
								}
							})
							.catch(function(err) {
								CommonFun.closeFullScreen(loading);
							});
					}
				});
			}
		},
		created: function() {
			let $this = this;
			let loading = CommonFun.openFullScreen($this);
			$this.getList().then((res, error) => {
				CommonFun.closeFullScreen(loading);
			});
		}
	};
</script>

<style scoped>
.alignBoth{
	width: 100%;
}
.listbox{height: calc(100% - 45px);}
</style>
