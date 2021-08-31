<template>
	<div class="boxStyle">
		<div class="outerbox">
			<div class="fun-box">
				<div class="but-box">
					<Search placeholderValue="请输入角色名" v-on:searchFun="searchAction" />
					<div class="but add-but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="showAddDialogTableVisible">增加角色</div>
				</div>
			</div>
			<div class="userlist">
				<template>
					<el-table :data="listPageData" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
						<el-table-column prop="index" label="序号" type="index" align="center">
						</el-table-column>
						<el-table-column prop="name" label="角色名">
						</el-table-column>
						<el-table-column prop="code" label="角色编码">
						</el-table-column>
						<el-table-column prop="description" label="描述">
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editUser(scope.$index, scope.row)"><i
									 class="el-icon-edit-outline"></i></div>
								<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteUser(scope.$index, scope.row)"><i
									 class="el-icon-delete"></i></div>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</div>
			<div class="pagebox">
				<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="$store.state.pageSize"
				 layout="total,prev, pager, next, jumper" :total="totle">
				</el-pagination>
			</div>

			<!-- 新增 -->
			<el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="640px">
				<div class="popup">
					<div class="title">新增角色</div>
					<div class="hidepopup" @click="dialogTableVisible=!dialogTableVisible">×</div>
					<div class="adduser-item" style="margin-top:20px;">
						<span class="adduser-tip">角色名:</span>
						<el-input placeholder="请输入角色名" type="text" v-model="newUserObj.name" maxlength="20" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">角色编码:</span>
						<el-input placeholder="请输入角色编码" type="text" v-model="newUserObj.code" maxlength="20" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">描述:</span>
						<el-input placeholder="请输入描述" type="text" v-model="newUserObj.description" maxlength="100" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">权限选择:</span>
						<div class="jurisdictionbox">
							<div class="jurisdictionitem" v-for="(item,index) in $store.state.allJurisdictionArr" :key="index" v-html="item.name"
							 :class="[{onselectJurisdition:((onselectJurisditionArr).indexOf(item.id)>-1)}]" @click="selectJurisdition(item,'add')"></div>
						</div>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="submitAddUser(newUserObj,'add')">确定</el-button>
						<!-- <div class="popup-but popup-but-submit" @click="submitAddUser(newUserObj,'add')">确 定</div> -->
						<div class="popup-but popup-but-cancel" @click="cancelAddUser">取 消</div>
					</div>
				</div>
			</el-dialog>
			<!-- 编辑 -->
			<el-dialog :visible.sync="dialogTableVisible_edit" :close-on-click-modal="false" width="640px">
				<div class="popup">
					<div class="title">编辑角色</div>
					<div class="hidepopup" @click="dialogTableVisible_edit=!dialogTableVisible_edit">×</div>
					<div class="adduser-item">
						<span class="adduser-tip">角色名:</span>
						<el-input placeholder="请输入角色名" type="text" v-model="editUserObj.name" disabled="disabled" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">编码:</span>
						<el-input placeholder="请输入角色编码" type="text" v-model="editUserObj.code" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">描述:</span>
						<el-input placeholder="请输入描述" type="text" v-model="editUserObj.description" />
					</div>
					<div class="adduser-item">
						<span class="adduser-tip">权限修改:</span>
						<div class="jurisdictionbox">
							<div class="jurisdictionitem" v-for="(item,index) in $store.state.allJurisdictionArr" :key="index" v-html="item.name"
							 :class="[{onselectJurisdition:((editOnselectJurisdition).indexOf(item.id)>-1)}]" @click="selectJurisdition(item,'edit')"></div>
						</div>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="submitAddUser(editUserObj,'edit')">确定</el-button>
						<!-- <div class="popup-but popup-but-submit" @click="submitAddUser(editUserObj,'edit')">确 定</div> -->
						<div class="popup-but popup-but-cancel" @click="cancelEditUser">取 消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
				<div class="popup">
					<div class="title">删除角色</div>
					<div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
					<div class="add-info-box">
						<p class="popop-tipinfo">确定删除该角色吗？</p>
					</div>
					<div class="popup-buts">
						<div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import axiosHttp from '../../js/axiosHttp.js'
	import baseUrl from '../../js/baseUrl.js'
	import Search from '../search.vue'
	import CommonFun from '../../js/commonFun'
	export default {
		name: 'roleManage',
		components: {
			Search
		},
		data() {
			return {
				addRoleUrl: 'system/role/save',
				deleteRoleUrl: 'system/role/delete',
				newUserObj: {},
				editUserObj: {},
				dialogTableVisible: false,
				dialogTableVisible_edit: false,
				roletabletip: ['序号', '角色名', '描述', '操作'],
				onselectJurisditionArr: [], // add  当前被选中的权限ids
				editOnselectJurisdition: [], // edit  当前被选中的权限ids
				currentPage: 1,
				getListPageUrl: 'system/role/listPage',
				listPageData: [],
				totle: 0,
				id: '',
				dialogTableVisible_delete: false,
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('roleManage'),
			}
		},
		methods: {
			searchAction: function(keyword) {
				// 搜索
				this.keyword = keyword
				this.currentPage = 1
				this.getList()
			},
			getList: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				let obj = {
					keyword: $this.keyword,
					page: $this.currentPage,
					pageSize: $this.$store.state.pageSize
				}
				axiosHttp
					.post(baseUrl.BASEURL + $this.getListPageUrl, obj)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status == 1) {
							$this.totle = res.data.data.total
							$this.listPageData = res.data.data.records
						}
					})
					.catch(function(error) {
						CommonFun.closeFullScreen(loading)
						CommonFun.responseError(error, $this)
					})
			},
			submitAddUser(obj, kind) {
				var $this = this
				let loading = CommonFun.openFullScreen($this)
				var sendingParam = {}
				if (kind == 'add') {
					sendingParam.permissionIds = this.onselectJurisditionArr
					sendingParam.role = obj
				} else if (kind == 'edit') {
					sendingParam.permissionIds = this.editOnselectJurisdition
					sendingParam.role = obj
				}
				if (!sendingParam.permissionIds) {
					CommonFun.closeFullScreen(loading)
					$this.$message.error('请选择权限')
					return
				}
				axiosHttp
					.post(baseUrl.BASEURL + this.addRoleUrl, sendingParam)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status == 1) {
							if (kind == 'edit') {
								$this.$message({
									message: '编辑角色成功！',
									type: 'success'
								})
								$this.cancelEditUser()
							} else {
								$this.$message({
									message: '角色添加成功！',
									type: 'success'
								})
								$this.cancelAddUser()
							}
							$this.getList()
							$this.$store.dispatch(
								'getAllRoleData', {}
							) /* 用户新增和编辑角色新增在一个界面，dispatch('getAllRoleData')一下，免得新增用户的时候角色没跟新 */
						}
					})
					.catch(function(res) {
						CommonFun.closeFullScreen(loading)
						$this.$message.error(res.message)
					})
			},
			cancelAddUser() {
				this.onselectJurisditionArr = []
				this.newUserObj = {}
				this.dialogTableVisible = false
			},
			cancelEditUser() {
				this.editOnselectJurisdition = []
				this.editUserObj = {}
				this.dialogTableVisible_edit = false
			},
			editUser(index, item) {
				this.editUserObj = {
					id: item.id,
					name: item.name,
					code: item.code,
					description: item.description
				}
				this.editOnselectJurisdition = item.permissionIds
				this.dialogTableVisible_edit = !this.dialogTableVisible_edit
			},
			deleteUser: function(index, item) {
				this.dialogTableVisible_delete = true
				this.id = item.id
			},
			submitDelete() {
				var $this = this
				let loading = CommonFun.openFullScreen($this)
				let obj = {
					id: $this.id
				}
				axiosHttp
					.delete(baseUrl.BASEURL + this.deleteRoleUrl, {
						data: obj
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status == '1') {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.getList()
							$this.$store.dispatch('getAllRoleData', {})
							$this.dialogTableVisible_delete = false
						} else {
							CommonFun.responseError('角色删除失败', $this)
						}
					})
					.catch(function(res) {
						CommonFun.closeFullScreen(loading)
						$this.$message.error(data.message)
					})
			},
			// 选择权限
			selectJurisdition(item, type) {
				if (type == 'add') {
					var index = this.onselectJurisditionArr.indexOf(item.id)
					if (index > -1) {
						this.onselectJurisditionArr = []
					} else {
						this.onselectJurisditionArr = []
						this.onselectJurisditionArr.push(item.id)
					}
				} else if (type == 'edit') {
					var index_edit = this.editOnselectJurisdition.indexOf(item.id)
					if (index_edit > -1) {
						this.editOnselectJurisdition = []
					} else {
						this.editOnselectJurisdition = []
						this.editOnselectJurisdition.push(item.id)
					}
				}
			},
			// 弹出新增角色框
			showAddDialogTableVisible() {
				this.dialogTableVisible = !this.dialogTableVisible
				this.newUserObj = {}
				this.onselectJurisditionArr = []
			},
			handleCurrentChange(val) {
				if (val == this.currentPage) {
					return
				}
				this.currentPage = val
				this.getList()
			}
		},
		created: function() {
			this.getList()
			this.$store.dispatch('getAllJurisdictionData')
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup {
	padding: 0 20px;
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

	.earename {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.uesrtabletop {
		height: 50px;
		display: flex;
		width: auto;
	}

	.uesrtabletop .tip {
		font-size: 14px;
		font-weight: bolder;
	}

	.userlist {
		background-color: #fff;
		width: 100%;
		display: inline-grid;
	}

	.tip,
	.userinfo {
		flex: 1;
		text-align: center;
		line-height: 40px;
		border-bottom: 1px solid #f5f5f5;
		padding: 5px 0px;
	}

	.userinfo {
		display: flex;
	}

	.userinfo div {
		text-align: center;
		font-size: 13px;
		color: #666;
	}

	.editbox .deal-but {
		color: #fff;
		width: 44px;
	}

	.adduser-item {
		margin-bottom: 15px;
	}

	.adduser-tip {
		color: #fff;
		line-height: 35px;
		margin-right: 5px;
		text-align: right;
		display: inline-block;
	}

	.adduser-item input {
		display: inline-block;
		width: 500px;
		border: 1px solid #ddd;
		padding-left: 10px;
		line-height: 35px;
	}

	.buts {
		margin-top: 30px;
		display: flex;
		justify-content: flex-end;
	}

	.buts div {
		line-height: 40px;
		padding: 0 30px;
		margin-right: 10px;
		cursor: pointer;
	}

	.buts .submit-but-selectParent {
		background-color: #58a7ea;
		color: #fff;
	}

	.buts .cancel-but-selectParent {
		background-color: #fafafa;
		color: #adadad;
	}

	.jurisdictionbox {
		height: auto;
		overflow: hidden;
		border: 1px solid #ddd;
		padding: 10px;
		display: block;
	}

	.jurisdictionbox .jurisdictionitem {
		margin: 10px;
		padding: 10px;
		background-color: #adadad;
		color: #fff;
		cursor: pointer;
		width: 100px;
		float: left;
	}

	.jurisdictionbox .onselectJurisdition {
		background-color: #ffac5b;
	}
</style>
