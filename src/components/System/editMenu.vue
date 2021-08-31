<template>
  <div class="box m-dialog">
    <div v-if="edittype == 'editMenu'">
      <div class="menu">
        <div class="custom-tree-container">
          <div class="block">
            <el-tree
              :data="dataList"
							class="filter-tree"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :highlight-current="true"
              :render-content="renderContent"
            ></el-tree>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="640px">
        <div class="addmenu popup">
          <div class="title">编辑</div>
          <div class="hidepopup" @click="dialogTableVisible=!dialogTableVisible">×</div>
          <div class="addmenu-item addmenu-sort">
            <span class="addmenu-tip">排序:</span>
            <el-input-number
              placeholder="请输入菜单的排序(大于等于1的整数)"
              controls-position="right"
              :min="1"
              v-model="onItem.displayOrder"
            />
          </div>
          <div class="addmenu-item addmenu-icon">
            <span class="addmenu-tip">图标:</span>
            <el-input
              placeholder="请输入菜单的图标(element-ui的Icon图标字符串,如:'el-icon-s-tools')"
              type="text"
              v-model="onItem.icon"
            />
          </div>
          <div class="addmenu-item addmenu-titlename">
            <span class="addmenu-tip">名称:</span>
            <el-input placeholder="请输入菜单的名称" type="text" v-model="onItem.label" />
          </div>
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">路由:</span>
            <el-input placeholder="请输入菜单的路由名称(如果该项菜单有子菜单,不填该项)" type="text" v-model="onItem.url" />
          </div>
          <div class="addmenu-item addmenu-parentNodeName">
            <span class="addmenu-tip">父菜单:</span>
            <el-popover
              placement="bottom"
              title="父菜单选择"
              trigger="click"
              ref="popover"
              v-model="visible_popover"
            >
            <el-scrollbar class="editMenu-el-scrollbar">
              <el-tree
                :data="[...this.firstParentNaviArr,...$store.state.naviArr]"
								class="filter-tree"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick"
              ></el-tree>
            </el-scrollbar>
              <el-button slot="reference">{{ onItem.parentLabel }}</el-button>
            </el-popover>
          </div>
          <!-- TODO -->
          <!-- <div class="addmenu-item addmenu-titlename" v-if="onItem.parentId && onItem.parentId!==0">
            <span class="addmenu-tip">菜单按钮:</span>
            <el-checkbox-group v-model="onItem.buttonIds">
              <el-checkbox v-for="button in $store.state.buttonList" :label="button.id" :key="button.id">
                {{button.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="popup-buts">
            <div class="popup-but popup-but-submit" @click="submitEdit">确 定</div>
            <div
              class="popup-but popup-but-cancel"
              @click="dialogTableVisible = !dialogTableVisible"
            >取 消</div>
          </div>
        </div>
      </el-dialog>
    </div>
    <div v-if="edittype == 'editCrew'">
        <div class="menu">
          <div class="custom-tree-container">
            <div class="block">
              <el-scrollbar>
              <el-tree
                :data="dataList"
                node-key="id"
								class="filter-tree"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="selectNode"
                :highlight-current="true"
                :render-content="renderContentCrew"
              ></el-tree>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="640px">
          <div class="addmenu popup">
            <div class="title">编辑</div>
            <div class="hidepopup" @click="dialogTableVisible=!dialogTableVisible">×</div>
            <div class="addmenu-item addmenu-icon">
              <span class="addmenu-tip">单位名称:</span>
              <el-input placeholder="请输入单位名称" type="text" v-model="onItem.name"   maxlength="50" />
            </div>
            <div class="addmenu-item addmenu-titlename">
              <span class="addmenu-tip">单位编号:</span>
              <el-input-number placeholder="请输入单位编号" controls-position="right" :min="1" v-model="onItem.number" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" maxlength="50" />
            </div>
            <div class="addmenu-item addmenu-sort">
              <span class="addmenu-tip">排序:</span>
              <el-input-number placeholder="请输入单位的排序" controls-position="right" :min="1" v-model="onItem.displayOrder" maxlength="10" />
            </div>
            <div class="addmenu-item addmenu-router">
              <span class="addmenu-tip">备注:</span>
              <el-input placeholder="请输入备注" type="text" v-model="onItem.remark" />
            </div>
            <!-- <div class="addmenu-item addmenu-router">
              <span class="addmenu-tip">类型:</span>
              <el-select v-model="onItem.typeName" placeholder="请选择">
                <el-option
                  v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </div> -->
            <div class="addmenu-item addmenu-parentNodeName">
              <span class="addmenu-tip">父单位:</span>
              <el-popover
                placement="bottom"
                title="父单位选择"
                trigger="click"
                ref="popover"
                v-model="visible_popover"
              >
              <el-scrollbar class="editMenu-el-scrollbar">
                <el-tree
                  :data="[...this.firstParentCompanyArr,...dataList]"
                  :props="defaultProps"
                  accordion
									class="filter-tree"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-scrollbar>
                <el-button slot="reference">{{ onItem.parentName }}</el-button>
              </el-popover>
            </div>
            <div class="addmenu-item addmenu-router">
              <span class="addmenu-tip">地址:</span>
              <el-cascader
                :options="options"
                ref="cascaderAddr"
                v-model="selectedOptions"
                :props="{value: 'label', checkStrictly: true}"
                style="width: 100%"
                @change="handleChange">
              </el-cascader>
            </div>
            <div class="popup-buts" v-if="currentButtonJurisdiction.indexOf('edit')>-1">
              <!-- <el-button class="popup-but popup-but-submit popup-but-submit-esp" type="danger"  @click="submitEditCompany">确定</el-button> -->
              <div
                class="popup-but popup-but-submit"
                @click="submitEditCompany"
              >确 定</div>
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
            <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
            <div class="add-info-box">
              <p class="popop-tipinfo">确定删除该单位吗？</p>
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
let pcas = require('@/js/json/pca-code.json');
import axiosHttp from "../../js/axiosHttp.js";
import baseUrl from "../../js/baseUrl.js";
import CommonFun from "../../js/commonFun.js";
export default {
  name: "EditMenu",
  data() {
    return {
      options: pcas,
      selectedOptions: [],
      editMenuUrl: "resource/menu/save",
      dialogTableVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      tempParentId: "",
      tempParentName: "",
      onItem: {},
      firstParentNaviArr: [
        {
          children: null,
          displayOrder: 1,
          icon: "",
          id: 0,
          label: "无",
          parentId: 0,
          parentLabel: "无",
          url: ""
        }
      ],
      visible_popover: false,
      /* 单位编辑 */
      //typeArr:[{name:'公司领导',id:'1'},{name:'二级单位',id:'2'},{name:'钻井队',id:'3'}],
      firstParentCompanyArr:[{
        children: null,
        id: 0,
        label: "无",
        parentId: 0,
        parentLabel: "无",
      }],
      showtypeselect:false,
      addCompanyUrl:'postCompany/save',
      deleteCrewUrl:'postCompany/delete',//删除单位  组织架构--》单位管理
      dialogTableVisible_delete:false,
      currentDeleteCrewItem:{},//当前要删除的单位item
	  currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('crewManageNew'),
	  currentButtonJurisdiction2:CommonFun.getCurrentButtonJurisdiction('menuManage'),
    };
  },
  props:['dataList','edittype'],
  components: {},
  methods: {
    // 获取省市区地址级联
    handleChange(e, form, thsAreaCode) {
      thsAreaCode = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels// 注意2： 获取label值
      console.log(thsAreaCode[0] + thsAreaCode[1] + thsAreaCode[2])
      this.onItem['province'] = thsAreaCode[0] || '';
      this.onItem['city'] = ((thsAreaCode[0].indexOf('市') > -1) ? thsAreaCode[2] : thsAreaCode[1]) || '';
      this.onItem['county'] = thsAreaCode[2] || '';
    },
    edit(node, data) {
      console.log("当前节点：");
      console.log(data);
      this.onItem = data;
      this.selectedOptions = [data.province];
      if(data.city) {
        this.selectedOptions.push(data.city);
      }
      if(data.county) {
        this.selectedOptions.push(data.county);
      }
      this.onItem.buttonIds = this.onItem.buttonIds?this.onItem.buttonIds:[]
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    //删除 组织架构--》单位管理
    delete(node, data){
      console.log("当前节点：");
      console.log(data);
      let $this = this
      if(data.children){//有子不能删除
      	CommonFun.responseError({message:'不能删除！'}, $this)
      	return;
      }else{
        this.currentDeleteCrewItem = data
        this.dialogTableVisible_delete=!this.dialogTableVisible_delete
      }
    },
    //选中某一节点
    selectNode(data,node,e){
      var $this = this
      console.log(data)
      console.log(node)
      console.log(e)
      sessionStorage.setItem('parentOfcurrentAddCrew',JSON.stringify(data))//选中了某一个节点 作为新增单位的副节点 此处修改N+1次 获得在addMenu组件中 比较混乱 注意！
    },
    //确定删除单位
    submitDelete(){
      let $this = this
			let loading = CommonFun.openFullScreen($this)
      let obj = { id:$this.currentDeleteCrewItem.id }
      axiosHttp
        .post(baseUrl.BASEURL + $this.deleteCrewUrl, obj)
        .then(function (res) {
			CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible_delete=!$this.dialogTableVisible_delete
          $this.$store.dispatch("getCompanyTreeArrAllData");
          sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
          if (res.data.status === 1) {
            CommonFun.responseSuccess(res.data.message, $this);
          }
          if (res.data.status === -1) {
            $this.$router.push('/login')
          }
          if (res.data.status === 0) {
            sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
            CommonFun.responseError(res.data, $this)
          }
        })
        .catch(function (error) {
					CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible_delete=!$this.dialogTableVisible_delete
          $this.$store.dispatch("getCompanyTreeArrAllData");
        })
    },
    renderContent(h, { node, data, store }) {
      //this.currentButtonJurisdiction2.indexOf('edit')>-1
		if(true){
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
		}else{
			return (
			  <span class="custom-tree-node">
			    <span>{node.label}</span>
			  </span>
			);
		}
        
    },
    renderContentCrew(h, { node, data, store }) {
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
            <span class="custom-tree-node custom-tree-node-manager">
            <span>{node.label}</span>
            <span>
            <span class="custom-tree-node-right-icon">
                <i class="el-icon-edit-outline" on-click={() => this.edit(node, data)}></i>
            </span>


            <span class="custom-tree-node-right-icon">
                <i class="el-icon-delete" on-click={() => this.delete(node, data)}></i>
            </span>
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
					on-click={() => this.edit(node, data)}
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
					on-click={() => this.edit(node, data)}
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
					on-click={() => this.edit(node, data)}
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
		if($this.currentButtonJurisdiction.indexOf('view')>-1 && $this.currentButtonJurisdiction.indexOf('edit')==-1 && $this.currentButtonJurisdiction.indexOf('delete')>-1){
			return (
			  <span class="custom-tree-node">
				<span>{node.label}</span>
				<span>
				  <el-button
					size="mini"
					type="text"
					on-click={() => this.edit(node, data)}
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
    //确定修改 菜单
    submitEdit() {
      var $this = this;
			let loading = CommonFun.openFullScreen($this)
      if(!$this.onItem.parentId || $this.onItem.parentId===0){
        $this.onItem.buttonIds = []
      }
      axiosHttp
        .post(baseUrl.BASEURL + $this.editMenuUrl, {
          id: this.onItem.id,
          displayOrder: parseInt(this.onItem.displayOrder),
          icon: this.onItem.icon,
          url: this.onItem.url,
          name: this.onItem.label,
          parentId: this.onItem.parentId,
          buttonIds: this.onItem.buttonIds
        })
        .then(function(res) {
			CommonFun.closeFullScreen(loading)
          if (res.data.status == "1") {
            console.log("修改结果：");
            console.log(res);
            $this.dialogTableVisible = false;
            $this.$store.dispatch("getNaviData");
			$this.$store.dispatch('setCompanyTree')
            $this.$message({
              message: "编辑菜单成功！",
              type: "success"
            });
          } else {
            $this.$message.error(data.message);
          }
        }).catch(function(){
					CommonFun.closeFullScreen(loading)
				})
    },
    /* getTypeByTypeName(typeName){
      let $this = this
      let id = 0
      for(let i=0;i<$this.typeArr.length;i++){
        if(typeName == $this.typeArr[i].name){
          id = $this.typeArr[i].id
          break;
        }
      }
      return id
    }, */
    //确定修改 单位
    submitEditCompany(){
        var $this = this;
		let loading = CommonFun.openFullScreen($this)
      //$this.onItem.type = $this.getTypeByTypeName($this.onItem.typeName)
      if(CommonFun.ifNall($this.onItem.parentId)){
        $this.onItem.parentId = '0'
      }
      console.log('this.onItem::')
      console.log(this.onItem)
      if (CommonFun.ifNall($this.onItem.name) || CommonFun.ifNall($this.onItem.number)) {
				CommonFun.closeFullScreen(loading)
        $this.$message.error('名称，编号是必填项！');
        return;
      }
      axiosHttp.post(baseUrl.BASEURL + $this.addCompanyUrl, $this.onItem).then(function(res) {
				CommonFun.closeFullScreen(loading)
          $this.$store.dispatch("getCompanyTreeArrAllData");
          $this.dialogTableVisible = !$this.dialogTableVisible;
          sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
          if (res.data.status == 1) {
			$this.$store.dispatch('setCompanyTree')
            CommonFun.responseSuccess(res.data.message, $this)
          }
          if (res.data.status === -1) {
            $this.$router.push('/login')
          }
          if (res.data.status === 0) {
            sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
            CommonFun.responseError(res.data, $this)
          }
        })
        .catch(function(error) {
					CommonFun.closeFullScreen(loading)
          $this.dialogTableVisible = !$this.dialogTableVisible;
        });

    },
    handleNodeClick(e) {
      console.log(e);
      let $this = this
      if($this.edittype == 'editMenu'){
        $this.onItem.parentLabel = e.label;
        $this.onItem.parentId = e.id;
      }
      if($this.edittype == 'editCrew'){
        $this.onItem.parentName = e.label;
        $this.onItem.parentId = e.id;
      }
    }
  },
  create: function() {
  //  this.$store.dispatch('getButtonListData')
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// .m-dialog{
//   ::v-deep.el-dialog{
//     top: 300px !important;
//   }
// }
.box{
  height: calc(100% - 45px);
  >div{
    height: 100%;
    .menu{
      height: 100%;
    }
  }
}
.popup{
  padding: 0 20px;
}
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
  height: auto;
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
  width: auto;
  text-align: left;
  display: block;
  color: #fff;
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
