import Vue from 'vue'
import Vuex from 'vuex'
import axiosHttp from './js/axiosHttp.js'
import baseUrl from './js/baseUrl.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: { 
		includeList: [],
		fullScreen: false,
		menuClick: false,
		/* 权限管理 */
		naviArr:sessionStorage.getItem('naviArr') ? JSON.parse(sessionStorage.getItem('naviArr')) : [], // 权限管理 导航树
		//naviArr:[], // 权限管理 导航树
		butsArr: [],
		userArr: [],
		userTotle: 0,
		roleArr: [],
		allRoleArr: [],
		roleTotle: 0,
		jurisdictionArr: [],
		allJurisdictionArr: [],
		jurisdictionTotle: 0,
		loginUrl: 'system/user/login',
		getMenuUrl: 'resource/menu/tree',
		getButUrl: 'resource/button/list',
		getUserList: 'system/user/listPage',
		getRoleList: 'system/role/listPage',
		getAllRoleList: 'system/role/list',
		getJurisdictionListUrl: 'system/permission/listPage',
		getAllJurisdictionListUrl: 'system/permission/list',
		jobList: [],
		getJobListUrl: 'postJob/list',
		staffList: [],
		getStaffListUrl: 'postStaff/list',
		companyList: [],
		getCompanyList: 'postCompany/companyList',
		buttonList: [],
		getButtonListUrl: 'resource/button/listAll',
		pageSize: 20, // 分页 每页条数
		pageSizeMini:10,
		pageSizeS:[20,50,100, 150, 200],//选择分页
		pageSizeSMini:[10,20,50,100, 150, 200],
		getCompanyTreeAllUrl: 'postCompany/tree', // 获取单位树url all(单位管理)
		getCompanyTreeUrl: 'postCompany/companyTree', // 获取单位树url 部分 权限分配( 班管理、队岗位管理、员工管理、账号管理)
		defaultActive: sessionStorage.getItem('defaultActive') ? sessionStorage.getItem('defaultActive') : 'index', // 导航 当前选中 高亮
		openlist: sessionStorage.getItem('openlist') ? JSON.parse(sessionStorage.getItem('openlist')) : [], // 导航 当前打开的 sub-menu 的 index 的数组
		companyTreeArr: [], // 单位树 arr
		companyTreeAllArr: [], // 单位树 arr all
		refreshPageArr: sessionStorage.getItem('currentExistTabPageArr') ? JSON.parse(sessionStorage.getItem(
			'currentExistTabPageArr')) : ['index'], //当前存在的（显示的）tab page 
		currentAddress: sessionStorage.getItem('currentAddress') ? sessionStorage.getItem('currentAddress') : '首页',
		editableTabsValue: sessionStorage.getItem('editableTabsValue') ? sessionStorage.getItem('editableTabsValue') : '首页',
		wellList: sessionStorage.getItem('wellList') ? JSON.parse(sessionStorage.getItem('wellList')) : [],
		getWellList: 'postWell/list',
		dataDictionaryRootId: 1, //数据字典根值
		dataDictionaryList: sessionStorage.getItem('dataDictionaryList') ? JSON.parse(sessionStorage.getItem('dataDictionaryList')) : [], 
		getDataDictionaryList: 'dataDictionary/tree',
		probeDeviceList: [], //获取探针列表
		probeDeviceListAndTask: [],
		getProbeDeviceList: 'probeDevice/list',
		getProbeDeviceListAndTask: 'probeDevice/listAndTaskNumber',
		relayMibList: [],
		deviceMibList: [],
		dialTaskTypeValue: 1, //拨测任务类型
		taskStatusValue: 2, //任务状态
		relayIndexValue: 3, //接口任务采集指标
		deviceIndexValue: 4, //设备任务采集指标
		lineRangeIndexValue: 5, //线路影响范围
		deviceStatusValue: 6, //探针设备状态
		deviceInterfaceValue: 7, //探针接口状态
		taskValidityValue: 8, //任务有效期
		taskProtocolValue: 9, //任务协议
		eventTypeValue: 10, //事件类型
		snmpVersionValue: 11, //SNMP版本
		taskTypeValue: 12, //任务类型
		faultGradeValue: 13, //故障等级
		faultStatusValue: 14, //故障状态
		deviceFaultTypeValue: 15, //设备故障类型
		deviceManufactorValue: 16, //设备厂家名称
		snmpVersionArr:[1, 2, 3],//SNMP版本
		snmpLevelArr:['noAuthNoPriv', 'authNoPriv', 'authPriv'],//SNMP认证等级
		snmpAuthArr:['SHA', 'MD5', 'SHA224', 'SHA256', 'SHA384', 'SHA512'], //SNMP认证方式
		snmpPrivacyArr: ['DES', '3DES', 'AES128', 'AES192', 'AES256'], //SNMP授权方式
		companyTree: sessionStorage.getItem('companyTree')?JSON.parse(sessionStorage.getItem('companyTree')):[],
		/* websocket start */
		numberObj:sessionStorage.getItem('numberObj')?JSON.parse(sessionStorage.getItem('numberObj')):[],
		echartsData1:sessionStorage.getItem('echartsData1')?JSON.parse(sessionStorage.getItem('echartsData1')):{alarmTrend:{},delayDistribution:{},lossDistribution:{}},
		echartsData2:sessionStorage.getItem('echartsData2')?JSON.parse(sessionStorage.getItem('echartsData2')):{},
		echartsData3:sessionStorage.getItem('echartsData3')?JSON.parse(sessionStorage.getItem('echartsData3')):{},
		inspectionStatistics5Numbers:sessionStorage.getItem('inspectionStatistics5Numbers')?JSON.parse(sessionStorage.getItem('inspectionStatistics5Numbers')):{},
		echartsBoxDataTask: [],
		echartsBoxDataNode: [],
		/* websocket end */
		showAudioDialog: false,
		eventAlarmObj: sessionStorage.getItem("updateEventAlarmObj")?JSON.parse(sessionStorage.getItem("updateEventAlarmObj")):{obj1:[], obj2:[], obj3:[]},
		notPopup: sessionStorage.getItem("updataNotPopup")=='false'?'false':'true',
		notPopupBell: sessionStorage.getItem("updataNotPopupBell")=='false'?'false':'true',
		exportViewId: '',
		cpuMemoryUseList: []
	},
	mutations: {
		pushIncludeList(state, val) {
			if(state.includeList.findIndex(item => item === val) == -1) {
				state.includeList.push(val)
			}
		},
		updateIncludeList(state, arr) {
			state.includeList = arr
		},
		updateFullScreen(state, val) {
			state.fullScreen = val
		},
		updateNaviArr(state, naviArr) {
			state.naviArr = naviArr
		},
		updateButsArr(state, butsArr) {
			state.butsArr = butsArr
		},
		updateUserArr(state, userArr) {
			state.userArr = userArr
		},
		updateUserTotle(state, userTotle) {
			state.userTotle = userTotle
		},
		updateAllRoleArr(state, allRoleArr) {
			state.allRoleArr = allRoleArr
		},
		updateRoleArr(state, roleArr) {
			state.roleArr = roleArr
		},
		updateRoleTotle(state, roleTotle) {
			state.roleTotle = roleTotle
		},
		updateJurisdictionArr(state, jurisdictionArr) {
			state.jurisdictionArr = jurisdictionArr
		},
		updateJurisdictionTotle(state, jurisdictionTotle) {
			state.jurisdictionTotle = jurisdictionTotle
		},
		updateAllJurisdictionArr(state, allJurisdictionArr) {
			state.allJurisdictionArr = allJurisdictionArr
		},
		updateJobArr (state, arr) {
		  state.jobList = arr
		},
		updateStaffArr(state, arr) {
			state.staffList = arr
		},
		updateCompanyArr(state, arr) {
			state.companyList = arr
		},
		updateWellArr(state, arr) {
			state.wellList = arr
		},
		updateDataDictionaryArr(state, arr) {
			state.dataDictionaryList = arr
		},
		updateProbeDeviceArr(state, arr) {
			state.probeDeviceList = arr
		},
		updateProbeDeviceAndTaskArr(state, arr) {
			state.probeDeviceListAndTask = arr
		},
		updateRelayMib(state, arr) {
			state.relayMibList = arr
		},
		updateDeviceMib(state, arr) {
			state.deviceMibList = arr
		},
		updateButtonArr(state, arr) {
			state.buttonList = arr
		},
		updateDefaultActive(state, defaultActive) {
			state.defaultActive = defaultActive
		},
		updateCompanyTreeAllArr(state, companyTreeAllArr) {
			state.companyTreeAllArr = companyTreeAllArr
		},
		updateCompanyTreeArr(state, companyTreeArr) {
			state.companyTreeArr = companyTreeArr
		},
		updateOpenList(state, openlist) {
			state.openlist = openlist
		},
		updateCurrentExistTabPageArr(state, currentExistTabPageArr) {
			state.currentExistTabPageArr = currentExistTabPageArr
		},
		updataCurrentAddress(state, currentAddress) {
			state.currentAddress = currentAddress
		},
		updateEditableTabsValue(state, editableTabsValue) {
			state.editableTabsValue = editableTabsValue
		},
		updateCompanyTree(state,companyTree){
			state.companyTree = companyTree
		},
		/* websocket start */
		updateNumberObj(state,numberObj){
			state.numberObj = numberObj
		},
		updateEchartsData1(state,echartsData1){
			state.echartsData1 = echartsData1
		},
		updateEchartsData2(state,echartsData2){
			state.echartsData2 = echartsData2
		},
		updateEchartsData3(state,echartsData3){
			state.echartsData3 = echartsData3
		},
		updateInspectionStatistics5Numbers(state,inspectionStatistics5Numbers){
			state.inspectionStatistics5Numbers = inspectionStatistics5Numbers
		},
		updateEchartsBoxDataTask(state, echartsBoxDataTask){
			if(echartsBoxDataTask.length){
				state.echartsBoxDataTask = [...state.echartsBoxDataTask, ...echartsBoxDataTask];
			}else {
				state.echartsBoxDataTask = echartsBoxDataTask;
			}
		},
		updateEchartsBoxDataNode(state, echartsBoxDataNode){
			if(echartsBoxDataNode.length){
				state.echartsBoxDataNode = [...state.echartsBoxDataNode, ...echartsBoxDataNode];
			}else {
				state.echartsBoxDataNode = echartsBoxDataNode;
			}
		},
		/* wensocket end */
		/* 告警信息 */
		updateEventAlarmObj(state, eventAlarmData){
			state.eventAlarmObj = eventAlarmData
		},
		updataNotPopup(state, notPopup) {
			state.notPopup = notPopup;
		},
		updataNotPopupBell(state, updataNotPopupBell){
			state.updataNotPopupBell = updataNotPopupBell;
		},
		updataExportViewId(state, exportViewId){
			state.exportViewId = exportViewId
		},
		updateCpuMemoryUseList(state, list){
			state.cpuMemoryUseList = list
		},
	},
	actions: {
		/* 权限管理 */
		/* 获得导航列表 */
		getNaviData: function(context) {
			var $this = this
			axiosHttp.get(baseUrl.BASEURL + this.state.getMenuUrl)
				.then(function(response) {
					var data = response.data
					console.log('导航数据：');
					console.log(data.data)
					if (data.status === 1) {
						context.commit('updateNaviArr', data.data)
						sessionStorage.setItem('naviArr',JSON.stringify(data.data))
					} else {
						$this.$message.error(data.message)
					}
				})
		},
		getButsData: function(context) {
			var $this = this
			axiosHttp.post(baseUrl.BASEURL + this.state.getButUrl, {})
				.then(function(response) {
					var data = response.data
					console.log('按钮数据：');
					console.log(data)
					if (data.status === 1) {
						context.commit('updateButsArr', data.data)
					} else {
						$this.$message.error(data.message)
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		getUserData: function(context, param) {
			var $this = this
			axiosHttp.post(baseUrl.BASEURL + this.state.getUserList, param)
				.then(function(response) {
					var data = response.data.data
					console.log('user数据：');
					console.log(data)
					if (response.data.status === 1) {
						context.commit('updateUserArr', data.records)
						context.commit('updateUserTotle', data.total)
					} else {
						$this.$message.error(data.message)
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		getRoleData: function(context, param) {
			var $this = this
			axiosHttp.post(baseUrl.BASEURL + this.state.getRoleList, param)
				.then(function(response) {
					var data = response.data
					console.log('role 数据：');
					console.log(data)
					if (data.status === 1) {
						context.commit('updateRoleArr', data.data.records)
						context.commit('updateRoleTotle', data.data.total)
					} else {
						$this.$message.error(data.message)
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		getAllRoleData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + this.state.getAllRoleList, param)
				.then(function(response) {
					var data = response.data
					console.log('allRole：');
					console.log(response)
					if (data.status === 1) {
						context.commit('updateAllRoleArr', data.data)
					} else {
						$this.$message.error(data.message)
					}
				})
		},
		getJurisdictionData: function(context, param) {
			var $this = this
			axiosHttp.post(baseUrl.BASEURL + this.state.getJurisdictionListUrl, param)
				.then(function(response) {
					var data = response.data
					console.log('Jurisdiction 数据：');
					console.log(data)
					if (data.status === 1) {
						context.commit('updateJurisdictionArr', data.data.records)
						context.commit('updateJurisdictionTotle', data.data.total)
					} else {
						$this.$message.error(data.message)
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		getAllJurisdictionData: function(context) {
			var $this = this
			axiosHttp.post(baseUrl.BASEURL + $this.state.getAllJurisdictionListUrl, {})
				.then(function(response) {
					console.log('AllJurisdiction 数据：');
					console.log(response.data.data)
					if (response.data.status === 1) {
						context.commit('updateAllJurisdictionArr', response.data.data)
					} else {
						$this.$message.error(response.data.message)
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		// 获取技术与安全措施列表
		getJobListData: function (context, param) {
		  var $this = this
		  return axiosHttp.post(baseUrl.BASEURL + $this.state.getJobListUrl, param)
		    .then(function (response) {
		      if (response.data.status === 1) {
		        context.commit('updateJobArr', response.data.data)
		      } else {
		        $this.$message.error(response.data.message)
		      }
		    })
		},
		// 获取人员列表
		getStaffListData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getStaffListUrl, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateStaffArr', response.data.data)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取单位列表
		getCompanyListData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getCompanyList, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateCompanyArr', response.data.data)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取井列表
		getWellListData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getWellList, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateWellArr', response.data.data)
						sessionStorage.setItem('wellList', JSON.stringify(response.data.data))
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取数据字典列表
		getDataDictionaryListData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getDataDictionaryList, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateDataDictionaryArr', response.data.data)
						//存入session缓存
						sessionStorage.setItem('dataDictionaryList', JSON.stringify(response.data.data))
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取探针设备列表
		getProbeDeviceListData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getProbeDeviceList, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateProbeDeviceArr', response.data.data)
						//存入session缓存
						sessionStorage.setItem('probeDeviceList', JSON.stringify(response.data.data))
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取探针带任务数量设备列表
		getProbeDeviceListAndTaskNumberData: function(context, param) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + $this.state.getProbeDeviceListAndTask, param)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateProbeDeviceAndTaskArr', response.data.data)
						//存入session缓存
						sessionStorage.setItem('probeDeviceListAndTask', JSON.stringify(response.data.data))
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取接口厂家列表
		getRelayMib: function(context, param) {
			var $this = this
			return axiosHttp.post(`${baseUrl.BASEURL}taskManagerRelayMib/listPage`, param)
				.then(function(response) {
					if (response.data.status === 1) {
						let list = response.data.data.records.map(item => {
							return {label: `${item.manufactor}-${item.model}`, value: item.id, companyName: item.manufactor} //[item.manufactor, item.model, item.id]
						})
						context.commit('updateRelayMib', list)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取设备厂家列表
		getDeviceMib: function(context, param) {
			var $this = this
			return axiosHttp.post(`${baseUrl.BASEURL}taskManagerDeviceMib/listPage`, param)
				.then(function(response) {
					if (response.data.status === 1) {
						let list = response.data.data.records.map(item => {
							return {label: `${item.manufactorName}-${item.model}`, value: item.id, companyName: item.manufactorName} //[item.manufactor, item.model, item.id]
						})
						context.commit('updateDeviceMib', list)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获取按钮列表
		getButtonListData: function(context) {
			var $this = this
			return axiosHttp.get(baseUrl.BASEURL + $this.state.getButtonListUrl)
				.then(function(response) {
					if (response.data.status === 1) {
						context.commit('updateButtonArr', response.data.data)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		/* app */
		setDefaultActive: function(context, str) {
			sessionStorage.setItem('defaultActive', str)
			context.commit('updateDefaultActive', str)
		},
		// 获得单位树 部分
		getCompanyTreeArrData: function(context, callback) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + this.state.getCompanyTreeUrl, {})
				.then(function(response) {
					console.log('getcompanytreeArrData 数据：')
					console.log(response.data.data)
					if (response.data.status === 1) {
						context.commit('updateCompanyTreeArr', response.data.data)
						callback()
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		// 获得单位树 全部
		getCompanyTreeArrAllData: function(context) {
			var $this = this
			return axiosHttp.post(baseUrl.BASEURL + this.state.getCompanyTreeAllUrl, {})
				.then(function(response) {
					console.log('getcompanytreeArrAllData 数据：')
					console.log(response.data.data)
					if (response.data.status === 1) {
						context.commit('updateCompanyTreeAllArr', response.data.data)
					} else {
						$this.$message.error(response.data.message)
					}
				})
		},
		/* new  */
		setOpenList: function(context, param) {
			context.commit('updateOpenList', param)
		},
		pushCurrentExistTabPageArr: function(context, param) {
			let data = this.state.currentExistTabPageArr
			if (data.indexOf(param) == -1) {
				data.push(param)
				context.commit('updateCurrentExistTabPageArr', data)
				sessionStorage.setItem('currentExistTabPageArr', JSON.stringify(data))
			}
		},
		popuCurrentExistTabPageArr: function(context, param) {
			let data = this.state.currentExistTabPageArr
			let index = data.indexOf(param)
			if (index > -1) {
				data.splice(index, 1)
				context.commit('updateCurrentExistTabPageArr', data)
				sessionStorage.setItem('currentExistTabPageArr', JSON.stringify(data))
			}
		},
		setCurrentExistTabPageArr: function(context, param) {
			context.commit('updateCurrentExistTabPageArr', param)
		},
		setCurrentAddress: function(context, param) {
			let data = JSON.parse(sessionStorage.getItem('pageTabArr'))
			for (let i = 0; i < data.length; i++) {
				let item = data[i]
				if (param == item.url) {
					context.commit('updataCurrentAddress', item.currentAddress)
					sessionStorage.setItem('currentAddress', item.currentAddress)
					break
				}
			}
		},
		setEditableTabsValue: function(context, param) {
			context.commit('updateEditableTabsValue', param)
			sessionStorage.setItem('editableTabsValue', param)
		},
		setCompanyTree: function(context, param) {
			context.commit('updateCompanyTree', param)
		},
		/* websocket start */
		setNumberObj: function(context, param) {
			context.commit('updateNumberObj', param)
		},
		setEchartsData1: function(context, param) {
			context.commit('updateEchartsData1', param)
		},
		setEchartsData2: function(context, param) {
			context.commit('updateEchartsData2', param)
		},
		setEchartsData3: function(context, param) {
			context.commit('updateEchartsData3', param)
		},
		setInspectionStatistics5Numbers: function(context, param) {
			context.commit('updateInspectionStatistics5Numbers', param)
		},
		setUpdateEchartsBoxDataTask: function(context, param) {
			context.commit('updateEchartsBoxDataTask', param);
		},
		setUpdateEchartsBoxDataNode: function(context, param) {
			context.commit('updateEchartsBoxDataNode', param);
		},
		setCpuMemoryUseList: function(context, param) {
			context.commit('updateCpuMemoryUseList', param);
		},
		/* websocket end */
		
		
	}
})
export default store
