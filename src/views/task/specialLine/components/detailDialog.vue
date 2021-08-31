<template>
<div>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="846px">
		<div class="popup">
			<div class="title">{{ title }}</div>
			<div class="hidepopup" @click="handleClose">×</div>
			<div class="add-info-box">
				<el-form :model="queryData" :rules="rules" ref="formAddEdit" class="popupruleform" :disabled="staut == 0">
					<div class="alignBoth">
						<el-form-item prop="taskName" label="专线名称" class="flex1">
							<el-input v-model="queryData.taskName" class="add-item-input" type="text" placeholder="请输入专线任务名称" maxlength="64"></el-input>
						</el-form-item>
						<el-form-item prop="anodeIp" label="A端地址" class="flex1 marginLeft10">
							<el-input v-model="queryData.anodeIp" class="add-item-input" type="text" maxlength="15"></el-input>
						</el-form-item>
						<el-form-item prop="anodeAlias" label="A端别名" class="flex1 marginLeft10">
							<el-input v-model="queryData.anodeAlias" class="add-item-input" type="text" maxlength="64"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="companyId" label="单位名称" class="flex1">
							<div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="showCompany">{{ currenCompanyName }}</div>
						</el-form-item>
						<el-form-item prop="bnodeIp" label="Z端地址" class="flex1 marginLeft10">
							<el-input v-model="queryData.bnodeIp" class="add-item-input" type="text" maxlength="15"></el-input>
						</el-form-item>
						<el-form-item prop="bnodeAlias" label="Z端别名" class="flex1 marginLeft10">
							<el-input v-model="queryData.bnodeAlias" class="add-item-input" type="text" maxlength="64"></el-input>
						</el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="bandWidth" label="带宽" class="flex1">
							<el-input type="number" v-model="queryData.bandWidth" class="add-item-input">
								<el-select v-model="bandUnit" slot="append" placeholder="请选择">
									<el-option label="Kbps" value="Kbps"></el-option>
									<el-option label="Mbps" value="Mbps"></el-option>
									<el-option label="Gbps" value="Gbps"></el-option>
								</el-select>
							</el-input>
							<!-- <el-input v-model="queryData.bandWidth" class="add-item-input" type="text" maxlength="32"></el-input> -->
						</el-form-item>
						<el-form-item prop="validityCycleEx" label="生效日期" class="flex1 marginLeft10">
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
					</div>
					<div class="alignBoth">
						<el-form-item prop="operators" label="运营商" class="flex1">
							<el-input v-model="queryData.operators" class="add-item-input" type="text" maxlength="64"></el-input>
						</el-form-item>
						<el-form-item prop="masterSlave" label="主备角色" class="flex1 marginLeft10">
							<el-radio-group v-model="queryData.masterSlave">
								<el-radio :label="0">无</el-radio>
								<el-radio :label="1">主用</el-radio>
								<el-radio :label="2">备用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item prop="slaveTaskName" label="备用专线" class="flex1 marginLeft10" v-if="queryData.masterSlave==1">
							<el-input v-model="queryData.slaveTaskName" class="add-item-input" type="text" @click.native="dialogTableVisible_detail = true"></el-input>
						</el-form-item>
						<el-form-item class="flex1 marginLeft10" v-else></el-form-item>
					</div>
					<div class="alignBoth">
						<el-form-item prop="bingFlag" label="是否绑定接口任务" class="flex1">
							<el-radio-group v-model="queryData.bingFlag">
								<el-radio :label="0">不绑定</el-radio>
								<el-radio :label="1">绑定</el-radio>
							</el-radio-group>
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
	<SpecialLineDialog :visible.sync="dialogTableVisible_detail" v-if="dialogTableVisible_detail" @selectDetail="selectDetail"/>
</div>
</template>
<script>
import ApiProbeDevice from './../api';
import CommonFun from '@/js/commonFun.js';
import Validation from '@/js/validation.js'
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import SpecialLineDialog from './specialLineDialog';
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
			bandUnit: 'Kbps',
            queryData: {
				id: '',
				taskName: '',
				anodeIp: '',
				anodeAlias: '',
				bnodeIp: '',
				bnodeAlias: '',
				bandWidth: '',
				operators: '',
				masterSlave: 0,
				specialLineId: '',
				slaveTaskName: '',
				companyId: 0,
				companyName: '',
				validityCycleEx: [],
				validityCycle: '',
				validityBeginTime: '',
				validityEndTime: '',
				bingFlag: ''
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
				anodeIp: [{
					required: true,
					message: '请输入A端地址',
					trigger: 'change'
				}],
				anodeAlias: [{
					required: true,
					message: '请输入A端别名',
					trigger: 'change'
				}],
				bnodeIp: [{
					required: true,
					message: '请输入Z端地址',
					trigger: 'change'
				}],
				bnodeAlias: [{
					required: true,
					message: '请输入Z端别名',
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
				bandWidth: [{
					required: true,
					message: '请输入带宽',
					trigger: 'change'
				}],
				operators: [{
					required: true,
					message: '请输入运营商',
					trigger: 'change'
				}],
				masterSlave: [{
					required: true,
					message: '请选择主备角色',
					trigger: 'change'
				}],
				slaveTaskName: [{
					required: true,
					message: '请选择备用专线',
					trigger: 'change'
				}],
				bingFlag: [{
					required: true,
					message: '请选择是否绑定接口任务',
					trigger: 'change'
				}],
			},
			visibleCompany: false,
			currenCompanyName: '选择单位',
			currenCompanyIdsOfEdit: null,

			dialogTableVisible_detail: false,

			timeList: ['00:00:01', '23:59:59']
        }
    },
	mounted() {
		this.init();
	},
    methods: {
		init() {
			this.queryData['id'] = this.detailData['id'];
			this.queryData['taskName'] = this.detailData['taskName'];
			this.queryData['anodeIp'] = this.detailData['anodeIp'];
			this.queryData['anodeAlias'] = this.detailData['anodeAlias'];
			this.queryData['bnodeIp'] = this.detailData['bnodeIp'];
			this.queryData['bnodeAlias'] = this.detailData['bnodeAlias'];
			this.queryData['bandWidth'] = parseInt(this.detailData['bandWidth']);
			this.bandUnit = this.detailData['bandWidth'] && this.detailData['bandWidth'].replace(/[0-9]*/g, '').replace(/\./, '') || 'Kbps';
			this.queryData['companyId'] = this.detailData['companyId'];
			this.queryData['companyName'] = this.detailData['companyName'];
			this.currenCompanyName = this.detailData['companyName'] || '选择单位';
			this.currenCompanyIdsOfEdit = this.detailData['companyId'];
			this.queryData['validityCycle'] = this.detailData['validityCycle'];
			this.queryData['validityCycleEx'] = this.detailData['validityCycleEx'];
			this.queryData['validityBeginTime'] = this.detailData['validityBeginTime'];
			this.queryData['validityEndTime'] = this.detailData['validityEndTime'];
			this.queryData['bingFlag'] = this.detailData['bingFlag'];

			this.queryData['operators'] = this.detailData['operators'];
			this.queryData['specialLineId'] = this.detailData['specialLineId'];
			this.queryData['slaveTaskName'] = this.detailData['slaveTaskName'];
			this.queryData['masterSlave'] = this.detailData['masterSlave'];
			if(!!this.detailData['validityBeginTime'] && !!this.detailData['validityEndTime']) {
				this.timeList = [this.detailData['validityBeginTime'], this.detailData['validityEndTime']];
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
				let item = data[0];
				this.queryData.specialLineId = item.id;
				this.queryData.slaveTaskName = item.taskName;
				this.dialogTableVisible_detail = false;
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
			if(!!this.timeList && this.timeList.length > 1) {
				this.queryData.validityBeginTime = this.timeList[0];
				this.queryData.validityEndTime = this.timeList[1];
			}
			this.queryData.bandWidth += this.bandUnit;
			this.$refs.formAddEdit.validate((valid) => {
				if (valid) {
					ApiProbeDevice.save(this.queryData).then(res => {
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