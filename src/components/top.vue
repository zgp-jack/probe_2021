<template>
<div class="topbox">
		<div class="logotext">
		</div>
		<div class="user-name">
          <!--  <p class="warnMessages">告警消息：
				<span>高<b class="highText">{{ $store.state.numberObj.number13 + $store.state.numberObj.number23 + $store.state.numberObj.number43 }}</b></span>
				<span>中<b class="middleText">{{ $store.state.numberObj.number12 + $store.state.numberObj.number22 + $store.state.numberObj.number42 }}</b></span>
				<span>低<b class="lowText">{{ $store.state.numberObj.number11 + $store.state.numberObj.number21 + $store.state.numberObj.number41 }}</b></span>
			</p> -->
			<el-popover
				placement="bottom"
				width="150"
				trigger="hover">
				<div class="page-content" @click="eventAlarm($event)">
					<p class="pageline" :data-index="3">链路中断（{{$store.state.eventAlarmObj.obj3.length}}）</p>
					<p class="pageline" :data-index="2">丢包劣化（{{$store.state.eventAlarmObj.obj2.length}}）</p>
					<p class="pageline" :data-index="1">时延劣化（{{$store.state.eventAlarmObj.obj1.length}}）</p>
				</div>
				<i slot="reference" class="el-icon-chat-dot-square warnMessage"><el-badge v-if="($store.state.eventAlarmObj.obj3.length + $store.state.eventAlarmObj.obj2.length + $store.state.eventAlarmObj.obj1.length)" :value="($store.state.eventAlarmObj.obj3.length + $store.state.eventAlarmObj.obj2.length + $store.state.eventAlarmObj.obj1.length)" :max="99" class="item" /></i>
			</el-popover>
			<p style="margin-right: 10px"><i class="el-icon-user"></i>{{username}}</p>
			<p @click="handleModifyPwd" style="margin-right: 10px"><i class="el-icon-lock" title="修改密码"></i></p>
			<p @click="returnLogin" style="margin-right: 20px"><i class="el-icon-switch-button" title="退出登录"></i></p>
		</div>
		<el-dialog
		  :visible.sync="dialogTableVisible_modifyPassword"
		  :close-on-click-modal="false"
		  :append-to-body="true"
		  width="25%"
		>
		  <div class="popup">
		    <div class="title">修改密码</div>
		    <div
		      class="hidepopup"
		      @click="dialogTableVisible_modifyPassword=!dialogTableVisible_modifyPassword"
		    >×</div>
            <div class="add-info-box">
                <div class="add-item-div">
                  <div class="add-item-title">原密码</div>
                  <el-input
                    placeholder="请输入原密码"
                    v-model="currentItem.oldPwd"
                    type="password"
                    maxlength="50"
                  ></el-input>
                </div>
                <div class="add-item-div">
                  <div class="add-item-title">新密码</div>
                  <el-input
                    placeholder="请输入新密码"
                    v-model="currentItem.newPwd"
                    type="password"
                    maxlength="50"
                  ></el-input>
                </div>
                <div class="add-item-div">
                  <div class="add-item-title">确认密码</div>
                  <el-input
                    placeholder="请输入确认密码"
                    v-model="currentItem.confirmPwd"
                    type="password"
                    maxlength="50"
                  ></el-input>
                </div>
            </div>
		    <div class="popup-buts">
		      <div class="popup-but popup-but-submit" @click="submitModifyPassword">确定</div>
		      <div
		        class="popup-but popup-but-cancel"
		        @click="dialogTableVisible_modifyPassword= !dialogTableVisible_modifyPassword"
		      >取消</div>
		    </div>
		  </div>
		</el-dialog>
</div>
</template>
<script>
import store from '../store.js'
import baseUrl from '../js/baseUrl.js'
import axiosHttp from '../js/axiosHttp.js'
import CommonFun from '../js/commonFun.js'
export default {
  	name: 'Top',
  	data () {
		return {
		username: sessionStorage.getItem('username'),
		staffName: sessionStorage.getItem('staffName'),
		dialogTableVisible_modifyPassword: false,
		currentItem: {},
		modifyPasswordUrl: 'system/user/modify-password'
		}
  	},
  	methods: {
		eventAlarm(e) {
			this.$emit('changeEvent', e.target.dataset.index)
		},
		handleModifyPwd: function () {
			this.currentItem = {}
			this.dialogTableVisible_modifyPassword = true
		},
		returnLogin () {
			axiosHttp.get(baseUrl.BASEURL + 'system/user/logout').then((res) => {
				if (res.data.status == 0) {
					CommonFun.responseError(res.data, $this)
				}
				this.$router.push('/login');
			}).catch((error) => {
				this.$router.push('/login');
			})
		},
		submitModifyPassword: function () {
			let $this = this
				let loading = CommonFun.openFullScreen($this)
			axiosHttp
			.put(baseUrl.BASEURL + $this.modifyPasswordUrl, $this.currentItem)
			.then(function (res) {
				CommonFun.closeFullScreen(loading)
				if (res.data.status == 0) {
				CommonFun.responseError(res.data, $this)
				}
				if (res.data.status == 1) {
					CommonFun.responseSuccess(res.data.message, $this)
					$this.$router.push('/login')
				}
			}).catch(function(error){
				CommonFun.closeFullScreen(loading)
			})
		}
  	},
}
</script>
<style scoped>
.page-content {
	padding-left: 0px;
}
.pageline {
	position: relative;
	color: #00d8cf;
	line-height: 30px;
	padding-left: 20px;
	cursor: pointer;
}
.warnMessage .el-badge{position: absolute;top: -5px;left: 12px;}
.el-icon-chat-dot-square{position: relative;margin-right: 30px;margin-top: 2px;}
.el-icon-chat-dot-square::before{font-size: 24px;}
.topbox {
  width: 100%;
  height: 86px;
  display: flex;
  justify-content: space-between;
  background-image: url(../assets/top.png);
  background-size: 100% 100%;
}

.user-name{display: flex;cursor: pointer; height: 54px;}
.user-name  p{
  line-height: 50px;
  color: #fff;
  font-size: 12px;
  margin-right: 5px;
}
.user-name i{
  line-height: 50px;
  color: #fff;
  font-size: 14px;
  /* margin-right: 5px; */
}
.logotext{display: flex;}
.logotext span{font-size: 18px;font-weight: bold;line-height: 50px;color: #fff;margin-left: 18px;}
.warnMessages{font-weight: bolder;}
.warnMessages span{margin-right:5px;}
.warnMessages span b{margin-left:3px;}
.warnMessages span b.highText{color: #e90000;}
.warnMessages span b.middleText{color: #ffa800;}
.warnMessages span b.lowText{color: #1aa4ec;}
.warnMessages span b.faultText{margin-left:0px;color: #e90000;}
</style>
