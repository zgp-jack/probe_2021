<template>
  <div class="box">
    <div class="but-add popup-but-submit" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增</div>
    <!-- 编辑权限（菜单） -->
        <el-dialog
          :visible.sync="dialogTableVisible_popu"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          v-if="dialogTableVisible_popu"
          center
          width="640px">
          <div class="popup">
            <div class="title">编辑权限</div>
            <div class="hidepopup" @click="dialogTableVisible_popu=!dialogTableVisible_popu">×</div>
    
            <div class="addmenu-item addmenu-icon">
              <span class="addmenu-tip">名称:</span>
              <el-input placeholder="请输入名称" type="text" v-model="currentItem.name" maxlength="20" />
            </div>
    				<!-- 编辑权限(菜单) 弹出框 -->
            <div class="custom-tree-container">
              <div class="block add-info-box" style="max-height: 360px;overflow-y:auto">
                <el-tree
                  ref="menuTree"
									class="filter-tree"
                  :data="$store.state.naviArr"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :check-strictly="true"
                  :default-checked-keys="checkedMenuIds"
                  :expand-on-click-node="false"
                  @check="checkNode"
                  :render-content="renderContentButton"
                ></el-tree>
              </div>
            </div>
    
            <div class="popup-buts">
              <el-button type="danger" @click="submitAddMenu">确定</el-button>
              <div class="popup-but popup-but-cancel" @click="dialogTableVisible_popu = !dialogTableVisible_popu">取 消</div>
            </div>
          </div>
        </el-dialog>
    	<!-- 编辑按钮权限 弹出框 -->
    	<el-dialog
    	  :visible.sync="dialogTableVisible_editbutton"
    	  :close-on-click-modal="false"
    	  width="21.9%">
    	  <div class="popup">
    	    <div class="title">编辑按钮权限</div>
    	    <div class="hidepopup" @click="cancelEditButton">×</div>
    		<div class="buttons">
    			<div
    			v-for='(item,index) in currentButtons'
    			:key="index"
    			@click=changeButton(item,index)
    			:class="['button-div',{'buttonOnselect':item.onSelect}]">
    				{{ item.buttonName }}
    			</div>
    		</div>
    	    <div class="popup-buts">
    	      <div class="popup-but popup-but-submit" @click="submitEditButton">确定</div>
    	      <div
    	        class="popup-but popup-but-cancel"
    	        @click="cancelEditButton"
    	      >取消</div>
    	    </div>
    	  </div>
    	</el-dialog>
       </div>
</template>

<script>
import axiosHttp from '../../js/axiosHttp.js'
import baseUrl from '../../js/baseUrl.js'
import CommonFun from '../../js/commonFun.js'
export default {
  name: 'Jurisdiction',
  components: {},
  data () {
    return {
        dialogTableVisible: false,
        dialogTableVisible_popu: false,
        buttonsOfItem: [], // 选中的节点的buttons
        tempMenuId: '', // 选中节点的menuid
        tempJurisdictionArr: [], // 当前选中节点的权限
		checkedMenuIds: [],
        code: '',
        name: '',
        addPermissionUrl: 'system/permission/save',
		currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('jurisdictionManage'),
		defaultProps: {
		       children: 'children',
		        label: 'label'
		  },
		  currentItem: {},
		  addPermissionUrl: 'system/permission/save',
		  id: '',
		/* 编辑按钮权限*/
		  dialogTableVisible_editbutton:false,
		  currentButtons:[],//编辑按钮权限时候的叶子节点的id=currentButtons.id
		  currentButtonsBak:[],//用作缓存 保存按钮权限的时候才真正改变选中状态
		  saveButtonUrl:'system/permission/saveResource',
		  menuIdOfeditButton:'',
		  currentPage: 1,
    }
  },
  methods: {
	  addFun: function () {
	  	this.checkedMenuIds = []
	  	this.currentItem = {
	  		name: ''
	  	}
	  	//this.getNaviData()
	  	this.dialogTableVisible_popu = true
	  },
	  checkNode: function (currentObj, treeStatus) {
	    // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
	    let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
	    // 选中
	    if (selected !== -1) {
	      // 子节点只要被选中父节点就被选中
	      this.selectedParent(currentObj)
	      // 统一处理子节点为相同的勾选状态
	      this.uniteChildSame(currentObj, true)
	    } else {
	      // 未选中 处理子节点全部未选中和父节点选中状态
	      this.uniteChildSame(currentObj, false)
	      this.uniteParent(currentObj)
	    }
	  },
	  // 统一处理子节点为相同的勾选状态
	  uniteChildSame: function (treeList, isSelected) {
	    this.$refs.menuTree.setChecked(treeList.id, isSelected, false)
	    if (treeList.children && treeList.children.length !== 0) {
	      for (let i = 0; i < treeList.children.length; i++) {
	        this.uniteChildSame(treeList.children[i], isSelected)
	      }
	    }
	  },
	  // 统一处理父节点为选中
	  selectedParent: function (currentObj) {
	    let currentNode = this.$refs.menuTree.getNode(currentObj.id)
	    if (currentNode !== null && currentNode.parent.key !== undefined) {
	      this.$refs.menuTree.setChecked(currentNode.parent, true, false)
	      this.selectedParent(currentNode.parent)
	    }
	  },
	  // 统一处理当节点兄弟全部都未选中时，设置当前节点父节点为未选中
	  uniteParent: function (currentObj) {
	    // 当前未选中节点
	    let currentNode = this.$refs.menuTree.getNode(currentObj.id)
	    if (currentNode !== null && currentNode.parent.key !== undefined) {
	      // 当前节点父节点
	      let parent = currentNode.parent
	      // 当前节点兄弟节点
	      let brothers = parent.childNodes
	      // 是否设置父节点未选中
	      let isParentSelected = false
	      if (brothers && brothers.length > 0) {
	        for (let index = 0; index < brothers.length; index++) {
	          const element = brothers[index]
	          if (element.checked === true) {
	            isParentSelected = true
	          }
	        }
	      }
	      this.$refs.menuTree.setChecked(parent, isParentSelected, false)
	    }
	  },
	  submitAddMenu () {
	    // 提交
	    var $this = this
			let loading = CommonFun.openFullScreen($this)
	    var selectNode = this.$refs.menuTree.getCheckedNodes(false, true)
	    var nodeLen = selectNode.length
	    // var tempJurisdictionArr_len = this.tempJurisdictionArr.length;
	    if ($this.currentItem.name == '' || nodeLen == 0) {
			CommonFun.closeFullScreen(loading)
	      $this.$message.error('名称是必填项,菜单至少选择一项')
	      return false
	    }
	  
	    var menuIds = []
	    for (var i = 0; i < nodeLen; i++) {
	      // var actionIds = [];
	      var item = selectNode[i]
	      var id = item.id // menuid
	      menuIds.push(id)
	    }
	    var param = {
	      permission: $this.currentItem,
	      menuIds: menuIds
	    }
	    axiosHttp
	      .post(baseUrl.BASEURL + $this.addPermissionUrl, param)
	      .then(function (res) {
			  CommonFun.closeFullScreen(loading)
	        if (res.data.status == 1) {
	          $this.$store.dispatch('getNaviData')
	          $this.$store.dispatch('getAllJurisdictionData')
	          $this.getListPage()
	          $this.$message({
	            message: '权限添加成功！',
	            type: 'success'
	          })
	          $this.currentItem = {}
	          $this.dialogTableVisible_popu = false
	        }
	      })
	      .catch(function (res) {
			  CommonFun.closeFullScreen(loading)
	        $this.$message.error(res.message)
	      })
	  },
	  getListPage: function () {
	    let $this = this
	    $this.$store.dispatch('getJurisdictionData', {
	      page: $this.currentPage,
	      pageSize: $this.$store.state.pageSize
	    })
	  },
	  ifNall(data){
	  	if(!data || data.length == 0){
	  		return true
	  	}else{
	  		return false
	  	}
	  },
	  //编辑按钮 权限
	editbutton(node , data){
		console.log('data:')
		console.log(data)
	  	let $this = this
	  	$this.currentButtons = JSON.parse(JSON.stringify(data.buttons))
	  	$this.currentButtonsBak = JSON.parse(JSON.stringify(data.buttons))//用作中间缓存
	  	$this.menuIdOfeditButton = data.id
	  	$this.dialogTableVisible_editbutton = !$this.dialogTableVisible_editbutton
	},
	submitEditButton(){
	  	let $this = this
		let loading = CommonFun.openFullScreen($this)
	  	let actionIds = ''
	  	for(let i=0;i<$this.currentButtons.length;i++){
	  		if($this.currentButtons[i].onSelect){
	  				actionIds+=$this.currentButtons[i].buttonId
	  				actionIds+= ','
	  		}
	  	}
	  	actionIds = actionIds.slice(0,actionIds.length-1)
	  	let param = {
	  		buttonIds: actionIds,
	  		menuId: $this.menuIdOfeditButton,
	  		//permissionId: $this.currentItem.id
	  	}
	  	axiosHttp
	  	  .post(baseUrl.BASEURL + $this.saveButtonUrl, param)
	  	  .then(function (res) {
			  CommonFun.closeFullScreen(loading)
	  	    if (res.data.status == 1) {
	  	      //$this.getNaviData()
	  	      $this.dialogTableVisible_editbutton = !$this.dialogTableVisible_editbutton
	  	    }
	  	  })
	  	  .catch(function (res) {
			  CommonFun.closeFullScreen(loading)
	  	    $this.$message.error(res.message)
	  	  })
	  
	},
	    cancelEditButton(){
	      	let $this = this
	     	$this.currentButtons = JSON.parse(JSON.stringify($this.currentButtonsBak))
	     	$this.dialogTableVisible_editbutton = !$this.dialogTableVisible_editbutton
	    },
	    changeButton(item,index,data){
	      	let $this = this
	      	$this.currentButtons[index].onSelect = !$this.currentButtons[index].onSelect
	    },
	  // 按钮权限
	  /* <el-button type="text" on-click={ () => this.editbutton(node,data) }>编辑</el-button> 不需要编辑按钮*/
	  renderContentButton(h, { node, data, store }) {
		return (
			<div class='custom-tree-node'>
				<span style='margin-right:40px'>{ node.label }</span>
				<span>
				  
				</span>
			</div>
		)
	  	
	  },
  },
  created: function () {
    this.$store.dispatch('getNaviData')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup {
	padding: 30px 40px;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.addmenu-item {
  margin-top: 15px;
  margin-bottom: 20px;
}
.addmenu-tip {
  color: #fff;
  line-height: 35px;
  margin-right: 5px;
  text-align: right;
  display: inline-block;
}
.addmenu-item input {
  display: inline-block;
  width: 500px;
  border: 1px solid #ddd;
  padding-left: 10px;
  line-height: 35px;
}
.buts {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
.buts div {
  line-height: 40px;
  padding: 0 30px;
  margin-right: 10px;
  cursor: pointer;
}
.buts .submit-but-selectParent {
  background-color: #58a7ea;
  color: #fff;
}
.buts .cancel-but-selectParent {
  background-color: #fafafa;
  color: #adadad;
}
.submit-but {
  width: 300px;
  height: 40px;
  background-color: #58a7ea;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 40px;
  margin-top: 20px;
}
.butbox {
  padding: 20px;
  border: 1px solid #dedede;
  max-width: 500px;
  overflow: hidden;
}
.butShow {
  float: left;
  padding: 10px 20px;
  background-color: #ddd;
  color: #fff;
  width: 100px;
  text-align: center;
  margin: 7px;
  cursor: pointer;
}
.onselectbuts {
  background-color: #ffac5b;
}
.but-add {
  height: 30px;
  padding:0px 10px;
  line-height: 30px;
  color: #fff;
  background-color: #ffbc5d;
  text-align: center;
  font-size: 12px;
  font-weight: lighter;
  cursor: pointer;
  border-radius:2px;
}
.but-add i{margin-right:5px;}
.custom-tree-container {
  padding: 0px 12px;
}

</style>
