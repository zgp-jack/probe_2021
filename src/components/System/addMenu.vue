<template>
  <div class="box m-dialog">
    <div v-if="addtype == 'addMenu'">
      <div class="but add-but popup-but-submit" @click="addFun">新增</div>
      <el-dialog :visible.sync="dialogTableVisible_popu" :close-on-click-modal="false" width="640px">
        <div class="addmenu popup">
          <div class="title">新增</div>
          <div class="hidepopup" @click="dialogTableVisible_popu=!dialogTableVisible_popu">×</div>
          <div class="addmenu-item addmenu-sort" style="margin-top:15px;">
            <span class="addmenu-tip">排序:</span>
            <el-input-number placeholder="请输入菜单的排序(大于等于1的整数)" controls-position="right" :min="1" v-model="sort" />
          </div>
          <div class="addmenu-item addmenu-icon">
            <span class="addmenu-tip">图标:</span>
            <el-input
              placeholder="请输入菜单的图标(element-ui的Icon图标字符串,如:'el-icon-s-tools')"
              type="text"
              v-model="icon"
            />
          </div>
          <div class="addmenu-item addmenu-titlename">
            <span class="addmenu-tip">名称:</span>
            <el-input placeholder="请输入菜单的名称" type="text" v-model="titlename" />
          </div>
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">路由:</span>
            <el-input placeholder="请输入菜单的路由名称(如果该项菜单有子菜单,不填该项)" type="text" v-model="router" />
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
              <el-tree
							class="filter-tree"
                :data="dataList"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick"
              ></el-tree>
              <div class="buts">
                <div class="submit-but-selectParent" @click="submitSelectParentNode">确 定</div>
                <div class="cancel-but-selectParent" @click="cancelSelectParentNode">取 消</div>
              </div>
              <el-button slot="reference">{{ tempParentName }}</el-button>
            </el-popover>
          </div>
          <!-- TODO -->
          <!-- <div class="addmenu-item addmenu-titlename" v-if="tempParentId && tempParentId!==0">
            <span class="addmenu-tip">菜单按钮:</span>
            <el-checkbox-group v-model="buttonIds">
              <el-checkbox v-for="button in $store.state.buttonList" :label="button.id" :key="button.id">
                {{button.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div> -->
        </div>
        <div class="popup-buts">
          <el-button type="danger"  @click="submitAddMenu">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="addtype == 'addCrew'">
      <div class="but-add" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun">新增</div>
      <el-dialog :visible.sync="dialogTableVisible_popu" :close-on-click-modal="false" width="640px">
        <div class="addmenu popup">
          <div class="title">新增</div>
          <div class="hidepopup" @click="dialogTableVisible_popu=!dialogTableVisible_popu">×</div>
          <div class="addmenu-item addmenu-icon" style="margin-top:15px;">
            <span class="addmenu-tip">单位名称:</span>
            <el-input placeholder="请输入单位名称"  type="text" v-model="currentCompany.name" />
          </div>
          <div class="addmenu-item addmenu-titlename">
            <span class="addmenu-tip">单位编号:</span>
            <el-input-number placeholder="请输入单位编号" controls-position="right" :min="1" v-model="currentCompany.number" />
          </div>
          <div class="addmenu-item addmenu-sort">
            <span class="addmenu-tip">排序:</span>
            <el-input-number placeholder="请输入单位的排序" controls-position="right" :min="1" v-model="currentCompany.displayOrder" />
          </div>
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">备注:</span>
            <el-input placeholder="请输入备注" type="text" v-model="currentCompany.remark" />
          </div>
          <!-- <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">类型:</span>
            <el-select v-model="currentCompany.type" placeholder="请选择">
              <el-option
                v-for="item in typeArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div> -->
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">父单位:</span>
            <el-input placeholder="请输入备注" disabled="disabled" type="text" v-model="currentParentCrew.name" />
          </div>
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">地址:</span>
            <el-cascader
              :options="options"
              :props="{value: 'label', checkStrictly: true}"
              ref="cascaderAddr"
              v-model="selectedOptions"
              style="width: 100%"
              @change="handleChange">
            </el-cascader>
          </div>
          <div class="popup-buts">
            <div class="popup-but popup-but-submit" @click="submitAddCompany">确定</div>
            <!-- <el-button type="danger"  @click="submitAddCompany">提交</el-button> -->
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
  name: "AddMenu",
  data() {
    return {
      options: pcas,
      selectedOptions: [],
      /* 新增菜单*/
      addMenuUrl: "resource/menu/save",
      /* 数据 */
      sort: "",
      icon: "",
      titlename: "",
      router: "",
      buttonIds:[],
      parentNodeName: "无",
      parentNodeId: 0,
      tempParentId: 0, //临时选中的父节点id 要变成真正的父节点传到后台需要点击确认后
      tempParentName:(this.addtype=='addMenu')?"请选择新菜单项的父菜单,当什么都没选的时候,默认第一级菜单":'请选择父单位,当什么都没选的时候,默认第一级单位', //临时选中的父节点name 要变成真正的父节点展示到页面上需要点击确认按钮后
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogTableVisible_popu: false,
      visible_popover: false,
      /*新增单位   组织架构--》单位管理*/
      currentCompany:{},
      //typeArr:[{name:'公司领导',id:'1'},{name:'二级单位',id:'2'},{name:'钻井队',id:'3'}],
      addCompanyUrl:'postCompany/save',
      currentParentCrew:{},//选中的父节点 单位 组织架构--》单位管理
      ifShowEditBut:sessionStorage.getItem('roleCode')=='admin'?true:false,
      currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('crewManageNew'),
      currentButtonJurisdiction2:CommonFun.getCurrentButtonJurisdiction('menuManage'),
    };
  },
  props:['dataList','addtype'],
  methods: {
    // 获取省市区地址级联
    handleChange(e, form, thsAreaCode) {
      thsAreaCode = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels// 注意2： 获取label值
      console.log(thsAreaCode[0] + thsAreaCode[1] + thsAreaCode[2])
      this.currentCompany['province'] = thsAreaCode[0];
      this.currentCompany['city'] = ((thsAreaCode[0].indexOf('市') > -1) ? thsAreaCode[2] : thsAreaCode[1]) || '';
      this.currentCompany['county'] = thsAreaCode[2] || '';
    },
    /* 提交新增菜单 */
    submitAddMenu() {
      var $this = this;
      if (!CommonFun.inputVerifica($this.sort, "str", "排序不能为空", $this)) {
        return;
      }
		let loading = CommonFun.openFullScreen($this)
      axiosHttp
        .post(baseUrl.BASEURL + $this.addMenuUrl, {
          displayOrder: parseInt($this.sort),
          icon: $this.icon,
          url: $this.router,
          name: $this.titlename,
          parentId: $this.tempParentId,
          buttonIds: $this.buttonIds
        })
        .then(function(response) {
					CommonFun.closeFullScreen(loading)
          var data = response.data;
          if (data.status == 1) {
            $this.$store.dispatch("getNaviData");
			//$this.$store.dispatch('setCompanyTree')
            $this.$message({
              message: "菜单添加成功！",
              type: "success"
            });
            $this.sort = "";
            $this.icon = "";
            $this.titlename = "";
            $this.router = "";
            $this.parentNodeName = "无";
            $this.parentNodeId = 0;
            $this.tempParentId = 0;
            $this.tempParentName =
              "请选择新菜单项的父菜单,当什么都没选的时候,默认第一级菜单";
            $this.dialogTableVisible_popu = false;
          }
          if (response.data.status === 0) {
            CommonFun.responseError(response.data, $this)
          }
        }).catch(function(error){
				CommonFun.closeFullScreen(loading)
			})
    },
    /*新增单位  组织管理--》单位管理*/
    submitAddCompany(){
        var $this = this;
		
        if(CommonFun.ifNall($this.currentCompany.parentId)){
			$this.currentCompany.parentId = '0'
        }
        console.log('this.currentCompany::')
        console.log(this.currentCompany)
        if (CommonFun.ifNall($this.currentCompany.name) || CommonFun.ifNall($this.currentCompany.number)) {
            $this.$message.error('名称，编号是必填项！');
			return;
        }
		let loading = CommonFun.openFullScreen($this)
      axiosHttp.post(baseUrl.BASEURL + $this.addCompanyUrl, $this.currentCompany).then(function(res) {
			CommonFun.closeFullScreen(loading)
            $this.$store.dispatch("getCompanyTreeArrAllData");
            sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
            if (res.data.status == 1) {
				$this.$store.dispatch('setCompanyTree')
				CommonFun.responseSuccess(res.data.message, $this)
				$this.currentCompany={}
				$this.dialogTableVisible_popu = false;
            }
            if (res.data.status === 0) {
				sessionStorage.setItem('parentOfcurrentAddCrew','')//删除 编辑 新增成功后都把parentOfcurrentAddCrew设置成空 让用户新增前手动选择父单位
				CommonFun.responseError(res.data, $this)
            }
        }).catch(function(error){
			CommonFun.closeFullScreen(loading)
		})
    },
    handleNodeClick(e) {
      console.log(e);
      var id = e.id;
      this.tempParentId = id;
      this.tempParentName = e.label;
    },
    submitSelectParentNode() {
      let $this = this
      if($this.addtype == 'addMenu'){
        $this.parentNodeName = this.tempParentName;
        $this.parentNodeId = parseInt(this.tempParentId);
        $this.visible_popover = false;
      }
    },
    cancelSelectParentNode() {
      let $this = this
      $this.parentNodeName = "无";
      $this.parentNodeId = 0;
      $this.tempParentId = 0;
      $this.buttonIds = []
      if($this.addtype == 'addMenu'){
        $this.tempParentName =
          "请选择新菜单项的父菜单,当什么都没选的时候,默认第一级菜单";
      }
      $this.visible_popover = false;
    },
    addFun(){
      let $this = this
      if($this.addtype == 'addMenu'){
       $this.dialogTableVisible_popu = !$this.dialogTableVisible_popu
       $this.cancelSelectParentNode()//新增打开弹出框清零 菜单用
      }
      if($this.addtype == 'addCrew'){
        if(CommonFun.ifNall(sessionStorage.getItem('parentOfcurrentAddCrew'))){
          CommonFun.responseError({message:'请先选择父单位'}, $this)
          return;
        }else{
          $this.dialogTableVisible_popu = !$this.dialogTableVisible_popu
          //选中父节点 来自于editMenu组件 此处注意 有点混乱
          $this.currentParentCrew = JSON.parse(sessionStorage.getItem('parentOfcurrentAddCrew'))
          $this.currentCompany.parentId = $this.currentParentCrew.id
        }
      }
    },
  },
  created: function() {
    //this.$store.dispatch('getButtonListData')

  }
};
</script>
<style scoped lang="scss">
.box{
  height: 100%;
}
// .m-dialog{
//   ::v-deep.el-dialog{
//     top: 300px !important;
//   }
// }
.popup{
  padding: 0 20px;
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
.but-add {
  height: 30px;
  line-height: 30px;
  padding:0px 10px;
  color: #fff;
  background-color: #ffbc5d;
  text-align: center;
  font-size: 12px;
  font-weight: lighter;
  cursor: pointer;
  border-radius:2px;
  background-image: linear-gradient(to bottom right, #3fa9d3, #016bc6);
  color: #fff;
}
.but-add i{margin-right:5px;}
.el-checkbox-group {
    width: 500px;
    display: inline-block;
}
.el-checkbox-group .el-checkbox{display: inline-block;}
</style>
