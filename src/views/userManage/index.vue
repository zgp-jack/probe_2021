<template>
	<div class="boxStyle">
		<div class="outerbox-pro">
			<div class="fun-box">
				<div class="but-box">
					<Search placeholderValue="请输入员工" v-on:searchFun="searchAction" />
					<div class="but add-but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增账号</div>
				</div>
			</div>
			<div class="content-outerbox">
				<div class="left-tree">
                    <el-scrollbar>
                        <el-tree class="filter-tree" :data="$store.state.companyTreeArr" :props="defaultProps" default-expand-all
                            :expand-on-click-node="false" :highlight-current="true" @node-click="selectNode" ref="tree">
                        </el-tree>
                    </el-scrollbar>
				</div>
				<div class="right-list-info">
					<div class="listbox">
						<div class="list-outer-div">
							<el-scrollbar class="list-content-div">
								<template>
									<el-table :data="listData" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
										<el-table-column prop="index" label="序号" type="index" align="center">
										</el-table-column>
										<el-table-column prop="username" label="用户名">
										</el-table-column>
										<!-- <el-table-column prop="employeeName" label="员工">
										</el-table-column>
										<el-table-column prop="jobName" label="所属岗位">
										</el-table-column> -->
										<el-table-column prop="companyName" label="所属单位">
										</el-table-column>
										<el-table-column prop="roleName" label="角色">
										</el-table-column>
										<el-table-column label="操作">
											<template slot-scope="scope">
												<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFun(scope.$index, scope.row)"><i
													 class="el-icon-edit-outline"></i></div>
												<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteFun(scope.$index, scope.row)"><i
													 class="el-icon-delete"></i></div>
												<div class="btnBox" title="修改密码" v-if="currentButtonJurisdiction.indexOf('modifyPwd')>-1" @click="modifyPasswordFun(scope.$index, scope.row)"><i
													 class="el-icon-lock"></i></div>
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
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="30%">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<div class="add-item-div">
							<div class="add-item-title">用户名</div>
							<el-input type="text" v-model="currentItem.username" maxlength="20" />
						</div>
						<div class="add-item-div">
							<div class="add-item-title">所属单位</div>
							<el-input disabled="disabled" type="text" v-model="currentCompanyName" maxlength="20" />
						</div>
						<!-- <div class="add-item-div">
							<div class="add-item-title">员工</div>
							<el-select v-model="currentItem.employeeId" clearable placeholder="请选择">
								<el-option v-for="item in staffList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
							</el-select>
						</div> -->
						<div class="add-item-div">
							<div class="add-item-title">角色名</div>
							<el-select v-model="currentItem.roleId" clearable placeholder="请选择">
								<el-option v-for="item in $store.state.allRoleArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</div>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmit">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
					<div class="add-info-box">
						<p class="popop-tipinfo">确定删除该账号吗？</p>
					</div>
					<div class="popup-buts">
						<div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_modifyPassword" :close-on-click-modal="false" width="25%">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_modifyPassword=!dialogTableVisible_modifyPassword">×</div>
					<div class="add-info-box">
						<div class="add-item-title">密码</div>
						<el-input type="password" v-model="modifyPassword.password" maxlength="50" />
					</div>
					<div class="popup-buts">
						<div class="popup-but popup-but-submit" @click="submitModifyPassword">确定</div>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_modifyPassword= !dialogTableVisible_modifyPassword">取消</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Search from '../../components/search.vue'
	import baseUrl from '../../js/baseUrl.js'
	import axiosHttp from '../../js/axiosHttp.js'
	import CommonFun from '../../js/commonFun.js'
	export default {
		name: 'userManage',
		components: {
			Search
		},
		data() {
			return {
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_delete: false,
				dialogTableVisible_modifyPassword: false,
				currentPage: 1,
				totle: 0,
				data: [], // 树
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				popupTitle: '',
				currentCompanyId: '', // 选中单位树节点id
				currentCompanyName: '', //选中单位树节点name
				currentItem: {}, // 当前新增 编辑 删除项
				keyword: '',
				getListUrl: 'system/user/listPage',
				saveUserUrl: 'system/user/save',
				deleteUserUrl: 'system/user/delete',
				listData: [],
				getStaffListUrl: 'postStaff/list',
				staffList: [],
				resetPasswordUrl: 'system/user/reset-password',
				modifyPassword: {},
				currenType: 0, //当前选中树type 判断当前角色是否能操作新增的依据
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('userManage'),
			}
		},
		methods: {
			searchAction: function(keyword) {
				// 搜索
				this.keyword = keyword
				this.currentPage = 1
				this.getList()
			},
			//获得员工数组
			getStaffList() {
				let $this = this
				let obj = {
					companyId: $this.currentCompanyId
				}
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.post(baseUrl.BASEURL + $this.getStaffListUrl, obj)
					.then(function(res) {
						console.log('员工 list：')
						console.log(res)
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							$this.staffList = res.data.data
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).then(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			//获得列表
			getList: function() {
				// 获得列表
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				if (CommonFun.ifNall(CommonFun.currentCompanyIdsArr)) { //如果为空 即传所有ids
					if (!CommonFun.ifNall($this.$store.state.companyTreeArr)) {
						for (let i = 0; i < $this.$store.state.companyTreeArr.length; i++) {
							CommonFun.getAllChildrenIds($this.$store.state.companyTreeArr[i])
						}
					}
				}
				let obj = {
					keyword: $this.keyword,
					page: $this.currentPage,
					pageSize: $this.$store.state.pageSize,
					companyIdList: CommonFun.currentCompanyIdsArr, //选中的叶子节点的id
				}
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrl, obj)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						console.log('列表：')
						console.log(res)
						if (res.data.status === 1) {
							$this.totle = res.data.data.total
							$this.listData = res.data.data.records
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).then(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			selectNode: function(data, node, e) {
				// 跟新当前部门id
				var $this = this
				$this.currentPage = 1
				$this.currentCompanyId = data.id
				$this.currentCompanyName = data.name
				$this.currenType = data.type //当前选中树type 判断当前角色是否能操作新增的依据
				$this.getStaffList() //获得当前员工 根据队id
				CommonFun.currentCompanyIdsArr = []
				CommonFun.getAllChildrenIds(data)
				$this.getList() //获得新列表
			},
			// 点击新增
			addFun: function() {
				let $this = this

				//如果当前用户角色是crewadmin（钻井队管理员）就不能操作type==3（选中树的节点的type字段）
				if (sessionStorage.getItem('roleCode') == 'crewadmin' && $this.currenType != 3) {
					CommonFun.responseError({
						message: '无权限操作！'
					}, $this)
					return false;
				}
				if (CommonFun.ifNall($this.currentCompanyId)) {
					CommonFun.responseError({
						message: "请先选择单位"
					}, $this);
					return;
				}

				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '新增账号'
				$this.currentItem = $this.resetCurrentItem()
				$this.currentItem.companyId = $this.currentCompanyId
			},
			editFun: function(index, item) {
				// 点击编辑
				let $this = this
				console.log(item)
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '编辑账号'
				$this.currentCompanyId = item.companyId
				$this.getStaffList() //获得员工数组

				$this.currentItem = {
					id: item.id,
					username: item.username,
					companyId: item.companyId,
					classId: item.classId,
					roleId: item.roleId,
					// employeeId: item.employeeId,
					companyName: item.companyName
				}
				$this.currentCompanyName = item.companyName
			},
			deleteFun: function(index, item) {
				// 点击删除
				this.dialogTableVisible_delete = true
				this.popupTitle = '删除账号'
				this.currentItem = item
			},
			modifyPasswordFun: function(index, item) {
				// 重置密码
				let $this = this
				this.popupTitle = '修改密码'
				$this.modifyPassword = {
					id: item.id
				}
				$this.dialogTableVisible_modifyPassword = true
			},
			submitModifyPassword: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.put(baseUrl.BASEURL + $this.resetPasswordUrl, $this.modifyPassword)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.getList()
							$this.dialogTableVisible_modifyPassword = false
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			addAndEditSubmit: function() {
				// 提交新增 编辑/* roleId:'',employeeId:'' */
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				if (CommonFun.ifNall($this.currentItem.username) || CommonFun.ifNall(
						$this.currentItem.roleId)) {
					CommonFun.closeFullScreen(loading)
					CommonFun.responseError({
						message: "姓名，角色名都是必填！"
					}, $this);
					return;
				}
				axiosHttp
					.post(baseUrl.BASEURL + $this.saveUserUrl, $this.currentItem)
					.then(function(res) {
						console.log(res)
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.getList()
							$this.dialogTableVisible_addAndedit = false
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			submitDelete: function() {
				// 提交删除
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.delete(baseUrl.BASEURL + $this.deleteUserUrl, {
						data: {
							id: $this.currentItem.id
						}
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							// 判断当前页是不是最后一条数据，如果是且当前页大于1，则当前页减1刷新列表
							let page = $this.currentPage
							if (page > 1 && $this.listData.length === 1) {
								$this.currentPage = page - 1
							}
							$this.getList()
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
						$this.dialogTableVisible_delete = false
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			handleCurrentChange: function(val) {
				// 分页跳转
				this.currentPage = val
				this.getList()
			},
			FormatTime: function(data) {
				return CommonFun.FormatTime(data)
			},
			resetCurrentItem: function() {
				this.currentItem = {
					id: '',
					username: '',
					companyId: '',
					classId: '',
					// employeeId: '',
					roleId: ''
				}
				return this.currentItem
			}
		},
		created: function() {
			CommonFun.currentCompanyIdsArr = []
			let $this = this
			let loading = CommonFun.openFullScreen($this)
			$this.$store.dispatch('getAllRoleData', {}).then(res => {
					//第一次进入页面的时候，需要传所有单位树ids 所以加回调
					$this.$store.dispatch("getCompanyTreeArrData", $this.getList).then(res => {
						CommonFun.closeFullScreen(loading)
					})
				})
				.catch(function(error) {
					CommonFun.closeFullScreen(loading)
				})
		}
	}
</script>

<style scoped lang="scss">
	.boxStyle {
		padding: 15px;
	}

	.totalNum {
		display: flex;
		align-items: flex-end;
	}

	.totalNum p {
		height: 36px;
		line-height: 36px;
		font-size: 13px;
		color: #333;
	}

	.el-tree {
		padding: 10px 10px;
		// max-height: 629px;
		width: 100%;
		display: grid;
		overflow: auto;
        background-color: RGBA(3, 32, 31, 1);
	}

	.content-outerbox {
        height: calc(100% - 47px);
		width: 100%;
		display: flex;
	}

	.left-tree {
		width: 240px;
        // height: calc(100% - 47px);
		margin-right: 15px;
		// max-height: 631px;
		background-color: RGBA(3, 32, 31, 1);
		border: 1px solid rgba(10, 179, 172, 1);
	}

	.tree-title {
		font-size: 14px;
		color: #000;
		font-weight: bold;
		padding-bottom: 24px;
		background-color: #f5f5f5;
	}

	.right-list-info {
		flex: 1;
	}

	.deal-delete {
		margin-right: 1px;
	}

	.deal-resetpassword {
		width: 70px;
	}

	/* popup */
	.add-info-box {
		display: flex;
		// padding-right: 8px;
		flex-wrap: wrap;
	}

	.add-item-div {
		width: 100%;
		// margin-right: 4%;
	}

	.jobNameBox {
		display: flex;
	}

	.el-dropdown {
		width: 100%;
	}

	.list-content-div {
		display: inline-grid;
        height: 100%;
	}

	.add-item-input {
		height: 40px;
		border: 1px solid #DCDFE6;
		outline: none;
		border-radius: 5px;
		padding: 0 15px;
	}
</style>
