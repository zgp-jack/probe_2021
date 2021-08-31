<template>
	<div class="boxStyle">
		<div class="outerbox-pro">
			<div class="fun-box">
				<div class="but-box">
					<Search placeholderValue="请输入名称" v-on:searchFun="searchAction" />
					<div class="but add-but popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增</div>
				</div>
				<div class="jobNameBox">
				</div>
			</div>
			<div class="content-outerbox">
				<div class="listbox">
					<div class="list-outer-div">
						<div class="list-content-div">
							<template>
								<el-table stripe header-row-class-name="table-header-row" row-class-name="table-row"  :data="listData" border style="width: 100%">
									<el-table-column prop="index" label="序号" type="index" align="center">
									</el-table-column>
									<el-table-column prop="name" label="名称">
									</el-table-column>
									<el-table-column prop="code" label="编码">
									</el-table-column>
									<el-table-column label="操作" width="90">
										<template slot-scope="scope">
											<div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFun(scope.$index, scope.row)"><i
												 class="el-icon-edit-outline"></i></div>
											<div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteFun(scope.$index, scope.row)"><i
												 class="el-icon-delete"></i></div>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</div>
					</div>
					<div class="pagebox">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="$store.state.pageSize"
						 layout="total,prev, pager, next, jumper" :total="totle">
						</el-pagination>
					</div>
				</div>
			</div>
			<!-- 弹出框  add edit-->
			<el-dialog :visible.sync="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="400px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
					<div class="add-info-box">
						<el-form :model="queryData" :rules="rules" ref="formAddEdit" class="popupruleform" :disabled="staut == 0">
							<div class="alignBoth">
								<el-form-item prop="taskName" label="名称" class="flex1">
									<el-input class="add-item-input" type="text" v-model="currentItem.name" placeholder="请输入名称"></el-input>
								</el-form-item>
							</div>
							<div class="alignBoth">
								<el-form-item prop="code" label="编码" class="flex1">
									<el-input class="add-item-input" type="text" v-model="currentItem.code" placeholder="请输入编码"></el-input>
								</el-form-item>
							</div>
						</el-form>
					</div>
					<div class="popup-buts">
						<el-button type="danger" @click="addAndEditSubmit">确定</el-button>
						<div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
					</div>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="300px">
				<div class="popup">
					<div class="title">{{ popupTitle }}</div>
					<div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
					<div class="add-info-box">
						<p class="popop-tipinfo">确定删除该按钮吗？</p>
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
	import Search from '../components/search.vue'
	import baseUrl from '../js/baseUrl.js'
	import axiosHttp from '../js/axiosHttp.js'
	import CommonFun from '../js/commonFun.js'
	export default {
		name: 'buttonManage',
		components: {
			Search
		},
		data() {
			return {
				dialogTableVisible_addAndedit: false,
				dialogTableVisible_delete: false,
				currentItemNodeId: '', // 选中部门id
				currentItem: {}, // 当前人员obj
				getListUrl: 'resource/button/listPage',
				saveUrl: 'resource/button/save',
				deleteUrl: 'resource/button/delete',
				listData: [],
				currentPage: 1,
				totle: 0,
				popupTitle: '',
				currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('buttonManage'),
			}
		},
		methods: {
			searchAction: function(key) {
				// 搜索
				this.key = key
				this.currentPage = 1
				this.getList()
			},
			getList: function() {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				let obj = {
					keyword: $this.key,
					page: $this.currentPage,
					pageSize: $this.$store.state.pageSize
				}
				return axiosHttp
					.post(baseUrl.BASEURL + $this.getListUrl, obj)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							$this.totle = res.data.data.total
							$this.listData = res.data.data.records
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(error) {
						CommonFun.closeFullScreen(loading)
					})
			},
			addFun: function() {
				let $this = this
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '新增按钮'
				$this.currentItem = {
					name: '',
					code: ''
				}
			},
			editFun: function(index, item) {
				let $this = this
				$this.dialogTableVisible_addAndedit = true
				$this.popupTitle = '编辑按钮'
				$this.currentItem = {
					id: item.id,
					name: item.name,
					code: item.code
				}
			},
			addAndEditSubmit: function() {
				let $this = this
				if (
					!(
						CommonFun.inputVerifica(
							$this.currentItem.name,
							"str",
							"名称不能为空",
							$this
						) &&
						CommonFun.inputVerifica(
							$this.currentItem.code,
							"str",
							"编码不能为空",
							$this
						)
					)
				) {
					return;
				}
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.post(baseUrl.BASEURL + $this.saveUrl, $this.currentItem)
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.currentItemNodeId = ''
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
			deleteFun: function(index, item) {
				this.dialogTableVisible_delete = true
				this.popupTitle = '删除按钮'
				this.currentItem = item
			},
			submitDelete: function() {
				// 提交删除
				let $this = this
				let obj = {
					id: $this.currentItem.id
				}
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.delete(baseUrl.BASEURL + $this.deleteUrl, {
						data: obj
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
							$this.dialogTableVisible_delete = false
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			handleCurrentChange(val) {
				// 分页跳转
				this.currentPage = val
				this.getList()
			}
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

	.content-outerbox {
		width: 100%;
		display: flex;
	}

	.left-tree {
		width: 240px;
		margin-right: 20px;
		background-color: #fff;
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

	.list-box {
		background-color: #fff;
		width: 100%;
		padding: 18px 24px 24px 24px;
	}

	.list-info-div {
		width: 100%;
		margin-bottom: 16px;
	}

	.list-info-title {
		font-size: 14px;
		margin-bottom: 10px;
	}

	.list-info-input {
		display: block;
		outline: none;
		border: 1px solid #eeeeee;
		padding-left: 15px;
		height: 40px;
		line-height: 38px;
		width: 100%;
	}

	.list-info-input-disable {
		background-color: #fbfbfb;
	}

	.list-info-submit {
		margin-top: 8px;
		width: 74px;
		height: 34px;
		line-height: 34px;
		font-size: 13px;
		cursor: pointer;
		background-color: #ffac5b;
		text-align: center;
		color: #fff;
	}

	/* popup */
	.add-info-box {
		display: flex;
		flex-wrap: wrap;
	}

	.add-item-div {
		width: 100%;
	}

	.jobNameBox {
		display: flex;
	}
</style>
