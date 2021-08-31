<template>
<!-- 搜索 开始 -->
	<div class="more-show-outbox">
		<div class="more-show-topbox" v-if="type == 'single'">
			<div class="more-show-topbox-left flex1">
				<div class="topbox-content">
					<el-tree
					  :data="$store.state.companyTree"
					  :check-strictly='true'
					  @check="handleNodeSelectSingle"
					  show-checkbox
					  :expand-on-click-node="false"
					  default-expand-all
					  node-key="id"
					  ref="tree"
					  highlight-current
					  :props="defaultProps"
					  :default-checked-keys="currentCheckedMenuId">
					</el-tree>
				</div>
			</div>
		</div>
		<div class="more-show-topbox" v-if="type == 'multiple'">
			<div class="more-show-topbox-left flex1">
				<!-- @check="handleNodeSelectMultiple" -->
				<div class="topbox-content">
					<el-tree
					  :data="$store.state.companyTree"
					  :check-strictly='checkStrictly'
					  show-checkbox
					  :expand-on-click-node="false"
					  default-expand-all
					  node-key="id"
					  ref="tree2"
					  highlight-current
					  :props="defaultProps"
					  :default-checked-keys="currentCheckedMenuIds">
					</el-tree>
				</div>
			</div>
		</div>
		<div class="popup-buts popup-buts-full">
			<div class="popup-but popup-but-submit" @click="submit">确定</div>
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
  name: 'selectCompanyComponent',
  data () {
    return {
		defaultProps: {
		  children: 'children',
		  label: 'label'
		},
		currentCheckedMenuId:[],
		currentCheckedMenuName:'',
		currentCheckedMenuIds:[],
		currentCheckedMenuNames:[],
    }
  },
  props: ['type','checkedMenuId','checkedMenuName','checkedMenuIds','checkedMenuNames','checkStrictly'],
  methods: {
	handleNodeSelectSingle(currentObj, treeStatus){
		  let $this = this
		  let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
		  if (selected !== -1) {// 选中
			 if($this.currentCheckedMenuId.length>0){
				 $this.currentCheckedMenuId = []
			 }
			 $this.currentCheckedMenuId.push(currentObj.id)
			 $this.currentCheckedMenuName = currentObj.label
		  } else {// 未选中
			  $this.currentCheckedMenuId = []
			  $this.currentCheckedMenuName = ''
		  }
		  if($this.$refs.tree){
		  	$this.$refs.tree.setCheckedKeys($this.currentCheckedMenuId)
		  }
	},
	handleNodeSelectMultiple(currentObj, treeStatus){
		  let $this = this
		  let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
		  if (selected !== -1) {// 选中
			 $this.currentCheckedMenuIds.push(currentObj.id)
			 $this.currentCheckedMenuNames.push(currentObj.label)
		  } else {// 未选中
			let index = $this.currentCheckedMenuIds.indexOf(currentObj.id)
			$this.currentCheckedMenuIds.splice(index,1)
			$this.currentCheckedMenuNames.splice(index,1)
		  }
		  if($this.$refs.tree2){
		  	$this.$refs.tree2.setCheckedKeys($this.currentCheckedMenuIds)
		  }
	},
	submit(){
		let $this = this
		if($this.type == 'single'){
			$this.$emit('setSearchCompanyId',$this.currentCheckedMenuId[0])
			$this.$emit('setSearchCompanyName',$this.currentCheckedMenuName)
		}else{
			let res = this.$refs.tree2.getCheckedNodes()
			let arr = [];let arr1 = [];
			res.forEach((item) => {
			    arr.push(item.id)
				arr1.push(item.label)
			})
			$this.currentCheckedMenuIds = arr
			$this.currentCheckedMenuNames = arr1
			$this.$emit('setSearchCompanyIds',$this.currentCheckedMenuIds)
			$this.$emit('setSearchCompanyNames',$this.currentCheckedMenuNames)
		}
		$this.$emit('closeSelectcompany')
	},
	cancel(){
		this.$emit('closeSelectcompany')
	},
  },
  created:function(){
	 let $this = this
	 if($this.type == 'single'){
		 $this.currentCheckedMenuId = []
		 $this.currentCheckedMenuId.push($this.checkedMenuId)
		 $this.currentCheckedMenuName = $this.checkedMenuName
	 }else{
		 $this.currentCheckedMenuIds = $this.checkedMenuIds
		 $this.currentCheckedMenuNames = $this.checkedMenuNames
	 }
  },
  mounted(){
	
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.more-show-outbox{}
.more-show-topbox{display: flex;}
.topbox-content{padding: 10px;height: 400px;overflow-y:auto;}
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
.popup-buts-full{margin-top:20px;margin-bottom:-16px;}
</style>
