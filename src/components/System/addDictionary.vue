<template>
  <div class="box">
    <div>
      <div class="but-add" v-if="currentButtonJurisdiction.indexOf('add')>-1" @click="addFun"><i class="el-icon-circle-plus-outline"></i>新增</div>
      <el-dialog :visible.sync="dialogTableVisible_popu" :close-on-click-modal="false" width="640px">
        <div class="addmenu popup">
          <div class="title">新增</div>
          <div class="hidepopup" @click="dialogTableVisible_popu=!dialogTableVisible_popu"></div>
          <div class="addmenu-item addmenu-icon" style="margin-top:15px;">
            <span class="addmenu-tip">字典名称:</span>
            <input placeholder="请输入字典名称"  type="text" v-model="currentItem.name" />
          </div>
          <div class="addmenu-item addmenu-titlename">
            <span class="addmenu-tip">字典值:</span>
            <input placeholder="请输入字典值" type="number" min="1" v-model="currentItem.value" />
          </div>
          <div class="addmenu-item addmenu-sort">
            <span class="addmenu-tip">排序:</span>
            <input placeholder="请输入单位的排序" type="number" min="1" v-model="currentItem.displayOrder" />
          </div>
          <div class="addmenu-item addmenu-router">
            <span class="addmenu-tip">父单位:</span>
            <input placeholder="请输入备注" disabled="disabled" type="text" v-model="currentParentDictionary.name" />
          </div>
        </div>
        <div class="popup-buts">
          <el-button type="danger"  @click="submitAdd">提交</el-button>
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
  name: "addDictionary",
  data() {
    return {
      dialogTableVisible_popu: false,
      currentItem:{},
      saveUrl:'dataDictionary/save',
      currentParentDictionary:{},//选中的父节点
	  currentButtonJurisdiction:CommonFun.getCurrentButtonJurisdiction('dataDictionary'),
    };
  },
  methods: {
    /*新增单位  组织管理--》单位管理*/
    submitAdd(){
        let $this = this;
        if(CommonFun.ifNall($this.currentItem.parentId)){
			CommonFun.responseError({message:'请先选择父级'}, $this)
			return
        }
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
            $this.$store.dispatch("getDataDictionaryListData", {id: $this.$store.state.dataDictionaryRootId})
			//删除 编辑 新增成功后都把parentOfcurrentAddDictionary设置成空 让用户新增前手动选择父单位
            sessionStorage.setItem('parentOfcurrentAddDictionary', '')
            if (res.data.status == 1) {
				CommonFun.responseSuccess(res.data.message, $this)
				$this.currentItem={}
				$this.dialogTableVisible_popu = false;
            }
            if (res.data.status === 0) {
				CommonFun.responseError(res.data, $this)
            }
        }).catch(function(error){
			CommonFun.closeFullScreen(loading)
		})
    },
    addFun(){
      let $this = this
	  if(CommonFun.ifNall(sessionStorage.getItem('parentOfcurrentAddDictionary'))){
		CommonFun.responseError({message:'请先选择父级'}, $this)
		return;
	  }else{
		$this.dialogTableVisible_popu = !$this.dialogTableVisible_popu
		//选中父节点 来自于editMenu组件 此处注意 有点混乱
		$this.currentParentDictionary = JSON.parse(sessionStorage.getItem('parentOfcurrentAddDictionary'))
		$this.currentItem.parentId = $this.currentParentDictionary.id
	  }
    },
  },
  created: function() {
  }
};
</script>
<style scoped lang="scss">
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
}
.but-add i{margin-right:5px;}
.el-checkbox-group {
    width: 500px;
    display: inline-block;
}
.el-checkbox-group .el-checkbox{display: inline-block;}
</style>
