<template>
  <div class="box">
    <div>
        <div class="menu">
          <div class="custom-tree-container">
            <div class="block">
              <el-tree
                :data="dataList"
                node-key="id"
				class="filter-tree"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="selectNode"
                :highlight-current="true"
                :render-content="renderContent"
              ></el-tree>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="640px">
          <div class="addmenu popup">
            <div class="title">编辑</div>
            <div class="hidepopup" @click="dialogTableVisible=!dialogTableVisible"></div>
            <div class="addmenu-item addmenu-icon">
              <span class="addmenu-tip">字典名称:</span>
              <input placeholder="请输入字典名称" type="text" v-model="currentItem.name"   maxlength="50" />
            </div>
            <div class="addmenu-item addmenu-titlename">
              <span class="addmenu-tip">字典值:</span>
              <input placeholder="请输入字典值" type="number" min="1" v-model="currentItem.value" />
            </div>
            <div class="addmenu-item addmenu-sort">
              <span class="addmenu-tip">排序:</span>
              <input placeholder="请输入排序" type="number" min="1" v-model="currentItem.displayOrder" />
            </div>
            <div class="popup-buts" v-if="currentButtonJurisdiction.indexOf('edit')>-1">
              <el-button v-if="dealType!='show'" class="popup-but popup-but-submit popup-but-submit-esp" type="danger"  @click="submitEdit">确定</el-button>
              <div
                class="popup-but popup-but-cancel"
                @click="dialogTableVisible = !dialogTableVisible"
              >取 消</div>
            </div>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogTableVisible_delete"
          :close-on-click-modal="false"
          width="21.9%">
          <div class="popup">
            <div class="title"> 删除 </div>
            <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete"></div>
            <div class="add-info-box">
              <p class="popop-tipinfo">确定删除该项吗？</p>
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
      </div>
  </div>
</template>

<script>
import axiosHttp from "../../js/axiosHttp.js";
import baseUrl from "../../js/baseUrl.js";
import CommonFun from "../../js/commonFun.js";
export default {
  name: "editDictionary",
  data() {
    return {
      dialogTableVisible: false,
      currentItem: {},
      saveUrl: "dataDictionary/save",
      deleteUrl: "dataDictionary/delete",
      dialogTableVisible_delete:false,
	  dealType:'',
	  currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('dataDictionary'),
    };
  },
  props:['dataList'],
  components: {},
  methods: {
    edit(node, data) {
      console.log("当前节点：");
      console.log(data);
      this.currentItem = data;
	  this.dealType = 'edit'
      this.dialogTableVisible = !this.dialogTableVisible;
    },
	show(node, data){
		console.log("当前节点：");
		console.log(data);
		this.currentItem = data;
		this.dealType = 'show'
		this.dialogTableVisible = !this.dialogTableVisible;
	},
    delete(node, data){
      console.log("当前节点：");
      console.log(data);
      let $this = this
      if(!CommonFun.ifNall(data.children)){//有子不能删除
      	CommonFun.responseError({message:'有子级节点，不能删除！'}, $this)
      	return;
      }else{
        this.currentItem = data
        this.dialogTableVisible_delete=!this.dialogTableVisible_delete
      }
    },
    //选中某一节点
    selectNode(data, node, e){
      var $this = this
      /* console.log(data)
      console.log(node)
      console.log(e) */
      sessionStorage.setItem('parentOfcurrentAddDictionary', JSON.stringify(data))//选中了某一个节点 作为新增单位的副节点 此处修改N+1次 获得在addMenu组件中 比较混乱 注意！
    },
    //确定删除单位
    submitDelete(){
      let $this = this
	  let loading = CommonFun.openFullScreen($this)
      let obj = { id:$this.currentItem.id }
      axiosHttp
        .delete(baseUrl.BASEURL + $this.deleteUrl, {data:obj})
        .then(function (res) {
		  CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible_delete=!$this.dialogTableVisible_delete
          $this.$store.dispatch("getDataDictionaryListData", {id: $this.$store.state.dataDictionaryRootId});
          sessionStorage.setItem('parentOfcurrentAddDictionary','')//删除 编辑 新增成功后都把parentOfcurrentAddDictionary设置成空 让用户新增前手动选择父单位
          if (res.data.status === 1) {
            CommonFun.responseSuccess(res.data.message, $this);
          }
          if (res.data.status === -1) {
            $this.$router.push('/login')
          }
          if (res.data.status === 0) {
            CommonFun.responseError(res.data, $this)
          }
        })
        .catch(function (error) {
		  CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible_delete=!$this.dialogTableVisible_delete
        })
    },
     //确定修改
    submitEdit(){
      let $this = this;
      console.log('this.currentItem::')
      console.log(this.currentItem)
      if (CommonFun.ifNall($this.currentItem.name)) {
        CommonFun.responseError({message:'字典名称必须填写'}, $this)
		return
      }
      if (CommonFun.ifNall($this.currentItem.value)) {
        CommonFun.responseError({message:'字典值必须填写'}, $this)
		return
      }
      if (CommonFun.ifNall($this.currentItem.displayOrder)) {
        CommonFun.responseError({message:'排序必须填写'}, $this)
		return
      }
	  let loading = CommonFun.openFullScreen($this)
      axiosHttp.post(baseUrl.BASEURL + $this.saveUrl, $this.currentItem).then(function(res) {
		CommonFun.closeFullScreen(loading)
          $this.$store.dispatch("getDataDictionaryListData", {id: $this.$store.state.dataDictionaryRootId});
          $this.dialogTableVisible = !$this.dialogTableVisible;
          sessionStorage.setItem('parentOfcurrentAddDictionary','')//删除 编辑 新增成功后都把parentOfcurrentAddDictionary设置成空 让用户新增前手动选择父单位
          if (res.data.status == 1) {
            CommonFun.responseSuccess(res.data.message, $this)
          }
          if (res.data.status === -1) {
            $this.$router.push('/login')
          }
          if (res.data.status === 0) {
            CommonFun.responseError(res.data, $this)
          }
        })
        .catch(function(error) {
		  CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible = !$this.dialogTableVisible;
        });
    },
    renderContent(h, { node, data, store }) {
		let $this = this
		/* 0 0 0 */
		if($this.currentButtonJurisdiction.indexOf('view')==-1 && $this.currentButtonJurisdiction.indexOf('edit')==-1 && $this.currentButtonJurisdiction.indexOf('delete')==-1){
			return (
			  <span class="custom-tree-node">
			    <span>{node.label}</span>
			  </span>
			);
		}
		/* 0 1 0 */
		if($this.currentButtonJurisdiction.indexOf('view')==-1 && $this.currentButtonJurisdiction.indexOf('edit')>-1 && $this.currentButtonJurisdiction.indexOf('delete')==-1){
		  return (
		    <span class="custom-tree-node">
		      <span>{node.label}</span>
		      <span>
		        <el-button
		          size="mini"
		          type="text"
		          on-click={() => this.edit(node, data)}
		        >
		          编辑
		        </el-button>
		      </span>
		
		    </span>
		  );
		}
		/* 0 0 1 */
		if($this.currentButtonJurisdiction.indexOf('view')==-1 && $this.currentButtonJurisdiction.indexOf('edit')==-1 && $this.currentButtonJurisdiction.indexOf('delete')>-1){
		    return (
		    <span class="custom-tree-node">
		      <span>{node.label}</span>
		
		      <span>
		        <el-button
		          size="mini"
		          type="text"
		          on-click={() => this.delete(node, data)}
		        >
		          删除
		        </el-button>
		      </span>
		
		    </span>
		  );
		}
		/* 0 1 1 */
        if($this.currentButtonJurisdiction.indexOf('view')==-1 && $this.currentButtonJurisdiction.indexOf('edit')>-1 && $this.currentButtonJurisdiction.indexOf('delete')>-1){
			return (
            <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.edit(node, data)}
              >
                编辑
              </el-button>
            </span>

            <span>
              <el-button
                size="mini"
                type="text"
              >
                ----
              </el-button>
            </span>

            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.delete(node, data)}
              >
                删除
              </el-button>
            </span>

          </span>
         );
        }
	    /* 1 0 0*/
	    if($this.currentButtonJurisdiction.indexOf('view')>-1 && $this.currentButtonJurisdiction.indexOf('edit')==-1 && $this.currentButtonJurisdiction.indexOf('delete')==-1){
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
		/* 1 1 0*/
		if($this.currentButtonJurisdiction.indexOf('view')>-1 && $this.currentButtonJurisdiction.indexOf('edit')>-1 && $this.currentButtonJurisdiction.indexOf('delete')==-1){
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
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				  >
				    ----
				  </el-button>
				</span>
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				    on-click={() => this.edit(node, data)}
				  >
				    编辑
				  </el-button>
				</span>
				
			  </span>
			);
		}
		/* 1 0 1*/
		if($this.currentButtonJurisdiction.indexOf('view')>-1 && $this.currentButtonJurisdiction.indexOf('edit')==-1 && $this.currentButtonJurisdiction.indexOf('delete')>-1){
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
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				  >
				    ----
				  </el-button>
				</span>
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				    on-click={() => this.delete(node, data)}
				  >
				    删除
				  </el-button>
				</span>
				
			  </span>
			);
		}
		/* 1 1 1*/
		if($this.currentButtonJurisdiction.indexOf('view')>-1 && $this.currentButtonJurisdiction.indexOf('edit')>-1 && $this.currentButtonJurisdiction.indexOf('delete')>-1){
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
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				  >
				    ----
				  </el-button>
				</span>
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				    on-click={() => this.edit(node, data)}
				  >
				    编辑
				  </el-button>
				</span>
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				  >
				    ----
				  </el-button>
				</span>
				
				<span>
				  <el-button
				    size="mini"
				    type="text"
				    on-click={() => this.delete(node, data)}
				  >
				    删除
				  </el-button>
				</span>
				
			  </span>
			);
		}
    },
  },
  create: function() {
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  padding: 15px 0px;
  font-size: 12px !important;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.submit-but {
  width: 300px;
  height: 40px;
  background-color: #58a7ea;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 40px;
  margin-left: 100px;
  margin-top: 20px;
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
.addmenu-parentNodeName .el-tree-node__content {
  height: 40px !important;
}
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.addmenu-item {
  margin-bottom: 15px;
}
.addmenu-tip {
  line-height: 35px;
  margin-right: 5px;
  width: 80px;
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
.addmenu-parentNodeName {
  position: relative;
}
.addmenu-parentNodeName input {
  cursor: pointer;
}
.addmenu-parentNodeName .clickbox {
  position: absolute;
  background: transparent;
  cursor: pointer;
  width: 500px;
  left: 85px;
  height: 37px;
  top: 0;
}
.submit-but {
  width: 300px;
  height: 40px;
  background-color: #58a7ea;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 40px;
  margin-left: 100px;
  margin-top: 20px;
}
.el-select {
  width: 500px;
}
.flex-addmenu-item{display: flex;}
.flex-addmenu-item div{width: 500px; border: 1px solid #ddd; padding-left: 10px;line-height: 35px;}

.el-checkbox-group {
    width: 500px;
    display: inline-block;
}
.el-checkbox-group .el-checkbox{display: inline-block;}
.popup-but-submit-esp{padding: 0;}
</style>
