<template>
	<div class="box">
		<div class="logoBox"></div>
		<div class="topLink">
		</div>
		<div class="loginbox">
			<div class="toptile">
				<p class="loginName"><img class="login-title-img" src="../../assets/login-title.png" alt="">网络性能质量遥测系统</p>
				<p class="loginNameSub">NPA-1000</p>
			</div>
			<div class="login-content">
                
				<div class="name-div">
					<i class="login-icon el-icon-user"></i>
                    <input style="display: none"/>
					<input class="name-input" type="text" v-model="username" @keyup.enter="loginAction" placeholder="用户名" autocomplete="off"/>
				</div>
				<div class="password-div">
					<i class="login-icon el-icon-lock"></i>
                    <input type="password" style="display: none"/>
					<input class="password-input" :type="passwordType" @keyup.enter="loginAction" v-model="password" placeholder="密码" autocomplete="new-password" />
                    <img v-show="!passwordView" src="../../assets/login-hide.png" @click="passwordView = !passwordView;passwordType = 'text'" class="password-hide">
                    <img v-show="passwordView" src="../../assets/login-view.png" @click="passwordView = !passwordView;passwordType = 'password'" class="password-view">
				</div>
				<div class="errortip">{{ errorTipText }}</div>
				<div class="butbox">
					<div class="submit-but" @click="loginAction" @keyup.enter="loginAction">登 录</div>
					<!-- <div class="submit-cancel" @click="cancleLoginAction">取 消</div> -->
				</div>
			</div>
		</div>
		<!-- <div class="footerBox">© 2020 网络性能管理版权所有</div> -->
	</div>
</template>

<script>
	import axios from 'axios'
	import baseUrl from '../../js/baseUrl.js'
	import axiosHttp from '../../js/axiosHttp.js'
	import CommonFun from '../../js/commonFun.js'
	export default {
		name: 'Login',
		components: {},
		data() {
			return {
				username: '',
				password: '',
				errorTipText: '',
				getButtonsUrl: 'system/role/action',
				getCompanyTreeUrl:'postCompany/companyTree',
                passwordView: false,
                passwordType: 'password'
			}
		},
		methods: {
			//获得按钮权限
			getButtonsJurisdiction(roleId) {
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.post(baseUrl.BASEURL + $this.getButtonsUrl, {
						id: roleId
					})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							console.log('getButtonsJurisdiction:')
							console.log(res)
							sessionStorage.setItem('buttonsJurisdiction', JSON.stringify(res.data.data))
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			// 登陆方法
			loginAction() {
				let $this = this
				/* var reg = new RegExp(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{12,}$/);
				if(!reg.test($this.password)){
					$this.errorTipText = '密码必须是12位以上，并且含有数字，字母，特殊字符的字符串'
					return
				} */
				let loading = CommonFun.openFullScreen($this)
				axios.post(baseUrl.BASEURL + $this.$store.state.loginUrl, {
						username: $this.username,
						password: $this.password
					})
					.then(function(res) {
						console.log('login result:')
						console.log(res)
						CommonFun.closeFullScreen(loading)
						if (res.data.status == 1) {
							var data = res.data.data
							$this.getButtonsJurisdiction(data.roleId)
							$this.errorTipText = ''
							sessionStorage.setItem('token', data.token)
							sessionStorage.setItem('menuArr', JSON.stringify(data.menus))
							sessionStorage.setItem('username', data.username)
							sessionStorage.setItem('userid', data.userId)
							sessionStorage.setItem('jobId', data.jobId)
							sessionStorage.setItem('staffName', data.staffName)
							sessionStorage.setItem('staffId', data.staffId)
							sessionStorage.setItem('companyId', data.companyId)
							sessionStorage.setItem('companyName', data.companyName)
							sessionStorage.setItem('roleCode', data.roleCode)
							sessionStorage.setItem('roleLevel', data.roleLevel)
							$this.$store.dispatch('setDefaultActive', 'index')
							$this.setPageTabArr(data.menus)
							$this.$store.dispatch('setCurrentExistTabPageArr', ['index'])
							sessionStorage.setItem('currentExistTabPageArr', '')
							$this.getCompanyTree()
							$this.getEventlist();
							//登录成功后，加载数据字典为全局缓存数据
							$this.$store.dispatch("getDataDictionaryListData", {
								id: $this.$store.state.dataDictionaryRootId
							}).then((res, reeor) => {
								console.log("获取数据字典成功")
							})
							//加载探针申报列表为全局缓存数据
							$this.$store.dispatch('getProbeDeviceListData', {}).then(res => {
								console.log("获取探针设备列表成功")
							})
							$this.$router.push('/index')
						} else {
							$this.errorTipText = res.data.message
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
			},
			getEventlist(){
				let $this = this;
				axiosHttp
					.post(baseUrl.BASEURL + 'popup/list', {})
					.then((res) => {
						if(res.data.status == 1){
							let eventAlarmObj = {obj1: [], obj2: [], obj3: []};
							res.data.data.length && res.data.data.forEach(item => {
								if(item.eventType == 1){
									eventAlarmObj.obj1.push(item);
								}else if(item.eventType == 2){
									eventAlarmObj.obj2.push(item);
								}else{
									eventAlarmObj.obj3.push(item);
								}
							})
							for (let key in eventAlarmObj){
								if(eventAlarmObj[key].length>=1000){
									eventAlarmObj[key] = eventAlarmObj[key].slice(0, 1000);
								}
							}
							$this.$store.commit('updateEventAlarmObj', eventAlarmObj)
							sessionStorage.setItem("updateEventAlarmObj", JSON.stringify(eventAlarmObj))
						}else{
							CommonFun.responseError(res.data, $this)
						}
					})
					.catch(err => {
						CommonFun.responseError(err, $this)
					})
			},
			//init page tab
			setPageTabArr(data) {
				let pageTabArr = []
				let len1 = data.length
				for (let i = 0; i < len1; i++) {
					let item = data[i]
					if (CommonFun.ifNall(item.children)) {
						item.currentAddress = item.name
						pageTabArr.push(JSON.parse(JSON.stringify(item)))
					} else {
						let len2 = item.children.length
						for (let k = 0; k < len2; k++) {
							let item2 = item.children[k]
							item2.icon = item.icon
							item2.currentAddress = item.name + " ＞ " + item2.name
							pageTabArr.push(JSON.parse(JSON.stringify(item2)))
						}
					}
				}
				sessionStorage.setItem('pageTabArr', JSON.stringify(pageTabArr)) //所有navi 路由信息 总
				this.$store.dispatch('setCurrentAddress', 'index') //获得 当前具体地址 index->首页
			},
			cancleLoginAction() {
				this.errorTipText = ''
				this.username = ''
				this.userpassword = ''
			},
			getCompanyTree(){
				let $this = this
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
					.post(baseUrl.BASEURL + $this.getCompanyTreeUrl, {})
					.then(function(res) {
						CommonFun.closeFullScreen(loading)
						if (res.data.status === 1) {
							console.log('company tree:')
							console.log(res)
							if(CommonFun.ifNall(res.data.data)){
								sessionStorage.setItem('companyTree', JSON.stringify([]))
								$this.$store.dispatch('setCompanyTree',[])
							}else{
								sessionStorage.setItem('companyTree', JSON.stringify(res.data.data))
								$this.$store.dispatch('setCompanyTree',res.data.data)
							}
						}
						if (res.data.status === 0) {
							CommonFun.responseError(res.data, $this)
						}
					}).catch(function(err) {
						CommonFun.closeFullScreen(loading)
					})
				
			},
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-title-img {
	width: 50px;
	height: 40px;
	margin-right: 10px;
	vertical-align: text-bottom;
}
	.box {
		position: relative;
		width: 100%;
		height: 100%;
		background: url(../../assets/login-bgm.gif) no-repeat center;
		background-size: cover;
	}

	.pclogo {
		margin: auto;
		padding-top: 60px;
		width: 300px;
		display: block;
	}

	.topLink {
		position: fixed;
		right: 40px;
		top: 40px;
		display: flex;
	}

	.linkhrefA {
		background: #fff;
		border: 1px solid #C7000B;
		padding: 8px 15px;
		display: block;
		text-decoration: none;
		color: #C7000B;
		font-size: 14px;
		margin-right: 3px;
	}

	.linkhrefA:hover {
		background: #C7000B;
		color: #fff;
	}

	.linkhrefB {
		background: #C7000B;
		border: 1px solid #C7000B;
		padding: 8px 15px;
		display: block;
		text-decoration: none;
		color: #fff;
		font-size: 14px;
	}

	.footerBox {
		width: 100%;
		text-align: center;
		position: fixed;
		bottom: 40px;
		font-size: 12px;
		color: #999;
	}

	.loginbox {
		width: 540px;
		height: 442px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		/* box-shadow: 0 0 20px #eee; */
		/* background-color: #fff; */
		border-radius: 10px;
		overflow: hidden;
        background: url(../../assets/login-bgm1.png) no-repeat center;
        background-size: contain;
	}

	.loginbox .toptile {
		height: 120px;
		/*  border-bottom: 1px solid #f1f1f1;
  background-color: #fdfdfd; */
	}

	.loginbox .toptile .china-name,
	.loginbox .toptile .english-names {
		height: 81px;
		width: 100%;
		position: relative;
	}

	.loginbox .toptile .english-names {
		height: 50px;
	}

	.loginbox .toptile .china-name p,
	.loginbox .toptile .english-names p {
		width: 100%;
		color: #c7000b;
		text-align: center;
		font-size: 24px;
		font-weight: bolder;
		position: absolute;
		bottom: 0px;
		padding: 0px;
		margin: 0px;
	}

	.loginbox .toptile .english-names p {
		font-weight: normal;
		font-size: 12px;
		color: #999;
		text-transform: Uppercase;
		position: absolute;
		top: 0px;
		padding: 0px;
		margin: 0px;
	}

	.loginbox .login-content {
		width: 302px;
		margin: 0 auto;
	}

	.loginbox .login-content .name-div,
	.loginbox .login-content .password-div {
		position: relative;
		width: 100%;
		border-bottom: 1px solid #077974;
		margin: 47px auto 12px auto;
		overflow: hidden;
	}

	.loginbox .login-content .password-div {
		margin-bottom: 0 !important;
	}

	.loginbox .login-content .errortip {
		height: 30px;
		width: 100%;
		margin-bottom: 10px;
		text-align: center;
		color: red;
		line-height: 30px;
	}

	.loginbox .login-content .name-div .name-input,
	.loginbox .login-content .password-div .password-input {
		border: none;
		float: left;
		width: 100%;
		height: 54px;
        padding-left: 48px;
        padding-right: 48px;
        color: #fff!important;
		line-height: 54px;
		background: none !important;
		box-shadow: 0 0 0px 1000px transparent inset !important;
		outline: none;
        caret-color: rgba(0, 192, 255, .3);
	}
    .loginbox .login-content input:-webkit-autofill {
        -webkit-text-fill-color: rgba(0, 192, 255, .3)!important;
    }
    input::-webkit-input-placeholder {
        color: rgba(0, 192, 255, .3);
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-transition-delay: 99999s!important;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out!important;
    }
	.loginbox .login-content .password-div {
		margin: 0 auto 40px auto;
	}

	input:-webkit-autofill {
		border: none;
		line-height: 44px;
		outline: none;
		-webkit-text-fill-color: #333 !important;
		-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
		background-color: transparent;
		background-image: none;
		transition: background-color 50000s ease-in-out 0s;
	}

	.loginbox .login-content .name-div .login-icon,
	.loginbox .login-content .password-div .login-icon {
        position: absolute;
		float: left;
		width: 48px;
		height: 54px;
        line-height: 54px;
        text-align: center;
	}
    .login-icon::before {
        font-size: 20px;
        color: #00DAD2;
    }
    .password-hide {
        position: absolute;
        right: 0;
        width: 20px;
        height: 10px;
        cursor: pointer;
        top: 50%;
        margin-top: -5px;
    }
    .password-view {
        position: absolute;
        right: 0;
        cursor: pointer;
        width: 18px;
        height: 14px;
        top: 50%;
        margin-top: -7px;
    }
	/* .loginbox .login-content .name-div .login-icon {
		background: url(../../assets/username.png) no-repeat center;
	}

	.loginbox .login-content .password-div .login-icon {
		background: url(../../assets/password.png) no-repeat center;
	} */

	.loginbox .login-content .butbox {
		display: flex;
	}

	.loginbox .login-content .butbox .submit-but {
		flex: 1;
		line-height: 54px;
		color: #fff;
		text-align: center;
		background-color: #00DAD2;
		font-size: 16px;
		cursor: pointer;
		text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.34);
		/* margin-right: 11px; */
	}

	.loginbox .login-content .butbox .submit-cancel {
		flex: 1;
		line-height: 54px;
		color: #adadad;
		text-align: center;
		background-color: #fafafa;
		cursor: pointer;
	}

	.loginName {
        color: #CDFAFF;
		font-size: 30px;
		font-weight: bolder;
		width: 100%;
		text-align: center;
		line-height: 30px;
		padding-top: 60px;
	}

	.loginNameSub {
		font-size: 12px;
		width: 100%;
		margin-top: 10px;
		text-align: center;
		line-height: 24px;
		color: #fff;
	}
</style>

