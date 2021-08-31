<template>
<div class="boxStyle">
	<div class="outerbox">
		<div class="top">
			<addMenu :dataList='$store.state.naviArr' addtype='addMenu'/>  
			<div class="gap"></div>
			<deleteMenu :dataList='$store.state.naviArr' deletetype='deleteMenu'/>
		</div>
		<EditMenu :dataList='$store.state.naviArr' edittype='editMenu' />
	</div>
</div>
</template>

<script>
	import addMenu from './System/addMenu.vue'
	import deleteMenu from './System/deleteMenu.vue'
	import EditMenu from './System/editMenu.vue'
	export default {
		name: 'menumanage',
		components:{
			addMenu,
			deleteMenu,
			EditMenu,
		},
		data(){
			return{
			}
		},
		created: function() {
			this.$store.dispatch("getNaviData")
		}
	}
</script>

<style scoped lang="scss">
	.outerbox{width: 100%;min-height: 100%; background-color: #fff;padding: 15px;}
	.top{display: flex;margin-bottom: 0px;}
	.gap{width: 4px;}
</style>
