<template>
  <div class="box">
    <p class="earename">删除菜单按钮</p>
    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="$store.state.naviArr"
          show-checkbox
          node-key="id"
					class="filter-tree"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
        ></el-tree>
      </div>
    </div>
    <!-- 菜单删除按钮 -->
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <div class="butbox">
        <div
          class="butShow"
          v-for="(item,index) in deleteButsArr"
          :key="index"
          v-html="item.buttonName"
          @click="ifSelectBut(item)"
          :class="[{onselectbuts:onselecteid == item.id}]"
        ></div>
      </div>
      <div class="buts">
        <div class="submit-but-selectParent" @click="submitSelectbuts">确 定</div>
        <div class="cancel-but-selectParent" @click="dialogTableVisible=!dialogTableVisible">取 消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axiosHttp from "../../js/axiosHttp.js";
import baseUrl from "../../js/baseUrl.js";
export default {
  name: "deleteButsOfMenu",
  data() {
    return {
      dialogTableVisible: false,
      deleteButsArr: [], //可以删除的按钮数组
      onselecteid: "", //删除按钮的id不是buttonId
      deleteButForMenuUrl: "resource/action/delete"
    };
  },
  components: {},
  methods: {
    remove: function(node, data) {
      console.log(data);
      this.deleteButsArr = [];
      this.onselectebutid = "";
      this.dialogTableVisible = !this.dialogTableVisible;
      var buts = data.buttons ? data.buttons : [];
      this.deleteButsArr = buts;
    },
    renderContent(h, { node, data, store }) {
      var buts = data.buttons ? data.buttons : [];
      var len = buts.length;
      if (data.children || len < 1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
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
    submitSelectbuts() {
        var $this = this;
		let loading = CommonFun.openFullScreen($this)
      axiosHttp
        .post(baseUrl.BASEURL + this.deleteButForMenuUrl, {
          id: this.onselecteid
        })
        .then(function(res) {
			CommonFun.closeFullScreen(loading)
          console.log("删除结果");
          console.log(res);
          if (res.data.status == "1") {
            $this.$store.dispatch("getNaviData");
            $this.$message({
              message: "菜单删除按钮成功！",
              type: "success"
            });
            $this.dialogTableVisible = !$this.dialogTableVisible;
          }
        })
        .catch(function(res) {
			CommonFun.closeFullScreen(loading)
            $this.$message.error(res.meaasge);
        });
    },
    ifSelectBut(item) {
      if (!!this.onselecteid) {
        if (this.onselecteid == item.id) {
          this.onselecteid = "";
          return;
        }
      }
      this.onselecteid = item.id;
    }
  },
	created: function() {
	
	}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.earename {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
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
.butbox {
  padding: 20px;
  border: 1px solid #dedede;
  max-width: 500px;
  overflow: hidden;
}
.butShow {
  float: left;
  padding: 10px 20px;
  background-color: #ffac5b;
  color: #fff;
  width: 100px;
  text-align: center;
  margin: 7px;
  cursor: pointer;
}
.onselectbuts {
  background-color: #ddd;
}
</style>
