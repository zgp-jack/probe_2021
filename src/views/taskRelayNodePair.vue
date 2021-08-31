<template>
	<div>
		<div >
			<div class="fun-box">
				<div class="topruleform">
					<!-- <div class="block gapright topruleform-width120">
						<el-input v-model="searchData.identifier" placeholder="标识符"></el-input>
					</div>
					<div class="block gapright topruleform-width120">
						<el-input v-model="searchData.ip" placeholder="目标IP"></el-input>
					</div>
					<div class="block gapright topruleform-width120">
						<el-input v-model="searchData.anode" placeholder="节点A"></el-input>
					</div>
					<div class="block gapright topruleform-width120">
						<el-input v-model="searchData.bnode" placeholder="节点B"></el-input>
					</div>
					<div class="search-but" @click="searchAction()"><i class="el-icon-search"></i></div> -->
					<div class="btn-dialog" @click="addFun">新增</div>
				</div>
			</div>
			<div class="listbox">
				<div class="list-outer-div">
					<div class="list-content-div">
						<template>
							<el-table :data="listData" stripe header-row-class-name="table-header-row" row-class-name="table-row" height="360" style="width: 100%">
								<el-table-column prop="index" label="序号" type="index" align="center" ></el-table-column>
								<el-table-column prop="identifier" label="标识符"></el-table-column>
								<el-table-column width="120" prop="ip" label="目标IP"></el-table-column>
								<el-table-column width="120" prop="anode" label="节点A"></el-table-column>
								<el-table-column width="120" prop="bnode" label="节点B"></el-table-column>
								<el-table-column width="70" label="操作"  align="center">
									<template slot-scope="scope">
										<div class="btnBox" title="编辑" @click="editFun(scope.$index, scope.row)"><i
											 class="el-icon-edit"></i></div>
										<div class="btnBox" title="删除" @click="deleteFun(scope.$index, scope.row)"><i
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
						 :total="totle">
						</el-pagination>
					</div>
				</div>
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" append-to-body :close-on-click-modal="false" width="690px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<el-form :model="currentItem" :rules="ruleAddEdit" ref="formAddEdit" class="popupruleform">
							<div class="alignBoth">
								<el-form-item prop="identifier" label="标识符" class="flex1">
									<el-input v-model="currentItem.identifier" class="add-item-input" type="text" maxlength="32"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="ip" label="目标IP" class="flex1">
									<el-input v-model="currentItem.ip" disabled class="add-item-input" type="text" maxlength="15"></el-input>
								</el-form-item>
								<el-form-item prop="anode" label="节点A" class="flex1 marginLeft10">
									<el-input v-model="currentItem.anode" class="add-item-input" type="text" maxlength="15"></el-input>
								</el-form-item>
								<el-form-item prop="bnode" label="节点B" class="flex1 marginLeft10">
									<el-input v-model="currentItem.bnode" class="add-item-input" type="text" maxlength="15"></el-input>
								</el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button class="popup-but popup-but-submit" @click="addAndEditSubmit()">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" append-to-body :close-on-click-modal="false" width="21.9%">
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
		name: 'taskRelayNodePair',
		props: ['targetIp'],
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
				getListUrl: 'taskManagerRelayNodePair/listPage',
				saveListUrl: 'taskManagerRelayNodePair/save',
				deleteListUrl: 'taskManagerRelayNodePair/delete',
				listData: [],
				dealType: 0,
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('taskRelayNodePair'),
				ruleAddEdit: {
					identifier: [{
						required: true,
						message: '请输入标识符',
						trigger: 'blur'
					}],
					ip: [{
							required: true,
							message: '请输入目标IP',
							trigger: 'blur'
						},
						{
							validator: Validation.ifIp,
							message: '输入数据无效',
							trigger: 'blur'
						}
					],
					anode: [{
							required: true,
							message: '请输入节点A',
							trigger: 'blur'
						},
						{
							validator: Validation.ifIp,
							message: '输入数据无效',
							trigger: 'blur'
						}
					],
					bnode: [{
							required: true,
							message: '请输入节点B',
							trigger: 'blur'
						},
						{
							validator: Validation.ifIp,
							message: '输入数据无效',
							trigger: 'blur'
						}
					],
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
				$this.searchData.ip = $this.targetIp;
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
				$this.currentItem = {
					ip: this.targetIp
				}
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
</style>
