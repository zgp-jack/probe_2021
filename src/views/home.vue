<template>
	<div class="boxouter-home">
		<div class="top" v-show="!this.fullScreen">
			<Top @changeEvent="changeEvent" />
		</div>
		<div class="contentbox">
			<div class="left-navi" v-show="!this.fullScreen">
				<Navi />
			</div>
			<div class="right-content" :style="{paddingTop: this.fullScreen ? '0': $route.name === 'index' ? '54px' : '94px'}">
				<div class="right-content-page">
					<keep-alive :include="this.$store.state.includeList">
						<router-view></router-view>
					</keep-alive>
				</div>
			</div>
		</div>
		<el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="876px">
			<div class="popup">
				<div class="title">告警
					<!-- <el-checkbox class="not-popup" v-model="$store.state.notPopup" true-label="true" false-label="false" @change="setPopup">不再弹窗</el-checkbox> -->
					<span class="not-popup-icon not-popup"></span>
					<el-popover
						popper-class="popup-popover"
						placement="bottom-end"
						width="150"
						trigger="click">
						<el-switch
							v-model="$store.state.notPopupBell"
							@change="setPopupBell"
							active-value="true"
							inactive-value="false"
							active-color="#009E91"
							inactive-color="#324141"
							inactive-text="告警铃声">
						</el-switch>
						<el-switch
							v-model="$store.state.notPopup"
							@change="setPopup"
							active-value="true"
							inactive-value="false"
							active-color="#009E91"
							inactive-color="#324141"
							inactive-text="是否弹窗">
						</el-switch>
						<span slot="reference" class="not-popup-icon not-popup"></span>
					</el-popover>
				</div>
				<div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
				<div class="tab-title" @click="changeTab($event)">
					<span :data-index='3' :class="[(tabIndex==3)&&'active']">链路中断（{{$store.state.eventAlarmObj.obj3.length}}）</span>
					<span :data-index='2' :class="[(tabIndex==2)&&'active']" style="border-left: none;border-right: none;">丢包劣化（{{$store.state.eventAlarmObj.obj2.length}}）</span>
					<span :data-index='1' :class="[(tabIndex==1)&&'active']">时延劣化（{{$store.state.eventAlarmObj.obj1.length}}）</span>
				</div>
				<div class="select-all">
					<el-checkbox v-if="eventList.length" v-model="checked" @change="selectAll">全选</el-checkbox>
				</div>
				<el-scrollbar>
					<div class="add-info-box" v-if="eventList.length">
						<div class="item popup" v-for="(item, index) in eventList" :key="index">
							<span class="item-icon" :class="['item-icon'+item.grade]"></span>
							<span :class="['item-text'+item.grade]">{{item.grade == 1? '低':item.grade == 2?'中':'高'}}</span>
							<div class="item-title">
								<p :class="['item-text'+item.grade]">【{{item.eventType==1?'时延劣化':item.eventType==2?'丢包劣化':'链路中断'}}】</p>
								<p>{{CommonFun.formatterTime(item,'告警时间')}}</p>
							</div>
							<div class="item-content">
								<span v-html="item.msg"></span>
								<span class="item-view" @click="showView(item, index)">点击查看<i class="el-icon-arrow-right"></i></span>
							</div>
							<el-checkbox v-model="item.status" :true-label='1' :false-label="0">告警确认</el-checkbox>
						</div>
					</div>
					<div  v-else class="no-data-box">
						<img src="../assets/no-data-table.png"/>
						<p>暂无告警</p>
					</div>
				</el-scrollbar>
				<div class="popup-buts">
					<div class="popup-but popup-but-submit" @click="changeEvnetWran">确定</div>
					<div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
				</div>
			</div>
		</el-dialog>
		<!-- <index-page ref="modalForm" @ok="modalFormOk"></index-page> -->
	</div>
</template>
<script>
	import Navi from '../components/navi.vue'
	import Top from '../components/top.vue'
	import PageTabComponent from '../components/pagetabcomponent.vue'
	import baseUrl from '../js/baseUrl.js'
	import store from '@/store.js'
	import axiosHttp from '../js/axiosHttp.js'
	import CommonFun from '@/js/commonFun'
	import { mapState } from 'vuex'
	var music = new Audio();
export default {
	name: 'home',
	components: {
		Navi,
		Top,
		PageTabComponent,
	},
    data () {
      return {
		eventList: this.$store.state.eventAlarmObj.obj3,
		tabIndex: 3,
		checked: false,
		dialogTableVisible_delete: false,
    	refreshPageArr:['index','taskDialTest','taskRelay','taskDevice'],
		/* websocket start */
		ws: '',//建立的连接
		lockReconnect: false,//是否真正建立连接
		timeout: 3*60*1000000,//3分钟一次心跳
		timeoutObj: null,//心跳心跳倒计时
		serverTimeoutObj: null,//心跳倒计时
		timeoutnum: null,//断开 重连倒计时
		username:sessionStorage.getItem('username'),
		companyId:sessionStorage.getItem('companyId')
		/* websocket end */
      }
    },
	computed: {
        ...mapState({
            fullScreen: state => state.fullScreen
        })
    },
	beforeDestroy() {
		this.ws.close();
	},
    methods:{
		setPopup(val){
			this.$store.commit('updataNotPopup', val)
			sessionStorage.setItem("updataNotPopup", val)
		},
		setPopupBell(val){
			this.$store.commit('updataNotPopupBell', val)
			sessionStorage.setItem("updataNotPopupBell", val)
		},
		showView(row,rowIndex){
			let $this = this;
			let params = {
				status: 1,
				idList: [row.id]
			}
			axiosHttp
				.post(baseUrl.BASEURL + 'popup/setStatus', params)
				.then(function(res) {
					if (res.data.status === 1) {
						$this.checked = false;
						$this.dialogTableVisible_delete = false;
						$this.eventList.splice(rowIndex, 1);
						$this.$store.state.eventAlarmObj['obj'+$this.tabIndex] = $this.eventList;
						$this.$store.commit('updateEventAlarmObj', $this.$store.state.eventAlarmObj)
						sessionStorage.setItem("updateEventAlarmObj", JSON.stringify($this.$store.state.eventAlarmObj))
						let data = {id: row.analyseId,beginTime: row.time}
						let toPage = 'analyseDelayDegradation';
						if($this.$route.name == 'analyseDelayDegradation'){
							$this.$store.commit('updataExportViewId', data.id+','+data.beginTime)
							$this.dialogTableVisible_delete = false;
						}else{
							// $this.$store.commit('pushIncludeList', 'analyseDialTest');
							sessionStorage.setItem('defaultActive', toPage);
							$this.$store.dispatch('setDefaultActive', toPage);
							$this.$store.dispatch('setOpenList', [toPage])
							$this.dialogTableVisible_delete = false;
							setTimeout(() => $this.$router.push({name: toPage, params: data}))
						}
					}else{
						CommonFun.responseError(res.data, $this)
					}
				}).catch(function(err) {
					CommonFun.responseError(err, $this)
				})
		},
		selectAll(val){
			let $this = this;
			if(val){
				this.eventList.length&&this.eventList.forEach((item,index) => {
					item.status = 1;
					$this.$set(this.eventList,index,item);
				})
			}else{
				this.eventList.length&&this.eventList.forEach((item,index) => {
					item.status = 0;
					$this.$set(this.eventList,index,item);
				})
			}
		},
		changeEvnetWran(){
			let $this = this;
			let idArr = []
			this.eventList.length&&this.eventList.forEach(item => {
				if(item.status == 1) {
					idArr.push(item.id)
				}
			});
			let params = {
				status: 1,
				idList: idArr
			}
			if(idArr.length){
				axiosHttp
					.post(baseUrl.BASEURL + 'popup/setStatus', params)
					.then(function(res) {
						if (res.data.status === 1) {
							CommonFun.responseSuccess(res.data.message, $this)
							$this.checked = false;
							$this.dialogTableVisible_delete = false;
							let eventAlarm = $this.eventList.filter(item => {
								if(idArr.indexOf(item.id) == -1){return item;}
							})
							$this.$store.state.eventAlarmObj['obj'+$this.tabIndex] = eventAlarm;
							$this.$store.commit('updateEventAlarmObj', $this.$store.state.eventAlarmObj)
							sessionStorage.setItem("updateEventAlarmObj", JSON.stringify($this.$store.state.eventAlarmObj))
						}else{
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.responseError(err, $this)
					})
			}else{
				$this.dialogTableVisible_delete = false;
			}
		},
		changeEvent(val){
			this.checked = false;
			this.tabIndex = val;
			this.dialogTableVisible_delete = true;
			this.eventList = this.$store.state.eventAlarmObj['obj'+val]
			this.eventList.length&&this.eventList.forEach(item => {item.status = 0});
		},
		changeTab(e){
			this.checked = false;
			this.tabIndex = e.target.dataset.index;
			this.eventList = this.$store.state.eventAlarmObj['obj'+e.target.dataset.index]
			this.eventList.length&&this.eventList.forEach(item => {item.status = 0});
		},
		modalFormOk(){},
		/* websocket start */
		initWebpack(){
			  let $this = this
			  const wsurl = baseUrl.WSURL+this.username;//ws地址,这里加入自己的地址即可'ws://192.168.2.42:9040/api/websocket/user_'
			  this.ws = new WebSocket(wsurl,[sessionStorage.getItem('token')]);
			  this.ws.onopen = this.onopen;
			  this.ws.onmessage = this.onmessage;
			  this.ws.onclose = this.onclose;
			  this.ws.onerror = this.onerror;
			  // 路由跳转时结束 websocket 链接
			 /* $this.$router.afterEach(function () {
				console.log('关闭ws')
				$this.lockReconnect = true
			    $this.ws.close()
			  }) */
			},
			reconnect() {//重新连接
			  var that = this;
			  if(that.lockReconnect) {
				return;
			  };
			  that.lockReconnect = true;
			  //没连接上会一直重连，设置延迟避免请求过多
			  that.timeoutnum && clearTimeout(that.timeoutnum);
			  that.timeoutnum = setTimeout(function () {
				//新连接
				that.initWebpack();
				that.lockReconnect = false;
			  },that.timeout);
			},
			reset(){//重置心跳
			  var that = this;
			  //清除时间
			  clearTimeout(that.timeoutObj);
			  clearTimeout(that.serverTimeoutObj);
			  //重启心跳
			  that.start();
			},
			start(){ //开启心跳
			  console.log('开启心跳');
			  var self = this;
			  self.timeoutObj && clearTimeout(self.timeoutObj);
			  self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
			  self.timeoutObj = setTimeout(function(){
				//这里发送一个心跳，后端收到后，返回一个心跳消息，
				console.log('self.ws.readyState: '+self.ws.readyState)
				if (self.ws.readyState == 1) {//如果连接正常
				  self.ws.send("heartCheck"); //这里可以自己跟后端约定
				}else{//否则重连
				  self.reconnect();
				}
				self.serverTimeoutObj = setTimeout(function() {
				  //超时关闭
				  self.ws.close();
				}, self.timeout);
			  }, self.timeout)
			},
		　　onopen() {
			  console.log("open");
			  //开启心跳
			  this.start();
			},
			onmessage(e) {
				let $this = this
			 // console.log('接收信息--', e);
			  //下面这块代码，接收到后端返回的消息后，根据自己的需求去判断
			  if(e.data == 'heartCheck' || e.data == '连接成功'){
			  }else {
				let res = JSON.parse(e.data)
				if (res.type == "es:task:dial:info" && baseUrl.WSSOURCE === 'true') {
					$this.$store.dispatch('setUpdateEchartsBoxDataTask', res.data)
				}else if((res.type == 'es:task:dial:node:info' || res.type == 'es:task:relay:info') && baseUrl.WSSOURCE === 'true') {
					$this.$store.dispatch('setUpdateEchartsBoxDataNode', res.data)
				}else if(res.type == 'send:popup:msg'){
					res.data.length && res.data.forEach(item => {
						$this.$store.state.eventAlarmObj['obj'+item.eventType].unshift(item);
					})
					for (let key in $this.$store.state.eventAlarmObj){
						if($this.$store.state.eventAlarmObj[key].length>=1000){
							$this.$store.state.eventAlarmObj[key] = $this.$store.state.eventAlarmObj[key].slice(0, 1000);
						}
					}
					$this.$store.commit('updateEventAlarmObj', $this.$store.state.eventAlarmObj)
					sessionStorage.setItem("updateEventAlarmObj", JSON.stringify($this.$store.state.eventAlarmObj))
					if($this.$store.state.notPopup == 'true' && $this.dialogTableVisible_delete != true){
						$this.checked = false;
						$this.tabIndex = res.data[0].eventType;
						$this.eventList = $this.$store.state.eventAlarmObj['obj'+res.data[0].eventType]
						$this.eventList.length&&this.eventList.forEach(item => {item.status = 0});
						$this.dialogTableVisible_delete = true;
					}
					if($this.$store.state.notPopupBell == 'true'){
						music.src=require("../assets/didi.wav");
						music.play();
					}
				}else if(res.type == 'es:task:device:info') {
					if(baseUrl.WSSOURCE === 'true') {
						$this.$store.dispatch('setCpuMemoryUseList', res.data)
					}
				}
			  }
			  //收到服务器信息，心跳重置
			  this.reset();
			},
			onclose(e) {
			  console.log("连接关闭");
			  console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
			  //重连
			  this.reconnect();
			},
			onerror(e) {
			  console.log("出现错误");
			  //重连
			  this.reconnect();
			},
			onsend(msg) {//向服务器发送信息
			  //数据发送
			  this.websock.send(msg);
			},
			/* websocket end */
		
	},
	created: function() {
		this.initWebpack()
	},
}
</script>
<style lang="scss" scoped>
.no-data-box{
	padding-bottom: 40px;
}
.select-all{
	text-align: right;
	margin-bottom: 20px;
}
.add-info-box{
	max-height: 250px;
}
.item{
	display: flex;
	color: #fff;
}
.item-text {
	color: #FF6C3F;
}
.item-content {
	width: 430px;
	margin-left: 40px;
	margin-right: 40px;
}
.item-view {
	margin-left: 8px;
	color: #00D9D2;
	cursor: pointer;
	white-space: nowrap;
}
.el-icon-arrow-right:before{
	vertical-align: -2px;
}
.item-title{
	width: 120px;
	margin-left: 20px;
	p:first-child{
		margin-bottom: 8px;
	}
}
.item-icon3{
	background-color: #FF6C3F;
}
.item-icon3::before {
	border-color: #FF6C3F!important;
}
.item-icon2{
	background-color: #FF8D1A;
}
.item-icon2::before {
	border-color: #FF8D1A!important;
}
.item-icon1{
	background-color: #22C3FF;
}
.item-icon1::before {
	border-color: #22C3FF!important;
}
.item-icon{
	position: relative;
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 20px;
	margin-top: 4px;
}
.item-icon::before{
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -7px;
	margin-left: -7px;
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	border: 1px solid;
}
.item-icon::after{
	content: '';
    position: absolute;
    left: 3px;
    top: 11px;
    display: block;
    width: 1px;
    height: 65px;
    background-color: #525252;
}
.item.popup:last-child .item-icon:after{
	content: none;
	display: none;
}
.tab-title {
	text-align: center;
}
.tab-title span{
	display: inline-block;
	width: 120px;
	color: #fff;
	text-align: center;
	padding: 8px 0;
	border: 1px solid #0AB3AC;
	cursor: pointer;
}
.tab-title span.active{
	background-color: rgba(10, 179, 172, 0.2);
}
.not-popup{
	position: absolute;
    right: 0;
	top: 18px;
	cursor: pointer;
}
.not-popup-icon{
	display: inline-block;
	width: 22px;
	height: 14px;
	border-top: 2px solid #04DDD5;
	cursor: pointer;
}
.not-popup-icon::before{
	content: '';
	display: inline-block;
	width: 22px;
	height: 2px;
	background-color: #04DDD5;
	position: absolute;
    top: 4px;
	right: 0;
	cursor: pointer;
}
.not-popup-icon::after{
	content: '';
	display: inline-block;
	width: 22px;
	height: 2px;
	background-color: #04DDD5;
	position: absolute;
    top: 10px;
	right: 0;
	cursor: pointer;
}
.popup-buts{
	margin-top: 20px;
}
	.boxouter-home {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		background-color: #f5f5f5;
		overflow: hidden;
	}

	.pad-0{
		padding: 0 !important;
	}
	.boxouter-home {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		background-color: #f5f5f5;
		overflow: hidden;
	}

	.top {
		width: 100%;
		height: 94px;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 999;
		background-color: transparent;
	}

	.contentbox {
		width: 100%;
		height: 100%;
		display: flex;
		background-color: #020c0d;
	}

	.left-navi {
		width: auto;
		height: calc(100% - 93px);
		margin-top: 93px;
		background-color: #001c1a;
	}

	.right-content {
		display: flex;
		overflow-y: auto;
		flex: 1;
		flex-direction: column;
		height: 100%;
		background-color: #020c0d;
		padding-top: 94px;
	}

	.right-content-page {
		flex: 1;
		overflow-y: auto;
	}
</style>
