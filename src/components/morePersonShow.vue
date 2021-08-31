<template>
<!-- 搜索 开始 -->
	<div class="more-show-outbox">
		<div class="more-show-topbox">
			<div class="more-show-topbox-left flex1">
				<div class="show-more-title">部门列表</div>
				<div class="topbox-content">
					<el-tree
					  :data="dataTree"
					  :check-strictly='true'
					  @node-click="handleNodeClick"
					  @check="handleNodeSelect"
					  show-checkbox
					  :expand-on-click-node="false"
					  default-expand-all
					  node-key="id"
					  ref="tree"
					  highlight-current
					  :props="defaultProps"
					  :default-checked-keys="checkedMenuIds">
					</el-tree>
				</div>
			</div>
			<div class="more-show-topbox-right flex1">
				<div class="show-more-title">部门成员</div>
				<div class="topbox-content">
					<div class='userbox' v-for="(item,index) in deparUserArr">
						<div :class="['checkbox-user',{'checkbox-user-selected':selectUserIdArr.indexOf(item.id)>-1}]" @click="selectUser(item)"></div>
						<div class="user-name">{{ item.realName }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="more-show-bottombox flex1">
			<div class="show-more-title">已选择</div>
			<div class="bottombox-content">
				<div class='selecteduserbox' v-for="(item,index) in selectDepartAndUserArr">
					<div class="selected-users-name">{{ item.name }}</div>
					<div class="delete-users" @click="selectSelectDepartAndUser(item)"></div>
				</div>
			</div>
		</div>
		<div class="popup-buts popup-buts-full">
		  <el-button type="danger" @click='submit'>确定</el-button>
		  <div class="popup-but popup-but-cancel" @click="cancel">取消</div>
		</div>
	</div>
<!--搜索 结束  -->
</template>

<script>
import baseUrl from '../js/baseUrl.js'
import axiosHttp from '../js/axiosHttp.js'
import CommonFun from '../js/commonFun.js'
export default {
  name: 'morePersonShow',
  data () {
    return {
		getTreeDataUrl:'postCompany/tree',
		getUserDataUrl:'postStaff/list',
		dataTree:[],//tree
		defaultProps: {
		  children: 'children',
		  label: 'label'
		},
		deparUserArr:[],//选中部门对应的部门成员 arr
		selectDepartAndUserArr:[],//被选中的部门和人 arr
		checkedMenuIds:[],//默认选中的树节点
		selectUserIdArr:[],//选中的人的id arr
    }
  },
  props: ['initSelectedIdArr','initSelectedNameArr'],
  methods: {
	  /* 获得 tree*/
	  getTreeData(){
		  let $this = this
		  let loading = CommonFun.openFullScreen($this)
		  return axiosHttp
		  .post(baseUrl.BASEURL + $this.getTreeDataUrl, {})
		  .then(function (res) {
		  	CommonFun.closeFullScreen(loading)
		  	console.log('tree列表::')
		  	console.log(res)
		    if (res.data.status === 1) {
		      $this.dataTree = res.data.data
		    }
		    if (res.data.status === 0) {
		      CommonFun.responseError(res.data, $this)
		    }
		  }).catch(function(err){
		  	CommonFun.closeFullScreen(loading)
		  })
	  },
	handleNodeClick(data){
		console.log('节点被点击')
		console.log(data)
		let $this = this
		let loading = CommonFun.openFullScreen($this)
		return axiosHttp
		.post(baseUrl.BASEURL + $this.getUserDataUrl, {companyId:data.id})
		.then(function (res) {
			CommonFun.closeFullScreen(loading)
			console.log('部门对应下成员::')
			console.log(res)
		  if (res.data.status === 1) {
			  $this.deparUserArr = res.data.data
		  }
		  if (res.data.status === 0) {
		    CommonFun.responseError(res.data, $this)
		  }
		}).catch(function(err){
			CommonFun.closeFullScreen(loading)
		})
	},
	handleNodeSelect(currentObj, treeStatus){
		let $this = this
		  let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
		  if (selected !== -1) {// 选中
			  let obj = {}
			  obj.name = currentObj.label
			  obj.uniqueID = currentObj.id+'_'+'1'
			  obj.type = 1
			  obj.companyStaffId = currentObj.id
			  $this.selectDepartAndUserArr.push(obj)
			  $this.checkedMenuIds.push(currentObj.id)
		  } else {// 未选中
			  let uniqueID = currentObj.id+'_'+'1'
			  $this.cancelSelectDepartAndUser(uniqueID)
		  }
	},
	selectUser(data){
		let $this = this
		let uniqueID = data.id+'_'+'2'
		if($this.selectUserIdArr.indexOf(data.id)>-1){
			for(let i=0;i<$this.selectDepartAndUserArr.length;i++){//取消选择
				if(uniqueID == $this.selectDepartAndUserArr[i].uniqueID){
					$this.selectDepartAndUserArr.splice(i,1)
					$this.selectUserIdArr.splice($this.selectUserIdArr.indexOf(data.id),1)
				}
			}
		}else{
			$this.selectUserIdArr.push(data.id)
			let obj = {}
			obj.name = data.realName
			obj.uniqueID = uniqueID
			obj.type = 2
			obj.companyStaffId = data.id
			$this.selectDepartAndUserArr.push(obj)
		}
	},
	//（从selectDepartAndUserArr中）弹出uniqueID为id的部门或者人
	cancelSelectDepartAndUser(id){
		let $this = this
		for(let i=0;i<$this.selectDepartAndUserArr.length;i++){
			if($this.selectDepartAndUserArr[i].uniqueID == id){
				$this.selectDepartAndUserArr.splice(i,1)
			}
		}
	},
	//可见成员中删除部门或者人
	selectSelectDepartAndUser(data){
		let $this = this
		$this.cancelSelectDepartAndUser(data.uniqueID)
		let currentDeleteId =  data.companyStaffId
		if(data.type == 1){//部门
			for(let i=0;i<$this.checkedMenuIds.length;i++){
				if($this.checkedMenuIds[i] == currentDeleteId)
				$this.checkedMenuIds.splice(i,1)
			}
			if($this.$refs.tree){
				$this.$refs.tree.setCheckedKeys($this.checkedMenuIds)
			}
		}else{//人
			let index = $this.selectUserIdArr.indexOf(data.companyStaffId)
			$this.selectUserIdArr.splice(index,1)
		}
	},
	submit(){
		let $this = this
		$this.$emit('setTrainCourseRangeList',$this.selectDepartAndUserArr)
		$this.$emit('setDialogTableVisibleMorePersonShow',false)
	},
	cancel(){
		this.$emit('setDialogTableVisibleMorePersonShow',false)
	},
  },
  created:function(){
  	let $this = this
	//this.selectDepartAndUserArr = this.initSelectedNameArr
	
	this.getTreeData()
  },
  mounted(){
	  let $this = this
	  if(!CommonFun.ifNall($this.initSelectedNameArr)){
	  		  $this.selectDepartAndUserArr = $this.initSelectedNameArr
	  }
	  if(!CommonFun.ifNall($this.initSelectedIdArr)){
	  	//	  $this.selectDepartAndUserArr = $this.initSelectedNameArr
	  }
	  
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.more-show-outbox{}
.more-show-topbox{display: flex;}
.topbox-content{border: 1px solid #ddd;padding: 10px;height: 300px;overflow-y:auto;}
.more-show-topbox-left{margin-right: 10px;}
.show-more-title{font-size: 14px;margin-bottom: 5px;font-weight: bold;}
.userbox{margin-top: 3px;display: flex;height: 23px;}
.checkbox-user{width: 14px;height: 14px;margin-top: 4px; margin-right: 5px;cursor: pointer;background: url(../assets/btn-off.jpg) no-repeat;}
.checkbox-user-selected{background: url(../assets/btnActive.jpg) no-repeat;;}
.user-name{line-height: 23px;}
.bottombox-content{display: flex;border: 1px solid #ddd;padding: 10px;flex-wrap: wrap}
.selecteduserbox{display: flex; margin-right: 5px;background-color: #ddd;padding: 4px 8px;border-radius: 2px;height: 30px;margin-bottom: 5px;}
.selected-users-name{line-height: 22px;height:22px; font-size: 12px;margin-right: 10px;}
.delete-users{cursor: pointer;width: 16px;height: 16px;margin-top: 3px;background: url(../assets/delete-img-icon.png) no-repeat;}
.popup-buts-full{margin-top:20px;margin-bottom:-16px;width: calc(100% + 44px);margin-left:-22px;}
</style>
