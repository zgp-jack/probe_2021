<template>
  <div class="box">
    <div class="but add-but popup-but-submit" style="color:#fff" @click="dialogTableVisible_popu = !dialogTableVisible_popu">
      <i class="el-icon-delete" style="color:#fff"></i> 删除
    </div>
    <el-dialog :visible.sync="dialogTableVisible_popu" :close-on-click-modal="false" width="640px">
      <div class="deletemenu popup">
        <div class="title">删除</div>
        <div class="hidepopup" @click="dialogTableVisible_popu=!dialogTableVisible_popu">×</div>
        <div class="custom-tree-container">
          <el-scrollbar class="block" style="height: 500px">
            <el-tree
              :data="dataList"
              show-checkbox
              node-key="id"
				class="filter-tree"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
            ></el-tree>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axiosHttp from "../../js/axiosHttp.js";
import baseUrl from "../../js/baseUrl.js";
import CommonFun from "../../js/commonFun.js";
export default {
  data() {
    return {
      deleteMenuUrl: "resource/menu/delete",//删除菜单
      dialogTableVisible_popu: false,
	  deleteCrewUrl:'postCompany/delete',//删除单位  组织架构--》单位管理
	  currentButtonJurisdiction2:CommonFun.getCurrentButtonJurisdiction('menuManage'),
    };
  },
	props:['dataList','deletetype'],
  methods: {
    remove(node, data) {
			let $this = this
			let loading = CommonFun.openFullScreen($this)
		//删除菜单
		if(this.deletetype == 'deleteMenu'){
			/* id = data.id */
			const parent = node.parent;
			const children = parent.data.children || parent.data;
			const index = children.findIndex(d => d.id === data.id);
			children.splice(index, 1);
			this.submitDeleteMenu(data.id);
		}
		//删除单位 删除 组织架构--》单位管理
		if(this.deletetype == 'deleteCrew'){
			if(data.children){//有子不能删除
				CommonFun.responseError({message:'不能删除！'}, $this)
				CommonFun.closeFullScreen(loading)
				return;
			}else{
				let $this = this
				let obj = { id:data.id }
				axiosHttp
				  .post(baseUrl.BASEURL + $this.deleteCrewUrl, obj)
				  .then(function (res) {
						CommonFun.closeFullScreen(loading)
            $this.$store.dispatch("getCompanyTreeArrData");
				    if (res.data.status === 1) {
				      CommonFun.responseSuccess(res.data.message, $this)
				    }
				    if (res.data.status === 0) {
				      CommonFun.responseError(res.data, $this)
				    }
				  })
				  .catch(function (error) {
						CommonFun.closeFullScreen(loading)
            $this.$store.dispatch("getCompanyTreeArrData");
				  })
			}
		}

    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    submitDeleteMenu(id) {
      var $this = this;
	  let loading = CommonFun.openFullScreen($this)
      axiosHttp
        .delete(baseUrl.BASEURL + $this.deleteMenuUrl, { data: { id } })
        .then(function(res) {
			CommonFun.closeFullScreen(loading)
          console.log("删除结果");
          console.log(res);
          if (res.data.status == 1) {
            $this.$store.dispatch("getNaviData");
            CommonFun.responseSuccess(res.data.message, $this);
          } else {
            $this.$store.dispatch("getNaviData");
            CommonFun.responseError(res.data, $this);
          }
        }).catch(function(error){
			CommonFun.closeFullScreen(loading)
		})
    }
  },
  created: function() {
	 //  let $this = this
	 //  let loading = CommonFun.openFullScreen($this)
	 //  $this.$store.dispatch("getNaviData").then((res,reeor) => {
	 //  	CommonFun.closeFullScreen(loading)
	 //  })
   }
}
</script>

<style scoped lang="scss">
.popup {
  padding: 50px 20px 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
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
.but-add {
  height: 30px;
  padding: 0px 10px;
  line-height: 30px;
  color: #666;
  background-color: #ddd;
  text-align: center;
  font-size: 12px;
  font-weight: lighter;
  cursor: pointer;
  border-radius: 2px;
}
.but-add i{margin-right:5px;}
</style>
