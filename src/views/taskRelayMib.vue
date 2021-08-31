<template>
	<div class="boxStyle">
		<div class="outerbox-pro">
			<div class="fun-box">
				<div class="topruleform">
					<div class="gapright30 topruleform-inline">
						<label>指标名称</label>
						<el-input v-model="searchData.name" placeholder="指标名称"></el-input>
					</div>
					<div class="gapright30 topruleform-inline">
						<label>厂家</label>
						<el-input v-model="searchData.manufactor" placeholder="厂家"></el-input>
					</div>
					<div class="gapright30 topruleform-inline">
						<label>型号</label>
						<el-input v-model="searchData.model" placeholder="型号"></el-input>
					</div>
					<div class="but popup-but-submit gapright30" @click="searchAction()"><i class="el-icon-search"></i></div>
					<div class="but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" stripe header-row-class-name="table-header-row" row-class-name="table-row" style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
								<el-table-column prop="name" label="指标名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="250" prop="manufactor" label="厂家" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="120" prop="model" label="型号" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="250" prop="oid" label="OID" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="200" prop="valueType" label="取值类型" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="70" label="操作" align="center">
									<template slot-scope="scope">
										<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFun(scope.$index, scope.row)"><i
											 class="el-icon-edit"></i></div>
										<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteFun(scope.$index, scope.row)"><i
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
						@size-change="handleSizeChange"
						layout="sizes,total,prev, pager, next, jumper" 
						:total="totle"
						background>
						</el-pagination>
					</div>
				</div>
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="690px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<el-form :model="currentItem" :rules="ruleAddEdit" ref="formAddEdit" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="name" label="指标名称" class="flex1">
									<el-input v-model="currentItem.name" class="add-item-input" type="text" maxlength="64"></el-input>
								</el-form-item>
								<el-form-item prop="manufactor" label="厂家" class="flex1 marginLeft10">
									<el-input v-model="currentItem.manufactor" class="add-item-input" type="text" maxlength="64"></el-input>
								</el-form-item>
								<el-form-item prop="model" label="型号" class="flex1 marginLeft10">
									<el-input v-model="currentItem.model" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="oid" label="OID" class="flex1">
									<el-input v-model="currentItem.oid" class="add-item-input" type="text" maxlength="128"></el-input>
								</el-form-item>
								<el-form-item prop="valueType" label="取值类型" class="flex1 marginLeft10">
									<el-input v-model="currentItem.valueType" class="add-item-input" type="text" maxlength="64"></el-input>
								</el-form-item>
								<el-form-item prop="" label="" class="flex1 marginLeft10">
								</el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmit()">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
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
		</div>
	</div>
</template>

<script>
	import baseUrl from '../js/baseUrl.js'
	import axiosHttp from '../js/axiosHttp.js'
	import CommonFun from '../js/commonFun.js'
	import Validation from '../js/validation.js'
	export default {
		name: 'taskRelayMib',
		data() {
			return {
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_delete: false,

				searchData: {},
				currentPage: 1,
				totle: 0,
				pageSize:this.$store.state.pageSize,
				popupTitle: '新增',
				currentItem: {},
				getListUrl: 'taskManagerRelayMib/listPage',
				saveListUrl: 'taskManagerRelayMib/save',
				deleteListUrl: 'taskManagerRelayMib/delete',
				listData: [],
				dealType: 0,
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('taskRelayMib'),
				ruleAddEdit: {
					name: [{
						required: true,
						message: '请输入指标名称',
						trigger: 'blur'
					}],
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
					oid: [{
						required: true,
						message: '请输入OID',
						trigger: 'blur'
					}],
					valueType: [{
						required: true,
						message: '请输入取值类型',
						trigger: 'blur'
					}],
				},
			}
		},
		methods: {
			searchAction: function() {
				let $this = this
				$this.currentPage = 1
				$this.getList()
			},
			getList: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				$this.searchData.page = $this.currentPage
				$this.searchData.pageSize = $this.pageSize
				return axiosHttp.post(baseUrl.BASEURL + $this.getListUrl, $this.searchData).then(function(res) {
					CommonFun.closeFullScreen(loading)
					console.log('列表::')
					console.log(res)
					if (res.data.status === 1) {
						$this.totle = res.data.data.total
						$this.listData = res.data.data.records
					} else {
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
				$this.currentItem = {}
			},
			editFun: function(index, item) {
				let $this = this
				if ($this.$refs.formAddEdit) {
					$this.$refs.formAddEdit.resetFields();
				}
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '编辑'
				$this.currentItem = JSON.parse(JSON.stringify(item))
			},
			deleteFun: function(index, item) {
				let $this = this
				this.dialogTableVisible_delete = true
				this.popupTitle = '删除'
				this.currentItem = JSON.parse(JSON.stringify(item))
			},
			addAndEditSubmit: function() {
				let $this = this
				$this.$refs.formAddEdit.validate((valid) => {
					if (valid) {
						let loading = CommonFun.openFullScreen($this)
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
				let obj = {
					id: $this.currentItem.id
				}
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.delete(baseUrl.BASEURL + $this.deleteListUrl, {
						data: obj
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.getList()
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
			handleSizeChange(val){
				this.currentPage = 1
				this.pageSize = val
				this.getList()
			},
		},
		created: function() {
			let $this = this
			let loading = CommonFun.openFullScreen($this)
			$this.getList().then((res, error) => {
				CommonFun.closeFullScreen(loading)
			})
		}
	}
</script>

<style scoped>
.m-dialog ::v-deep .el-dialog{
	top: 300px !important;
}
.alignBoth{
	width: 100%;
}
.listbox{height: calc(100% - 45px);}
</style>
