<template>
    <div class="boxStyle">
	<div class="outerbox">
		<div class="top">
			<addMenu :dataList='$store.state.companyTreeAllArr' addtype='addCrew' />
			<div class="gap"></div>
		</div>
		<EditMenu  :dataList='$store.state.companyTreeAllArr' edittype='editCrew' />
	</div>
    </div>
</template>

<script>
	import addMenu from '../components/System/addMenu.vue'
	import deleteMenu from '../components/System/deleteMenu.vue'
	import EditMenu from '../components/System/editMenu.vue'
	import baseUrl from '../js/baseUrl.js'
	import axiosHttp from '../js/axiosHttp.js'
	import CommonFun from '../js/commonFun.js'
	export default {
		name: 'crewManageNew',
		components:{
			addMenu,
			deleteMenu,
			EditMenu,
		},
		data(){
			return{

			}
		},
		methods:{

		},
		created: function() {
			let $this = this
			let loading = CommonFun.openFullScreen($this)
			$this.$store.dispatch("getCompanyTreeArrAllData").then((res,reeor) => {
				sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后 进入页面都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
				CommonFun.closeFullScreen(loading)
			})
		}
	}
</script>

<style scoped lang="scss">
	.outerbox{width: 100%;height: 100%; background-color: #fff;padding:15px;}
	.top{display: flex;margin-bottom: 0px;}
	.gap{width: 4px;}
</style>
