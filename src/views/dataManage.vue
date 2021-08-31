<template>
<div class="boxStyle">
  <div class="outerbox-pro">
    <div class="content-outerbox">
      <div class="left-tree">
        <el-scrollbar>
        <el-tree
				class="filter-tree"
          :data="$store.state.companyTreeAllArr"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="selectNode"
          :highlight-current="true"
          :render-content="renderContent"
        ></el-tree>
        </el-scrollbar>
      </div>
    </div>
    <!-- 弹出框   edit-->
    <el-dialog
      :visible.sync="dialogTableVisible_addAndedit"
      :close-on-click-modal="false"
      width="25%"
    >
      <div class="popup">
        <div class="title">配置权限</div>
        <div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
        <div class="add-info-box" style="max-height: 360px; overflow-y: auto">
          <el-tree
					class="filter-tree"
            show-checkbox
            :data="treeForEdit"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false" 
            :default-checked-keys='checkedArr'
            ref='treeedit'
			:render-content="renderContentEditAndShow"
          ></el-tree>
        </div>
		<div class="add-item-div">
			<div class="add-item-title">上级管理单位ID</div>
			<el-input class="flex1" type="text" v-model="superiorCompanyId" maxlength="50" />
		</div>
        <div class="popup-buts">
          <el-button type="danger"  @click="addAndEditSubmit">确定</el-button>
          <!-- <div class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</div> -->
          <div class="popup-but popup-but-cancel"  @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出框  查看-->
    <el-dialog
      :visible.sync="dialogTableVisible_show"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="popup">
        <div class="title">配置权限</div>
        <div class="hidepopup" @click="dialogTableVisible_show=!dialogTableVisible_show">×</div>
        <div class="add-info-box" style="max-height: 360px; overflow-y: auto">
          <el-tree
            show-checkbox
            :data="treeForShow"
            node-key="id"
						class="filter-tree"
            default-expand-all
            :expand-on-click-node="false"
            :default-checked-keys='checkedArr'
            ref='treeshow'
          ></el-tree>
        </div>
		<div class="add-item-div">
			<div class="add-item-title">上级管理单位ID</div>
			<el-input class="flex1" type="text" v-model="superiorCompanyId" maxlength="50" />
		</div>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import Search from '../components/search.vue'
import baseUrl from '../js/baseUrl.js'
import axiosHttp from '../js/axiosHttp.js'
import CommonFun from '../js/commonFun.js'
export default {
  name: 'dataManage',
  components: {
    Search
  },
  data () {
    return {
      dialogTableVisible_addAndedit: false,
      dialogTableVisible_show:false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentItem:{},
      saveUrl:'postCompanyCrew/saveList',
      currentCrewId:'',//当前编辑的叶子节点的id
	  superiorCompanyId:null,//上级管理单位ID
      checkedArr:[],//默认选中节点
      treeForShow:[],
      treeForEdit:[],
	  currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('dataManage'),
    }
  },
  methods: {
    //选中树节点
    selectNode: function (data, node, e) {
      var $this = this
    },
    edit(node, data){
      let $this = this
      $this.currentCrewId = data.id
	  $this.superiorCompanyId = data.superiorCompanyId
      $this.treeForEdit = JSON.parse(JSON.stringify($this.$store.state.companyTreeAllArr))
	  console.log('-------')
	  console.log($this.treeForEdit)
      let leafIds = CommonFun.getAllLeaf($this.treeForEdit)//获得所有叶子节点id 
      $this.checkedArr = leafIds.filter(it => data.crewIds.indexOf(it) > -1)
      $this.dialogTableVisible_addAndedit = !$this.dialogTableVisible_addAndedit
    },
    show(node, data){
      let $this = this
      $this.superiorCompanyId = data.superiorCompanyId
      //获得新内存地址的引用 不然会改变原始树
      let treeData = JSON.stringify($this.$store.state.companyTreeAllArr)
      $this.treeForShow = JSON.parse(treeData)

      //查看的时候树不可点击选择 设置disabled
      for(let i=0;i<$this.treeForShow.length;i++){
        $this.setTreeDisabled($this.treeForShow[i])
      }

      $this.checkedArr = data.crewIds
      $this.dialogTableVisible_show = !$this.dialogTableVisible_show
    },
    setTreeDisabled(data){
      //if data null
      data.disabled = true
      if(CommonFun.ifNall(data.children)){
        return
      }

      for(let i=0;i<data.children.length;i++){
        this.setTreeDisabled(data.children[i])
      }
    },
    addAndEditSubmit(){
      let $this = this
      let nodes = $this.$refs.treeedit.getCheckedNodes(false,true)
      let len = nodes.length
      let ids = []
      for(let i=0;i<len;i++){
        let item = nodes[i]
        ids.push(item.id)
      }
      console.log(ids)
	  
	  let params = {companyId:$this.currentCrewId, crewIdList:ids, superiorCompanyId:$this.superiorCompanyId}
	  
	  let loading = CommonFun.openFullScreen($this)
      axiosHttp
        .post(baseUrl.BASEURL + $this.saveUrl, params)
        .then(function (res) {
			CommonFun.closeFullScreen(loading)
          console.log('res:::')
          console.log(res)
          $this.dialogTableVisible_addAndedit = !$this.dialogTableVisible_addAndedit
          $this.$store.dispatch("getCompanyTreeArrAllData");
          if (res.data.status === 1) {
            CommonFun.responseSuccess(res.data.message, $this)
          }
          if (res.data.status === 0) {
            CommonFun.responseError(res.data, $this)
          }
        })
        .catch(function (error) {
			CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible_addAndedit = !$this.dialogTableVisible_addAndedit
          $this.$store.dispatch("getCompanyTreeArrAllData");
        })
    },
	renderContentEditAndShow(h, { node, data, store }){
		return (
		  <span class="custom-tree-node">
		    <span>{data.label}</span>
			<span> ---- </span>
			<span>{data.id}</span>
		 </span>	
		)
	},
    renderContent(h, { node, data, store }) {
		/* 1 1 */
		console.log(node)
      if(this.currentButtonJurisdiction.indexOf('config')>-1 && this.currentButtonJurisdiction.indexOf('view')>-1){
        return (
          <span class="custom-tree-node custom-tree-node-manager">
            <span>{node.label}</span>
            <span>
            <span class="custom-tree-node-right-icon">
                <i class="el-icon-edit-outline" on-click={() => this.edit(node, data)}></i>
            </span>
            <span class="custom-tree-node-right-icon">
                <i class="el-icon-view" on-click={() => this.show(node, data)}></i>
            </span>
            </span>
          </span>
        );
      }
	  /* 1 0*/
	  if(this.currentButtonJurisdiction.indexOf('config')>-1 && this.currentButtonJurisdiction.indexOf('view')==-1){
	    return (
	      <span class="custom-tree-node">
	        <span>{node.label}</span>
	        <span>
	          <el-button
	            size="mini"
	            type="text"
	            on-click={() => this.edit(node, data)}
	          >
	            配置权限
	          </el-button>
	        </span>

	      </span>
	    );
	  }
	  /* 0 1*/
	  if(this.currentButtonJurisdiction.indexOf('config')==-1 && this.currentButtonJurisdiction.indexOf('view')>-1){
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.show(node, data)}
              >
                查看
              </el-button>
            </span>

          </span>
        );
      }
	  /* 0 0*/
	  if(this.currentButtonJurisdiction.indexOf('config')==-1 && this.currentButtonJurisdiction.indexOf('view')==-1){
	    return (
	      <span class="custom-tree-node">
	      <span>{node.label}</span>
	      </span>
	    );
	  }
    },
  },
  created: function () {
	  let $this = this
	  let loading = CommonFun.openFullScreen($this)
	  $this.$store.dispatch("getCompanyTreeArrAllData").then((res,eoor) => {
	  	CommonFun.closeFullScreen(loading)
	  })
  }
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.el-tree {
  padding:0px;
  font-size: 12px !important;
  background-color: #03201F;
}
.pagebox{
   display: flex;
   justify-content: space-between;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
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

.content-outerbox {
  width: 100%;
  display: flex;
  height: calc(100% - 45px);
}
.left-tree {
  width: 100%;
  // margin-right: 20px;
  background-color: #03201F;
  border: 1px solid rgba(10, 179, 172, 1);
}
.tree-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  padding-bottom: 24px;
  background-color: #f5f5f5;
}
.right-list-info {
  flex: 1;
}

.deal-delete {
  margin-right: 1px;
}
.deal-resetpassword {
  width: 70px;
}
/* popup */
.add-info-box {
  display: flex;
  // padding-right: 8px;
  flex-wrap: wrap;
}
.add-item-div {
  width: 100%;
  // margin-right: 4%;
}

.jobNameBox {
  display: flex;
}
.el-dropdown {
  width: 100%;
}
.add-item-div{display: flex;}
.add-item-title{width: auto;padding-right: 10px;line-height: 38px;}
.add-item-input{margin-right: 10px;}
.filter-tree{width: 100%;}
</style>
