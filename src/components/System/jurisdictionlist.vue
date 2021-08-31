<template>
  <div class="box">
    <div class="userlist">
        <template>
          <el-table
            :data="$store.state.jurisdictionArr"
            stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
			        type="index"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="权限名称">
            </el-table-column>
            <el-table-column
              label="操作"
              width="90">
              <template slot-scope="scope">
                <div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="editFun(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
                <div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="deleteUser(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
              </template>
            </el-table-column>
          </el-table>
        </template>
    </div>
    <div class="pagebox">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="$store.state.pageSize"
        layout="total,prev, pager, next, jumper"
        :total="$store.state.jurisdictionArr.length">
      </el-pagination>
    </div>
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
          <div class="block" style="max-height: 360px; overflow-y:auto">
            <el-tree
              ref="menuTree"
			  class="filter-tree-jurisdictionlist"
              :data="CurrentTree"
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
          <el-button type="danger"  @click="submitAddMenu">确定</el-button>
          <div class="popup-but popup-but-cancel" @click="dialogTableVisible_popu = !dialogTableVisible_popu">取 消</div>
        </div>
      </div>
    </el-dialog>
   <!-- 删除权限-->
	<el-dialog
      :visible.sync="dialogTableVisible_delete"
      :close-on-click-modal="false"
      width="21.9%">
      <div class="popup">
        <div class="title">删除权限</div>
        <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
        <div class="add-info-box">
          <p class="popop-tipinfo">确定删除该权限吗？</p>
        </div>
        <div class="popup-buts">
          <div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
          <div
            class="popup-but popup-but-cancel"
            @click="dialogTableVisible_delete= !dialogTableVisible_delete"
          >取消</div>
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
  name: 'JurisdictionList',
  components: {},
  data () {
    return {
        defaultProps: {
            children: 'children',
           label: 'label'
        },
        dialogTableVisible_popu: false,
         roletabletip: ['序号', '权限名称', '操作'],
        deleteJurisdiction: 'system/permission/delete',
        currentPage: 1,
        pageSize: 20,
        currentItem: {},
        checkedMenuIds: [],
        addPermissionUrl: 'system/permission/save',
        id: '',
        dialogTableVisible_delete: false,
	  /* 编辑按钮权限*/
	    getMenuUrl: 'resource/menu/treeAndAction',
	    dialogTableVisible_editbutton:false,
	    currentButtons:[],//编辑按钮权限时候的叶子节点的id=currentButtons.id
	    currentButtonsBak:[],//用作缓存 保存按钮权限的时候才真正改变选中状态
	    CurrentTree:[],
	    saveButtonUrl:'system/permission/saveResource',
	    menuIdOfeditButton:'',
		currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('jurisdictionManage'),
    }
  },
  methods: {
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
    editFun: function (index,item) {
		console.log('当前选中的编辑项：')
		console.log(item)
		this.checkedMenuIds = item.menuIds
		console.log('选中的节点ids：')
		console.log(this.checkedMenuIds)
		this.currentItem = {
			id: item.id,
			name: item.name,
			code: item.code
		}
		this.getNaviData()
		this.dialogTableVisible_popu = true
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
            $this.getNaviData()
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
    deleteUser: function (index,item) {
      this.dialogTableVisible_delete = true
      this.id = item.id
    },
    submitDelete () {
      var $this = this
	  let loading = CommonFun.openFullScreen($this)
      axiosHttp
        .delete(baseUrl.BASEURL + this.deleteJurisdiction, {
          data: { id: $this.id }
        })
        .then(function (res) {
			CommonFun.closeFullScreen(loading)
          if (res.data.status == 1) {
            // 判断当前页是不是最后一条数据，如果是且当前页大于1，则当前页减1刷新列表
            let page = $this.currentPage
            if(page > 1 && $this.listData.length === 1){
              $this.currentPage = page - 1
            }
            $this.getListPage()
            $this.$store.dispatch('getAllJurisdictionData')
            CommonFun.responseSuccess(res.data.message, $this)
            $this.dialogTableVisible_delete = false
          } else {
            CommonFun.responseError({message:'权限删除失败'}, $this)
          }
        })
        .catch(function (res) {
			CommonFun.closeFullScreen(loading)
		})
    },
    handleCurrentChange (val) {
      if (this.currentPage == val) {
        return
      }
      this.currentPage = val
      this.getListPage()
    },
	ifNall(data){
		if(!data || data.length == 0){
			return true
		}else{
			return false
		}
	},
	//编辑按钮 权限
	/* 获得menu树 */
	getNaviData() {
	  var $this = this
		let loading = CommonFun.openFullScreen($this)
	  axiosHttp.post(baseUrl.BASEURL + $this.getMenuUrl,{permissionId:$this.currentItem.id})
	    .then(function (response) {
			CommonFun.closeFullScreen(loading)
	        var data = response.data
	        if (data.status === 1) {
				$this.CurrentTree = data.data
	        } else {
				$this.$message.error(data.message)
	        }
		}).catch(function(error){
			CommonFun.closeFullScreen(loading)
		})
	},
	editbutton(node , data){
		console.log('data:')
		console.log(data)
		let $this = this
		if($this.checkedMenuIds.indexOf(data.id) == -1){
			CommonFun.responseError({message:'没被选中的菜单禁止编辑按钮权限！'},$this)
			return;
		}else{
			$this.currentButtons = JSON.parse(JSON.stringify(data.buttons))
			$this.currentButtonsBak = JSON.parse(JSON.stringify(data.buttons))//用作中间缓存
			$this.menuIdOfeditButton = data.id
			$this.dialogTableVisible_editbutton = !$this.dialogTableVisible_editbutton
		}
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
			permissionId: $this.currentItem.id
		}
		axiosHttp
		  .post(baseUrl.BASEURL + $this.saveButtonUrl, param)
		  .then(function (res) {
			  CommonFun.closeFullScreen(loading)
		    if (res.data.status == 1) {
		      $this.getNaviData()
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
	renderContentButton(h, { node, data, store }) {
		let len = 0
		let editname = ''
		if(!this.ifNall(data.buttons)){
			if(this.checkedMenuIds.indexOf(data.id) > -1){
				editname = '编辑'
			}
			let names = ''
			for(let i=0;i<data.buttons.length;i++){
				if(data.buttons[i].onSelect){
					names += data.buttons[i].buttonName
					names += ' , '
				}
			}
			names = names.slice(0,names.length-3)
			return (
				<div class='custom-tree-node custom-tree-node-manager'>
					<span style='margin-right:40px'>{ node.label }</span>
					<span style='margin-right:40px'>{ names }</span>
					<span>
            <i class="el-icon-edit-outline" on-click={ () => this.editbutton(node,data) }></i>
					</span>
				</div>
			)
		}else{
			return (
				<div class="custom-tree-node custom-tree-node-manager">
					<span style="margin-right:40px">{ node.label }</span>
				</div>
			)
		}
	},
  },
  created: function () {
    this.getListPage()

  }
}
</script>
<style scoped lang="scss">
.popup {
	padding: 0px 20px;
}
.totalNum{
  display: flex;
  align-items: flex-end;
}
.totalNum p {
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  color: #333;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.uesrtabletop {
  height: 50px;
  display: flex;
  width: auto;
}
.uesrtabletop .tip {
  font-size: 14px;
  font-weight: bolder;
}
.userlist {
  width: 100%;
}
.userlist {
  background-color: #fff;
  display: inline-grid;
  width:100%;
}
.userinfo {
  display: flex;
}
.userinfo div {
  text-align: center;
  font-size: 13px;
  color: #666;
}
.editbox .deal-but {
  color: #fff;
  width: 44px;
}
.tip,
.userinfo {
  flex: 1;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #f5f5f5;
  padding: 5px 0px;
}
.userinfo .list-div {
  flex: 1;
  text-align: center;
  line-height: 40px;
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
.but-add {
  width: 74px;
  height: 34px;
  line-height: 34px;
  color: #fff;
  background-color: #c7000b;
  text-align: center;
  font-size: 14px;
  font-weight: bolder;
  cursor: pointer;
}
.el-dialog>>>.el-dialog__body{padding:20px 0px 0px 0px!important;}
.custom-tree-container{padding:0px 12px;}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.button-div {display: inline-block;padding-left: 20px;height: 40px;cursor: pointer; line-height: 40px;margin-left: 25px;background: url(../../assets/btn-off.jpg) 0 center no-repeat;background-size: 14px;}
.buttonOnselect{background: url(../../assets/btnActive.jpg) 0 center no-repeat;background-size: 14px;color: #409eff;}


</style>
