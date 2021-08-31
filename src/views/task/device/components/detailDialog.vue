<template>
<div class="m-dialog">
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="846px">
		<div class="popup">
			<div class="title">{{ title }}</div>
			<div class="hidepopup" @click="handleClose">×</div>
			<div class="add-info-box">
				<el-form :model="queryData" :rules="rules" ref="formAddEdit" class="popupruleform" :disabled="staut == 0">
					<div class="alignBoth">
						<el-form-item prop="taskName" label="任务名称" class="flex1">
							<el-input v-model="queryData.taskName" class="add-item-input" type="text" maxlength="64"></el-input>
						</el-form-item>
						<el-form-item prop="companyId" label="单位名称" class="flex1 marginLeft10">
							<div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="showCompany">{{ currenCompanyName }}</div>
						</el-form-item>
						<el-form-item prop="mibId" label="厂家-型号" class="flex1 marginLeft10">
							<el-select v-model="queryData.mibId" class="add-item-input" clearable>
								<el-option v-for="item in deviceMibList" :key="item.label" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<!-- <el-input v-model="queryData.taskName" class="add-item-input" type="text" maxlength="64"></el-input> -->
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="deviceId" label="探针IP" class="flex1">
							<el-select v-model="queryData.deviceId" class="add-item-input" @change="selectChanged" clearable>
								<el-option v-for="item in probeDeviceList" :key="item.id" :label="item.ip" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="deviceDetailId" label="拨测接口" class="flex1 marginLeft10">
							<el-select v-model="queryData.deviceDetailId" class="add-item-input">
								<el-option v-for="item in probeDeviceDetailList" :key="item.id" :label="item.ip" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="targetIp" label="目标地址" class="flex1 marginLeft10">
							<el-input v-model="queryData.targetIp" class="add-item-input" type="text" maxlength="15"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="validityCycleEx" label="有效日期" class="flex1">
							<el-select v-model="queryData.validityCycleEx" class="add-item-input" multiple collapse-tags>
								<el-option v-for="item in CommonFun.getDataDictionaryChildrenListData($store.state.taskValidityValue)" :key="item.value"
									:label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="validityBeginTime" label="生效时间" class="flex1 marginLeft10">
							<el-time-picker
								is-range
								v-model="timeList"
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								placeholder="选择时间范围"
								value-format="HH:mm:ss"
								class="add-item-input">
							</el-time-picker>
							<!-- <el-time-picker v-model="queryData.validityBeginTime" value-format="HH:mm:ss" class="add-item-input"></el-time-picker> -->
						</el-form-item>
						<el-form-item prop="cycle" label="采集周期" class="flex1 marginLeft10">
							<el-input v-model="queryData.cycle" class="add-item-input" type="number"></el-input>
						</el-form-item>
					</div>
					<div class="el-form-sub-title">登录信息</div>
					<template v-if="queryData.snmpVersion==1 || queryData.snmpVersion==2">
						<div class="alignBoth">
							<el-form-item prop="snmpVersion" label="版本" class="flex1">
								<el-select v-model="queryData.snmpVersion" class="add-item-input">
									<el-option v-for="(item, index) in snmpVersionList" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="snmpTeam" label="团体名" class="flex1 marginLeft10">
								<el-input v-model="queryData.snmpTeam" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
							<el-form-item class="flex1 marginLeft10"></el-form-item>
						</div>
					</template>
					<template v-if="queryData.snmpVersion==3">
						<div class="alignBoth">
							<el-form-item prop="snmpVersion" label="版本" class="flex1">
								<el-select v-model="queryData.snmpVersion" class="add-item-input" clearable>
									<el-option v-for="(item, index) in $store.state.snmpVersionArr" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="snmpLevel" label="认证等级" class="flex1 marginLeft10">
								<el-select v-model="queryData.snmpLevel" class="add-item-input" clearable>
									<el-option v-for="(item, index) in $store.state.snmpLevelArr" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item class="flex1 marginLeft10"></el-form-item>
						</div>
						<div class="alignBoth" v-if="queryData.snmpLevel == 'noAuthNoPriv'">
							<el-form-item prop="snmpName" label="用户名" class="flex1">
								<el-input v-model="queryData.snmpName" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
							<el-form-item  class="flex1 marginLeft10"></el-form-item>
							<el-form-item  class="flex1 marginLeft10"></el-form-item>
						</div>
						<div class="alignBoth" v-if="queryData.snmpLevel == 'authNoPriv'">
							<el-form-item prop="snmpName" label="用户名" class="flex1">
								<el-input v-model="queryData.snmpName" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
							<el-form-item prop="snmpAuth" label="认证方式" class="flex1 marginLeft10">
								<el-select v-model="queryData.snmpAuth" class="add-item-input" clearable>
									<el-option v-for="(item, index) in $store.state.snmpAuthArr" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="snmpPass" label="密码" class="flex1 marginLeft10">
								<el-input v-model="queryData.snmpPass" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
						</div>
						<div class="alignBoth" v-if="queryData.snmpLevel == 'authPriv'">
							<el-form-item prop="snmpName" label="用户名" class="flex1">
								<el-input v-model="queryData.snmpName" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
							<el-form-item prop="snmpAuth" label="认证方式" class="flex1 marginLeft10">
								<el-select v-model="queryData.snmpAuth" class="add-item-input" clearable>
									<el-option v-for="(item, index) in $store.state.snmpAuthArr" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="snmpPass" label="密码" class="flex1 marginLeft10">
								<el-input v-model="queryData.snmpPass" class="add-item-input" type="text" maxlength="64"></el-input>
							</el-form-item>
						</div>
						<div class="alignBoth" v-if="queryData.snmpLevel == 'authPriv'">
							<el-form-item prop="snmpPrivacy" label="授权方式" class="flex1">
								<el-select v-model="queryData.snmpPrivacy" class="add-item-input" clearable>
									<el-option v-for="(item, index) in $store.state.snmpPrivacyArr" :key="index" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="snmpPrivacyKey" label="秘钥" class="flex2 marginLeft10">
								<el-input v-model="queryData.snmpPrivacyKey" class="add-item-input" type="text" maxlength="128"></el-input>
							</el-form-item>
						</div>
					</template>
					<el-form-item class="popup-buts">
						<el-button class="popup-but popup-but-submit" @click="submit">确定</el-button>
						<el-button class="popup-but popup-but-cancel" @click="handleClose">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</el-dialog>
	<el-dialog :visible.sync="visibleCompany" :close-on-click-modal="false" v-if="visibleCompany" width="690px">
		<div class="popup">
			<div class="title">单位选择</div> 
			<div class="hidepopup" @click="visibleCompany = !visibleCompany">×</div>
			<SelectCompanyComponent type='single' v-on:setSearchCompanyId='setSearchCompanyId'
			v-on:setSearchCompanyName='setSearchCompanyName' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuId='currenCompanyIdsOfEdit'
			:checkedMenuName='currenCompanyName'></SelectCompanyComponent>
		</div>
	</el-dialog>
	<SpecialLineDialog :visible.sync="dialogTableVisible_detail" v-if="dialogTableVisible_detail" @selectDetail="selectDetail"/>
</div>
</template>
<script>
import ApiTaskDevice from './../api';
import CommonFun from '@/js/commonFun.js';
import Validation from '@/js/validation.js'
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import SpecialLineDialog from '../../specialLine/components/specialLineDialog';
import { mapState } from 'vuex';
export default {
	components: {
		SelectCompanyComponent, SpecialLineDialog
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
    	}
	},
    data() {
        return {
            queryData: {
				id: '',
				taskName: '',
				companyId: 0,
				companyName: '',
				cycle: 0,
				validityCycleEx: '',
				validityBeginTime: '',
				validityEndTime: '',
				mibId: 0,
				deviceId: '',
				deviceDetailId: '',
				targetIp: '',
				manufactor: '',
				model: '',
				snmpVersion: 1,
				snmpTeam: '',
				snmpLevel: '',
				snmpName: '',
				snmpAuth: '',
				snmpPass: '',
				snmpPrivacy: '',
				snmpPrivacyKey: ''
			},
			rules: {
				taskName: [{
					required: true,
					message: '请输入任务名称',
					trigger: 'change'
				}],
				companyId: [{
					required: true,
					message: '请选择单位',
					trigger: 'change'
				}],
				validityCycleEx: [{
					required: true,
					message: '请选择任务生效日期',
					trigger: 'blur'
				}],
				validityBeginTime: [{
					required: true,
					message: '请选择生效开始时间',
					trigger: 'change'
				}],
				validityEndTime: [{
					required: true,
					message: '请选择生效结束时间',
					trigger: 'change'
				}],
				cycle: [{
						required: true,
						message: '请输入采样周期',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				deviceId: [{
					required: true,
					message: '请选择探针IP',
					trigger: 'change'
				}],
				deviceDetailId: [{
					required: true,
					message: '请选择拨测接口IP',
					trigger: 'change'
				}],
				targetIp: [{
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
			},
			visibleCompany: false,
			currenCompanyName: '选择单位',
			currenCompanyIdsOfEdit: null,

			probeDeviceDetailList: [],
			
			dialogTableVisible_detail: false,

			timeList: ['00:00:01', '23:59:59']

        }
    },
	computed: {
		...mapState({
			probeDeviceList: state => state.probeDeviceList,
			deviceMibList: state => state.deviceMibList,
			snmpVersionList: state => state.snmpVersionArr,
			snmpLevelList: state => state.snmpLevelArr,
			snmpAuthList: state => state.snmpAuthArr,
			snmpPrivacyList: state => state.snmpPrivacyArr,
		})
	},
	mounted() {
		this.init();
	},
    methods: {
		init() {
			this.queryData['id'] = this.detailData['id'];
			this.queryData['taskName'] = this.detailData['taskName'];
			this.queryData['cycle'] = this.detailData['cycle'];
			this.queryData['validityCycle'] = this.detailData['validityCycle'];
			this.queryData['validityCycleEx'] = this.detailData['validityCycleEx'];
			this.queryData['validityBeginTime'] = this.detailData['validityBeginTime'];
			this.queryData['validityEndTime'] = this.detailData['validityEndTime'];
			this.queryData['deviceId'] = this.detailData['deviceId'];
			this.queryData['deviceDetailId'] = this.detailData['deviceDetailId'];
			this.queryData['companyId'] = this.detailData['companyId'];
			this.queryData['companyName'] = this.detailData['companyName'];
			this.currenCompanyName = this.detailData['companyName'] || '选择单位';
			this.currenCompanyIdsOfEdit = this.detailData['companyId'];
			this.queryData['targetIp'] = this.detailData['targetIp'];
			this.queryData['snmpVersion'] = this.detailData['snmpVersion'];
			this.queryData['snmpTeam'] = this.detailData['snmpTeam'];
			this.queryData['snmpLevel'] = this.detailData['snmpLevel'];
			this.queryData['snmpName'] = this.detailData['snmpName'];
			this.queryData['snmpAuth'] = this.detailData['snmpAuth'];
			this.queryData['snmpPass'] = this.detailData['snmpPass'];
			this.queryData['snmpPrivacy'] = this.detailData['snmpPrivacy'];
			this.queryData['snmpPrivacyKey'] = this.detailData['snmpPrivacyKey'];
			this.queryData.mibId = this.detailData['mibId'];

			this.timeList = [this.detailData['validityBeginTime'], this.detailData['validityEndTime']];
			if(this.staut === 2) {
				this.selectChanged(this.queryData.deviceId, 'edit');
			}
			let tempArr = []
			if (!CommonFun.ifNall(this.queryData.validityCycle)) {
				tempArr = this.queryData.validityCycle.split(",")
			}
			if(tempArr.length) {
				this.$set(this.queryData, 'validityCycleEx', CommonFun.transformationToInt(tempArr))
			}
		},
		selectDetail(data) {
			if (data.length > 0) {
				let item = data[0]
				this.queryData.specialLineId = item.id
				this.queryData.specialLineName = item.taskName
				this.dialogTableVisible_detail = false;
			}
		},
		//根据探针查找接口IP
		selectChanged(value, type) {
			let that = this
			let loading = CommonFun.openFullScreen(that)
			ApiTaskDevice.listProbeDetail({deviceId: value}).then(function(res) {
				CommonFun.closeFullScreen(loading)
				const data = res.data;
				if (data.status === 1) {
					if (CommonFun.ifNall(type)) {
						that.$set(that.queryData, 'deviceDetailId', null)
					}
					that.probeDeviceDetailList = data.data
				} else {
					CommonFun.responseError(data, that)
				}
			}).catch(function(err) {
				CommonFun.closeFullScreen(loading)
			})
		},
		setSearchCompanyId(data) {
			this.currenCompanyIdsOfEdit = data;
			this.queryData['companyId'] = data;
		},
		setSearchCompanyName(data) {
			let that = this;
			if(CommonFun.ifNall(data)){
				that.currenCompanyName = '选择单位';
			}else{
				that.currenCompanyName = data;
				this.queryData['companyName'] = data;
			}
		},
		showCompany() {
			if(this.staut != 0) {
				this.visibleCompany = true;
			}
		},
		closeSelectcompany() {
			this.visibleCompany = false;
		},
		resetForm(formName = 'formAddEdit') {
			if(this.$refs[formName]){
				this.$refs[formName].resetFields();
			}
		},
		submit() {
			if (!CommonFun.ifNall(this.queryData.validityCycleEx)) {
				this.queryData.validityCycle = this.queryData.validityCycleEx.join(",")
			}
			if(!!this.timeList && this.timeList.length > 1) {
				this.queryData.validityBeginTime = this.timeList[0];
				this.queryData.validityEndTime = this.timeList[1];
			}
			this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
					ApiTaskDevice.save(this.queryData).then(res => {
						const data = res.data;
						if (data.status === 1) {
							this.$emit('closeDialog');
						}else{
							CommonFun.responseError(data, this);
						}
					})
				} else {
					return false;
				}
			})
		},
        handleClose(){
			this.$emit('update:visible', false);
		},
		selectCompanyFun() {

		}
    }
}
</script>
<style lang="scss" scoped>

.alignBoth{
	width: 100%;
}
</style>