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
							<el-input class="add-item-input" type="text" v-model="queryData.taskName" placeholder="请输入任务名称"></el-input>
						</el-form-item>
						<el-form-item prop="type" label="任务类型" class="flex1 marginLeft10">
							<el-select v-model="queryData.type" class="add-item-input">
								<el-option v-for="item in dialTaskTypeList" :key="item.value"
									:label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="protocol" label="任务协议" class="flex1 marginLeft10">
							<el-select v-model="queryData.protocol" @change="changeProtocol" :disabled="staut == 2" class="add-item-input">
								<el-option v-for="item in taskProtocolList" :key="item.value"
									:label="item.label" :value="item.value"></el-option>
							</el-select>
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
							<el-input v-model="queryData.targetIp" :disabled="staut == 2" class="add-item-input" type="text" maxlength="15"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="validityCycleEx" label="生效日期" class="flex1">
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
						<el-form-item prop="dialCycle" label="拨测周期(秒)" class="flex1 marginLeft10">
							<el-input v-model="queryData.dialCycle" class="add-item-input" type="number"></el-input>
						</el-form-item>
					</div> 
					<div class="alignBoth">
						<el-form-item prop="dialCount" label="每跳探测次数" class="flex1">
							<el-input v-model="queryData.dialCount" class="add-item-input" type="number"></el-input>
						</el-form-item>
						<el-form-item prop="minTtl" label="最小跳数" class="flex1 marginLeft10"> 
							<el-input v-model="queryData.minTtl" class="add-item-input" type="number"></el-input>
						</el-form-item>
						<el-form-item prop="maxTtl" label="最大跳数" class="flex1 marginLeft10">
							<el-input v-model="queryData.maxTtl" class="add-item-input" type="number"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="companyId" label="组织机构" class="flex1">
							<div class="block">
								<div
									:class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位', 'search-div-disabled':staut == 0}]"
									@click="showCompany"
								>{{ currenCompanyName }}</div>
							</div>
						</el-form-item>
						<el-form-item prop="sourcePort" label="拨测端口" class="flex1 marginLeft10" v-if="tempProtocolLabel != 'ICMP' "> 
							<el-input v-model="queryData.sourcePort" :disabled="staut == 2" class="add-item-input" type="number"></el-input>
						</el-form-item>
						<el-form-item prop="targetPort" label="目标端口" class="flex1 marginLeft10" v-if="tempProtocolLabel != 'ICMP' ">
							<el-input v-model="queryData.targetPort" :disabled="staut == 2" class="add-item-input" type="number"></el-input>
						</el-form-item>
					</div>
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
</div>
</template>
<script>
import ApiTaskDiaTest from './../api';
import CommonFun from '@/js/commonFun.js';
import Validation from '@/js/validation.js'
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import { mapState } from 'vuex';
export default {
	components: {
		SelectCompanyComponent
	},
	// props: ['visible', 'title', 'staut', 'detailData'],
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
				type: '',
				protocol: '',
				deviceId: '',
				deviceDetailId: '',
				targetIp: '',
				companyId: 0,
				companyName: '',
				sourcePort: '',
				targetPort: '',
				validityCycleEx: '',
				validityBeginTime: '',
				dialCycle: '',
				minTtl: '',
				maxTtl: '',
				dialCount: '',
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
				type: [{
					required: true,
					message: '请选择任务类型',
					trigger: 'change'
				}],
				protocol: [{
					required: true,
					message: '请选择任务协议',
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
				dialCycle: [{
						required: true,
						message: '请输入拨测周期',
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
				sourcePort: [{
						required: true,
						message: '请输入拨测端口',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				targetIp: [{
						required: true,
						message: '请输入目标地址',
						trigger: 'blur'
					},
					{
						validator: Validation.ifIp,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				targetPort: [{
						required: true,
						message: '请输入目标端口',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				minTtl: [{
						required: true,
						message: '请输入最小跳数',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				maxTtl: [{
						required: true,
						message: '请输入最大跳数',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
				dialCount: [{
						required: true,
						message: '请输入每跳探测次数',
						trigger: 'blur'
					},
					{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}
				],
			},
			visibleCompany: false,
			currenCompanyName: '选择单位',
			currenCompanyIdsOfEdit: null,
	
			probeDeviceDetailList: [],
			tempProtocolLabel: '',
			timeList: ['00:00:01', '23:59:59']
        }
    },
	computed: {
		...mapState({
			probeDeviceList: state => state.probeDeviceList,
			dialTaskTypeList: state => CommonFun.getDataDictionaryChildrenListData(state.dialTaskTypeValue),
			taskProtocolList: state => CommonFun.getDataDictionaryChildrenListData(state.taskProtocolValue)
		})
	},
	mounted() {
		this.init();
	},
    methods: {
		init() {
			this.queryData['id'] = this.detailData['id'];
			this.queryData['taskName'] = this.detailData['taskName'];
			this.queryData['type'] = this.detailData['type'];
			this.queryData['protocol'] = this.detailData['protocol'];
			this.queryData['deviceId'] = this.detailData['deviceId'];
			this.queryData['deviceDetailId'] = this.detailData['deviceDetailId'];
			this.queryData['targetIp'] = this.detailData['targetIp'];
			this.queryData['companyId'] = this.detailData['companyId'];
			this.queryData['companyName'] = this.detailData['companyName'];
			this.currenCompanyName = this.detailData['companyName'] || '选择单位';
			this.currenCompanyIdsOfEdit = this.detailData['companyId'];

			this.queryData['sourcePort'] = this.detailData['sourcePort'];
			this.queryData['targetPort'] = this.detailData['targetPort'];
			this.queryData['validityCycle'] = this.detailData['validityCycle'];
			this.queryData['validityCycleEx'] = this.detailData['validityCycleEx'];
			this.queryData['validityBeginTime'] = this.detailData['validityBeginTime'];
			this.queryData['dialCycle'] = this.detailData['dialCycle'];
			this.queryData['minTtl'] = this.detailData['minTtl'];
			this.queryData['maxTtl'] = this.detailData['maxTtl'];
			this.queryData['dialCount'] = this.detailData['dialCount'];

			this.timeList = [this.detailData['validityBeginTime'], this.detailData['validityEndTime']];
			if(this.staut === 2 || this.staut === 3) {
				this.selectChanged(this.queryData.deviceId, 'edit');
			}
			if(this.staut === 3) {
				this.rules.taskName = undefined;
				this.rules.targetIp = undefined;
				this.changeProtocol(this.queryData.protocol);
			}
			let tempArr = []
			if (!CommonFun.ifNall(this.queryData.validityCycle)) {
				tempArr = this.queryData.validityCycle.split(",")
			}
			if(tempArr.length) {
				this.$set(this.queryData, 'validityCycleEx', CommonFun.transformationToInt(tempArr))
			}
			for(let i = 0; i < this.taskProtocolList.length; i++){
				if(this.queryData.protocol == this.taskProtocolList[i].value){
					this.tempProtocolLabel = this.taskProtocolList[i].label
				}
			}
		},
		//根据探针查找接口IP
		selectChanged(value, type) {
			let that = this
			let loading = CommonFun.openFullScreen(that)
			ApiTaskDiaTest.listProbeDetail({deviceId: value}).then(function(res) {
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
		changeProtocol(item){
			let that = this
			for(let i = 0; i < this.taskProtocolList.length; i++) {
				if(item == this.taskProtocolList[i].value) {
					that.tempProtocolLabel = this.taskProtocolList[i].label
				}
			}
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
			if(this.tempProtocolLabel == 'ICMP') {
				this.queryData.sourcePort = 0
				this.queryData.targetPort = 0 
			}
			if(!!this.timeList && this.timeList.length > 1) {
				this.queryData.validityBeginTime = this.timeList[0];
				this.queryData.validityEndTime = this.timeList[1];
			}
			if(this.staut === 3) {
				let validMsg = [];
				this.$refs.formAddEdit.validateField(['companyId', 'validityCycleEx', 'dialCycle', 'deviceDetailId'], (valid) => {
					if(valid) {
						validMsg.push(valid);
					}
				})
				if (!validMsg.length) {
					ApiTaskDiaTest.template(this.queryData).then((res) => {
						if (res.data.status === 1) {
							window.open(res.data.data);
							this.$emit('closeDialog');
						}else{
							CommonFun.responseError(data, this);
						}
					})
				}
				return;
			}
			this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
					ApiTaskDiaTest.save(this.queryData).then(res => {
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