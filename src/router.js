import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import Login from './views/login/index.vue'
import menuManage from './components/menuManage.vue'
import buttonManage from './views/buttonManage.vue'
import userManage from './views/userManage/index'
import userManagement from './components/System/userManage.vue'
import roleManage from './components/System/roleManage.vue'
import index from './views/index/index.vue'
import analyseDialTest from './views/analyseDialTest/index'
import analyseRelay from './views/analyseRelay/index'
import analyseSpecialLine from './views/analyseSpecialLine/index'
import analyseNetworkDevice from './views/deviceMonitor/analysis/indexOld.vue'
import analyseStatics from './views/deviceMonitor/analysis/index.vue'
import analyseDelayDegradation from './views/expertAnalysis/index'
import taskDialTest from './views/task/dialTest/index.vue'
import taskRelay from './views/task/relay/index.vue'
import taskRelayMib from './views/taskRelayMib.vue'
import taskDevice from './views/task/device/index.vue'
import taskDeviceMib from './views/taskDeviceMib.vue'
import taskSpecialLine from './views/task/specialLine/index.vue'
import probeManager from './views/probeManager.vue'
import alarmDetailInfo from './views/expertAnalysisDetail/index'
import analyseRelaySpecialLineDetail from './views/analyseRelaySpecialLineDetail/index'
import analyseFlowCongestion from './views/deviceMonitor/fault/index.vue'
import jurisdictionManage from './components/jurisdictionManage.vue'
import crewManageNew from './views/crewManageNew.vue'
import dataManage from './views/dataManage.vue'
import noticeBase from './views/noticeBase.vue'
import systemStatue from './views/systemStatue.vue'
import linkTopology from './views/linkTopology/index'
import nodeFile from './views/nodeFile/index'
import maintainFile from './views/maintainFile/index'
import classRule from './views/classRule/index'
import faultDetail from './views/deviceMonitor/faultDetail/index'
import popupManagement from './views/popupManagement/index'
import parameterSetting from './views/parameterSetting/index'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'index',
			component: Home,
			redirect: '/index',
			children: [{
					path: 'menuManage',
					name: 'menuManage',
					component: menuManage
				},
				{
					path: 'linkTopology',
					name: 'linkTopology',
					component: linkTopology
				},
				{
					path: 'faultDetail',
					name: 'faultDetail',
					component: faultDetail
				},
				{
					path: 'userManage',
					name: 'userManage',
					component: userManage
				},
				{
					path: 'roleManage',
					name: 'roleManage',
					component: roleManage
				},
				{
					path: 'index',
					name: 'index',
					component: index
				},
				{
					path: 'userManagement',
					name: 'userManagement',
					component: userManagement
				},
				{
					path: '/analyseDialTest',
					name: 'analyseDialTest',
					component: analyseDialTest
				},
				{
					path: '/analyseRelay',
					name: 'analyseRelay',
					component: analyseRelay
				},
				{
					path: '/analyseSpecialLine',
					name: 'analyseSpecialLine',
					component: analyseSpecialLine
				},
				{
                    path: '/analyseDelayDegradation',
                    name: 'analyseDelayDegradation',
                    component: analyseDelayDegradation
                },
				{
					path: '/analyseStatistical',
					name: 'analyseStatistical',
					component:analyseStatics
	            },
				{
					path: '/analyseNetworkDevice',
					name: 'analyseNetworkDevice',
					component: analyseNetworkDevice
				},
				{
					path: '/analyseFlowCongestion',
					name: 'analyseFlowCongestion',
					component: analyseFlowCongestion
				},
				{
					path: 'crewManageNew',
					name: 'crewManageNew',
					component: crewManageNew 
				},
				{
					path: 'jurisdictionManage',
					name: 'jurisdictionManage',
					component: jurisdictionManage
				},
				{
					path: '/dataManage',
					name: 'dataManage',
					component: dataManage
				},
				{
					path: '/buttonManage',
					name: 'buttonManage',
					component: buttonManage
				},
				{
					path: '/noticeBase',
					name: 'noticeBase',
					component: noticeBase
				},
				{
					path: '/systemStatue',
					name: 'systemStatue',
					component: systemStatue
				},
				{
					path: '/taskDialTest',
					name: 'taskDialTest',
					component: taskDialTest
				},
				{
					path: '/taskRelay',
					name: 'taskRelay',
					component: taskRelay
				},
				{
					path: '/taskRelayMib',
					name: 'taskRelayMib',
					component: taskRelayMib
				},
				{
					path: '/taskDevice',
					name: 'taskDevice',
					component: taskDevice
				},
				{
					path: '/taskDeviceMib',
					name: 'taskDeviceMib',
					component: taskDeviceMib
				},
				{
					path: '/taskSpecialLine',
					name: 'taskSpecialLine',
					component: taskSpecialLine
				},
				{
					path: '/probeManager',
					name: 'probeManager',
					component: probeManager
				},
				{
					path: '/alarmDetailInfo',
					name: 'alarmDetailInfo',
					component: alarmDetailInfo
				},
				{
					path: '/analyseRelaySpecialLineDetail',
					name: 'analyseRelaySpecialLineDetail',
					component: analyseRelaySpecialLineDetail
				},
				{
					path: '/nodeFile',
					name: 'nodeFile',
					component: nodeFile
				},
				{
					path: '/maintainFile',
					name: 'maintainFile',
					component: maintainFile
				},
				{
					path: '/classRule',
					name: 'classRule',
					component: classRule
				},
				{
					path: '/popupManagement',
					name: 'popupManagement',
					component: popupManagement
				},
				{
					path: '/parameterSetting',
					name: 'parameterSetting',
					component: parameterSetting
				},
			]
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
	]
})

router.beforeEach((to, from, next) => { // 当用户跳转页面的时候保证和导航同步跳转
	// 在router中调用store中的方法
	// router.app.$options.store.dispatch('getNaviData')
	console.log('to：')
	console.log(to)
	// let href  = '/exchange/screenfull'

	if (to.name === 'login' || to.name === 'screenfull') {
		next()
	} else {
		var token = sessionStorage.getItem('token')
		if (!token) {
			next({
				path: '/login'
			})
		} else {
			next()
		}
	}
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
export default router
