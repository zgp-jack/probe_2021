<template>
<div class="m-dialog">
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="846px">
		<div class="popup">
			<div class="title">配置接口</div>
			<div class="hidepopup" @click="handleClose">×</div>
			<div class="add-info-box">
				<div style="height: 30px">
					<div class="send-dial-btn" @click="sendDial"><i class="el-icon-refresh"></i>发起探测</div>
					<!-- <div class="topruleform">
						<div class="gapright30 topruleform-inline">
							<label>接口名称：</label>
							<el-input v-model="searchDataDetail.keyword" placeholder="名称"></el-input>
						</div>
						<div class="but popup-but-submit gapright30" @click="searchActionDetail"><i class="el-icon-search"></i></div>
					</div> -->
				</div>
				<div class="listbox">
					<div class="list-outer-div">
						<div class="list-content-div">
								<el-table :data="listDataDetail" stripe header-row-class-name="table-header-row" row-class-name="table-row" height="500px">
									<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
									<el-table-column prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column prop="ip" label="IP" width="150" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column prop="realityBandWidth" label="实际带宽" width="100" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column prop="statusName" width="100" label="状态" :show-overflow-tooltip="true"></el-table-column>
									<el-table-column label="操作" width="120" align="center">
										<template slot-scope="scope">
											<div class="btnBox" title="编辑" @click="editFunDetail(scope.$index, scope.row, 'edit')">
												<i class="el-icon-edit-outline"></i>
											</div>
											<div class="btnBox" title="删除" @click="deleteFunDetail(scope.$index, scope.row)">
												<i class="el-icon-delete"></i>
											</div>
											<div class="btnBox" title="启用" v-if="scope.row.status == 2"
												@click="statusDetailFun(scope.row, 1)">
												<i class="el-icon-video-play"></i>
											</div>
											<div class="btnBox" title="停用" v-if="scope.row.status == 1"
												@click="statusDetailFun(scope.row, 2)">
												<i class="el-icon-video-pause"></i>
											</div>
											<div class="btnBox" title="链接到首页流量趋势" v-if="scope.row.home == 1"
												@click="homeDetailFun(scope.row, 0)">
												<i class="iconfont icon-home"></i>
											</div>
											<div class="btnBox" title="链接到首页流量趋势" v-else
												@click="homeDetailFun(scope.row, 1)" style="color: #007F7A">
												<i class="iconfont icon-home"></i>
											</div>
										</template>
									</el-table-column>
								</el-table>
						</div>
					</div>
				</div>
				<div class="popup-buts">
					<div class="popup-but popup-but-cancel" style="margin-left: 0" @click="handleClose">关闭</div>
				</div>
			</div>
		</div>
	</el-dialog>
	<el-dialog :visible.sync="dialogTableVisible_addAndeditDetail"  :close-on-click-modal="false" width="690px">
		<div class="popup">
			<div class="title">{{ popupTitle }}</div>
			<div class="hidepopup" @click="dialogTableVisible_addAndeditDetail = !dialogTableVisible_addAndeditDetail">×</div>
			<div class="add-info-box add-info-box-esp">
				<el-form :model="currentItemDetail" :rules="ruleAddEditDetail" ref="formAddEditDetail" class="popupruleform">
					<div class="alignBoth">
						<el-form-item prop="name" label="名称" class="flex1">
							<el-input v-model="currentItemDetail.name" readonly="readonly" class="add-item-input" type="text" maxlength="128"></el-input>
						</el-form-item>
						<el-form-item prop="ip" label="IP" class="flex1 marginLeft10">
							<el-input v-model="currentItemDetail.ip" class="add-item-input" type="text" maxlength="128"></el-input>
						</el-form-item>
						<el-form-item prop="realityBandWidth" label="实际带宽" class="flex1 marginLeft10">
							<el-input v-model="currentItemDetail.realityBandWidth" class="add-item-input" type="text" maxlength="128"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth alignBothesp">
						<el-form-item prop="status" label="状态" class="flex1">
							<el-select v-model="currentItemDetail.status" class="" placeholder="请选择">
								<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
						<el-form-item prop="" label="" class="flex1 marginLeft10"></el-form-item>
					</div>
				</el-form>
			</div>
			<div class="popup-buts">
				<!-- <el-button type="danger" @click="resumeDetail">还原带宽</el-button>
				<el-button type="danger" @click="addAndEditSubmitDetail">确定</el-button> -->
				<div class="popup-but popup-but-submit" @click="resumeDetail">还原带宽</div>
				<div class="popup-but popup-but-submit" style="margin-left: 100px" @click="addAndEditSubmitDetail">确定</div>
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
</template>
<script>
import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';
import CommonFun from '@/js/commonFun.js';
export default {
	components: {
		
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '新增'
		},
		staut: {
      		type: Number,
      		default: 1 //0查看, 1新增, 2编辑
    	},
		detailData: {
      		type: Object,
      		default: () => {
        		return {};
      		}
    	},
		searchData: {
      		type: Object,
      		default: () => {
        		return {};
      		}
    	}
	},
    data() {
        return {
			listDataDetail: [],
			searchDataDetail: {
				keyword: '',
				deviceId: '',
				page: 1,
				pageSize: this.$store.state.pageSize
			},
			currentPageDetail: 1,
			ruleAddEditDetail: {},
			currentItemDetail: {},
			popupTitle: '',
			statusOptions: [{
					value: 1,
					label: '启用'
				},
				{
					value: 2,
					label: '禁用'
				}
			],
			dialogTableVisible_addAndeditDetail: false,
			dialogTableVisible_delete: false
        }
    },
	mounted() {
		this.searchDataDetail.deviceId = this.searchData.deviceId;
		this.getListDetail();
	},
    methods: {
		searchActionDetail() {
			this.currentPageDetail = 1;
			this.getListDetail();
		},
        getListDetail() {
            this.searchDataDetail.page = this.currentPageDetail;
            let loading = CommonFun.openFullScreen(this);
            axiosHttp.post(baseUrl.BASEURL + 'taskManagerDeviceInterface/list', this.searchDataDetail).then((res) => {
                CommonFun.closeFullScreen(loading);
                console.log('弹出框列表========');
                console.log(res);
                if (res.data.status === 1) {
                    this.listDataDetail = res.data.data;
                } else {
                    CommonFun.responseError(res.data, this);
                }
            })
            .catch(function(err) {
                CommonFun.closeFullScreen(loading);
            });
        },
		//发起拨测请求
		sendDial() {
			let loading = CommonFun.openFullScreen(this);
			axiosHttp.post(baseUrl.BASEURL + 'taskManagerDevice/sendDial', this.detailData).then((res) => {
				CommonFun.closeFullScreen(loading);
				if (res.data.status === 1) {
					this.getListDetail()
					CommonFun.responseSuccess(res.data.message, this);
				} else {
					CommonFun.responseError(res.data, this);
				}
			})
			.catch(function(err) {
				CommonFun.closeFullScreen(loading);
			});
		},
		statusDetailFun: function(item, status) {
			let params = {
				id: item.id,
				deviceId: this.detailData.id,
				status: status
			};
			let loading = CommonFun.openFullScreen(this);
			axiosHttp.post(baseUrl.BASEURL + 'taskManagerDeviceInterface/setStatus', params).then((res) => {
				CommonFun.closeFullScreen(loading);
				if (res.data.status === 1) {
					this.getListDetail();
				} else {
					CommonFun.responseError(res.data, this);
				}
			})
			.catch(function(err) {
				CommonFun.closeFullScreen(loading);
			});
		},
		homeDetailFun(row, home) {
			let loading = CommonFun.openFullScreen(this);
			let param = JSON.parse(JSON.stringify(row));
			param['home'] = home;
			axiosHttp.post(baseUrl.BASEURL + 'taskManagerDeviceInterface/save', param).then((res) => {
				CommonFun.closeFullScreen(loading);
				if (res.data.status === 1) {
					CommonFun.responseSuccess(res.data.message, this);
					this.getListDetail();
				} else {
					CommonFun.responseError(res.data, this);
				}
			})
			.catch(function(err) {
				CommonFun.closeFullScreen(loading);
			});
		},
		editFunDetail(index, item) {
			this.popupTitle = '编辑';
			this.operateType = 2;
			this.currentItemDetail = JSON.parse(JSON.stringify(item));
			this.dialogTableVisible_addAndeditDetail = true;
		},
		deleteFunDetail(index, item) {
			this.currentItemDetail = JSON.parse(JSON.stringify(item));
			this.operateType = 2;
			this.dialogTableVisible_delete = true;
		},
		resumeDetail: function() {
			this.currentItemDetail.realityBandWidth = this.currentItemDetail.standardBandWidth;
		},
		addAndEditSubmitDetail: function() {
			// 提交新增 编辑
			this.$refs.formAddEditDetail.validate(valid => {
				if (valid) {
					let loading = CommonFun.openFullScreen(this);
					axiosHttp.post(baseUrl.BASEURL + 'taskManagerDeviceInterface/save', this.currentItemDetail).then((res) => {
						CommonFun.closeFullScreen(loading);
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, this);
							this.getListDetail();
							this.dialogTableVisible_addAndeditDetail = false;
						} else {
							CommonFun.responseError(res.data, this);
						}
					})
					.catch(function(err) {
						CommonFun.closeFullScreen(loading);
					});
				}
			});
		},
		submitDelete: function() {
			let param = {id: this.currentItemDetail.id};
			let loading = CommonFun.openFullScreen(this);
			axiosHttp.delete(baseUrl.BASEURL + 'taskManagerDeviceInterface/delete', {data: param}).then((res) => {
				CommonFun.closeFullScreen(loading);
				if (res.data.status === 1) {
					CommonFun.responseSuccess(res.data.message, this);
					this.dialogTableVisible_delete = false;
						this.getListDetail();
				} else {
					CommonFun.responseError(res.data, this);
				}
			})
			.catch(function(error) {
				CommonFun.closeFullScreen(loading);
				CommonFun.responseError(error, this);
			});
		},
        handleClose(){
			this.$emit('update:visible', false);
		},
    }
}
</script>
<style lang="scss" scoped>
	.alignBoth{
		width: 100%;
	}
	.send-dial-btn{
		cursor: pointer;
		color: #03D6CA;
		float: right;
	}
</style>